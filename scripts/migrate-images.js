require('dotenv').config()

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const { v2: cloudinary } = require('cloudinary')

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadsDir = path.join(process.cwd(), 'uploads')

async function migrateImages() {
	try {
		await mongoose.connect(process.env.MONGODB_URI)

		console.log('✅ MongoDB ga ulandi\n')

		const products = mongoose.connection.collection('products')

		const oldProducts = await products
			.find({
				productImage: { $regex: '^/uploads/' },
			})
			.toArray()

		console.log(`📚 Ko'chiriladigan rasmlar: ${oldProducts.length}\n`)

		let success = 0
		let failed = 0
		let missing = 0

		for (let i = 0; i < oldProducts.length; i++) {
			const product = oldProducts[i]

			const filename = path.basename(product.productImage)
			const filePath = path.join(uploadsDir, filename)

			console.log(`[${i + 1}/${oldProducts.length}] ${product.productName}`)

			if (!fs.existsSync(filePath)) {
				console.log(`   ❌ Fayl topilmadi: ${filename}\n`)
				missing++
				continue
			}

			try {
				const result = await cloudinary.uploader.upload(filePath, {
					folder: 'my-library/books',
					resource_type: 'image',
					public_id: `product-${product._id}`,
					overwrite: true,
				})

				await products.updateOne(
					{ _id: product._id },
					{
						$set: {
							productImage: result.secure_url,
						},
					},
				)

				console.log(`   ☁️ Cloudinary: ${result.secure_url}`)
				console.log(`   ✅ MongoDB yangilandi\n`)

				success++
			} catch (error) {
				console.log(`   ❌ Xatolik: ${error.message}\n`)
				failed++
			}
		}

		console.log('================================')
		console.log('🎉 Migration tugadi!')
		console.log(`✅ Muvaffaqiyatli: ${success}`)
		console.log(`❌ Xatolik: ${failed}`)
		console.log(`⚠️ Fayl topilmadi: ${missing}`)
		console.log('================================')

		await mongoose.disconnect()
	} catch (error) {
		console.error('❌ Umumiy xatolik:', error)
		process.exit(1)
	}
}

migrateImages()

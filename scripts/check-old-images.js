require('dotenv').config()
const mongoose = require('mongoose')

async function checkOldImages() {
	try {
		await mongoose.connect(process.env.MONGODB_URI)

		console.log('✅ MongoDB ga ulandi')

		const products = mongoose.connection.collection('products')

		const oldImages = await products
			.find({
				productImage: { $regex: '^/uploads/' },
			})
			.toArray()

		console.log(`\n📚 Eski rasmlar soni: ${oldImages.length}\n`)

		oldImages.forEach((product, index) => {
			console.log(
				`${index + 1}. ${product.productName} → ${product.productImage}`,
			)
		})

		await mongoose.disconnect()

		console.log('\n✅ Tekshiruv tugadi')
	} catch (error) {
		console.error('❌ Xatolik:', error)
		process.exit(1)
	}
}

checkOldImages()

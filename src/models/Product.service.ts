// Diqqat: bu fayl sizning ro'yxatingizda yo'q edi, lekin kitoblarni
// admin panel orqali qo'shish/tahrirlash/o'chirish uchun zarur bo'lgani
// sababli, boshqa service fayllar bilan bir xil uslubda qo'shildi.

import { ProductStatus } from '../libs/enums/product.enum'
import { Errors, HttpCode, Message } from '../libs/Errors'
import { ProductInput, ProductSearchInput } from '../libs/types/product'
import ProductModel from '../schema/Product.model'
import { isValidObjectId } from 'mongoose'

class ProductService {
	public async getLibraryStats() {
		const [totalBooks, currentlyBorrowed] = await Promise.all([
			ProductModel.countDocuments({
				productStatus: { $ne: ProductStatus.HIDDEN },
			}).exec(),
			ProductModel.countDocuments({
				productStatus: ProductStatus.BORROWED,
			}).exec(),
		])

		return { totalBooks, currentlyBorrowed }
	}

	public async getProducts(input: ProductSearchInput) {
		const page = input.page && input.page > 0 ? input.page : 1
		const limit = input.limit && input.limit > 0 ? input.limit : 40

		const filter: any = { productStatus: { $ne: ProductStatus.HIDDEN } }
		if (input.search) {
			filter.$or = [
				{ productName: { $regex: input.search, $options: 'i' } },
				{ productAuthor: { $regex: input.search, $options: 'i' } },
			]
		}
		if (input.genre) filter.productGenre = input.genre
		if (input.status) filter.productStatus = input.status

		const products = await ProductModel.find(filter)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.exec()

		const total = await ProductModel.countDocuments(filter).exec()

		return { products, total, page, limit }
	}

	// Admin uchun: HIDDEN bo'lganlarni ham qo'shib, barchasini qaytaradi
	public async getAllForAdmin(input: ProductSearchInput) {
		const filter: any = {}
		if (input.search) {
			filter.$or = [
				{ productName: { $regex: input.search, $options: 'i' } },
				{ productAuthor: { $regex: input.search, $options: 'i' } },
			]
		}
		if (input.genre) filter.productGenre = input.genre
		if (input.status) filter.productStatus = input.status

		return ProductModel.find(filter).sort({ createdAt: -1 }).exec()
	}

	public async getProductById(id: string) {
		if (!isValidObjectId(id)) {
			throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND)
		}
		const product = await ProductModel.findById(id).exec()
		if (!product) {
			throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND)
		}
		return product
	}

	public async createProduct(input: ProductInput) {
		return ProductModel.create(input)
	}

	public async updateProduct(id: string, input: Partial<ProductInput>) {
		const updated = await ProductModel.findByIdAndUpdate(id, input, {
			new: true,
			runValidators: true,
		}).exec()
		if (!updated) {
			throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND)
		}
		return updated
	}

	public async removeProduct(id: string) {
		const removed = await ProductModel.findByIdAndDelete(id).exec()
		if (!removed) {
			throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND)
		}
		return removed
	}
	// Bosh sahifadagi "Mening tavsiyalarim" bo'limi uchun,
	// admin belgilab qo'ygan kitoblarni qaytaradi
	public async getRecommended(limit = 10) {
		return ProductModel.find({
			isRecommended: true,
			productStatus: { $ne: ProductStatus.HIDDEN },
		})
			.sort({ updatedAt: -1 })
			.limit(limit)
			.exec()
	}

	public async getGenreCounts() {
		const counts = await ProductModel.aggregate([
			{ $match: { productStatus: { $ne: ProductStatus.HIDDEN } } },
			{ $group: { _id: '$productGenre', count: { $sum: 1 } } },
		])

		return counts.reduce<Record<string, number>>((result, item) => {
			result[item._id] = item.count
			return result
		}, {})
	}
}

export default new ProductService()

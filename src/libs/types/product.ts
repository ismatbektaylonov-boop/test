import { ProductGenre, ProductStatus } from '../enums/product.enum'

export interface Product {
	_id: string
	productName: string // kitob nomi
	productAuthor?: string // muallif
	productGenre: ProductGenre
	productDesc?: string // kitob haqida ma'lumot
	productImage?: string // /uploads/... yo'li
	productStatus: ProductStatus
	isRecommended: boolean
	createdAt: Date
	updatedAt: Date
}

export interface ProductInput {
	productName: string
	productAuthor?: string
	productGenre: ProductGenre
	productDesc?: string
	productImage?: string
	productStatus?: ProductStatus
	isRecommended?: boolean
}

export interface ProductSearchInput {
	search?: string
	genre?: ProductGenre
	status?: ProductStatus
	page?: number
	limit?: number
}

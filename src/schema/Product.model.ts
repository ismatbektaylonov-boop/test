import { Schema, model } from 'mongoose'
import { ProductGenre, ProductStatus } from '../libs/enums/product.enum'

const productSchema = new Schema(
	{
		productName: {
			type: String,
			required: true,
			trim: true,
		},
		productAuthor: {
			type: String,
			default: '',
			trim: true,
		},
		productGenre: {
			type: String,
			enum: ProductGenre,
			default: ProductGenre.BOSHQA,
		},
		productDesc: {
			type: String,
			default: '',
		},
		productImage: {
			type: String,
			default: '', // masalan: /uploads/167...-kitob.jpg
		},
		productStatus: {
			type: String,
			enum: ProductStatus,
			default: ProductStatus.AVAILABLE,
		},
		isRecommended: {
			type: Boolean,
			default: false, // "Mening tavsiyalarim" bo'limida chiqishi uchun
		},
	},
	{ timestamps: true, collection: 'products' },
)

export default model('Product', productSchema)

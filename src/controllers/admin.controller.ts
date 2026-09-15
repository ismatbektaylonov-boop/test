import { NextFunction, Request, Response } from 'express'
import { MemberType } from '../libs/enums/member.enum'
import { ProductGenre, ProductStatus } from '../libs/enums/product.enum'
import MemberService from '../models/Member.service'
import OrderService from '../models/Order.service'
import ProductService from '../models/Product.service'

class AdminController {
	// GET /admin/login
	public getLogin(req: Request, res: Response) {
		res.render('admin/login', { error: null })
	}

	// POST /admin/login
	public async postLogin(req: Request, res: Response) {
		try {
			const { memberEmail, memberPassword } = req.body
			const member = await MemberService.login({
				memberEmail,
				memberPassword,
			})

			if (member.memberType !== MemberType.ADMIN) {
				return res.render('admin/login', {
					error: 'Bu hisob admin emas.',
				})
			}

			req.session.member = {
				_id: String(member._id),
				memberName: member.memberName,
				memberEmail: member.memberEmail,
				memberType: member.memberType,
			}
			res.redirect('/admin')
		} catch (err: any) {
			res.render('admin/login', {
				error: err.message || 'Kirishda xatolik',
			})
		}
	}

	public logout(req: Request, res: Response) {
		req.session.destroy(() => res.redirect('/admin/login'))
	}

	// GET /admin -> kitoblar ro'yxati (boshqaruv paneli)
	public async getDashboard(req: Request, res: Response, next: NextFunction) {
		try {
			const search = (req.query.search as string) || ''
			const products = await ProductService.getAllForAdmin({ search })
			res.render('admin/products', {
				member: req.session.member,
				products,
				search,
				genres: Object.values(ProductGenre),
				statuses: Object.values(ProductStatus),
			})
		} catch (err) {
			next(err)
		}
	}

	// GET /admin/products/new -> yangi kitob qo'shish formasi
	public getNewProductForm(req: Request, res: Response) {
		res.render('admin/product-form', {
			member: req.session.member,
			product: null,
			genres: Object.values(ProductGenre),
			error: null,
		})
	}

	// POST /admin/products -> yangi kitob saqlash (rasm bilan)
	public async createProduct(req: Request, res: Response, next: NextFunction) {
		try {
			const {
				productName,
				productAuthor,
				productGenre,
				productDesc,
				isRecommended,
			} = req.body
			const productImage = req.file ? `/uploads/${req.file.filename}` : ''

			await ProductService.createProduct({
				productName,
				productAuthor,
				productGenre,
				productDesc,
				productImage,
				isRecommended: isRecommended === 'on' || isRecommended === 'true',
			})
			res.redirect('/admin')
		} catch (err: any) {
			res.render('admin/product-form', {
				member: req.session.member,
				product: req.body,
				genres: Object.values(ProductGenre),
				error: err.message || 'Saqlashda xatolik',
			})
		}
	}

	// GET /admin/products/:id/edit -> tahrirlash formasi
	public async getEditProductForm(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const product = await ProductService.getProductById(req.params.id)
			res.render('admin/product-form', {
				member: req.session.member,
				product,
				genres: Object.values(ProductGenre),
				error: null,
			})
		} catch (err) {
			next(err)
		}
	}

	// POST /admin/products/:id -> tahrirlashni saqlash
	public async updateProduct(req: Request, res: Response, next: NextFunction) {
		try {
			const {
				productName,
				productAuthor,
				productGenre,
				productDesc,
				productStatus,
				isRecommended,
			} = req.body

			const updateData: any = {
				productName,
				productAuthor,
				productGenre,
				productDesc,
				productStatus,
				isRecommended: isRecommended === 'on' || isRecommended === 'true',
			}
			if (req.file) {
				updateData.productImage = `/uploads/${req.file.filename}`
			}

			await ProductService.updateProduct(req.params.id, updateData)
			res.redirect('/admin')
		} catch (err) {
			next(err)
		}
	}

	// POST /admin/products/:id/delete
	public async deleteProduct(req: Request, res: Response, next: NextFunction) {
		try {
			await ProductService.removeProduct(req.params.id)
			res.redirect('/admin')
		} catch (err) {
			next(err)
		}
	}

	// GET /admin/orders -> barcha ijara so'rovlari
	public async getOrders(req: Request, res: Response, next: NextFunction) {
		try {
			const orders = await OrderService.getAllOrdersForAdmin()
			res.render('admin/orders', {
				member: req.session.member,
				orders,
			})
		} catch (err) {
			next(err)
		}
	}

	public async approveOrder(req: Request, res: Response, next: NextFunction) {
		try {
			await OrderService.approveOrder(req.params.id)
			res.redirect('/admin/orders')
		} catch (err) {
			next(err)
		}
	}

	public async rejectOrder(req: Request, res: Response, next: NextFunction) {
		try {
			await OrderService.rejectOrder(req.params.id)
			res.redirect('/admin/orders')
		} catch (err) {
			next(err)
		}
	}

	public async returnOrder(req: Request, res: Response, next: NextFunction) {
		try {
			await OrderService.returnOrder(req.params.id)
			res.redirect('/admin/orders')
		} catch (err) {
			next(err)
		}
	}
}

export default new AdminController()

import { NextFunction, Request, Response } from 'express'
import { ProductGenre, ProductStatus } from '../libs/enums/product.enum'
import MemberService from '../models/Member.service'
import ProductService from '../models/Product.service'

class MemberController {
	// GET /  -> bosh sahifa (so'nggi qo'shilgan kitoblar)
	public async getHome(req: Request, res: Response, next: NextFunction) {
		try {
			const { products } = await ProductService.getProducts({
				page: 1,
				limit: 8,
			})
			const [bookStats, totalMembers, genreCounts, recommended] =
				await Promise.all([
					ProductService.getLibraryStats(),
					MemberService.countMembers(),
					ProductService.getGenreCounts(),
					ProductService.getRecommended(10),
				])
			res.render('home', {
				member: req.session.member,
				products,
				stats: { ...bookStats, totalMembers },
				genreCounts,
				recommended,
			})
		} catch (err) {
			next(err)
		}
	}

	// GET /products -> barcha kitoblar (qidiruv/filtr bilan)
	public async getProducts(req: Request, res: Response, next: NextFunction) {
		try {
			const search = (req.query.search as string) || ''
			const genre = (req.query.genre as ProductGenre) || undefined
			const page = Number(req.query.page) || 1

			const { products, total, limit } = await ProductService.getProducts({
				search,
				genre,
				page,
				limit: 40,
			})

			res.render('products', {
				member: req.session.member,
				products,
				total,
				page,
				limit,
				search,
				genre: genre || '',
				genres: Object.values(ProductGenre),
				ProductStatus,
			})
		} catch (err) {
			next(err)
		}
	}

	// GET /products/:id -> bitta kitobning batafsil sahifasi
	public async getProductDetail(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const product = await ProductService.getProductById(req.params.id)
			res.render('product-detail', {
				member: req.session.member,
				product,
			})
		} catch (err) {
			next(err)
		}
	}

	// GET /signup
	public getSignup(req: Request, res: Response) {
		res.render('signup', { member: req.session.member, error: null })
	}

	// POST /signup
	public async postSignup(req: Request, res: Response, next: NextFunction) {
		try {
			const { memberName, memberEmail, memberPassword, memberPhone } = req.body
			const member = await MemberService.signup({
				memberName,
				memberEmail,
				memberPassword,
				memberPhone,
			})

			req.session.member = {
				_id: String(member._id),
				memberName: member.memberName,
				memberEmail: member.memberEmail,
				memberType: member.memberType,
			}
			res.redirect('/')
		} catch (err: any) {
			res.render('signup', {
				member: req.session.member,
				error: err.message || "Ro'yxatdan o'tishda xatolik",
			})
		}
	}

	// GET /login
	public getLogin(req: Request, res: Response) {
		res.render('login', { member: req.session.member, error: null })
	}

	// POST /login
	public async postLogin(req: Request, res: Response, next: NextFunction) {
		try {
			const { memberEmail, memberPassword } = req.body
			const member = await MemberService.login({
				memberEmail,
				memberPassword,
			})

			req.session.member = {
				_id: String(member._id),
				memberName: member.memberName,
				memberEmail: member.memberEmail,
				memberType: member.memberType,
			}
			res.redirect('/')
		} catch (err: any) {
			res.render('login', {
				member: req.session.member,
				error: err.message || 'Kirishda xatolik',
			})
		}
	}

	// GET /logout
	public logout(req: Request, res: Response) {
		req.session.destroy(() => {
			res.redirect('/')
		})
	}
}

export default new MemberController()

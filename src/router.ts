import { Router } from 'express'
import MemberController from './controllers/member.controller'
import OrderController from './controllers/order.controller'

const router = Router()

// Bosh sahifa va kitoblar
router.get('/', MemberController.getHome)
router.get('/products', MemberController.getProducts)

// Ro'yxatdan o'tish / kirish / chiqish
router.get('/signup', MemberController.getSignup)
router.post('/signup', MemberController.postSignup)
router.get('/login', MemberController.getLogin)
router.post('/login', MemberController.postLogin)
router.get('/logout', MemberController.logout)

// A'zoning ijaraga olish so'rovlari
router.get('/orders', OrderController.getMyOrders)
router.post('/orders', OrderController.createOrder)

router.get('/products/:id', MemberController.getProductDetail)

export default router

import MongoStore from 'connect-mongo'
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import path from 'path'

import { Errors, HttpCode, Message } from './libs/Errors'
import MemberService from './models/Member.service'
import router from './router'
import adminRouter from './router.admin'

const app = express()
const PORT = process.env.PORT || 8015
const MONGODB_URI = process.env.MONGODB_URI as string

// ==================== VIEW ENGINE ====================
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// ==================== MIDDLEWARE ====================
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.use(
	session({
		secret: process.env.SESSION_SECRET || 'kutubxona-maxfiy-kalit',
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: MONGODB_URI }),
		cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 kun
	}),
)

// ==================== ROUTES ====================
app.use('/admin', adminRouter)
app.use('/', router)

// ==================== 404 ====================
app.use((_req: Request, res: Response) => {
	res.status(HttpCode.NOT_FOUND).send('Sahifa topilmadi')
})

// ==================== XATOLIKLARNI BOSHQARISH ====================
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err)
	const code = err instanceof Errors ? err.code : HttpCode.INTERNAL_SERVER_ERROR
	const message =
		err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG
	res.status(code).send(message)
})

// ==================== SERVERNI ISHGA TUSHIRISH ====================
async function bootstrap() {
	try {
		await mongoose.connect(MONGODB_URI)
		console.log('✅ MongoDB ga ulandi')

		// Birinchi marta ishga tushirishda admin hisobini avtomatik yaratib qo'yamiz
		// (email/parolni albatta .env yoki shu yerda o'zingizga moslang)
		await MemberService.createAdminIfNotExists(
			process.env.ADMIN_EMAIL || 'admin@kutubxona.uz',
			process.env.ADMIN_PASSWORD || 'admin123',
			'Kutubxona Admin',
		)

		app.listen(PORT, () => {
			console.log(`🚀 Server http://localhost:${PORT} da ishga tushdi`)
		})
	} catch (err) {
		console.error('❌ Ishga tushirishda xatolik:', err)
		process.exit(1)
	}
}

bootstrap()

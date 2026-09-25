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
const isProduction = process.env.NODE_ENV === 'production'

function requiredEnv(name: string): string {
	const value = process.env[name]
	if (!value) throw new Error(`Missing required environment variable: ${name}`)
	return value
}

const MONGODB_URI = requiredEnv('MONGODB_URI')
const SESSION_SECRET = requiredEnv('SESSION_SECRET')
const ADMIN_EMAIL = requiredEnv('ADMIN_EMAIL')
const ADMIN_PASSWORD = requiredEnv('ADMIN_PASSWORD')

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
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: MONGODB_URI }),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true,
			secure: isProduction,
			sameSite: 'lax',
		},
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
			ADMIN_EMAIL,
			ADMIN_PASSWORD,
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

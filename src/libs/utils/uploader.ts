import multer from 'multer'
import path from 'path'

const storage = multer.memoryStorage()

function imageFileFilter(
	_req: any,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) {
	const allowed = /jpeg|jpg|png|webp/
	const isAllowed = allowed.test(path.extname(file.originalname).toLowerCase())

	if (isAllowed) {
		cb(null, true)
	} else {
		cb(
			new Error(
				'Faqat jpg, jpeg, png yoki webp rasm fayllarini yuklash mumkin',
			),
		)
	}
}

export const uploader = multer({
	storage,
	fileFilter: imageFileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
})

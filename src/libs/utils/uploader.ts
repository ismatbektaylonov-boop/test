import multer from "multer";
import path from "path";
import fs from "fs";

// Loyiha ildizidagi /uploads papkasiga saqlaymiz (.gitignore'da bor)
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

function imageFileFilter(
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const allowed = /jpeg|jpg|png|webp/;
  const isAllowed = allowed.test(path.extname(file.originalname).toLowerCase());
  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error("Faqat jpg, jpeg, png yoki webp rasm fayllarini yuklash mumkin"));
  }
}

export const uploader = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

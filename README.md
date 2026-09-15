# Shaxsiy Kutubxona — Backend (TypeScript + Express + EJS + MongoDB)

## Tuzilma haqida qisqacha

Siz bergan struktura bo'yicha qurilgan, ikkita qo'shimcha bilan (quyida izohlangan):

- `schema/Product.model.ts` va `models/Product.service.ts` — sizning
  ro'yxatingizda yo'q edi, lekin kitoblarni (nomi, muallifi, janri,
  tavsifi, rasmi) saqlash uchun zarur bo'lgani sababli, boshqa
  fayllar bilan bir xil uslubda qo'shildi.
- `views/admin/` papkasi (login.ejs, products.ejs, product-form.ejs,
  orders.ejs) — admin panel sahifalari uchun.

"Product" atamasi butun kodda **kitob** ma'nosida, "Order" atamasi esa
**kitobni ijaraga olish so'rovi** ma'nosida ishlatilgan.

## Kitob nomlari haqida

Kodning hech bir joyida kitob nomi qattiq yozilmagan (hardcode
qilinmagan) — hammasi bo'sh MongoDB bazasidan boshlanadi. Kitoblarni
`/admin` panel orqali, bittalab, nomi + muallifi + janri + tavsifi +
rasmi bilan o'zingiz kiritasiz.

## Ishga tushirish

1. **MongoDB Atlas'da baza yarating** (yoki mahalliy MongoDB
   ishlatasiz) va ulanish manzilini oling.

2. `.env.example` ni `.env` deb nusxalang va to'ldiring:
   ```
   MONGODB_URI=...
   PORT=3000
   SESSION_SECRET=...
   ADMIN_EMAIL=admin@kutubxona.uz
   ADMIN_PASSWORD=admin123
   ```

3. O'rnating va ishga tushiring:
   ```bash
   npm install
   npm run dev
   ```

4. Server birinchi ishga tushganda `.env`dagi `ADMIN_EMAIL` /
   `ADMIN_PASSWORD` bilan **avtomatik ADMIN hisobi** yaratiladi.
   `http://localhost:3000/admin/login` ga shu login/parol bilan kiring.

5. Admin panelda **"+ Yangi kitob qo'shish"** orqali kitoblaringizni
   birma-bir kiritib chiqing (nomi, muallifi, janri, tavsifi, rasm
   fayli — kompyuteringizdan yuklaysiz).

6. Oddiy foydalanuvchilar (`/signup` orqali ro'yxatdan o'tganlar)
   `/products` sahifasida kitoblarni ko'radi, kirgan bo'lsa mavjud
   kitobni "Ijaraga olish" tugmasi bilan so'rov yuboradi. Siz esa
   `/admin/orders` sahifasida so'rovlarni tasdiqlaysiz/rad etasiz/
   qaytarilgan deb belgilaysiz.

## Rasm fayllari qayerda saqlanadi?

`uploads/` papkasida (loyiha ildizida, `.gitignore`'da bor — git'ga
tushmaydi). Serverga deploy qilganda, agar hosting fayl tizimini
saqlab turmasa (masalan Render qayta deploy qilinganda diskni
tozalaydi), rasmlar uchun Cloudinary kabi tashqi xizmatga o'tish
tavsiya etiladi — kerak bo'lsa shuni ham sozlab beraman.

## Build va production

```bash
npm run build   # dist/ papkasiga kompilyatsiya qiladi
npm start       # dist/app.js ni ishga tushiradi
```

// "Product" atamasi shu loyihada KITOB ma'nosida ishlatiladi

export enum ProductStatus {
  AVAILABLE = "AVAILABLE", // ijaraga berilishi mumkin
  BORROWED = "BORROWED", // hozir kimdadir
  HIDDEN = "HIDDEN", // admin vaqtincha yashirgan
}

export enum ProductGenre {
  BADIIY = "Badiiy",
  DIN = "Din",
  TARIX_BIOGRAFIYA = "Tarix/Biografiya",
  ILMIY = "Ilmiy",
  BOLALAR = "Bolalar uchun",
  SHEIRIYAT = "She'riyat",
  BOSHQA = "Boshqa",
}

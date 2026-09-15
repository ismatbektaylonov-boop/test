// "Order" shu loyihada kitobni IJARAGA OLISH SO'ROVI ma'nosida ishlatiladi

export enum OrderStatus {
  PENDING = "PENDING", // member so'rov yubordi, admin tasdiqlamagan
  APPROVED = "APPROVED", // admin tasdiqladi, kitob memberda
  RETURNED = "RETURNED", // kitob qaytarildi
  REJECTED = "REJECTED", // admin rad etdi
}

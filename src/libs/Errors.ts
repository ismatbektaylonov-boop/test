export enum HttpCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
  SOMETHING_WENT_WRONG = "Nimadir xato ketdi. Qayta urinib ko'ring.",
  NO_DATA_FOUND = "Ma'lumot topilmadi.",
  CREATE_FAILED = "Yaratishda xatolik yuz berdi.",
  UPDATE_FAILED = "Yangilashda xatolik yuz berdi.",
  REMOVE_FAILED = "O'chirishda xatolik yuz berdi.",
  USED_MEMBER_EMAIL = "Bu email allaqachon ro'yxatdan o'tgan.",
  WRONG_PASSWORD = "Email yoki parol noto'g'ri.",
  NOT_AUTHENTICATED = "Avval tizimga kiring.",
  NOT_AUTHORIZED = "Bu amal uchun ruxsatingiz yo'q.",
  PRODUCT_NOT_AVAILABLE = "Bu kitob hozircha band.",
}

export class Errors extends Error {
  public code: HttpCode;
  public message: Message | string;

  constructor(code: HttpCode, message: Message | string) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

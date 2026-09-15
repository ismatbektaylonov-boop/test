export interface MessageResponse {
  message: string;
}

export interface T {
  [key: string]: any;
}

// EJS view ichida "session"dan qulay foydalanish uchun
export interface LoggedInMember {
  _id: string;
  memberName: string;
  memberEmail: string;
  memberType: string;
}

declare module "express-session" {
  interface SessionData {
    member?: LoggedInMember;
  }
}

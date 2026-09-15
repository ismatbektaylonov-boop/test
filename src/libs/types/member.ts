import { MemberStatus, MemberType } from "../enums/member.enum";

export interface Member {
  _id: string;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberName: string;
  memberEmail: string;
  memberPassword: string; // hash holida saqlanadi
  memberPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberSignupInput {
  memberName: string;
  memberEmail: string;
  memberPassword: string;
  memberPhone?: string;
}

export interface MemberLoginInput {
  memberEmail: string;
  memberPassword: string;
}

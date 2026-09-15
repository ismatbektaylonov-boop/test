import { Schema, model } from "mongoose";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";

const memberSchema = new Schema(
  {
    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.USER,
    },
    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },
    memberName: {
      type: String,
      required: true,
      trim: true,
    },
    memberEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    memberPassword: {
      type: String,
      required: true,
      select: false, // so'rovlarda default holda qaytmaydi
    },
    memberPhone: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, collection: "members" }
);

export default model("Member", memberSchema);

import { Schema, model } from "mongoose";
import { OrderStatus } from "../libs/enums/order.enum";

const orderSchema = new Schema(
  {
    orderMemberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    orderProductId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PENDING,
    },
  },
  { timestamps: true, collection: "orders" }
);

export default model("Order", orderSchema);

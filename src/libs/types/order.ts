import { OrderStatus } from "../enums/order.enum";

export interface Order {
  _id: string;
  orderMemberId: string;
  orderProductId: string;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderInput {
  orderMemberId: string;
  orderProductId: string;
}

export interface OrderUpdateInput {
  orderId: string;
  orderStatus: OrderStatus;
}

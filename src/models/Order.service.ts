import OrderModel from "../schema/Order.model";
import ProductModel from "../schema/Product.model";
import { Errors, HttpCode, Message } from "../libs/Errors";
import { OrderInput } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";
import { ProductStatus } from "../libs/enums/product.enum";
import { isValidObjectId } from "mongoose";

class OrderService {
  // Member kitobni "ijaraga olish" uchun so'rov yuboradi
  public async createOrder(input: OrderInput) {
    if (!isValidObjectId(input.orderMemberId) || !isValidObjectId(input.orderProductId)) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND);
    }
    const product = await ProductModel.findById(input.orderProductId).exec();
    if (!product) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    if (product.productStatus !== ProductStatus.AVAILABLE) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.PRODUCT_NOT_AVAILABLE);
    }

    const existingOrder = await OrderModel.findOne({
      orderMemberId: input.orderMemberId,
      orderProductId: input.orderProductId,
      orderStatus: { $in: [OrderStatus.PENDING, OrderStatus.APPROVED] },
    }).exec();
    if (existingOrder) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.PRODUCT_NOT_AVAILABLE);
    }

    const order = await OrderModel.create({
      orderMemberId: input.orderMemberId,
      orderProductId: input.orderProductId,
      orderStatus: OrderStatus.PENDING,
    });

    return order;
  }

  public async getOrdersByMember(memberId: string) {
    return OrderModel.find({ orderMemberId: memberId })
      .populate("orderProductId")
      .sort({ createdAt: -1 })
      .exec();
  }

  public async findApprovedOrder(productId: string, memberId: string) {
    if (!isValidObjectId(productId) || !isValidObjectId(memberId)) return null;

    return OrderModel.findOne({
      orderProductId: productId,
      orderMemberId: memberId,
      orderStatus: OrderStatus.APPROVED,
    }).exec();
  }

  public async getAllOrdersForAdmin() {
    return OrderModel.find({})
      .populate("orderMemberId")
      .populate("orderProductId")
      .sort({ createdAt: -1 })
      .exec();
  }

  public async approveOrder(orderId: string) {
    if (!isValidObjectId(orderId)) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    const order = await OrderModel.findOneAndUpdate(
      { _id: orderId, orderStatus: OrderStatus.PENDING },
      { orderStatus: OrderStatus.APPROVED },
      { new: true }
    ).exec();
    if (!order) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    await ProductModel.findByIdAndUpdate(order.orderProductId, {
      productStatus: ProductStatus.BORROWED,
    }).exec();

    return order;
  }

  public async rejectOrder(orderId: string) {
    if (!isValidObjectId(orderId)) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    const order = await OrderModel.findOneAndUpdate(
      { _id: orderId, orderStatus: OrderStatus.PENDING },
      { orderStatus: OrderStatus.REJECTED },
      { new: true }
    ).exec();
    if (!order) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return order;
  }

  public async returnOrder(orderId: string) {
    if (!isValidObjectId(orderId)) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    const order = await OrderModel.findOneAndUpdate(
      { _id: orderId, orderStatus: OrderStatus.APPROVED },
      { orderStatus: OrderStatus.RETURNED },
      { new: true }
    ).exec();
    if (!order) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    await ProductModel.findByIdAndUpdate(order.orderProductId, {
      productStatus: ProductStatus.AVAILABLE,
    }).exec();

    return order;
  }
}

export default new OrderService();

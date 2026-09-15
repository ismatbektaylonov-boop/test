import OrderModel from "../schema/Order.model";
import ProductModel from "../schema/Product.model";
import { Errors, HttpCode, Message } from "../libs/Errors";
import { OrderInput } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";
import { ProductStatus } from "../libs/enums/product.enum";

class OrderService {
  // Member kitobni "ijaraga olish" uchun so'rov yuboradi
  public async createOrder(input: OrderInput) {
    const product = await ProductModel.findById(input.orderProductId).exec();
    if (!product) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    if (product.productStatus !== ProductStatus.AVAILABLE) {
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

  public async getAllOrdersForAdmin() {
    return OrderModel.find({})
      .populate("orderMemberId")
      .populate("orderProductId")
      .sort({ createdAt: -1 })
      .exec();
  }

  public async approveOrder(orderId: string) {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
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
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { orderStatus: OrderStatus.REJECTED },
      { new: true }
    ).exec();
    if (!order) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return order;
  }

  public async returnOrder(orderId: string) {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
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

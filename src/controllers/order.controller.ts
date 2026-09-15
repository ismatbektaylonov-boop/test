import { Request, Response, NextFunction } from "express";
import OrderService from "../models/Order.service";

class OrderController {
  // GET /orders -> tizimga kirgan a'zoning o'z so'rovlari ro'yxati
  public async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.session.member) return res.redirect("/login");

      const orders = await OrderService.getOrdersByMember(
        req.session.member._id
      );
      res.render("orders", {
        member: req.session.member,
        orders,
      });
    } catch (err) {
      next(err);
    }
  }

  // POST /orders -> kitobni ijaraga olish uchun so'rov yuborish
  public async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.session.member) return res.redirect("/login");

      const { productId } = req.body;
      await OrderService.createOrder({
        orderMemberId: req.session.member._id,
        orderProductId: productId,
      });
      res.redirect("/orders");
    } catch (err: any) {
      res.redirect("/products");
    }
  }
}

export default new OrderController();

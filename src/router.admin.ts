import { Router, Request, Response, NextFunction } from "express";
import AdminController from "./controllers/admin.controller";
import { uploader } from "./libs/utils/uploader";
import { MemberType } from "./libs/enums/member.enum";

const router = Router();

// Faqat ADMIN kira oladigan sahifalar uchun himoya
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.member && req.session.member.memberType === MemberType.ADMIN) {
    return next();
  }
  return res.redirect("/admin/login");
}

// Login sahifasi himoyasiz
router.get("/login", AdminController.getLogin);
router.post("/login", AdminController.postLogin);
router.get("/logout", AdminController.logout);

// Qolgan hamma narsa faqat adminga
router.use(requireAdmin);

router.get("/", AdminController.getDashboard);

router.get("/products/new", AdminController.getNewProductForm);
router.post("/products", uploader.single("productImage"), AdminController.createProduct);
router.get("/products/:id/edit", AdminController.getEditProductForm);
router.post("/products/:id", uploader.single("productImage"), AdminController.updateProduct);
router.post("/products/:id/delete", AdminController.deleteProduct);

router.get("/orders", AdminController.getOrders);
router.post("/orders/:id/approve", AdminController.approveOrder);
router.post("/orders/:id/reject", AdminController.rejectOrder);
router.post("/orders/:id/return", AdminController.returnOrder);

export default router;

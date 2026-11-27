import { Router } from "express";
import { processBankPayment, validPaymentSignature } from "../services/paymentEvents.js";

const router = Router();
router.post("/webhook", async (req, res, next) => {
  if (!process.env.PAYMENT_WEBHOOK_SECRET || !process.env.PAYMENT_ACCOUNT_NO) return res.status(503).json({ success: false, message: "Chưa cấu hình thông báo giao dịch ngân hàng." });
  if (!validPaymentSignature(req.rawBody, req.get("x-payment-signature"), process.env.PAYMENT_WEBHOOK_SECRET)) return res.status(401).json({ success: false, message: "Chữ ký giao dịch không hợp lệ." });
  try {
    const result = await processBankPayment(req.body || {});
    return res.status(result.status).json({ success: result.status === 200, message: result.message, orderId: result.orderId });
  } catch (error) { return next(error); }
});
export default router;

import { Router } from "express";
import db from "../config/database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/product/:productId", async (req, res, next) => {
  try { const [rows] = await db.query("SELECT dg.maDanhGia AS id, dg.diem AS rating, dg.noiDung AS content, dg.taoLuc AS createdAt, kh.hoTen AS customer FROM danh_gia dg JOIN khach_hang kh ON kh.maKhachHang = dg.maKhachHang WHERE dg.maSanPham = ? AND dg.trangThai = 'DA_DUYET' ORDER BY dg.taoLuc DESC", [req.params.productId]); return res.json({ success: true, data: rows }); } catch (error) { return next(error); }
});

router.post("/product/:productId", requireAuth, async (req, res, next) => {
  const { rating, content } = req.body || {};
  if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5 || !content?.trim()) return res.status(400).json({ success: false, message: "Vui lòng chọn số sao và nhập nội dung đánh giá." });
  try { const [[customer]] = await db.query("SELECT maKhachHang FROM khach_hang WHERE maTaiKhoan = ?", [req.user.id]); const [[purchased]] = await db.query("SELECT cd.maChiTietDon FROM chi_tiet_don cd JOIN don_hang d ON d.maDon = cd.maDon WHERE d.maKhachHang = ? AND cd.maSanPham = ? AND d.trangThai = 'DA_GIAO'", [customer?.maKhachHang, req.params.productId]); if (!purchased) return res.status(403).json({ success: false, message: "Bạn cần mua và nhận sản phẩm trước khi đánh giá." }); await db.query("INSERT INTO danh_gia (maKhachHang, maSanPham, diem, noiDung, trangThai, taoLuc) VALUES (?, ?, ?, ?, 'CHO_DUYET', NOW())", [customer.maKhachHang, req.params.productId, rating, content.trim()]); return res.status(201).json({ success: true, message: "Đánh giá đã được gửi và chờ duyệt." }); } catch (error) { return next(error); }
});

export default router;

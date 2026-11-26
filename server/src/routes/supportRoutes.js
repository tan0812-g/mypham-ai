import { Router } from "express";
import db from "../config/database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try { const [rows] = await db.query("SELECT y.maYeuCau AS id, y.loaiYeuCau AS type, y.noiDung AS content, y.phanHoi AS reply, y.trangThai AS status, y.taoLuc AS createdAt FROM yeu_cau_ho_tro y JOIN khach_hang kh ON kh.maKhachHang = y.maKhachHang WHERE kh.maTaiKhoan = ? ORDER BY y.taoLuc DESC", [req.user.id]); return res.json({ success: true, data: rows }); } catch (error) { return next(error); }
});

router.post("/", async (req, res, next) => {
  const { type = "HO_TRO", content, orderId = null } = req.body || {};
  const allowed = ["HO_TRO", "HUY_DON", "DOI_TRA"];
  if (!allowed.includes(type) || !content?.trim()) return res.status(400).json({ success: false, message: "Vui lòng chọn loại yêu cầu và nhập nội dung." });
  try { const [[customer]] = await db.query("SELECT maKhachHang FROM khach_hang WHERE maTaiKhoan = ?", [req.user.id]); if (!customer) return res.status(400).json({ success: false, message: "Tài khoản chưa có hồ sơ khách hàng." }); const [result] = await db.query("INSERT INTO yeu_cau_ho_tro (maKhachHang, maDon, loaiYeuCau, noiDung, trangThai, taoLuc) VALUES (?, ?, ?, ?, 'MOI', NOW())", [customer.maKhachHang, orderId || null, type, content.trim()]); return res.status(201).json({ success: true, message: "Đã gửi yêu cầu hỗ trợ.", data: { id: result.insertId } }); } catch (error) { return next(error); }
});

export default router;

import { Router } from "express";
import bcrypt from "bcryptjs";
import db from "../config/database.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireRole("KHACH_HANG"));

router.get("/profile", async (req, res, next) => { try { const [[profile]] = await db.query("SELECT kh.maKhachHang AS id, kh.hoTen AS name, tk.email, kh.dienThoai AS phone, kh.diaChiMacDinh AS address, kh.loaiDa AS skinType FROM khach_hang kh JOIN tai_khoan tk ON tk.maTaiKhoan = kh.maTaiKhoan WHERE kh.maTaiKhoan = ?", [req.user.id]); if (!profile) return res.status(404).json({ success: false, message: "Chưa có hồ sơ khách hàng." }); return res.json({ success: true, data: profile }); } catch (error) { return next(error); } });

router.patch("/profile", async (req, res, next) => { const { name, phone = "", address = "", skinType = "" } = req.body || {}; if (!name?.trim()) return res.status(400).json({ success: false, message: "Họ tên không được để trống." }); try { const [result] = await db.query("UPDATE khach_hang SET hoTen = ?, dienThoai = ?, diaChiMacDinh = ?, loaiDa = ? WHERE maTaiKhoan = ?", [name.trim(), phone.trim(), address.trim(), skinType.trim(), req.user.id]); if (!result.affectedRows) return res.status(404).json({ success: false, message: "Chưa có hồ sơ khách hàng." }); return res.json({ success: true, message: "Đã cập nhật thông tin tài khoản." }); } catch (error) { return next(error); } });

router.patch("/password", async (req, res, next) => { const { currentPassword, newPassword } = req.body || {}; if (!currentPassword || String(newPassword || "").length < 8) return res.status(400).json({ success: false, message: "Mật khẩu mới cần tối thiểu 8 ký tự." }); try { const [[account]] = await db.query("SELECT matKhauBam FROM tai_khoan WHERE maTaiKhoan = ?", [req.user.id]); if (!account || !(await bcrypt.compare(String(currentPassword), account.matKhauBam))) return res.status(400).json({ success: false, message: "Mật khẩu hiện tại không đúng." }); const hash = await bcrypt.hash(String(newPassword), 10); await db.query("UPDATE tai_khoan SET matKhauBam = ? WHERE maTaiKhoan = ?", [hash, req.user.id]); return res.json({ success: true, message: "Đã đổi mật khẩu thành công." }); } catch (error) { return next(error); } });

export default router;

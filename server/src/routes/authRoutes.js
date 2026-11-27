import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { Router } from "express";
import db from "../config/database.js";

const router = Router();
const sessions = new Map();

router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ success: false, message: "Vui lòng nhập đủ thông tin." });
  if (String(password).length < 8) return res.status(400).json({ success: false, message: "Mật khẩu cần tối thiểu 8 ký tự." });
  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const [existing] = await db.query("SELECT maTaiKhoan FROM tai_khoan WHERE email = ?", [normalizedEmail]);
    if (existing.length) return res.status(409).json({ success: false, message: "Email này đã được đăng ký." });
    const passwordHash = await bcrypt.hash(String(password), 10);
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const [account] = await connection.query("INSERT INTO tai_khoan (email, matKhauBam, vaiTro, trangThai, taoLuc) VALUES (?, ?, 'KHACH_HANG', 'HOAT_DONG', NOW())", [normalizedEmail, passwordHash]);
      await connection.query("INSERT INTO khach_hang (maTaiKhoan, hoTen) VALUES (?, ?)", [account.insertId, String(name).trim()]);
      await connection.commit();
      return res.status(201).json({ success: true, message: "Đăng ký thành công.", data: { id: account.insertId, name: String(name).trim(), email: normalizedEmail } });
    } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
  } catch (error) { return next(error); }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body || {};
  try {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const [rows] = await db.query("SELECT tk.maTaiKhoan, tk.email, tk.matKhauBam, tk.vaiTro, kh.hoTen AS customerName, nv.hoTen AS staffName, nv.dangLamViec, nv.quyenHan FROM tai_khoan tk LEFT JOIN khach_hang kh ON kh.maTaiKhoan = tk.maTaiKhoan LEFT JOIN nhan_vien nv ON nv.maTaiKhoan = tk.maTaiKhoan WHERE tk.email = ? AND tk.trangThai = 'HOAT_DONG'", [normalizedEmail]);
    const account = rows[0];
    if (!account || !(await bcrypt.compare(String(password || ""), account.matKhauBam))) return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng." });
    const token = randomUUID();
    if (account.vaiTro === "NHAN_VIEN" && !account.dangLamViec) return res.status(403).json({ success: false, message: "Tài khoản nhân viên hiện đang tạm nghỉ." });
    let permissions = [];
    try { permissions = JSON.parse(account.quyenHan || "[]"); } catch { permissions = []; }
    const user = { id: account.maTaiKhoan, name: account.staffName || account.customerName || account.email, email: account.email, role: account.vaiTro, permissions };
    sessions.set(token, user);
    return res.json({ success: true, message: "Đăng nhập thành công.", token, data: user });
  } catch (error) { return next(error); }
});

export { sessions };
export default router;

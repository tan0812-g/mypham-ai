import { Router } from "express";
import db from "../config/database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT maDon AS id, CONCAT('#MPAI-', LPAD(maDon, 4, '0')) AS code, tongThanhToan AS total, trangThai AS status, taoLuc AS createdAt FROM don_hang WHERE maKhachHang = (SELECT maKhachHang FROM khach_hang WHERE maTaiKhoan = ?) ORDER BY taoLuc DESC", [req.user.id]);
    return res.json({ success: true, data: rows });
  } catch (error) { return next(error); }
});

router.post("/coupon/validate", requireAuth, async (req, res, next) => { const { code, subtotal } = req.body || {}; if (!code?.trim() || Number(subtotal) <= 0) return res.status(400).json({ success: false, message: "Vui lòng nhập mã giảm giá." }); try { const [[coupon]] = await db.query("SELECT * FROM ma_giam_gia WHERE maCode = ? AND kichHoat = 1 AND NOW() BETWEEN batDau AND ketThuc", [code.trim().toUpperCase()]); if (!coupon) return res.status(400).json({ success: false, message: "Mã giảm giá không tồn tại hoặc đã hết hạn." }); if (coupon.soLuotDaDung >= coupon.gioiHanLuot) return res.status(400).json({ success: false, message: "Mã giảm giá đã hết lượt sử dụng." }); if (Number(subtotal) < Number(coupon.giaTriToiThieu)) return res.status(400).json({ success: false, message: `Đơn hàng tối thiểu ${Number(coupon.giaTriToiThieu).toLocaleString("vi-VN")} đ để dùng mã này.` }); const discount = coupon.loaiGiam === "PERCENT" ? Math.round(Number(subtotal) * Number(coupon.mucGiam) / 100) : Number(coupon.mucGiam); return res.json({ success: true, message: `Đã áp dụng mã ${coupon.maCode}.`, data: { code: coupon.maCode, discount, total: Math.max(0, Number(subtotal) - discount) } }); } catch (error) { return next(error); } });

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const [[order]] = await db.query("SELECT d.maDon AS id, CONCAT('#MPAI-', LPAD(d.maDon, 4, '0')) AS code, d.nguoiNhan AS receiver, d.dienThoaiNhan AS phone, d.diaChiNhanLucDat AS address, d.tongTienHang AS subtotal, d.tienGiam AS discount, d.phiVanChuyen AS shipping, d.tongThanhToan AS total, d.trangThai AS status, d.taoLuc AS createdAt, gt.phuongThuc AS paymentMethod, gt.trangThai AS paymentStatus FROM don_hang d JOIN khach_hang kh ON kh.maKhachHang = d.maKhachHang LEFT JOIN giao_dich_thanh_toan gt ON gt.maDon = d.maDon WHERE d.maDon = ? AND kh.maTaiKhoan = ? LIMIT 1", [req.params.id, req.user.id]);
    if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng." });
    const [items] = await db.query("SELECT ct.maSanPham AS id, sp.tenSanPham AS name, ct.soLuong AS quantity, ct.donGiaLucMua AS price, ct.thanhTien AS lineTotal FROM chi_tiet_don ct JOIN san_pham sp ON sp.maSanPham = ct.maSanPham WHERE ct.maDon = ?", [req.params.id]);
    return res.json({ success: true, data: { ...order, items } });
  } catch (error) { return next(error); }
});

router.patch("/:id/cancel", requireAuth, async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [[order]] = await connection.query("SELECT d.maDon AS id, d.trangThai AS status, gt.phuongThuc AS paymentMethod, gt.trangThai AS paymentStatus FROM don_hang d JOIN khach_hang kh ON kh.maKhachHang = d.maKhachHang LEFT JOIN giao_dich_thanh_toan gt ON gt.maDon = d.maDon WHERE d.maDon = ? AND kh.maTaiKhoan = ? FOR UPDATE", [req.params.id, req.user.id]);
    if (!order) { await connection.rollback(); return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng." }); }
    if (order.paymentMethod === "ONLINE" && order.paymentStatus === "THANH_CONG") { await connection.rollback(); return res.status(409).json({ success: false, message: "Đơn đã thanh toán. Vui lòng liên hệ hỗ trợ để xử lý hoàn tiền trước khi hủy." }); }
    if (!["CHO_XAC_NHAN", "DA_XAC_NHAN"].includes(order.status)) { await connection.rollback(); return res.status(400).json({ success: false, message: "Đơn hàng đã được chuẩn bị hoặc đang giao nên không thể hủy." }); }
    const [items] = await connection.query("SELECT maSanPham AS productId, soLuong AS quantity FROM chi_tiet_don WHERE maDon = ?", [req.params.id]);
    for (const item of items) await connection.query("UPDATE ton_kho SET soLuongGiu = GREATEST(0, soLuongGiu - ?), capNhatLuc = NOW() WHERE maSanPham = ?", [item.quantity, item.productId]);
    await connection.query("UPDATE don_hang SET trangThai = 'DA_HUY' WHERE maDon = ?", [req.params.id]);
    await connection.query("UPDATE giao_dich_thanh_toan SET trangThai = 'HOAN_TIEN' WHERE maDon = ?", [req.params.id]);
    await connection.commit();
    return res.json({ success: true, message: "Đã hủy đơn hàng." });
  } catch (error) { await connection.rollback(); return next(error); } finally { connection.release(); }
});

router.post("/", requireAuth, async (req, res, next) => {
  const { items, receiver, paymentMethod = "COD", couponCode = null } = req.body || {};
  if (!Array.isArray(items) || !items.length || !receiver?.name || !receiver?.phone || !receiver?.address) return res.status(400).json({ success: false, message: "Thông tin đơn hàng chưa đầy đủ." });
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [[customer]] = await connection.query("SELECT maKhachHang FROM khach_hang WHERE maTaiKhoan = ?", [req.user.id]);
    if (!customer) return res.status(400).json({ success: false, message: "Tài khoản chưa có hồ sơ khách hàng." });
    const ids = items.map((item) => Number(item.productId));
    const [products] = await connection.query("SELECT p.maSanPham, p.giaBan, t.soLuongThucTe, t.soLuongGiu FROM san_pham p JOIN ton_kho t ON t.maSanPham = p.maSanPham WHERE p.maSanPham IN (?) AND p.trangThai = 'DANG_BAN' FOR UPDATE", [ids]);
    const productMap = new Map(products.map((product) => [product.maSanPham, product]));
    let subtotal = 0;
    const lines = items.map((item) => { const product = productMap.get(Number(item.productId)); const quantity = Math.max(1, Number(item.quantity || 1)); if (!product || product.soLuongThucTe - product.soLuongGiu < quantity) throw new Error("Sản phẩm không đủ tồn kho."); const lineTotal = Number(product.giaBan) * quantity; subtotal += lineTotal; return { ...product, quantity, lineTotal }; });
    let discount = 0;
    let couponId = null;
    if (couponCode) { const [[coupon]] = await connection.query("SELECT * FROM ma_giam_gia WHERE maCode = ? AND kichHoat = 1 AND NOW() BETWEEN batDau AND ketThuc FOR UPDATE", [couponCode]); if (coupon && subtotal >= Number(coupon.giaTriToiThieu) && coupon.soLuotDaDung < coupon.gioiHanLuot) { couponId = coupon.maGiamGia; discount = coupon.loaiGiam === "PERCENT" ? Math.round(subtotal * Number(coupon.mucGiam) / 100) : Number(coupon.mucGiam); await connection.query("UPDATE ma_giam_gia SET soLuotDaDung = soLuotDaDung + 1 WHERE maGiamGia = ?", [couponId]); } }
    const shipping = Math.max(0, subtotal - discount) >= 499000 ? 0 : 30000;
    const total = Math.max(0, subtotal - discount) + shipping;
    const [order] = await connection.query("INSERT INTO don_hang (maKhachHang, maGiamGia, nguoiNhan, dienThoaiNhan, diaChiNhanLucDat, tongTienHang, tienGiam, phiVanChuyen, tongThanhToan, trangThai, taoLuc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'CHO_XAC_NHAN', NOW())", [customer.maKhachHang, couponId, receiver.name, receiver.phone, receiver.address, subtotal, discount, shipping, total]);
    for (const line of lines) { await connection.query("INSERT INTO chi_tiet_don (maDon, maSanPham, soLuong, donGiaLucMua, giamGiaLucMua, thanhTien) VALUES (?, ?, ?, ?, 0, ?)", [order.insertId, line.maSanPham, line.quantity, line.giaBan, line.lineTotal]); await connection.query("UPDATE ton_kho SET soLuongGiu = soLuongGiu + ?, capNhatLuc = NOW() WHERE maSanPham = ?", [line.quantity, line.maSanPham]); }
    const normalizedPayment = String(paymentMethod).toUpperCase();
    await connection.query("INSERT INTO giao_dich_thanh_toan (maDon, phuongThuc, soTien, trangThai, khoaXuLyMotLan, taoLuc) VALUES (?, ?, ?, 'CHO_XU_LY', ?, NOW())", [order.insertId, ["BANK", "ONLINE"].includes(normalizedPayment) ? "ONLINE" : "COD", total, `ORDER-${order.insertId}-${Date.now()}`]);
    await connection.commit();
    return res.status(201).json({ success: true, message: "Đặt hàng thành công.", data: { id: order.insertId, code: `#MPAI-${String(order.insertId).padStart(4, "0")}`, total } });
  } catch (error) { await connection.rollback(); return next(error); } finally { connection.release(); }
});

export default router;

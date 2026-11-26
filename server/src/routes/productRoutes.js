import { Router } from "express";
import db from "../config/database.js";

const router = Router();
const visualByCategory = { "Chăm sóc da": "peach", "Chống nắng": "blue", "Trang điểm": "rose", "Chăm sóc tóc": "lavender", "Thiên nhiên": "cream" };
const tagById = { 1: "Bán chạy", 2: "Mới", 3: "Da nhạy cảm", 4: "Yêu thích", 5: "Phục hồi" };

function mapProduct(row) {
  return { id: row.maSanPham, name: row.tenSanPham, category: row.tenDanhMuc, price: Number(row.giaBan), rating: Number(row.diemTrungBinh || 0), tone: visualByCategory[row.tenDanhMuc] || "peach", tag: tagById[row.maSanPham] || "Mới", stock: Number(row.soLuongThucTe || 0), image: row.anhDaiDien || "", hoverImage: row.anhHover || "", description: row.congDung, ingredients: row.thanhPhan, usage: row.cachSuDung };
}

const selectProducts = `SELECT p.maSanPham, p.tenSanPham, p.giaBan, p.anhDaiDien, p.anhHover, p.thanhPhan, p.congDung, p.cachSuDung, d.tenDanhMuc, COALESCE(AVG(dg.diem), 0) AS diemTrungBinh, COALESCE(t.soLuongThucTe - t.soLuongGiu, 0) AS soLuongThucTe FROM san_pham p JOIN danh_muc d ON d.maDanhMuc = p.maDanhMuc LEFT JOIN danh_gia dg ON dg.maSanPham = p.maSanPham AND dg.trangThai = 'DA_DUYET' LEFT JOIN ton_kho t ON t.maSanPham = p.maSanPham WHERE p.trangThai = 'DANG_BAN' AND d.dangHienThi = 1`;

router.get("/", async (req, res, next) => {
  try {
    const values = [];
    let query = `${selectProducts}`;
    if (req.query.search) { query += " AND p.tenSanPham LIKE ?"; values.push(`%${String(req.query.search).trim()}%`); }
    if (req.query.category && req.query.category !== "Tất cả") { query += " AND d.tenDanhMuc = ?"; values.push(String(req.query.category)); }
    query += " GROUP BY p.maSanPham ORDER BY p.maSanPham ASC";
    const [rows] = await db.query(query, values);
    res.json({ success: true, data: rows.map(mapProduct), total: rows.length });
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const [rows] = await db.query(`${selectProducts} AND p.maSanPham = ? GROUP BY p.maSanPham`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm." });
    return res.json({ success: true, data: mapProduct(rows[0]) });
  } catch (error) { return next(error); }
});

export default router;

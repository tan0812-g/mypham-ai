import { Router } from "express";
import db from "../config/database.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT
        d.maDanhMuc AS id,
        d.tenDanhMuc AS name,
        COUNT(p.maSanPham) AS productCount
      FROM danh_muc d
      LEFT JOIN san_pham p ON p.maDanhMuc = d.maDanhMuc
      WHERE d.dangHienThi = 1
      GROUP BY d.maDanhMuc, d.tenDanhMuc
      ORDER BY d.maDanhMuc ASC
    `);

    res.json({
      success: true,
      data: rows.map((row) => ({
        id: Number(row.id),
        name: row.name,
        productCount: Number(row.productCount),
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;

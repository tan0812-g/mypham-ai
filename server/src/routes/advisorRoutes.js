import { Router } from "express";
import { recommendProducts } from "../services/advisor.js";

const router = Router();
const skins = ["Da dầu", "Da khô", "Da hỗn hợp", "Da nhạy cảm"];
const concerns = ["Cấp ẩm", "Làm sáng", "Chống nắng", "Phục hồi"];
const budgets = ["Dưới 250.000đ", "250.000–400.000đ", "Trên 400.000đ"];
router.post("/recommendations", async (req, res, next) => {
  const { skin, concern, budget, query = "" } = req.body || {};
  if (!skins.includes(skin) || !concerns.includes(concern) || !budgets.includes(budget) || typeof query !== "string" || query.length > 120) return res.status(400).json({ success: false, message: "Vui lòng chọn loại da, nhu cầu và ngân sách hợp lệ." });
  try {
    const products = await recommendProducts({ skin, concern, budget, query });
    return res.json({ success: true, data: products, message: products.length ? `Có ${products.length} sản phẩm đang bán, còn hàng và hợp với bộ lọc của bạn.` : "Chưa có sản phẩm phù hợp từ khóa, nhu cầu và khoảng giá này." });
  } catch (error) { return next(error); }
});
export default router;

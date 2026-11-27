import db from "../config/database.js";

const concernRules = {
  "Cấp ẩm": { category: "Chăm sóc da", words: ["hydra", "moistur", "serum", "cream", "essence", "cấp ẩm", "dưỡng"] },
  "Làm sáng": { category: "Chăm sóc da", words: ["glow", "bright", "vitamin", "toner", "serum", "sáng"] },
  "Chống nắng": { category: "Chống nắng", words: ["spf", "sun", "chống nắng"] },
  "Phục hồi": { category: "Chăm sóc da", words: ["barrier", "repair", "sooth", "pdrn", "phục hồi", "cream"] },
};

const skinWords = {
  "Da dầu": ["oil control", "pore", "purif", "airy", "gel"],
  "Da khô": ["hydra", "moistur", "nourish", "cream", "dưỡng"],
  "Da hỗn hợp": ["balance", "daily", "light", "serum"],
  "Da nhạy cảm": ["sooth", "gentle", "calm", "barrier", "sensitive"],
};

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export async function recommendProducts({ skin, concern, budget, query = "" }) {
  const maxPrice = budget === "Dưới 250.000đ" ? 249999 : budget === "250.000–400.000đ" ? 400000 : Infinity;
  const minPrice = 0;
  const [rows] = await db.query(`SELECT p.maSanPham AS id, p.tenSanPham AS name, d.tenDanhMuc AS category,
    p.giaBan AS price, p.anhDaiDien AS image, p.congDung AS description, p.thanhPhan AS ingredients,
    COALESCE(t.soLuongThucTe - t.soLuongGiu, 0) AS stock,
    COALESCE(AVG(dg.diem), 0) AS rating
    FROM san_pham p JOIN danh_muc d ON d.maDanhMuc = p.maDanhMuc
    JOIN ton_kho t ON t.maSanPham = p.maSanPham
    LEFT JOIN danh_gia dg ON dg.maSanPham = p.maSanPham AND dg.trangThai = 'DA_DUYET'
    WHERE p.trangThai = 'DANG_BAN' AND d.dangHienThi = 1 AND t.soLuongThucTe > t.soLuongGiu
    GROUP BY p.maSanPham`);
  const rule = concernRules[concern];
  const terms = normalize(query).split(/\s+/).filter((word) => word.length > 2).slice(0, 8);
  const products = rows
    .filter((item) => Number(item.price) >= minPrice && Number(item.price) <= maxPrice)
    .map((item) => {
      const haystack = normalize(`${item.name} ${item.category} ${item.description || ""} ${item.ingredients || ""}`);
      const queryMatches = terms.filter((word) => haystack.includes(word)).length;
      let score = rule?.category === item.category ? 10 : 0;
      score += (rule?.words || []).filter((word) => haystack.includes(normalize(word))).length * 2;
      score += (skinWords[skin] || []).filter((word) => haystack.includes(normalize(word))).length;
      score += queryMatches * 3;
      score += Math.min(Number(item.rating) || 0, 5) / 10;
      return { ...item, price: Number(item.price), stock: Number(item.stock), rating: Number(item.rating), score, queryMatches };
    })
    .filter((item) => (!rule || item.category === rule.category) && (!terms.length || item.queryMatches > 0))
    .sort((a, b) => b.score - a.score || b.rating - a.rating || a.id - b.id)
    .slice(0, 3)
    .map(({ score, queryMatches, ...item }) => item);
  return products;
}

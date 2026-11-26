export const categories = ["Chăm sóc da", "Trang điểm", "Chống nắng", "Chăm sóc tóc", "Thiên nhiên"];

export const products = [
  { id: 1, name: "Glow Reset Serum", category: "Chăm sóc da", price: 350000, rating: 4.9, tone: "peach", tag: "Bán chạy" },
  { id: 2, name: "Cloud Veil SPF 50+", category: "Chống nắng", price: 290000, rating: 4.8, tone: "blue", tag: "Mới" },
  { id: 3, name: "Dewy Clean Foam", category: "Chăm sóc da", price: 180000, rating: 4.7, tone: "lavender", tag: "Da nhạy cảm" },
  { id: 4, name: "Rosewood Lip Tint", category: "Trang điểm", price: 220000, rating: 4.9, tone: "rose", tag: "Yêu thích" },
  { id: 5, name: "Silk Barrier Cream", category: "Chăm sóc da", price: 320000, rating: 4.8, tone: "cream", tag: "Phục hồi" },
];

export const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + " đ";

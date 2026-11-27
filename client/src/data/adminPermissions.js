export const adminPermissions = [
  { id: "orders", label: "Đơn hàng", path: "/admin/don-hang" },
  { id: "products", label: "Sản phẩm và danh mục", path: "/admin/san-pham" },
  { id: "customers", label: "Khách hàng", path: "/admin/khach-hang" },
  { id: "reports", label: "Tổng quan và báo cáo", path: "/admin/bao-cao" },
  { id: "reviews", label: "Đánh giá", path: "/admin/danh-gia" },
  { id: "knowledge", label: "Kiến thức AI", path: "/admin/kien-thuc-ai" },
  { id: "support", label: "Hỗ trợ", path: "/admin/ho-tro" },
  { id: "coupons", label: "Mã giảm giá", path: "/admin/ma-giam-gia" },
];

export function firstAdminPath(user) {
  if (user?.role === "QUAN_TRI") return "/admin";
  return adminPermissions.find((item) => user?.permissions?.includes(item.id))?.path || "/admin";
}

import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  BrainCircuit,
  ClipboardList,
  FolderTree,
  Headphones,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Star,
  TicketPercent,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ProductVisual from "../components/ProductVisual.jsx";
import { products } from "../data/products.js";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const statusLabels = {
  CHO_XAC_NHAN: "Chờ xác nhận",
  DA_XAC_NHAN: "Đã xác nhận",
  DANG_CHUAN_BI: "Đang chuẩn bị",
  DANG_GIAO: "Đang giao",
  DA_GIAO: "Đã giao",
  DA_HUY: "Đã hủy",
};

function AdminPage() {
  const [dashboard, setDashboard] = useState(null);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("mpai_admin_user") || "null");
  const menu = [
    { label: "Tổng quan", to: "/admin", icon: LayoutDashboard },
    { label: "Đơn hàng", to: "/admin/don-hang", icon: ClipboardList },
    { label: "Sản phẩm", to: "/admin/san-pham", icon: PackageCheck },
    { label: "Danh mục", to: "/admin/danh-muc", icon: FolderTree },
    { label: "Khách hàng", to: "/admin/khach-hang", icon: Users },
    { label: "Báo cáo", to: "/admin/bao-cao", icon: BarChart3 },
    { label: "Mã giảm giá", to: "/admin/ma-giam-gia", icon: TicketPercent },
    { label: "Đánh giá", to: "/admin/danh-gia", icon: Star },
    { label: "Kiến thức AI", to: "/admin/kien-thuc-ai", icon: BrainCircuit },
    { label: "Hỗ trợ", to: "/admin/ho-tro", icon: Headphones },
    { label: "Nhân viên", to: "/admin/nhan-vien", icon: Users },
  ];
  const loadDashboard = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}`,
        },
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setDashboard(result.data);
    } catch (error) {
      setFeedback(error.message || "Không thể tải dữ liệu tổng quan.");
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(loadDashboard, 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);
  const logout = () => {
    localStorage.removeItem("mpai_admin_token");
    localStorage.removeItem("mpai_admin_user");
    navigate("/admin/login", { replace: true });
  };
  const overview = dashboard?.metrics?.overview || {
    revenue: 0,
    orders: 0,
    customers: 0,
    sold: 0,
  };
  const topProducts = dashboard?.metrics?.topProducts || [];
  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-logo">
          <span className="brand-mark">
            <ShoppingBag size={18} />
          </span>
          <span>
            mỹ phẩm <b>AI</b>
          </span>
        </Link>
        <div className="admin-nav">
          {menu.filter((item) => currentUser?.role === "QUAN_TRI" || (item.to !== "/admin/nhan-vien" && currentUser?.permissions?.includes(({ "/admin": "reports", "/admin/don-hang": "orders", "/admin/san-pham": "products", "/admin/danh-muc": "products", "/admin/khach-hang": "customers", "/admin/bao-cao": "reports", "/admin/ma-giam-gia": "coupons", "/admin/danh-gia": "reviews", "/admin/kien-thuc-ai": "knowledge", "/admin/ho-tro": "support" })[item.to]))).map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <item.icon size={17} /> {item.label}
            </NavLink>
          ))}
        </div>
        <div className="admin-sidebar-bottom">
          <div className="admin-user">
            <span>NT</span>
            <div>
              <strong>{currentUser?.name || "Quản trị viên"}</strong>
              <small>{currentUser?.role === "QUAN_TRI" ? "Quản trị viên" : "Nhân viên"}</small>
            </div>
          </div>
          <Link to="/" className="back-store">
            ← Về cửa hàng
          </Link>
          <button className="admin-logout" onClick={logout}>
            <LogOut size={14} /> Đăng xuất
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-kicker">LIVE STORE OVERVIEW</span>
            <h1>Tổng quan</h1>
          </div>
          <div className="admin-top-actions">
            <button
              className="admin-refresh-icon"
              onClick={loadDashboard}
              aria-label="Làm mới dữ liệu"
            >
              <RefreshCw size={16} />
            </button>
            <div className="admin-avatar">NT</div>
          </div>
        </header>
        {feedback && <p className="admin-form-feedback">{feedback}</p>}
        {!dashboard && !feedback && (
          <section className="admin-placeholder">
            <RefreshCw className="loading-spin" size={28} />
            <p>Đang tải dữ liệu tổng quan...</p>
          </section>
        )}
        {dashboard && (
          <>
            <section className="stat-grid">
              <StatCard
                label="Doanh thu tháng này"
                value={`${Number(overview.revenue).toLocaleString("vi-VN")} đ`}
                change="Theo đơn không bị hủy"
                icon={TrendingUp}
                tone="green"
              />
              <StatCard
                label="Đơn hàng tháng này"
                value={overview.orders}
                change={`${overview.sold} sản phẩm đã bán`}
                icon={ClipboardList}
                tone="rose"
              />
              <StatCard
                label="Khách hàng đã mua"
                value={overview.customers}
                change="Trong tháng hiện tại"
                icon={Users}
                tone="lavender"
              />
              <StatCard
                label="Sản phẩm sắp hết"
                value={dashboard.lowStock.length}
                change="Cần kiểm tra tồn kho"
                icon={PackageCheck}
                tone="orange"
              />
            </section>
            <section className="dashboard-grid">
              <article className="dashboard-card revenue-card">
                <div className="card-heading">
                  <div>
                    <span className="card-kicker">MONTHLY OVERVIEW</span>
                    <h2>Doanh thu tháng này</h2>
                  </div>
                  <Link className="view-report" to="/admin/bao-cao">
                    Xem báo cáo →
                  </Link>
                </div>
                <div className="revenue-total">
                  {Number(overview.revenue).toLocaleString("vi-VN")} đ{" "}
                  <span>Dữ liệu MySQL</span>
                </div>
                <div className="live-summary">
                  <span>
                    <strong>{overview.orders}</strong> đơn hàng
                  </span>
                  <span>
                    <strong>{overview.customers}</strong> khách hàng
                  </span>
                  <span>
                    <strong>{overview.sold}</strong> sản phẩm
                  </span>
                </div>
              </article>
              <article className="dashboard-card best-card">
                <div className="card-heading">
                  <div>
                    <span className="card-kicker">TOP PRODUCTS</span>
                    <h2>Bán chạy nhất</h2>
                  </div>
                </div>
                {topProducts.map((product, index) => (
                  <div className="best-product" key={product.id}>
                    <span className="best-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ProductVisual
                      tone={
                        products.find((item) => item.id === product.id)?.tone ||
                        "rose"
                      }
                      image={product.image}
                    />
                    <div>
                      <strong>{product.name}</strong>
                      <small>{product.quantity} sản phẩm đã bán</small>
                    </div>
                    <b>{Number(product.revenue).toLocaleString("vi-VN")} đ</b>
                  </div>
                ))}
                {!topProducts.length && (
                  <p className="admin-empty-text">
                    Chưa có đơn hàng hoàn tất trong tháng.
                  </p>
                )}
              </article>
            </section>
            <section className="dashboard-card order-card">
              <div className="card-heading">
                <div>
                  <span className="card-kicker">RECENT ACTIVITY</span>
                  <h2>Đơn hàng gần đây</h2>
                </div>
                <Link className="view-report" to="/admin/don-hang">
                  Xem tất cả →
                </Link>
              </div>
              <div className="order-table">
                <div className="order-row order-head">
                  <span>Mã đơn</span>
                  <span>Khách hàng</span>
                  <span>Tổng tiền</span>
                  <span>Trạng thái</span>
                  <span />
                </div>
                {dashboard.recentOrders.map((order) => (
                  <div className="order-row" key={order.id}>
                    <strong>{order.code}</strong>
                    <span>{order.customer}</span>
                    <span>{Number(order.total).toLocaleString("vi-VN")} đ</span>
                    <span
                      className={`order-status ${order.status === "DA_GIAO" ? "delivered" : order.status === "CHO_XAC_NHAN" ? "waiting" : "processing"}`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                    <span>•••</span>
                  </div>
                ))}
                {!dashboard.recentOrders.length && (
                  <p className="admin-empty-text">Chưa có đơn hàng.</p>
                )}
              </div>
            </section>
            <section className="dashboard-card low-stock-card">
              <div className="card-heading">
                <div>
                  <span className="card-kicker">INVENTORY ALERTS</span>
                  <h2>Sản phẩm cần nhập hàng</h2>
                </div>
                <Link className="view-report" to="/admin/bao-cao">
                  Xem tồn kho →
                </Link>
              </div>
              <div className="low-stock-grid">
                {dashboard.lowStock.map((item) => (
                  <div className="low-stock-item" key={item.id}>
                    <strong>{item.name}</strong>
                    <span>
                      Còn {item.stock - item.reserved} · Đang giữ{" "}
                      {item.reserved}
                    </span>
                  </div>
                ))}
                {!dashboard.lowStock.length && (
                  <p className="admin-empty-text">Tồn kho đang ổn định.</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, change, icon: Icon, tone }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={18} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small className="positive">{change}</small>
    </article>
  );
}

export default AdminPage;

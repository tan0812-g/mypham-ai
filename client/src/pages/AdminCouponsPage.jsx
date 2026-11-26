import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Percent, Plus, RefreshCw, Search, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const initialForm = {
  code: "",
  type: "FIXED",
  amount: 50000,
  minimum: 300000,
  usageLimit: 100,
  startsAt: "",
  endsAt: "",
};

function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [now] = useState(() => Date.now());
  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}`,
  });
  const loadCoupons = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/admin/coupons`, {
        headers: headers(),
      });
      const result = await response.json();
      if (result.success) setCoupons(result.data);
      else setFeedback(result.message);
    } catch {
      setFeedback("Không thể tải mã giảm giá.");
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(loadCoupons, 0);
    return () => window.clearTimeout(timer);
  }, [loadCoupons]);
  const updateForm = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const addCoupon = async (event) => {
    event.preventDefault();
    const response = await fetch(`${API}/api/admin/coupons`, {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    setFeedback(result.message || "");
    if (result.success) {
      setForm(initialForm);
      loadCoupons();
    }
  };
  const toggleCoupon = async (coupon) => {
    const response = await fetch(
      `${API}/api/admin/coupons/${coupon.id}/status`,
      {
        method: "PATCH",
        headers: { ...headers(), "Content-Type": "application/json" },
        body: JSON.stringify({ active: !coupon.active }),
      },
    );
    const result = await response.json();
    setFeedback(result.message || "");
    if (result.success) loadCoupons();
  };
  const filteredCoupons = coupons.filter((coupon) => { const keyword = search.trim().toLowerCase(); const expired = new Date(coupon.endsAt).getTime() < now; return (!keyword || coupon.code.toLowerCase().includes(keyword)) && (statusFilter === "all" || (statusFilter === "active" && coupon.active && !expired) || (statusFilter === "inactive" && !coupon.active) || (statusFilter === "expired" && expired)); });
  return (
    <div className="admin-products-page">
      <header className="admin-products-header">
        <Link to="/admin" className="admin-back">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div>
          <span className="admin-kicker">PROMOTION MANAGEMENT</span>
          <h1>Mã giảm giá</h1>
        </div>
        <button
          className="button button-outline admin-refresh"
          onClick={loadCoupons}
        >
          <RefreshCw size={14} /> Làm mới
        </button>
      </header>
      <main className="coupon-layout">
        <section className="coupon-list">
          <div className="admin-products-title">
            <div>
              <h2>Mã đang phát hành</h2>
              <span>Áp dụng trực tiếp khi thanh toán</span>
            </div>
            <strong>{filteredCoupons.length}/{coupons.length} mã</strong>
          </div>
          {feedback && <p className="admin-form-feedback">{feedback}</p>}
          <div className="admin-coupon-filters"><label><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm mã giảm giá..." /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">Tất cả mã</option><option value="active">Đang hoạt động</option><option value="inactive">Đã tắt</option><option value="expired">Đã hết hạn</option></select></div>
          {filteredCoupons.map((coupon) => (
            <article className="coupon-row" key={coupon.id}>
              <div className="coupon-icon">
                <Tag size={18} />
              </div>
              <div className="coupon-copy">
                <strong>{coupon.code}</strong>
                <small>
                  {coupon.type === "PERCENT"
                    ? `Giảm ${coupon.amount}%`
                    : `Giảm ${Number(coupon.amount).toLocaleString("vi-VN")} đ`}{" "}
                  · Đơn từ {Number(coupon.minimum).toLocaleString("vi-VN")} đ
                </small>
                <small>
                  Đã dùng {coupon.usedCount}/{coupon.usageLimit} ·{" "}
                  {new Date(coupon.endsAt).toLocaleDateString("vi-VN")}
                </small>
              </div>
              <button
                className={`knowledge-status ${coupon.active ? "active" : ""}`}
                onClick={() => toggleCoupon(coupon)}
              >
                {coupon.active ? "Đang bật" : "Đã tắt"}
              </button>
            </article>
          ))}
          {!filteredCoupons.length && <p className="admin-empty-text">{coupons.length ? "Không tìm thấy mã giảm giá phù hợp." : "Chưa có mã giảm giá."}</p>}
        </section>
        <form className="coupon-form" onSubmit={addCoupon}>
          <div className="placeholder-icon">
            <Percent size={22} />
          </div>
          <h2>Tạo mã mới</h2>
          <label>
            Mã giảm giá
            <input
              name="code"
              value={form.code}
              onChange={updateForm}
              placeholder="WELCOME20"
              required
            />
          </label>
          <label>
            Loại giảm
            <select name="type" value={form.type} onChange={updateForm}>
              <option value="FIXED">Giảm theo số tiền</option>
              <option value="PERCENT">Giảm theo phần trăm</option>
            </select>
          </label>
          <div className="admin-form-two">
            <label>
              Mức giảm
              <input
                name="amount"
                value={form.amount}
                onChange={updateForm}
                type="number"
                min="1"
                required
              />
            </label>
            <label>
              Giới hạn lượt
              <input
                name="usageLimit"
                value={form.usageLimit}
                onChange={updateForm}
                type="number"
                min="1"
                required
              />
            </label>
          </div>
          <label>
            Đơn tối thiểu
            <input
              name="minimum"
              value={form.minimum}
              onChange={updateForm}
              type="number"
              min="0"
            />
          </label>
          <div className="admin-form-two">
            <label>
              Bắt đầu
              <input
                name="startsAt"
                value={form.startsAt}
                onChange={updateForm}
                type="datetime-local"
                required
              />
            </label>
            <label>
              Kết thúc
              <input
                name="endsAt"
                value={form.endsAt}
                onChange={updateForm}
                type="datetime-local"
                required
              />
            </label>
          </div>
          <button className="button button-dark" type="submit">
            <Plus size={15} /> Tạo mã giảm giá
          </button>
        </form>
      </main>
    </div>
  );
}

export default AdminCouponsPage;

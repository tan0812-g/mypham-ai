import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, RefreshCw, Search, Star } from "lucide-react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const labels = { CHO_DUYET: "Chờ duyệt", DA_DUYET: "Đã duyệt", DA_AN: "Đã ẩn" };

function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const loadReviews = () =>
    fetch(`${API}/api/admin/reviews`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) setReviews(result.data);
        else setFeedback(result.message);
      })
      .catch(() => setFeedback("Không thể tải đánh giá."));
  useEffect(() => {
    loadReviews();
  }, []);
  const updateStatus = async (id, status) => {
    const response = await fetch(`${API}/api/admin/reviews/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}`,
      },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    setFeedback(result.message || "");
    if (result.success) loadReviews();
  };
  const filteredReviews = reviews.filter((review) => { const keyword = search.trim().toLowerCase(); return (!keyword || review.customer.toLowerCase().includes(keyword) || review.product.toLowerCase().includes(keyword) || review.content.toLowerCase().includes(keyword)) && (statusFilter === "all" || review.status === statusFilter); });
  return (
    <div className="admin-products-page">
      <header className="admin-products-header">
        <Link to="/admin" className="admin-back">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div>
          <span className="admin-kicker">CUSTOMER VOICE</span>
          <h1>Duyệt đánh giá</h1>
        </div>
        <button
          className="button button-outline admin-refresh"
          onClick={loadReviews}
        >
          <RefreshCw size={14} /> Làm mới
        </button>
      </header>
      <main className="admin-reviews-panel">
        <div className="admin-products-title">
          <div>
            <h2>Đánh giá sản phẩm</h2>
            <span>Kiểm duyệt nội dung trước khi hiển thị</span>
          </div>
          <strong>{filteredReviews.length}/{reviews.length} đánh giá</strong>
        </div>
        {feedback && <p className="admin-form-feedback">{feedback}</p>}
        <div className="admin-review-filters"><label><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm khách hàng, sản phẩm..." /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">Tất cả trạng thái</option>{Object.entries(labels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>
        {filteredReviews.map((review) => (
          <article className="admin-review-row" key={review.id}>
            <div className="admin-review-icon">
              <MessageCircle size={17} />
            </div>
            <div className="admin-review-content">
              <div className="admin-review-meta">
                <strong>{review.customer}</strong>
                <span>{review.product}</span>
                <small>
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </small>
              </div>
              <div className="admin-stars">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star size={13} fill="currentColor" key={index} />
                ))}
              </div>
              <p>{review.content}</p>
            </div>
            <select
              value={review.status}
              onChange={(event) => updateStatus(review.id, event.target.value)}
            >
              {Object.entries(labels).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </article>
        ))}
        {!filteredReviews.length && (
          <div className="admin-empty-orders">
            <MessageCircle size={26} />
            <p>{reviews.length ? "Không tìm thấy đánh giá phù hợp." : "Chưa có đánh giá nào."}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminReviewsPage;

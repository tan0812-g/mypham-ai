import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Headphones,
  RefreshCw,
  Search,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const labels = {
  HO_TRO: "Hỗ trợ chung",
  HUY_DON: "Hủy đơn hàng",
  DOI_TRA: "Đổi trả sản phẩm",
};
const statuses = {
  MOI: "Mới",
  DANG_XU_LY: "Đang xử lý",
  DA_GIAI_QUYET: "Đã giải quyết",
  TU_CHOI: "Từ chối",
};

function AdminSupportPage() {
  const [requests, setRequests] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [drafts, setDrafts] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}`,
  });
  const loadRequests = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/admin/support`, {
        headers: headers(),
      });
      const result = await response.json();
      if (result.success) setRequests(result.data);
      else setFeedback(result.message);
    } catch {
      setFeedback("Không thể tải yêu cầu hỗ trợ.");
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(loadRequests, 0);
    return () => window.clearTimeout(timer);
  }, [loadRequests]);
  const updateDraft = (id, field, value) =>
    setDrafts((current) => ({
      ...current,
      [id]: { ...(current[id] || {}), [field]: value },
    }));
  const saveRequest = async (request) => {
    const draft = drafts[request.id] || {};
    const status = draft.status || request.status;
    const reply = draft.reply ?? request.reply ?? "";
    const response = await fetch(`${API}/api/admin/support/${request.id}`, {
      method: "PATCH",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ status, reply }),
    });
    const result = await response.json();
    setFeedback(result.message || "");
    if (result.success) loadRequests();
  };
  const filteredRequests = requests.filter((request) => { const keyword = search.trim().toLowerCase(); return (!keyword || request.customer.toLowerCase().includes(keyword) || request.email.toLowerCase().includes(keyword) || request.content.toLowerCase().includes(keyword)) && (statusFilter === "all" || request.status === statusFilter); });
  return (
    <div className="admin-products-page">
      <header className="admin-products-header">
        <Link to="/admin" className="admin-back">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div>
          <span className="admin-kicker">CUSTOMER CARE</span>
          <h1>Yêu cầu hỗ trợ</h1>
        </div>
        <button
          className="button button-outline admin-refresh"
          onClick={loadRequests}
        >
          <RefreshCw size={14} /> Làm mới
        </button>
      </header>
      <main className="admin-support-list">
        <div className="admin-products-title">
          <div>
            <h2>Danh sách yêu cầu</h2>
            <span>Phản hồi trực tiếp cho khách hàng</span>
          </div>
          <strong>{filteredRequests.length}/{requests.length} yêu cầu</strong>
        </div>
        {feedback && <p className="admin-form-feedback">{feedback}</p>}
        <div className="admin-support-filters"><label><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên, email hoặc nội dung..." /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">Tất cả trạng thái</option>{Object.entries(statuses).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>
        {filteredRequests.map((request) => {
          const draft = drafts[request.id] || {};
          return (
            <article className="admin-support-card" key={request.id}>
              <div className="admin-support-card-head">
                <div className="admin-support-icon">
                  <Headphones size={17} />
                </div>
                <div>
                  <strong>{request.customer}</strong>
                  <small>
                    {request.email} · {labels[request.type] || request.type} ·{" "}
                    {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                  </small>
                </div>
                <select
                  value={draft.status || request.status}
                  onChange={(event) =>
                    updateDraft(request.id, "status", event.target.value)
                  }
                >
                  {Object.entries(statuses).map(([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="admin-support-content">{request.content}</p>
              <textarea
                value={draft.reply ?? request.reply ?? ""}
                onChange={(event) =>
                  updateDraft(request.id, "reply", event.target.value)
                }
                placeholder="Nhập phản hồi cho khách hàng..."
                rows="3"
              />
              <button
                className="button button-dark"
                onClick={() => saveRequest(request)}
              >
                <Send size={14} /> Lưu phản hồi
              </button>
            </article>
          );
        })}
        {!filteredRequests.length && (
          <div className="admin-empty-orders">
            <CheckCircle2 size={27} />
            <p>{requests.length ? "Không tìm thấy yêu cầu phù hợp." : "Chưa có yêu cầu hỗ trợ."}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminSupportPage;

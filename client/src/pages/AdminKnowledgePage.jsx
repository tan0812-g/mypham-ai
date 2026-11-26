import { useEffect, useState } from "react";
import { ArrowLeft, BrainCircuit, RefreshCw, Save, Search } from "lucide-react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const types = {
  SAN_PHAM: "Sản phẩm",
  CHINH_SACH: "Chính sách",
  BAI_VIET: "Bài viết",
  FAQ: "FAQ",
};

function AdminKnowledgePage() {
  const [sources, setSources] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState({ title: "", content: "", type: "FAQ" });
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const loadSources = () =>
    fetch(`${API}/api/admin/knowledge`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) setSources(result.data);
        else setFeedback(result.message);
      })
      .catch(() => setFeedback("Không thể tải dữ liệu AI."));
  useEffect(() => {
    loadSources();
  }, []);
  const addSource = async (event) => {
    event.preventDefault();
    const response = await fetch(`${API}/api/admin/knowledge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}`,
      },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    setFeedback(result.message);
    if (result.success) {
      setForm({ title: "", content: "", type: "FAQ" });
      loadSources();
    }
  };
  const toggleSource = async (source) => {
    await fetch(`${API}/api/admin/knowledge/${source.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}`,
      },
      body: JSON.stringify({ active: !source.active }),
    });
    loadSources();
  };
  const filteredSources = sources.filter((source) => { const keyword = search.trim().toLowerCase(); return (!keyword || source.title.toLowerCase().includes(keyword) || source.content.toLowerCase().includes(keyword) || (source.product || "").toLowerCase().includes(keyword)) && (typeFilter === "all" || source.type === typeFilter); });
  return (
    <div className="admin-products-page">
      <header className="admin-products-header">
        <Link to="/admin" className="admin-back">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div>
          <span className="admin-kicker">AI KNOWLEDGE BASE</span>
          <h1>Dữ liệu kiến thức AI</h1>
        </div>
        <button
          className="button button-outline admin-refresh"
          onClick={loadSources}
        >
          <RefreshCw size={14} /> Làm mới
        </button>
      </header>
      <main className="knowledge-layout">
        <section className="knowledge-list">
          <div className="admin-products-title">
            <div>
              <h2>Nguồn kiến thức</h2>
              <span>Chỉ nguồn đang hiệu lực mới được dùng để tư vấn</span>
            </div>
            <strong>{filteredSources.length}/{sources.length} nguồn</strong>
          </div>
          {feedback && <p className="admin-form-feedback">{feedback}</p>}
          <div className="admin-knowledge-filters"><label><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tiêu đề hoặc nội dung..." /></label><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="all">Tất cả loại nguồn</option>{Object.entries(types).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>
          {filteredSources.map((source) => (
            <article className="knowledge-row" key={source.id}>
              <div className="knowledge-icon">
                <BrainCircuit size={17} />
              </div>
              <div className="knowledge-copy">
                <div>
                  <span>{types[source.type] || source.type}</span>
                  {source.product && <small> · {source.product}</small>}
                </div>
                <strong>{source.title}</strong>
                <p>{source.content}</p>
              </div>
              <button
                className={`knowledge-status ${source.active ? "active" : ""}`}
                onClick={() => toggleSource(source)}
              >
                {source.active ? "Đang dùng" : "Đã tắt"}
              </button>
            </article>
          ))}
          {!filteredSources.length && <p className="admin-empty-text">{sources.length ? "Không tìm thấy nguồn kiến thức phù hợp." : "Chưa có nguồn kiến thức."}</p>}
        </section>
        <form className="knowledge-form" onSubmit={addSource}>
          <div className="placeholder-icon">
            <BrainCircuit size={22} />
          </div>
          <h2>Thêm kiến thức</h2>
          <label>
            Loại nguồn
            <select
              value={form.type}
              onChange={(event) =>
                setForm({ ...form, type: event.target.value })
              }
            >
              <option value="FAQ">FAQ</option>
              <option value="SAN_PHAM">Sản phẩm</option>
              <option value="CHINH_SACH">Chính sách</option>
              <option value="BAI_VIET">Bài viết</option>
            </select>
          </label>
          <label>
            Tiêu đề
            <input
              required
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="Ví dụ: Chính sách giao hàng"
            />
          </label>
          <label>
            Nội dung
            <textarea
              required
              rows="6"
              value={form.content}
              onChange={(event) =>
                setForm({ ...form, content: event.target.value })
              }
              placeholder="Thông tin AI được phép sử dụng..."
            />
          </label>
          <button className="button button-dark" type="submit">
            <Save size={15} /> Lưu nguồn kiến thức
          </button>
        </form>
      </main>
    </div>
  );
}

export default AdminKnowledgePage;

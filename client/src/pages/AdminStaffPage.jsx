import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, RefreshCw, Search, UserPlus, Users } from "lucide-react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function AdminStaffPage() {
  const [staff, setStaff] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", position: "Nhân viên" });
  const [search, setSearch] = useState("");
  const [workFilter, setWorkFilter] = useState("all");

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}` });
  const loadStaff = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/admin/staff`, { headers: headers() });
      const result = await response.json();
      if (result.success) setStaff(result.data);
      else setFeedback(result.message || "Không thể tải danh sách nhân viên.");
    } catch { setFeedback("Không thể kết nối tới máy chủ."); }
  }, []);

  useEffect(() => { const timer = window.setTimeout(loadStaff, 0); return () => window.clearTimeout(timer); }, [loadStaff]);

  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const addStaff = async (event) => {
    event.preventDefault();
    setFeedback("");
    try {
      const response = await fetch(`${API}/api/admin/staff`, { method: "POST", headers: { ...headers(), "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      setFeedback(result.message || "");
      if (result.success) { setForm({ name: "", email: "", password: "", position: "Nhân viên" }); loadStaff(); }
    } catch { setFeedback("Không thể thêm nhân viên."); }
  };
  const updateStatus = async (member, status, working = member.working) => { const response = await fetch(`${API}/api/admin/staff/${member.id}/status`, { method: "PATCH", headers: { ...headers(), "Content-Type": "application/json" }, body: JSON.stringify({ status, working: Boolean(working) }) }); const result = await response.json(); setFeedback(result.message || ""); if (result.success) loadStaff(); };
  const filteredStaff = staff.filter((member) => { const keyword = search.trim().toLowerCase(); return (!keyword || member.name.toLowerCase().includes(keyword) || member.email.toLowerCase().includes(keyword)) && (workFilter === "all" || (workFilter === "working" && member.working) || (workFilter === "away" && !member.working) || (workFilter === "locked" && member.accountStatus === "KHOA")); });

  return <div className="admin-products-page">
    <header className="admin-products-header">
      <Link to="/admin" className="admin-back"><ArrowLeft size={16} /> Dashboard</Link>
      <div><span className="admin-kicker">STAFF & ACCESS</span><h1>Quản lý nhân viên</h1></div>
      <button className="button button-outline admin-refresh" onClick={loadStaff}><RefreshCw size={14} /> Làm mới</button>
    </header>
    <main className="staff-layout">
      <section className="staff-list-panel">
        <div className="admin-products-title"><div><h2>Đội ngũ quản trị</h2><span>Nhân viên có quyền truy cập hệ thống</span></div><strong>{filteredStaff.length}/{staff.length} nhân viên</strong></div>
        {feedback && <p className="admin-form-feedback">{feedback}</p>}
        <div className="admin-staff-filters"><label><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên hoặc email..." /></label><select value={workFilter} onChange={(event) => setWorkFilter(event.target.value)}><option value="all">Tất cả nhân viên</option><option value="working">Đang làm</option><option value="away">Tạm nghỉ</option><option value="locked">Đã khóa tài khoản</option></select></div>
        <div className="staff-table-head"><span>Nhân viên</span><span>Chức vụ</span><span>Tài khoản</span><span>Làm việc</span></div>
        {filteredStaff.map((member) => <div className="staff-row" key={member.id}>
          <div className="customer-identity"><span>{member.name.slice(0, 1)}</span><div><strong>{member.name}</strong><small>{member.email}</small></div></div>
          <span>{member.position || "Nhân viên"}</span>
          <select className="staff-status-select" value={member.accountStatus} onChange={(event) => updateStatus(member, event.target.value)}><option value="HOAT_DONG">Hoạt động</option><option value="KHOA">Đã khóa</option></select>
          <select className="staff-status-select" value={member.working ? "1" : "0"} onChange={(event) => updateStatus(member, member.accountStatus, event.target.value === "1")}><option value="1">Đang làm</option><option value="0">Tạm nghỉ</option></select>
        </div>)}
        {!filteredStaff.length && <div className="admin-empty-orders"><Users size={26} /><p>{staff.length ? "Không tìm thấy nhân viên phù hợp." : "Chưa có nhân viên."}</p></div>}
      </section>
      <form className="staff-form" onSubmit={addStaff}>
        <div className="placeholder-icon"><UserPlus size={26} /></div><h2>Thêm nhân viên</h2><p>Tài khoản mới sẽ được cấp vai trò nhân viên và mật khẩu được mã hóa.</p>
        <label>Họ và tên<input name="name" value={form.name} onChange={updateForm} placeholder="Nguyễn Văn A" required /></label>
        <label>Email đăng nhập<input type="email" name="email" value={form.email} onChange={updateForm} placeholder="nhanvien@example.com" required /></label>
        <label>Chức vụ<input name="position" value={form.position} onChange={updateForm} placeholder="Nhân viên" required /></label>
        <label>Mật khẩu<input type="password" name="password" value={form.password} onChange={updateForm} minLength="8" placeholder="Tối thiểu 8 ký tự" required /></label>
        <button className="button button-dark" type="submit"><BriefcaseBusiness size={15} /> Tạo tài khoản</button>
      </form>
    </main>
  </div>;
}

export default AdminStaffPage;

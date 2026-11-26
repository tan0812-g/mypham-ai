import { useState } from "react";
import { ArrowLeft, Check, LockKeyhole } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SimpleHeader from "../components/SimpleHeader.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function ChangePasswordPage() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [feedback, setFeedback] = useState(""); const [saving, setSaving] = useState(false); const navigate = useNavigate();
  const token = localStorage.getItem("mpai_token"); let user = null; try { user = JSON.parse(localStorage.getItem("mpai_user") || "null"); } catch { user = null; }
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => { event.preventDefault(); if (!token || user?.role !== "KHACH_HANG") { navigate("/login", { replace: true }); return; } if (form.newPassword !== form.confirmPassword) { setFeedback("Mật khẩu xác nhận không khớp."); return; } setSaving(true); setFeedback(""); try { const response = await fetch(`${API}/api/account/password`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }) }); const result = await response.json(); setFeedback(result.message || ""); if (result.success) setForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); } catch { setFeedback("Không thể kết nối máy chủ."); } finally { setSaving(false); } };
  return <div className="sub-page"><SimpleHeader /><main className="container password-page"><Link to="/tai-khoan" className="back-link"><ArrowLeft size={15} /> Quay lại tài khoản</Link><section className="password-card"><div className="password-icon"><LockKeyhole size={23} /></div><span className="eyebrow">ACCOUNT SECURITY</span><h1>Đổi mật khẩu</h1><p>Bảo vệ tài khoản của bạn bằng một mật khẩu mới an toàn.</p><form onSubmit={submit}><label>Mật khẩu hiện tại<input name="currentPassword" type="password" value={form.currentPassword} onChange={update} required autoComplete="current-password" /></label><label>Mật khẩu mới<input name="newPassword" type="password" minLength="8" value={form.newPassword} onChange={update} required autoComplete="new-password" /><small>Tối thiểu 8 ký tự.</small></label><label>Xác nhận mật khẩu mới<input name="confirmPassword" type="password" minLength="8" value={form.confirmPassword} onChange={update} required autoComplete="new-password" /></label>{feedback && <p className={`password-feedback ${feedback.includes("thành công") ? "success" : ""}`}><Check size={14} /> {feedback}</p>}<button className="button button-dark" type="submit" disabled={saving}>{saving ? "Đang cập nhật..." : "Cập nhật mật khẩu"}</button></form></section></main></div>;
}

export default ChangePasswordPage;

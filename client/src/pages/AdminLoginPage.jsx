import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { firstAdminPath } from "../data/adminPermissions.js";
import "./AdminLoginPage.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback("");
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${API}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Đăng nhập thất bại.");
      if (!["QUAN_TRI", "NHAN_VIEN"].includes(result.data?.role)) {
        fetch(`${API}/api/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${result.token}` } }).catch(() => {});
        throw new Error("Tài khoản này không có quyền truy cập trang quản trị.");
      }
      localStorage.setItem("mpai_admin_token", result.token);
      localStorage.setItem("mpai_admin_user", JSON.stringify(result.data));
      navigate(location.state?.from || firstAdminPath(result.data), { replace: true });
    } catch (error) { setFeedback(error.message); }
    finally { setLoading(false); }
  };

  return <main className="admin-login-page">
    <section className="admin-login-art">
      <Link to="/" className="admin-login-brand"><span><ShoppingBag size={20} /></span> mỹ phẩm <b>AI</b></Link>
      <div className="admin-login-art-copy"><span className="admin-login-eyebrow"><Sparkles size={14} /> CONTROL CENTER</span><h1>Quản trị tinh tế,<br /><em>vận hành thông minh.</em></h1><p>Theo dõi cửa hàng, đơn hàng và dữ liệu khách hàng trong một không gian quản trị tập trung.</p></div>
      <div className="admin-login-orbit"><i /><i /><i /><strong><ShieldCheck size={34} /></strong></div>
      <small>© 2026 Mỹ Phẩm AI · Khu vực dành cho quản trị viên</small>
    </section>
    <section className="admin-login-form-panel">
      <Link to="/" className="admin-login-back"><ArrowLeft size={16} /> Về cửa hàng</Link>
      <div className="admin-login-form-wrap">
        <div className="admin-login-icon"><ShieldCheck size={24} /></div>
        <span className="admin-login-kicker">ADMIN ACCESS</span><h2>Đăng nhập quản trị</h2><p>Dành cho quản trị viên và nhân viên được cấp quyền.</p>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <label>Email quản trị<div className="admin-login-input"><Mail size={17} /><input name="email" type="email" placeholder="admin@mypham-ai.vn" autoComplete="email" required /></div></label>
          <label>Mật khẩu<div className="admin-login-input"><LockKeyhole size={17} /><input name="password" type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
          {feedback && <p className="admin-login-feedback">{feedback}</p>}
          <button className="admin-login-submit" type="submit" disabled={loading}>{loading ? "Đang kiểm tra..." : "Vào trang quản trị"}</button>
        </form>
        <div className="admin-login-security"><LockKeyhole size={14} /> Chỉ tài khoản có quyền quản trị mới được truy cập</div>
      </div>
    </section>
  </main>;
}

export default AdminLoginPage;

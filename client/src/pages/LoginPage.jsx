import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

function getCustomerSession() { try { return JSON.parse(localStorage.getItem("mpai_user") || "null"); } catch { return null; } }

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  useEffect(() => { if (localStorage.getItem("mpai_token") && getCustomerSession()?.role === "KHACH_HANG") navigate("/tai-khoan", { replace: true }); }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback("Đang kiểm tra thông tin...");
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Đăng nhập thất bại.");
      if (result.data?.role !== "KHACH_HANG") {
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${result.token}` } }).catch(() => {});
        throw new Error("Tài khoản quản trị hoặc nhân viên vui lòng đăng nhập ở trang quản trị.");
      }
      localStorage.setItem("mpai_token", result.token);
      localStorage.setItem("mpai_user", JSON.stringify(result.data));
      navigate("/tai-khoan");
    } catch (error) {
      setFeedback(error.message);
    }
  };

  return (
    <main className="login-page">
      <section className="login-showcase" aria-label="Mỹ Phẩm AI">
        <div className="login-showcase__glow login-showcase__glow--top" />
        <div className="login-showcase__glow login-showcase__glow--bottom" />

        <Link to="/" className="login-brand">
          <span className="login-brand__icon">
            <ShoppingBag size={21} strokeWidth={1.8} />
          </span>
          <span>Mỹ Phẩm <strong>AI</strong></span>
        </Link>

        <div className="login-showcase__content">
          <span className="login-eyebrow">
            <Sparkles size={15} /> VẺ ĐẸP CỦA RIÊNG BẠN
          </span>
          <h1>
            Chăm sóc làn da,
            <br />
            <span>bắt đầu từ hôm nay.</span>
          </h1>
          <p>
            Đăng nhập để khám phá sản phẩm phù hợp và nhận gợi ý chăm sóc da
            dành riêng cho bạn.
          </p>
          <div className="login-showcase__note">
            <span className="login-showcase__note-icon">
              <Sparkles size={18} />
            </span>
            <span>
              <strong>Chọn đúng, đẹp đúng cách</strong>
              <small>Gợi ý mỹ phẩm theo nhu cầu của bạn</small>
            </span>
          </div>
        </div>

        <div className="login-showcase__decoration" aria-hidden="true">
          <span className="login-orbit login-orbit--one" />
          <span className="login-orbit login-orbit--two" />
          <span className="login-orbit login-orbit--three" />
          <span className="login-orbit__center">
            <Sparkles size={34} strokeWidth={1.3} />
          </span>
        </div>

        <small className="login-showcase__copyright">
          © 2026 Mỹ Phẩm AI. Chăm sóc sắc đẹp theo cách của bạn.
        </small>
      </section>

      <section className="login-form-panel">
        <Link to="/" className="login-back-link">
          <ArrowLeft size={17} /> Quay lại cửa hàng
        </Link>

        <div className="login-form-wrap">
          <div className="login-mobile-brand">
            <span className="login-brand__icon">
              <ShoppingBag size={21} strokeWidth={1.8} />
            </span>
            <span>Mỹ Phẩm <strong>AI</strong></span>
          </div>

          <span className="login-form-eyebrow">CHÀO MỪNG BẠN TRỞ LẠI</span>
          <h2>Đăng nhập</h2>
          <p className="login-form-description">
            Điền thông tin tài khoản để tiếp tục nhé.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email</label>
            <div className="login-input-wrap">
              <Mail size={18} aria-hidden="true" />
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
                onChange={() => setFeedback("")}
              />
            </div>

            <div className="login-password-label">
              <label htmlFor="login-password">Mật khẩu</label>
              <button
                type="button"
                className="login-text-button"
                onClick={() =>
                  setFeedback("Vui lòng liên hệ cửa hàng để được hỗ trợ đặt lại mật khẩu.")
                }
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="login-input-wrap">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                required
                onChange={() => setFeedback("")}
              />
              <button
                type="button"
                className="login-password-toggle"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="login-remember">
              <input type="checkbox" name="remember" />
              <span>Ghi nhớ đăng nhập</span>
            </label>

            {feedback && (
              <p className="login-feedback" role="status">
                {feedback}
              </p>
            )}

            <button type="submit" className="login-submit">
              Đăng nhập
            </button>
          </form>

          <p className="login-signup">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="login-text-button">
              Đăng ký ngay
            </Link>
          </p>

          <div className="login-secure-note">
            <LockKeyhole size={14} />
            Thông tin của bạn luôn được bảo mật
          </div>
        </div>

        <small className="login-form-panel__copyright">
          © 2026 Mỹ Phẩm AI
        </small>
      </section>
    </main>
  );
}

export default LoginPage;

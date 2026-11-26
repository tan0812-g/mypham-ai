import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShoppingBag,
  Sparkles,
  UserRound
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (formData.get("password") !== formData.get("confirmPassword")) {
      setFeedback("Mật khẩu xác nhận chưa khớp. Vui lòng kiểm tra lại.");
      return;
    }

    setFeedback("Đang tạo tài khoản...");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: formData.get("name"), email: formData.get("email"), password: formData.get("password") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Đăng ký thất bại.");
      setFeedback("Đăng ký thành công. Đang chuyển tới trang đăng nhập...");
      window.setTimeout(() => navigate("/login"), 700);
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
            Hành trình chăm sóc da,
            <br />
            <span>bắt đầu từ bạn.</span>
          </h1>
          <p>
            Tạo tài khoản để khám phá sản phẩm phù hợp và lưu lại hành trình
            chăm sóc sắc đẹp của riêng mình.
          </p>
          <div className="login-showcase__note">
            <span className="login-showcase__note-icon">
              <Sparkles size={18} />
            </span>
            <span>
              <strong>Đẹp theo cách của bạn</strong>
              <small>Gợi ý mỹ phẩm theo nhu cầu riêng</small>
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
        <Link to="/login" className="login-back-link">
          <ArrowLeft size={17} /> Quay lại đăng nhập
        </Link>

        <div className="login-form-wrap">
          <div className="login-mobile-brand">
            <span className="login-brand__icon">
              <ShoppingBag size={21} strokeWidth={1.8} />
            </span>
            <span>Mỹ Phẩm <strong>AI</strong></span>
          </div>

          <span className="login-form-eyebrow">BẮT ĐẦU HÀNH TRÌNH CỦA BẠN</span>
          <h2>Tạo tài khoản</h2>
          <p className="login-form-description">
            Đăng ký miễn phí để trải nghiệm Mỹ Phẩm AI.
          </p>

          <form className="login-form register-form" onSubmit={handleSubmit}>
            <label htmlFor="register-name">Họ và tên</label>
            <div className="login-input-wrap">
              <UserRound size={18} aria-hidden="true" />
              <input
                id="register-name"
                name="name"
                type="text"
                placeholder="Nhập họ và tên"
                autoComplete="name"
                minLength={2}
                required
              />
            </div>

            <label htmlFor="register-email">Email</label>
            <div className="login-input-wrap">
              <Mail size={18} aria-hidden="true" />
              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>

            <label htmlFor="register-password">Mật khẩu</label>
            <div className="login-input-wrap">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tối thiểu 8 ký tự"
                autoComplete="new-password"
                minLength={8}
                required
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

            <label htmlFor="register-confirm-password">Xác nhận mật khẩu</label>
            <div className="login-input-wrap">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="login-password-toggle"
                aria-label={
                  showConfirmPassword
                    ? "Ẩn mật khẩu xác nhận"
                    : "Hiện mật khẩu xác nhận"
                }
                aria-pressed={showConfirmPassword}
                onClick={() => setShowConfirmPassword((visible) => !visible)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="login-remember register-terms">
              <input type="checkbox" name="terms" required />
              <span>Tôi đồng ý tạo tài khoản và sử dụng dịch vụ.</span>
            </label>

            {feedback && (
              <p className="login-feedback" role="status">
                {feedback}
              </p>
            )}

            <button type="submit" className="login-submit">
              Tạo tài khoản
            </button>
          </form>

          <p className="login-signup">
            Đã có tài khoản?{" "}
            <Link to="/login" className="login-text-button">
              Đăng nhập
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

export default RegisterPage;

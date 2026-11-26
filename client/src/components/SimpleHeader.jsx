import { ShoppingBag, ShoppingCart, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

function getStoredUser() { try { return JSON.parse(localStorage.getItem("mpai_user") || "null"); } catch { return null; } }

function SimpleHeader({ cartCount = 0 }) {
  const storedUser = getStoredUser(); const user = storedUser?.role === "KHACH_HANG" ? storedUser : null;
  return <header className="sub-header"><div className="container sub-header-inner"><Link to="/" className="brand"><span className="brand-mark"><ShoppingBag size={19} /></span><span>mỹ phẩm <b>AI</b></span></Link><div className="sub-header-links"><Link to="/">Trang chủ</Link><Link to="/#san-pham">Sản phẩm</Link><Link to="/ai-tu-van">AI tư vấn</Link><Link to={user ? "/tai-khoan" : "/login"} className="sub-account"><UserRound size={16} /> {user ? (user.name || "Tài khoản") : "Đăng nhập"}</Link><Link to="/gio-hang" className="sub-cart"><ShoppingCart size={17} /> Giỏ hàng <em>{cartCount}</em></Link></div></div></header>;
}

export default SimpleHeader;

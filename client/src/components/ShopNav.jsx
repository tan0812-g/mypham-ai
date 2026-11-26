import { ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categories as fallbackCategories } from "../data/products.js";

function CategoryLinks({ title, type, categories }) {
  return <div className="nav-dropdown" role="menu">
    <Link to={type === "product" ? "/san-pham" : "/#danh-muc"} role="menuitem">{title === "Sản phẩm" ? "Tất cả sản phẩm" : "Xem tất cả danh mục"}</Link>
    {categories.map((category) => <Link key={category} to={`/san-pham?category=${encodeURIComponent(category)}`} role="menuitem">{category}</Link>)}
  </div>;
}

function ShopNav({ mobileNav = false }) {
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/categories`)
      .then((response) => {
        if (!response.ok) throw new Error("Không thể tải danh mục");
        return response.json();
      })
      .then((payload) => {
        if (payload.success && Array.isArray(payload.data) && payload.data.length) {
          setCategories(payload.data.map((category) => category.name));
        }
      })
      .catch(() => setCategories(fallbackCategories));
  }, []);

  return <nav className={`main-nav ${mobileNav ? "is-open" : ""}`}><div className="container nav-inner">
    <a className="active" href="/#trang-chu">Trang chủ</a>
    <div className="nav-item-with-menu"><a href="/#san-pham">Sản phẩm <ChevronDown size={13} /></a><CategoryLinks title="Sản phẩm" type="product" categories={categories} /></div>
    <div className="nav-item-with-menu"><a href="/#danh-muc">Danh mục <ChevronDown size={13} /></a><CategoryLinks title="Danh mục" type="category" categories={categories} /></div>
    <Link to="/ai-tu-van"><Sparkles size={13} /> AI tư vấn</Link>
    <a href="/#khuyen-mai">Khuyến mãi <span className="nav-new">Hot</span></a>
    <a href="/#tin-tuc">Tin tức</a>
    <a href="/#lien-he">Liên hệ</a>
  </div></nav>;
}

export default ShopNav;

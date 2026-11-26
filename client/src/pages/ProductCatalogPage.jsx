import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import SimpleHeader from "../components/SimpleHeader.jsx";
import { products as fallbackProducts } from "../data/products.js";
import { cartCount, getCart } from "../utils/cart.js";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function ProductCatalogPage() {
  const [params] = useSearchParams();
  const category = params.get("category") || "";
  const [products, setProducts] = useState(fallbackProducts);
  const [cartItems] = useState(getCart);
  useEffect(() => { const query = category ? `?category=${encodeURIComponent(category)}` : ""; fetch(`${API}/api/products${query}`).then((response) => response.json()).then((payload) => setProducts(payload.data || [])).catch(() => setProducts(fallbackProducts.filter((item) => !category || item.category === category))); }, [category]);
  return <div className="sub-page catalog-page"><SimpleHeader cartCount={cartCount(cartItems)} /><main className="container catalog-main"><div className="breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><strong>Sản phẩm</strong>{category && <><span>/</span><strong>{category}</strong></>}</div><div className="catalog-heading"><div><span className="eyebrow">BEAUTY COLLECTION</span><h1>{category || "Tất cả sản phẩm"}</h1><p>Khám phá những sản phẩm được chọn riêng cho hành trình chăm sóc sắc đẹp của bạn.</p></div><Link className="text-button" to="/#danh-muc">Xem danh mục <ArrowRight size={15} /></Link></div><div className="catalog-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}{!products.length && <div className="catalog-empty">Chưa có sản phẩm trong danh mục này.</div>}</div></main></div>;
}

export default ProductCatalogPage;

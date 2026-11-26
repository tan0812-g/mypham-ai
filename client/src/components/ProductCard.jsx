import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { assetUrl } from "../utils/api.js";
import ProductVisual from "./ProductVisual.jsx";


function ProductCard({ product, favorite = false, onFavorite }) {
  const hoverImage = product.hoverImage || product.image;
  return <article className="product-card">
    <div className="product-card-top"><span className="product-tag">{product.tag}</span>{onFavorite && <button className={favorite ? "favorite-active" : ""} aria-label="Yêu thích" onClick={() => onFavorite(product)}><Heart size={18} fill={favorite ? "currentColor" : "none"} /></button>}</div>
    <Link to={`/san-pham/${product.id}`} className="product-card-visual"><ProductVisual tone={product.tone} image={product.image} /><img className="product-hover-image" src={assetUrl(hoverImage)} alt={`${product.name} ảnh phụ`} /></Link>
    <div className="product-info"><span className="product-category">{product.category}</span><Link to={`/san-pham/${product.id}`}><h3>{product.name}</h3></Link><div className="product-meta"><span className="rating">★ {product.rating}</span><strong>{new Intl.NumberFormat("vi-VN").format(product.price)} đ</strong></div></div>
  </article>;
}

export default ProductCard;

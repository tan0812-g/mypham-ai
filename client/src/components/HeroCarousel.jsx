import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { assetUrl } from "../utils/api.js";

const slides = [
  { id: 1, name: "Glow Reset Serum", image: "/uploads/products/product-1.jpg", tone: "peach", label: "your daily ritual" },
  { id: 2, name: "Cloud Veil SPF 50+", image: "/uploads/products/product-2.jpg", tone: "blue", label: "shield your glow" },
  { id: 4, name: "Rosewood Lip Tint", image: "/uploads/products/product-4.jpg", tone: "rose", label: "made for you" },
  { id: 5, name: "Silk Barrier Cream", image: "/uploads/products/product-5.jpg", tone: "cream", label: "soft skin energy" },
];

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = () => setActive((current) => (current + 1) % slides.length);
  const previous = () => setActive((current) => (current - 1 + slides.length) % slides.length);
  useEffect(() => { if (paused) return undefined; const timer = window.setInterval(next, 4200); return () => window.clearInterval(timer); }, [paused]);
  const slide = slides[active];
  return <div className={`hero-carousel hero-carousel--${slide.tone}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className="hero-carousel-bg" />
    <Link className="hero-carousel-link" to={`/san-pham/${slide.id}`} aria-label={`Xem ${slide.name}`}>
      <img key={slide.image} src={assetUrl(slide.image)} alt={slide.name} />
      <span className="hero-carousel-caption">{slide.label}</span>
      <strong>{slide.name}</strong>
    </Link>
    <button className="hero-carousel-control hero-carousel-control--prev" onClick={previous} aria-label="Ảnh trước"><ChevronLeft size={17} /></button>
    <button className="hero-carousel-control hero-carousel-control--next" onClick={next} aria-label="Ảnh tiếp theo"><ChevronRight size={17} /></button>
    <div className="hero-carousel-dots">{slides.map((item, index) => <button key={item.id} className={index === active ? "active" : ""} onClick={() => setActive(index)} aria-label={`Xem ảnh ${index + 1}`} />)}</div>
  </div>;
}

export default HeroCarousel;

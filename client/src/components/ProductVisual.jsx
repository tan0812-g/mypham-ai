import { assetUrl } from "../utils/api.js";

function ProductVisual({ tone, image }) {
  return <div className={`product-visual product-visual--${tone}`}>{image ? <img className="product-image" src={assetUrl(image)} alt="" /> : <><span className="product-shadow" /><span className="product-bottle"><i /></span><span className="product-sparkle">✦</span></>}</div>;
}

export default ProductVisual;

const CART_KEY = "mpai_cart";

export function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; }
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  return items;
}

export function cartCount(items = getCart()) {
  return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

export function addToCart(product, quantity = 1) {
  const items = getCart();
  const stock = Number(product.stock);
  if (Number.isFinite(stock) && stock <= 0) return items;
  const existing = items.find((item) => item.id === product.id);
  if (existing) existing.quantity = Number.isFinite(stock) ? Math.min(stock, existing.quantity + quantity) : existing.quantity + quantity;
  else items.push({ ...product, quantity: Number.isFinite(stock) ? Math.min(stock, quantity) : quantity });
  return saveCart(items);
}

export function updateCartItem(id, quantity) {
  return saveCart(getCart().map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item));
}

export function removeCartItem(id) {
  return saveCart(getCart().filter((item) => item.id !== id));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

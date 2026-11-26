const FAVORITES_KEY = "mpai_favorites";

export function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"); } catch { return []; }
}

export function isFavorite(productId) { return getFavorites().some((item) => item.id === productId); }

export function toggleFavorite(product) {
  const favorites = getFavorites();
  const exists = favorites.some((item) => item.id === product.id);
  const next = exists ? favorites.filter((item) => item.id !== product.id) : [...favorites, product];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return { favorites: next, added: !exists };
}

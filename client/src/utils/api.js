export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function assetUrl(path = "") {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_URL}${path}`;
}

import { getSessionUser } from "../services/sessions.js";

export async function requireAuth(req, res, next) {
  const token = String(req.headers.authorization || "").replace("Bearer ", "");
  try {
    const user = await getSessionUser(token);
    if (!user) return res.status(401).json({ success: false, message: "Vui lòng đăng nhập để tiếp tục." });
    req.user = user;
    return next();
  } catch (error) { return next(error); }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Bạn không có quyền thực hiện thao tác này." });
    return next();
  };
}

export function requirePermission(permission) {
  return (req, res, next) => {
    if (req.user?.role === "QUAN_TRI" || req.user?.permissions?.includes(permission)) return next();
    return res.status(403).json({ success: false, message: "Tài khoản chưa được cấp quyền cho chức năng này." });
  };
}

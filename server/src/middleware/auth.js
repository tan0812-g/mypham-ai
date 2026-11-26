import { sessions } from "../routes/authRoutes.js";

export function requireAuth(req, res, next) {
  const token = String(req.headers.authorization || "").replace("Bearer ", "");
  const user = sessions.get(token);
  if (!user) return res.status(401).json({ success: false, message: "Vui lòng đăng nhập để tiếp tục." });
  req.user = user;
  return next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Bạn không có quyền thực hiện thao tác này." });
    return next();
  };
}

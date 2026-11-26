import cors from "cors";
import express from "express";
import path from "node:path";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "8mb" }));
app.use("/uploads", express.static(path.resolve("uploads")));
app.get("/", (req, res) => res.send("Backend website mỹ phẩm AI đang hoạt động!"));
app.get("/api/health", async (req, res) => res.json({ success: true, message: "Kết nối Node.js thành công!" }));
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/account", accountRoutes);
app.use((error, req, res, next) => { console.error(error); res.status(500).json({ success: false, message: "Lỗi máy chủ hoặc database." }); });

export default app;

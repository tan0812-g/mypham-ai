import { createHash, randomUUID } from "node:crypto";
import db from "../config/database.js";

const tokenHash = (token) => createHash("sha256").update(token).digest("hex");

export async function ensureSessionTable() {
  await db.query(`CREATE TABLE IF NOT EXISTS phien_dang_nhap (
    tokenHash CHAR(64) NOT NULL PRIMARY KEY,
    maTaiKhoan BIGINT UNSIGNED NOT NULL,
    hetHanLuc DATETIME NOT NULL,
    taoLuc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_phien_tai_khoan (maTaiKhoan),
    KEY idx_phien_het_han (hetHanLuc),
    CONSTRAINT fk_phien_tai_khoan FOREIGN KEY (maTaiKhoan) REFERENCES tai_khoan(maTaiKhoan) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}

export async function createSession(accountId) {
  const token = randomUUID();
  await db.query("INSERT INTO phien_dang_nhap (tokenHash, maTaiKhoan, hetHanLuc) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))", [tokenHash(token), accountId]);
  return token;
}

export async function getSessionUser(token) {
  if (!token) return null;
  const [[account]] = await db.query(`SELECT tk.maTaiKhoan AS id, tk.email, tk.vaiTro AS role,
    COALESCE(nv.hoTen, kh.hoTen, tk.email) AS name, nv.dangLamViec, nv.quyenHan
    FROM phien_dang_nhap p JOIN tai_khoan tk ON tk.maTaiKhoan = p.maTaiKhoan
    LEFT JOIN nhan_vien nv ON nv.maTaiKhoan = tk.maTaiKhoan
    LEFT JOIN khach_hang kh ON kh.maTaiKhoan = tk.maTaiKhoan
    WHERE p.tokenHash = ? AND p.hetHanLuc > NOW() AND tk.trangThai = 'HOAT_DONG' LIMIT 1`, [tokenHash(token)]);
  if (!account || (account.role === "NHAN_VIEN" && !account.dangLamViec)) return null;
  let permissions = [];
  try { permissions = JSON.parse(account.quyenHan || "[]"); } catch { permissions = []; }
  return { id: account.id, email: account.email, name: account.name, role: account.role, permissions };
}

export async function deleteSession(token) {
  if (token) await db.query("DELETE FROM phien_dang_nhap WHERE tokenHash = ?", [tokenHash(token)]);
}

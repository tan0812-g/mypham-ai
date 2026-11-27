import { createHmac, timingSafeEqual } from "node:crypto";
import db from "../config/database.js";

export async function ensurePaymentEventTable() {
  await db.query(`CREATE TABLE IF NOT EXISTS bank_payment_events (
    transactionId VARCHAR(120) NOT NULL PRIMARY KEY,
    maDon BIGINT UNSIGNED NOT NULL,
    soTien DECIMAL(14,2) NOT NULL,
    taoLuc DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_bank_event_order (maDon),
    CONSTRAINT fk_bank_event_order FOREIGN KEY (maDon) REFERENCES don_hang(maDon)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}

export function validPaymentSignature(rawBody, signature, secret) {
  if (!secret || secret.length < 32 || !rawBody || !/^[a-f0-9]{64}$/i.test(signature || "")) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  return timingSafeEqual(Buffer.from(signature, "hex"), expected);
}

export function parseBankPayment(event, expectedAccountNumber) {
  const transactionId = String(event.transactionId || "").trim();
  const amount = Number(event.amount);
  const content = String(event.content || "");
  const destinationAccount = String(event.destinationAccount || "").replace(/\s|-/g, "");
  const expectedAccount = String(expectedAccountNumber || "").replace(/\s|-/g, "");
  const match = content.match(/\bMPAI\s*0*(\d+)\b/i);
  if (!expectedAccount || !transactionId || transactionId.length > 120 || !Number.isSafeInteger(amount) || amount <= 0 || event.direction !== "IN" || destinationAccount !== expectedAccount || !match) {
    return null;
  }
  const orderId = Number(match[1]);
  if (!Number.isSafeInteger(orderId) || orderId <= 0) return null;
  return { transactionId, amount, orderId };
}

export async function processBankPayment(event) {
  const payment = parseBankPayment(event, process.env.PAYMENT_ACCOUNT_NO);
  if (!payment) return { status: 422, message: "Giao dịch không đủ điều kiện đối chiếu." };
  const { transactionId, amount, orderId } = payment;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [[seen]] = await connection.query("SELECT transactionId FROM bank_payment_events WHERE transactionId = ?", [transactionId]);
    if (seen) { await connection.rollback(); return { status: 200, message: "Giao dịch đã được xử lý." }; }
    const [[order]] = await connection.query(`SELECT d.trangThai AS orderStatus, d.tongThanhToan AS total, gt.phuongThuc AS method, gt.trangThai AS paymentStatus
      FROM don_hang d JOIN giao_dich_thanh_toan gt ON gt.maDon = d.maDon
      WHERE d.maDon = ? FOR UPDATE`, [orderId]);
    if (!order || order.orderStatus === "DA_HUY" || order.method !== "ONLINE" || order.paymentStatus !== "CHO_XU_LY" || Number(order.total) !== amount) {
      await connection.rollback();
      return { status: 409, message: "Giao dịch không khớp đơn hàng đang chờ thanh toán." };
    }
    const [inserted] = await connection.query("INSERT IGNORE INTO bank_payment_events (transactionId, maDon, soTien) VALUES (?, ?, ?)", [transactionId, orderId, amount]);
    if (!inserted.affectedRows) { await connection.rollback(); return { status: 200, message: "Giao dịch đã được xử lý." }; }
    const [updated] = await connection.query("UPDATE giao_dich_thanh_toan SET trangThai = 'THANH_CONG', congThanhToan = 'WEBHOOK', maGiaoDichCong = ? WHERE maDon = ? AND phuongThuc = 'ONLINE' AND trangThai = 'CHO_XU_LY'", [transactionId, orderId]);
    if (!updated.affectedRows) { await connection.rollback(); return { status: 409, message: "Đơn hàng không còn chờ thanh toán." }; }
    await connection.commit();
    return { status: 200, message: "Đã đối chiếu và xác nhận thanh toán.", orderId };
  } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}

import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { parseBankPayment, validPaymentSignature } from "../src/services/paymentEvents.js";

const account = "0869729121";
const event = { transactionId: "bank-123", amount: 575000, content: "MPAI 0013", destinationAccount: account, direction: "IN" };

test("chỉ chấp nhận chữ ký của nguyên văn body", () => {
  const secret = "a-secret-longer-than-thirty-two-characters";
  const body = Buffer.from(JSON.stringify(event));
  const signature = createHmac("sha256", secret).update(body).digest("hex");
  assert.equal(validPaymentSignature(body, signature, secret), true);
  assert.equal(validPaymentSignature(Buffer.from(`${body} `), signature, secret), false);
  assert.equal(validPaymentSignature(body, "0".repeat(64), secret), false);
  assert.equal(validPaymentSignature(body, signature, "short"), false);
});

test("chỉ đối chiếu giao dịch tiền vào đúng tài khoản và mã đơn", () => {
  assert.deepEqual(parseBankPayment(event, account), { transactionId: "bank-123", amount: 575000, orderId: 13 });
  assert.equal(parseBankPayment({ ...event, direction: "OUT" }, account), null);
  assert.equal(parseBankPayment({ ...event, destinationAccount: "other" }, account), null);
  assert.equal(parseBankPayment({ ...event, content: "khong co ma don" }, account), null);
  assert.equal(parseBankPayment({ ...event, amount: -1 }, account), null);
});

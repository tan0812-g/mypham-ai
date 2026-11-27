import assert from "node:assert/strict";
import test from "node:test";
import { normalizeOrderItems, OrderInventoryError, prepareOrderLines } from "../src/services/orderInventory.js";

const products = [
  { maSanPham: 1, giaBan: "100000.00", soLuongThucTe: 10, soLuongGiu: 3 },
  { maSanPham: 2, giaBan: "50000.00", soLuongThucTe: 4, soLuongGiu: 4 },
];

test("gộp sản phẩm trùng trong giỏ và tính tiền từ giá trong database", () => {
  const { lines, subtotal } = prepareOrderLines([
    { productId: 1, quantity: 2, price: 1 },
    { productId: 1, quantity: 3, price: 1 },
  ], products);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].quantity, 5);
  assert.equal(lines[0].lineTotal, 500000);
  assert.equal(subtotal, 500000);
});

test("chặn vượt số lượng còn bán kể cả khi giỏ có dòng trùng", () => {
  assert.throws(() => prepareOrderLines([{ productId: 1, quantity: 4 }, { productId: 1, quantity: 4 }], products), (error) => error instanceof OrderInventoryError && error.status === 409);
  assert.throws(() => prepareOrderLines([{ productId: 2, quantity: 1 }], products), (error) => error instanceof OrderInventoryError && error.status === 409);
  assert.throws(() => prepareOrderLines([{ productId: 99, quantity: 1 }], products), (error) => error instanceof OrderInventoryError && error.status === 409);
});

test("từ chối số lượng không hợp lệ thay vì tự đổi thành 1", () => {
  for (const quantity of [0, -1, 1.5, "abc", null, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => normalizeOrderItems([{ productId: 1, quantity }]), OrderInventoryError);
  }
  assert.throws(() => normalizeOrderItems([{ productId: -1, quantity: 1 }]), OrderInventoryError);
});

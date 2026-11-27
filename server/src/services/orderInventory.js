export class OrderInventoryError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "OrderInventoryError";
    this.status = status;
  }
}

export function normalizeOrderItems(items) {
  if (!Array.isArray(items) || !items.length || items.length > 100) {
    throw new OrderInventoryError("Giỏ hàng phải có từ 1 đến 100 dòng sản phẩm.");
  }
  const quantities = new Map();
  for (const item of items) {
    const productId = Number(item?.productId);
    const quantity = Number(item?.quantity);
    if (!Number.isSafeInteger(productId) || productId <= 0 || !Number.isSafeInteger(quantity) || quantity <= 0) {
      throw new OrderInventoryError("Mã sản phẩm và số lượng phải là số nguyên dương.");
    }
    const totalQuantity = (quantities.get(productId) || 0) + quantity;
    if (!Number.isSafeInteger(totalQuantity)) throw new OrderInventoryError("Số lượng sản phẩm quá lớn.");
    quantities.set(productId, totalQuantity);
  }
  return [...quantities].map(([productId, quantity]) => ({ productId, quantity }));
}

export function prepareOrderLines(items, products) {
  const normalized = normalizeOrderItems(items);
  const productMap = new Map(products.map((product) => [Number(product.maSanPham), product]));
  let subtotal = 0;
  const lines = normalized.map(({ productId, quantity }) => {
    const product = productMap.get(productId);
    if (!product) throw new OrderInventoryError("Sản phẩm không tồn tại hoặc đã ngừng bán.", 409);
    const available = Number(product.soLuongThucTe) - Number(product.soLuongGiu);
    if (quantity > available) throw new OrderInventoryError("Sản phẩm không đủ tồn kho.", 409);
    const price = Number(product.giaBan);
    const lineTotal = price * quantity;
    if (!Number.isSafeInteger(price) || price < 0 || !Number.isSafeInteger(lineTotal) || !Number.isSafeInteger(subtotal + lineTotal)) {
      throw new OrderInventoryError("Giá hoặc tổng tiền sản phẩm không hợp lệ.");
    }
    subtotal += lineTotal;
    return { ...product, quantity, lineTotal };
  });
  return { lines, subtotal };
}

export async function changeHeldStock(connection, productId, delta) {
  const [result] = await connection.query(
    "UPDATE ton_kho SET soLuongGiu = soLuongGiu + ?, capNhatLuc = NOW() WHERE maSanPham = ? AND soLuongGiu + ? BETWEEN 0 AND soLuongThucTe",
    [delta, productId, delta],
  );
  if (result.affectedRows !== 1) throw new OrderInventoryError("Tồn kho đã thay đổi, vui lòng thử lại.", 409);
}

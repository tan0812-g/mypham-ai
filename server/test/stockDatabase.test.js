import assert from "node:assert/strict";
import test, { after } from "node:test";
import db from "../src/config/database.js";
import { changeHeldStock, OrderInventoryError } from "../src/services/orderInventory.js";

after(async () => { await db.end(); });

test("giữ và trả tồn kho trong transaction, sau đó rollback dữ liệu thử", async (context) => {
  let connection;
  try { connection = await db.getConnection(); }
  catch { context.skip("Không kết nối được MySQL; cần bật MySQL để chạy kiểm thử tồn kho."); return; }
  try {
    await connection.beginTransaction();
    const [[stock]] = await connection.query("SELECT maSanPham, soLuongGiu AS held, soLuongThucTe AS actual FROM ton_kho WHERE soLuongThucTe > soLuongGiu ORDER BY maSanPham LIMIT 1 FOR UPDATE");
    if (!stock) { context.skip("Không có sản phẩm nào còn hàng để thử giữ kho."); return; }
    await changeHeldStock(connection, stock.maSanPham, 1);
    const [[reserved]] = await connection.query("SELECT soLuongGiu AS held FROM ton_kho WHERE maSanPham = ?", [stock.maSanPham]);
    assert.equal(reserved.held, stock.held + 1);
    await assert.rejects(changeHeldStock(connection, stock.maSanPham, stock.actual + 1), OrderInventoryError);
    await changeHeldStock(connection, stock.maSanPham, -1);
    const [[released]] = await connection.query("SELECT soLuongGiu AS held FROM ton_kho WHERE maSanPham = ?", [stock.maSanPham]);
    assert.equal(released.held, stock.held);
  } finally {
    await connection.rollback();
    connection.release();
  }
});

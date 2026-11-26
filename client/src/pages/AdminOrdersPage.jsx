import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  Eye,
  Printer,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const statusLabels = {
  CHO_XAC_NHAN: "Chờ xác nhận",
  DA_XAC_NHAN: "Đã xác nhận",
  DANG_CHUAN_BI: "Đang chuẩn bị",
  DANG_GIAO: "Đang giao",
  DA_GIAO: "Đã giao",
  DA_HUY: "Đã hủy",
};

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}`,
  });
  const loadOrders = useCallback(
    () =>
      fetch(`${API}/api/admin/orders`, { headers: headers() })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) setOrders(result.data);
          else setFeedback(result.message);
        })
        .catch(() => setFeedback("Không thể tải danh sách đơn hàng.")),
    [],
  );
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);
  const updateStatus = async (id, status) => {
    const response = await fetch(`${API}/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    setFeedback(result.message || "");
    if (result.success) loadOrders();
  };
  const viewOrder = async (id) => {
    const response = await fetch(`${API}/api/admin/orders/${id}`, {
      headers: headers(),
    });
    const result = await response.json();
    if (result.success) setSelectedOrder(result.data);
    else setFeedback(result.message || "Không thể tải chi tiết đơn hàng.");
  };
  const filteredOrders = orders.filter((order) => {
    const keyword = search.trim().toLowerCase();
    return (!keyword || order.code.toLowerCase().includes(keyword) || order.customer.toLowerCase().includes(keyword)) && (statusFilter === "all" || order.status === statusFilter);
  });
  return (
    <div className="admin-products-page">
      <header className="admin-products-header">
        <Link to="/admin" className="admin-back">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div>
          <span className="admin-kicker">ORDER MANAGEMENT</span>
          <h1>Quản lý đơn hàng</h1>
        </div>
        <button
          className="button button-outline admin-refresh"
          onClick={loadOrders}
        >
          <RefreshCw size={14} /> Làm mới
        </button>
      </header>
      <main className="admin-orders-panel">
        <div className="admin-products-title">
          <div>
            <h2>Đơn hàng gần đây</h2>
            <span>Cập nhật trực tiếp từ MySQL</span>
          </div>
          <strong>{filteredOrders.length}/{orders.length} đơn hàng</strong>
        </div>
        {feedback && <p className="admin-form-feedback">{feedback}</p>}
        <div className="admin-order-filters"><label><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm mã đơn hoặc tên khách hàng..." /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">Tất cả trạng thái</option>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>
        <div className="admin-order-table">
          <div className="admin-order-table-head">
            <span>Mã đơn</span>
            <span>Khách hàng</span>
            <span>Ngày đặt</span>
            <span>Tổng tiền</span>
            <span>Trạng thái</span>
            <span />
          </div>
          {filteredOrders.map((order) => (
            <div className="admin-order-table-row" key={order.id}>
              <strong>{order.code}</strong>
              <span>{order.customer}</span>
              <span>
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </span>
              <b>{Number(order.total).toLocaleString("vi-VN")} đ</b>
              <select
                value={order.status}
                onChange={(event) => updateStatus(order.id, event.target.value)}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                className="admin-order-view"
                onClick={() => viewOrder(order.id)}
                aria-label={`Xem ${order.code}`}
              >
                <Eye size={15} />
              </button>
            </div>
          ))}
          {!filteredOrders.length && (
            <div className="admin-empty-orders">
              <ClipboardList size={26} />
              <p>{orders.length ? "Không tìm thấy đơn hàng phù hợp." : "Chưa có đơn hàng nào."}</p>
            </div>
          )}
        </div>
      </main>
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <section
            className="admin-order-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              <X size={16} />
            </button>
            <div className="admin-order-modal-head">
              <div>
                <span className="admin-kicker">ORDER DETAIL</span>
                <h2>{selectedOrder.code}</h2>
              </div>
              <button
                className="admin-print-order"
                onClick={() => window.print()}
              >
                <Printer size={14} /> In hóa đơn
              </button>
            </div>
            <div className="admin-order-detail-meta">
              <div>
                <strong>{selectedOrder.receiver}</strong>
                <span>{selectedOrder.phone}</span>
                <span>{selectedOrder.address}</span>
              </div>
              <div>
                <strong>{statusLabels[selectedOrder.status]}</strong>
                <span>{selectedOrder.email}</span>
                <span>
                  {selectedOrder.paymentMethod === "COD"
                    ? "Thanh toán khi nhận hàng"
                    : "Thanh toán online"}
                </span>
              </div>
            </div>
            <div className="admin-order-items">
              {selectedOrder.items.map((item) => (
                <div className="admin-order-item" key={item.id}>
                  <span>{item.name}</span>
                  <small>
                    {item.quantity} ×{" "}
                    {Number(item.price).toLocaleString("vi-VN")} đ
                  </small>
                  <b>{Number(item.lineTotal).toLocaleString("vi-VN")} đ</b>
                </div>
              ))}
            </div>
            <div className="admin-order-total">
              <span>
                Tạm tính{" "}
                <b>
                  {Number(selectedOrder.subtotal).toLocaleString("vi-VN")} đ
                </b>
              </span>
              <span>
                Giảm giá{" "}
                <b>
                  -{Number(selectedOrder.discount).toLocaleString("vi-VN")} đ
                </b>
              </span>
              <span>
                Phí vận chuyển{" "}
                <b>
                  {Number(selectedOrder.shipping).toLocaleString("vi-VN")} đ
                </b>
              </span>
              <strong>
                Tổng cộng{" "}
                <b>{Number(selectedOrder.total).toLocaleString("vi-VN")} đ</b>
              </strong>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminOrdersPage;

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Eye, RefreshCw, Search, Users, X } from "lucide-react";
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

function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}`,
  });
  const loadCustomers = useCallback(
    () =>
      fetch(`${API}/api/admin/customers`, { headers: headers() })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) setCustomers(result.data);
          else setFeedback(result.message);
        })
        .catch(() => setFeedback("Không thể tải danh sách khách hàng.")),
    [],
  );
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);
  const updateStatus = async (id, status) => {
    const response = await fetch(`${API}/api/admin/customers/${id}/status`, {
      method: "PATCH",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    setFeedback(result.message || "");
    if (result.success) loadCustomers();
  };
  const viewCustomer = async (id) => {
    const response = await fetch(`${API}/api/admin/customers/${id}`, {
      headers: headers(),
    });
    const result = await response.json();
    if (result.success) setSelectedCustomer(result.data);
    else setFeedback(result.message || "Không thể tải hồ sơ khách hàng.");
  };
  const filteredCustomers = customers.filter((customer) => { const keyword = search.trim().toLowerCase(); return (!keyword || customer.name.toLowerCase().includes(keyword) || customer.email.toLowerCase().includes(keyword)) && (statusFilter === "all" || customer.accountStatus === statusFilter); });
  return (
    <div className="admin-products-page">
      <header className="admin-products-header">
        <Link to="/admin" className="admin-back">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div>
          <span className="admin-kicker">CUSTOMER MANAGEMENT</span>
          <h1>Quản lý khách hàng</h1>
        </div>
        <button
          className="button button-outline admin-refresh"
          onClick={loadCustomers}
        >
          <RefreshCw size={14} /> Làm mới
        </button>
      </header>
      <main className="admin-customers-panel">
        <div className="admin-products-title">
          <div>
            <h2>Danh sách khách hàng</h2>
            <span>Tài khoản và lịch sử mua hàng</span>
          </div>
          <strong>{filteredCustomers.length}/{customers.length} khách hàng</strong>
        </div>
        {feedback && <p className="admin-form-feedback">{feedback}</p>}
        <div className="admin-customer-filters"><label><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên hoặc email..." /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">Tất cả trạng thái</option><option value="HOAT_DONG">Hoạt động</option><option value="KHOA">Đã khóa</option></select></div>
        <div className="customer-table">
          <div className="customer-table-head">
            <span>Khách hàng</span>
            <span>Liên hệ</span>
            <span>Đơn hàng</span>
            <span>Đã chi tiêu</span>
            <span>Trạng thái</span>
            <span />
          </div>
          {filteredCustomers.map((customer) => (
            <div className="customer-table-row" key={customer.id}>
              <div className="customer-identity">
                <span>{customer.name.slice(0, 1)}</span>
                <div>
                  <strong>{customer.name}</strong>
                  <small>{customer.email}</small>
                </div>
              </div>
              <span>
                {customer.phone || "Chưa cập nhật"}
                <small>{customer.skinType || "Chưa có loại da"}</small>
              </span>
              <b>{customer.orderCount}</b>
              <strong>
                {Number(customer.totalSpent).toLocaleString("vi-VN")} đ
              </strong>
              <select
                value={customer.accountStatus}
                onChange={(event) =>
                  updateStatus(customer.id, event.target.value)
                }
              >
                <option value="HOAT_DONG">Hoạt động</option>
                <option value="KHOA">Đã khóa</option>
              </select>
              <button
                className="admin-order-view"
                onClick={() => viewCustomer(customer.id)}
                aria-label={`Xem ${customer.name}`}
              >
                <Eye size={15} />
              </button>
            </div>
          ))}
          {!filteredCustomers.length && (
            <div className="admin-empty-orders">
              <Users size={26} />
              <p>{customers.length ? "Không tìm thấy khách hàng phù hợp." : "Chưa có khách hàng."}</p>
            </div>
          )}
        </div>
      </main>
      {selectedCustomer && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedCustomer(null)}
        >
          <section
            className="admin-customer-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedCustomer(null)}
            >
              <X size={16} />
            </button>
            <div className="customer-modal-heading">
              <span>{selectedCustomer.name.slice(0, 1)}</span>
              <div>
                <span className="admin-kicker">CUSTOMER PROFILE</span>
                <h2>{selectedCustomer.name}</h2>
                <p>{selectedCustomer.email}</p>
              </div>
            </div>
            <div className="customer-profile-grid">
              <div>
                <small>Số điện thoại</small>
                <strong>{selectedCustomer.phone || "Chưa cập nhật"}</strong>
              </div>
              <div>
                <small>Loại da</small>
                <strong>{selectedCustomer.skinType || "Chưa cập nhật"}</strong>
              </div>
              <div>
                <small>Địa chỉ</small>
                <strong>{selectedCustomer.address || "Chưa cập nhật"}</strong>
              </div>
              <div>
                <small>Tham gia</small>
                <strong>
                  {new Date(selectedCustomer.joinedAt).toLocaleDateString(
                    "vi-VN",
                  )}
                </strong>
              </div>
            </div>
            <h3>Lịch sử đơn hàng</h3>
            <div className="customer-order-history">
              {selectedCustomer.orders.map((order) => (
                <div key={order.id}>
                  <strong>{order.code}</strong>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <span
                    className={`order-status ${order.status === "DA_GIAO" ? "delivered" : "processing"}`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                  <b>{Number(order.total).toLocaleString("vi-VN")} đ</b>
                </div>
              ))}
              {!selectedCustomer.orders.length && (
                <p className="admin-empty-text">Khách hàng chưa có đơn hàng.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminCustomersPage;

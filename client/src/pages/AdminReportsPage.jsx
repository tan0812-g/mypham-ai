import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Download,
  PackageCheck,
  Printer,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const periodLabels = {
  week: "Tuần này",
  month: "Tháng này",
  quarter: "Quý này",
  year: "Năm nay",
};

function AdminReportsPage() {
  const [period, setPeriod] = useState("month");
  const [report, setReport] = useState(null);
  const [feedback, setFeedback] = useState("");
  const loadReport = useCallback(
    () =>
      fetch(`${API}/api/admin/reports/summary?period=${period}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) setReport(result.data);
          else setFeedback(result.message);
        })
        .catch(() => setFeedback("Không thể tải báo cáo.")),
    [period],
  );
  useEffect(() => {
    loadReport();
  }, [loadReport]);
  const change = (current, previous) =>
    previous
      ? Math.round(((current - previous) / previous) * 1000) / 10
      : current
        ? 100
        : 0;
  const exportCsv = async () => {
    const response = await fetch(
      `${API}/api/admin/reports/export?period=${period}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}`,
        },
      },
    );
    if (!response.ok) {
      setFeedback("Không thể xuất báo cáo.");
      return;
    }
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-${period}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <div className="admin-products-page">
      <header className="admin-products-header">
        <Link to="/admin" className="admin-back">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div>
          <span className="admin-kicker">BUSINESS REPORTS</span>
          <h1>Báo cáo thống kê</h1>
        </div>
        <div className="report-actions">
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
          <button className="button button-outline" onClick={loadReport}>
            <RefreshCw size={14} /> Làm mới
          </button>
          <button className="button button-dark" onClick={exportCsv}>
            <Download size={14} /> Xuất CSV
          </button>
          <button className="button button-outline" onClick={() => window.print()}>
            <Printer size={14} /> In / PDF
          </button>
        </div>
      </header>
      {feedback && (
        <p className="admin-form-feedback report-feedback">{feedback}</p>
      )}
      {report && (
        <main className="report-layout">
          <div className="report-period-note">
            Đang xem: <strong>{periodLabels[period]}</strong> · So sánh với kỳ
            trước tương ứng
          </div>
          <section className="report-stat-grid">
            <ReportStat
              icon={TrendingUp}
              label="Tổng doanh thu"
              value={`${Number(report.current.overview.revenue).toLocaleString("vi-VN")} đ`}
              change={change(
                report.current.overview.revenue,
                report.previous.overview.revenue,
              )}
              tone="green"
            />
            <ReportStat
              icon={BarChart3}
              label="Tổng đơn hàng"
              value={report.current.overview.orders}
              change={change(
                report.current.overview.orders,
                report.previous.overview.orders,
              )}
              tone="rose"
            />
            <ReportStat
              icon={Users}
              label="Khách hàng đã mua"
              value={report.current.overview.customers}
              change={change(
                report.current.overview.customers,
                report.previous.overview.customers,
              )}
              tone="lavender"
            />
            <ReportStat
              icon={PackageCheck}
              label="Sản phẩm đã bán"
              value={report.current.overview.sold}
              change={change(
                report.current.overview.sold,
                report.previous.overview.sold,
              )}
              tone="orange"
            />
          </section>
          <section className="report-card report-comparison-card">
            <div className="card-heading"><div><span className="card-kicker">PERIOD COMPARISON</span><h2>So sánh kỳ này và kỳ trước</h2></div></div>
            <div className="report-comparison-grid">
              <ComparisonBars label="Doanh thu" current={report.current.overview.revenue} previous={report.previous.overview.revenue} format={(value) => `${Number(value).toLocaleString("vi-VN")} đ`} />
              <ComparisonBars label="Đơn hàng" current={report.current.overview.orders} previous={report.previous.overview.orders} format={(value) => Number(value).toLocaleString("vi-VN")} />
              <ComparisonBars label="Sản phẩm đã bán" current={report.current.overview.sold} previous={report.previous.overview.sold} format={(value) => Number(value).toLocaleString("vi-VN")} />
            </div>
          </section>
          <section className="report-columns">
            <article className="report-card">
              <div className="card-heading">
                <div>
                  <span className="card-kicker">BEST SELLERS</span>
                  <h2>Sản phẩm bán chạy</h2>
                </div>
              </div>
              {report.current.topProducts.map((product, index) => (
                <div className="report-product" key={product.id}>
                  <span>0{index + 1}</span>
                  <div>
                    <strong>{product.name}</strong>
                    <small>
                      {product.quantity} sản phẩm ·{" "}
                      {Number(product.revenue).toLocaleString("vi-VN")} đ
                    </small>
                  </div>
                  <i style={{ width: `${Math.max(25, 100 - index * 18)}%` }} />
                </div>
              ))}
              {!report.current.topProducts.length && (
                <p className="report-empty">Chưa có dữ liệu trong kỳ này.</p>
              )}
            </article>
            <article className="report-card">
              <div className="card-heading">
                <div>
                  <span className="card-kicker">INVENTORY</span>
                  <h2>Tình trạng tồn kho</h2>
                </div>
              </div>
              {report.stock.map((item) => (
                <div className="report-stock" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <small>Đang giữ: {item.reserved}</small>
                  </div>
                  <span
                    className={
                      item.stock - item.reserved <= item.warningStock
                        ? "low"
                        : "ok"
                    }
                  >
                    {item.stock - item.reserved} còn
                  </span>
                </div>
              ))}
            </article>
          </section>
        </main>
      )}
    </div>
  );
}

function ComparisonBars({ label, current, previous, format }) {
  const max = Math.max(Number(current), Number(previous), 1);
  return <div className="comparison-item"><strong>{label}</strong><div className="comparison-bar-row"><span>Kỳ này</span><i><b style={{ width: `${(Number(current) / max) * 100}%` }} /></i><em>{format(current)}</em></div><div className="comparison-bar-row previous"><span>Kỳ trước</span><i><b style={{ width: `${(Number(previous) / max) * 100}%` }} /></i><em>{format(previous)}</em></div></div>;
}

function ReportStat({ icon: Icon, label, value, change, tone }) {
  const positive = change >= 0;
  const meter = Math.min(100, Math.max(12, 50 + change / 2));
  return (
    <article className="report-stat">
      <div className={`stat-icon ${tone}`}>
        <Icon size={18} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small className={positive ? "report-up" : "report-down"}>
        {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{" "}
        {Math.abs(change)}% so với kỳ trước
      </small>
      <i className="report-stat-meter">
        <b
          className={positive ? "positive" : "negative"}
          style={{ width: `${meter}%` }}
        />
      </i>
    </article>
  );
}

export default AdminReportsPage;

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Edit3,
  ImagePlus,
  PackagePlus,
  Save,
  Search,
  ArrowDownUp,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const emptyForm = {
  categoryId: 1,
  name: "",
  price: "",
  stock: 10,
  warningStock: 5,
  description: "",
  imageData: "",
  imageMimeType: "",
  hoverImageData: "",
  hoverImageMimeType: "",
  status: "DANG_BAN",
};

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const tokenHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("mpai_admin_token") || ""}`,
  });
  const loadProducts = useCallback(
    () =>
      fetch(`${API}/api/admin/products`, { headers: tokenHeaders() })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) setProducts(result.data);
          else setFeedback(result.message);
        })
        .catch(() => setFeedback("Không thể tải danh sách sản phẩm.")),
    [],
  );
  const loadCategories = useCallback(
    () =>
      fetch(`${API}/api/admin/categories`, { headers: tokenHeaders() })
        .then((response) => response.json())
        .then((result) => {
          if (result.success)
            setCategories(result.data.filter((category) => category.visible));
        })
        .catch(() => {}),
    [],
  );
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadCategories, loadProducts]);
  const visibleProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const filtered = products.filter(
      (product) =>
        (!keyword || product.name.toLowerCase().includes(keyword)) &&
        (categoryFilter === "all" ||
          String(product.categoryId) === categoryFilter) &&
        (statusFilter === "all" || product.status === statusFilter),
    );
    return filtered.sort((first, second) => {
      if (sortBy === "name") return first.name.localeCompare(second.name, "vi");
      if (sortBy === "priceAsc") return Number(first.price) - Number(second.price);
      if (sortBy === "priceDesc") return Number(second.price) - Number(first.price);
      if (sortBy === "stock") return Number(first.stock) - Number(second.stock);
      return Number(second.id) - Number(first.id);
    });
  }, [categoryFilter, products, search, sortBy, statusFilter]);
  const updateForm = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const readImage = (event, dataField, mimeField) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setFeedback("Ảnh phải là JPG, PNG hoặc WebP và không quá 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setForm((current) => ({
        ...current,
        [dataField]: reader.result,
        [mimeField]: file.type,
      }));
    reader.readAsDataURL(file);
    event.target.value = "";
  };
  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      categoryId: product.categoryId,
      name: product.name,
      price: product.price,
      stock: product.stock,
      warningStock: product.warningStock,
      description: "",
      status: product.status,
    });
    setFeedback("");
  };
  const updateEditForm = (event) =>
    setEditForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const saveProduct = async (event) => {
    event.preventDefault();
    setFeedback("Đang cập nhật sản phẩm...");
    const response = await fetch(`${API}/api/admin/products/${editingId}`, {
      method: "PATCH",
      headers: { ...tokenHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const result = await response.json();
    setFeedback(result.message || "");
    if (result.success) {
      setEditingId(null);
      loadProducts();
    }
  };
  const createProduct = async (event) => {
    event.preventDefault();
    setFeedback("Đang lưu sản phẩm...");
    const response = await fetch(`${API}/api/admin/products`, {
      method: "POST",
      headers: { ...tokenHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    setFeedback(
      result.message ||
        (result.success ? "Đã thêm sản phẩm." : "Không thể thêm sản phẩm."),
    );
    if (result.success) {
      setForm(emptyForm);
      loadProducts();
    }
  };
  const uploadImage = (productId, event, variant = "primary") => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFeedback("Vui lòng chọn tệp ảnh.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFeedback("Ảnh không được vượt quá 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      setFeedback("Đang tải ảnh lên...");
      const response = await fetch(
        `${API}/api/admin/products/${productId}/image`,
        {
          method: "POST",
          headers: { ...tokenHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({
            data: reader.result,
            mimeType: file.type,
            variant,
          }),
        },
      );
      const result = await response.json();
      setFeedback(result.message || "");
      if (result.success) loadProducts();
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };
  return (
    <div className="admin-products-page">
      <header className="admin-products-header">
        <Link to="/admin" className="admin-back">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div>
          <span className="admin-kicker">PRODUCT MANAGEMENT</span>
          <h1>Quản lý sản phẩm</h1>
        </div>
      </header>
      <main className="admin-products-layout">
        <section className="admin-products-list">
          <div className="admin-products-title">
            <div>
              <h2>Danh sách sản phẩm</h2>
              <span>Cập nhật tên, giá, ảnh, trạng thái và tồn kho</span>
            </div>
            <strong>
              {visibleProducts.length}/{products.length} sản phẩm
            </strong>
          </div>
          <div className="admin-product-filters">
            <label>
              <Search size={15} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tên sản phẩm..."
              />
            </label>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="DANG_BAN">Đang bán</option>
              <option value="DA_AN">Đã ẩn</option>
            </select>
            <label className="admin-sort-label">
              <ArrowDownUp size={15} />
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="newest">Mới cập nhật</option>
                <option value="name">Tên A–Z</option>
                <option value="priceAsc">Giá thấp đến cao</option>
                <option value="priceDesc">Giá cao đến thấp</option>
                <option value="stock">Tồn kho thấp trước</option>
              </select>
            </label>
          </div>
          {feedback && <p className="admin-form-feedback">{feedback}</p>}
          {visibleProducts.map((product) =>
            editingId === product.id ? (
              <form
                className="admin-product-edit"
                key={product.id}
                onSubmit={saveProduct}
              >
                <div className="admin-product-edit-head">
                  <strong>
                    Chỉnh sửa #{String(product.id).padStart(3, "0")}
                  </strong>
                  <div className="admin-edit-head-actions">
                    <label className="admin-image-button" title="Tải ảnh chính">
                      <ImagePlus size={15} />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) =>
                          uploadImage(product.id, event, "primary")
                        }
                      />
                    </label>
                    <label
                      className="admin-image-button admin-image-button--hover"
                      title="Tải ảnh khi rê chuột"
                    >
                      <ImagePlus size={15} />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) =>
                          uploadImage(product.id, event, "hover")
                        }
                      />
                    </label>
                    <button type="button" onClick={() => setEditingId(null)}>
                      <X size={15} />
                    </button>
                  </div>
                </div>
                <div className="admin-form-two">
                  <label>
                    Tên sản phẩm
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={updateEditForm}
                      required
                    />
                  </label>
                  <label>
                    Giá bán
                    <input
                      name="price"
                      value={editForm.price}
                      onChange={updateEditForm}
                      type="number"
                      min="1"
                      required
                    />
                  </label>
                </div>
                <label>
                  Danh mục
                  <select
                    name="categoryId"
                    value={editForm.categoryId}
                    onChange={updateEditForm}
                  >
                    {categories.map((category) => (
                      <option value={category.id} key={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="admin-form-two">
                  <label>
                    Tồn kho
                    <input
                      name="stock"
                      value={editForm.stock}
                      onChange={updateEditForm}
                      type="number"
                      min="0"
                      required
                    />
                  </label>
                  <label>
                    Mức cảnh báo
                    <input
                      name="warningStock"
                      value={editForm.warningStock}
                      onChange={updateEditForm}
                      type="number"
                      min="0"
                      required
                    />
                  </label>
                </div>
                <label>
                  Trạng thái
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={updateEditForm}
                  >
                    <option value="DANG_BAN">Đang bán</option>
                    <option value="DA_AN">Đã ẩn</option>
                  </select>
                </label>
                <div className="admin-edit-actions">
                  <button className="button button-dark" type="submit">
                    <Check size={14} /> Lưu thay đổi
                  </button>
                  <button
                    className="button button-outline"
                    type="button"
                    onClick={() => setEditingId(null)}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            ) : (
              <article className="admin-product-row" key={product.id}>
                <div className="admin-product-number">
                  #{String(product.id).padStart(3, "0")}
                </div>
                <div className="admin-product-thumbnails" title="Ảnh chính và ảnh khi rê chuột">
                  {product.image ? <img src={`${API}${product.image}`} alt="" /> : <span>Ảnh</span>}
                  {product.hoverImage && product.hoverImage !== product.image ? <img src={`${API}${product.hoverImage}`} alt="" /> : <span className="missing">{product.hoverImage ? "Trùng" : "Hover"}</span>}
                </div>
                <div className="admin-product-main">
                  <strong>{product.name}</strong>
                  <small>
                    {product.category} ·{" "}
                    {Number(product.price).toLocaleString("vi-VN")} đ
                  </small>
                </div>
                <span
                  className={`admin-stock ${product.stock <= product.warningStock ? "low" : ""}`}
                >
                  {product.stock} còn lại
                </span>
                <span className="admin-product-status">
                  {product.status === "DANG_BAN" ? "Đang bán" : "Đã ẩn"}
                </span>
                <label className="admin-image-button" title="Tải ảnh chính">
                  <ImagePlus size={15} />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                      uploadImage(product.id, event, "primary")
                    }
                  />
                </label>
                <label
                  className="admin-image-button admin-image-button--hover"
                  title="Tải ảnh khi rê chuột"
                >
                  <ImagePlus size={15} />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                      uploadImage(product.id, event, "hover")
                    }
                  />
                </label>
                <button
                  className="admin-edit-button"
                  onClick={() => startEdit(product)}
                  aria-label={`Sửa ${product.name}`}
                >
                  <Edit3 size={15} />
                </button>
              </article>
            ),
          )}
          {!visibleProducts.length && (
            <div className="catalog-empty">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          )}
        </section>
        <form className="admin-create-product" onSubmit={createProduct}>
          <div className="placeholder-icon">
            <PackagePlus size={22} />
          </div>
          <h2>Thêm sản phẩm</h2>
          <label>
            Tên sản phẩm
            <input
              name="name"
              value={form.name}
              onChange={updateForm}
              required
              placeholder="Ví dụ: Daily Calm Toner"
            />
          </label>
          <label>
            Danh mục
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={updateForm}
            >
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <div className="admin-form-two">
            <label>
              Giá bán
              <input
                name="price"
                value={form.price}
                onChange={updateForm}
                required
                type="number"
                min="0"
                placeholder="250000"
              />
            </label>
            <label>
              Tồn kho
              <input
                name="stock"
                value={form.stock}
                onChange={updateForm}
                type="number"
                min="0"
              />
            </label>
          </div>
          <label>
            Mô tả
            <input
              name="description"
              value={form.description}
              onChange={updateForm}
              placeholder="Công dụng sản phẩm"
            />
          </label>
          <div className="admin-form-two">
            <label>
              Ảnh chính
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  readImage(event, "imageData", "imageMimeType")
                }
              />
            </label>
            <label>
              Ảnh khi rê chuột
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  readImage(event, "hoverImageData", "hoverImageMimeType")
                }
              />
            </label>
          </div>
          <button className="button button-dark" type="submit">
            <Save size={15} /> Lưu sản phẩm
          </button>
        </form>
      </main>
    </div>
  );
}

export default AdminProductsPage;

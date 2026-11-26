# Mỹ Phẩm AI

Website bán mỹ phẩm gồm giao diện khách hàng và trang quản trị, sử dụng React/Vite, Express và MySQL.

## 1. Chuẩn bị database

1. Mở XAMPP và bật MySQL/MariaDB ở port `3308`.
2. Mở phpMyAdmin tại `http://localhost:8080/phpmyadmin`.
3. Tạo database tên `mypham_ai` với charset `utf8mb4_unicode_ci`.
4. Import file SQL database của dự án.

## 2. Chạy backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Backend chạy tại `http://localhost:4000`.

## 3. Chạy frontend

Mở terminal khác:

```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```

Frontend chạy tại `http://localhost:5173`.

## 4. Tài khoản mẫu

- Quản trị: `admin@mypham-ai.vn` / `password`
- Khách hàng: `tuananh@example.com` / `password`

## 5. Các địa chỉ chính

- Trang chủ: `http://localhost:5173/`
- Đăng nhập quản trị: `http://localhost:5173/admin/login`
- Dashboard: `http://localhost:5173/admin`
- Sản phẩm: `http://localhost:5173/admin/san-pham`
- Báo cáo: `http://localhost:5173/admin/bao-cao`

## 6. Kiểm tra bản build

```bash
cd client
npm run lint
npm run build
```

Ảnh upload được lưu trong `server/uploads/products`. Không xóa thư mục này nếu muốn giữ ảnh sản phẩm.

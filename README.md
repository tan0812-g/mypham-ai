# Mỹ Phẩm AI

Website bán mỹ phẩm gồm giao diện khách hàng và trang quản trị, sử dụng React/Vite, Express và MySQL.

## Yêu cầu cần cài đặt

Trước khi chạy project, cần cài:

- **Node.js LTS** và npm: dùng để chạy frontend/backend.
- **Git**: dùng để tải project từ GitHub.
- **XAMPP**: dùng để chạy Apache và MySQL/MariaDB.
- **Trình duyệt hiện đại**: Chrome, Safari, Edge hoặc Firefox.

Kiểm tra Node.js và npm:

```bash
node -v
npm -v
```

Kiểm tra Git:

```bash
git --version
```

Sau khi cài XAMPP, mở XAMPP và bật:

- Apache Web Server.
- MySQL Database/MariaDB.

MySQL của project sử dụng port `3308`. Nếu máy dùng port khác, sửa lại `DB_PORT` trong file `server/.env`.

## Tải project từ GitHub

```bash
git clone https://github.com/tan0812-g/mypham-ai.git
cd mypham-ai
```

## 1. Chuẩn bị database

1. Mở XAMPP và bật MySQL/MariaDB ở port `3308`.
2. Mở phpMyAdmin tại `http://localhost:8080/phpmyadmin`.
3. Tạo database tên `mypham_ai` với charset `utf8mb4_unicode_ci`.
4. Import file SQL database của dự án.

Nếu dùng bản SQL đã tải trước khi có phân quyền nhân viên, chạy thêm file `database/migrations/2026-11-27-staff-permissions.sql` trong phpMyAdmin (một lần). Bản cài mới cũng cần chạy file này sau khi import `database/mypham_ai.sql`.

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

## Thanh toán online bằng QR

Checkout hỗ trợ thanh toán khi nhận hàng và chuyển khoản online bằng QR. Sau khi tạo file `client/.env.local`, điền thông tin tài khoản nhận tiền:

```env
VITE_PAYMENT_BANK_ID=970422
VITE_PAYMENT_ACCOUNT_NO=SO_TAI_KHOAN_CUA_BAN
VITE_PAYMENT_ACCOUNT_NAME=TEN_CHU_TAI_KHOAN
VITE_PAYMENT_BANK_NAME=TEN_NGAN_HANG
```

Thay `VITE_PAYMENT_BANK_ID` bằng mã ngân hàng và `VITE_PAYMENT_ACCOUNT_NO` bằng số tài khoản thật của cửa hàng. Khởi động lại frontend sau khi sửa `.env.local`. Hiện tại hệ thống ghi nhận giao dịch online ở trạng thái chờ xác nhận; nhân viên quản trị xác nhận sau khi kiểm tra tiền về tài khoản.

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

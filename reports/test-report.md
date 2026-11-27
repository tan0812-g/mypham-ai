# Báo cáo kiểm thử Mỹ Phẩm AI

- Thời gian chạy: lúc 22:05:39 Thứ Sáu, 27 tháng 11, 2026 (Việt Nam)
- Kết quả: **3/3 bước đạt**
- Node.js: v26.10.0

## Kết quả tự động

| Bước | Lệnh | Kết quả | Thời gian |
| --- | --- | --- | ---: |
| Kiểm thử backend (2 bài) | `cd server && npm test` | Đạt | 361 ms |
| Kiểm tra mã frontend | `cd client && npm run lint` | Đạt | 2115 ms |
| Tạo bản build frontend | `cd client && npm run build` | Đạt | 615 ms |

## Kết quả chi tiết

### Kiểm thử backend

```text
> server@1.0.0 test
> node --test

✔ chỉ chấp nhận chữ ký của nguyên văn body (1.447ms)
✔ chỉ đối chiếu giao dịch tiền vào đúng tài khoản và mã đơn (0.931834ms)
ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 165.414167
```

### Kiểm tra mã frontend

```text
> client@0.0.0 lint
> eslint .
```

### Tạo bản build frontend

```text
> client@0.0.0 build
> vite build

vite v8.3.8 building client environment for production...
transforming...
✓ 2132 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.62 kB │ gzip:   0.39 kB
dist/assets/index-Bsml7fPG.css  338.57 kB │ gzip:  51.28 kB
dist/assets/index-D5YY50-P.js   430.10 kB │ gzip: 120.00 kB

✓ built in 289ms
```

## Phạm vi chưa kiểm thử tự động

Các thao tác đăng nhập trên trình duyệt, đặt/hủy đơn, phân quyền nhân viên, ảnh tải lên, xuất báo cáo và đối chiếu tiền về ngân hàng cần được thử riêng. Báo cáo này không xác nhận các luồng đó đã đạt.

## Cách chạy lại

Từ thư mục dự án, chạy `cd server && npm run test:report`. Lệnh sẽ ghi đè báo cáo và dữ liệu kết quả bằng lần chạy mới nhất.

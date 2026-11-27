# Báo cáo kiểm thử Mỹ Phẩm AI

- Thời gian chạy: lúc 22:17:31 Thứ Sáu, 27 tháng 11, 2026 (Việt Nam)
- Kết quả: **3/3 bước đạt**
- Node.js: v26.10.0

## Kết quả tự động

| Bước | Lệnh | Kết quả | Thời gian |
| --- | --- | --- | ---: |
| Kiểm thử backend (6 bài) | `cd server && npm test` | Đạt | 411 ms |
| Kiểm tra mã frontend | `cd client && npm run lint` | Đạt | 1993 ms |
| Tạo bản build frontend | `cd client && npm run build` | Đạt | 614 ms |

## Kết quả chi tiết

### Kiểm thử backend

```text
> server@1.0.0 test
> node --test

✔ gộp sản phẩm trùng trong giỏ và tính tiền từ giá trong database (1.348417ms)
✔ chặn vượt số lượng còn bán kể cả khi giỏ có dòng trùng (0.296584ms)
✔ từ chối số lượng không hợp lệ thay vì tự đổi thành 1 (0.497958ms)
✔ chỉ chấp nhận chữ ký của nguyên văn body (1.367ms)
✔ chỉ đối chiếu giao dịch tiền vào đúng tài khoản và mã đơn (0.869916ms)
✔ giữ và trả tồn kho trong transaction, sau đó rollback dữ liệu thử (56.420625ms)
ℹ tests 6
ℹ suites 0
ℹ pass 6
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 218.726917
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

✓ built in 297ms
```

## Phạm vi chưa kiểm thử tự động

Bộ kiểm thử hiện kiểm tra dữ liệu giỏ hàng, chặn vượt kho và giữ/trả kho trong transaction MySQL có rollback. Các luồng giao diện từ đầu đến cuối như đăng nhập, đặt/hủy đơn, phân quyền nhân viên, ảnh tải lên, xuất báo cáo và nhận tiền ngân hàng cần được thử riêng. Báo cáo này không xác nhận các luồng đó đã đạt.

## Cách chạy lại

Từ thư mục dự án, chạy `cd server && npm run test:report`. Lệnh sẽ ghi đè báo cáo và dữ liệu kết quả bằng lần chạy mới nhất.

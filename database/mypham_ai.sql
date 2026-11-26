-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for osx10.10 (x86_64)
--
-- Host: 127.0.0.1    Database: mypham_ai
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chi_tiet_don`
--

DROP TABLE IF EXISTS `chi_tiet_don`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chi_tiet_don` (
  `maChiTietDon` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maDon` bigint(20) unsigned NOT NULL,
  `maSanPham` bigint(20) unsigned NOT NULL,
  `soLuong` int(10) unsigned NOT NULL,
  `donGiaLucMua` decimal(14,2) NOT NULL,
  `giamGiaLucMua` decimal(14,2) NOT NULL,
  `thanhTien` decimal(14,2) NOT NULL,
  PRIMARY KEY (`maChiTietDon`),
  UNIQUE KEY `uk_don_sp` (`maDon`,`maSanPham`),
  KEY `fk_chi_tiet_don_maSanPham` (`maSanPham`),
  CONSTRAINT `fk_chi_tiet_don_maDon` FOREIGN KEY (`maDon`) REFERENCES `don_hang` (`maDon`) ON UPDATE CASCADE,
  CONSTRAINT `fk_chi_tiet_don_maSanPham` FOREIGN KEY (`maSanPham`) REFERENCES `san_pham` (`maSanPham`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_don`
--

LOCK TABLES `chi_tiet_don` WRITE;
/*!40000 ALTER TABLE `chi_tiet_don` DISABLE KEYS */;
INSERT INTO `chi_tiet_don` VALUES (1,1,1,1,350000.00,0.00,350000.00),(2,1,2,1,290000.00,0.00,290000.00),(3,2,3,1,180000.00,0.00,180000.00),(4,2,5,1,320000.00,50000.00,270000.00),(5,3,4,1,220000.00,0.00,220000.00),(6,3,3,2,180000.00,0.00,360000.00),(7,4,1,3,350000.00,0.00,1050000.00),(8,5,2,1,290000.00,0.00,290000.00),(9,6,3,1,180000.00,0.00,180000.00),(10,7,1,1,350000.00,0.00,350000.00),(11,7,4,1,220000.00,0.00,220000.00),(12,7,2,1,290000.00,0.00,290000.00),(13,8,1,1,350000.00,0.00,350000.00),(14,9,3,33,180000.00,0.00,5940000.00);
/*!40000 ALTER TABLE `chi_tiet_don` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_gio`
--

DROP TABLE IF EXISTS `chi_tiet_gio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chi_tiet_gio` (
  `maChiTietGio` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maGio` bigint(20) unsigned NOT NULL,
  `maSanPham` bigint(20) unsigned NOT NULL,
  `soLuong` int(10) unsigned NOT NULL,
  PRIMARY KEY (`maChiTietGio`),
  UNIQUE KEY `uk_gio_sp` (`maGio`,`maSanPham`),
  KEY `fk_chi_tiet_gio_maSanPham` (`maSanPham`),
  CONSTRAINT `fk_chi_tiet_gio_maGio` FOREIGN KEY (`maGio`) REFERENCES `gio_hang` (`maGio`) ON UPDATE CASCADE,
  CONSTRAINT `fk_chi_tiet_gio_maSanPham` FOREIGN KEY (`maSanPham`) REFERENCES `san_pham` (`maSanPham`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_gio`
--

LOCK TABLES `chi_tiet_gio` WRITE;
/*!40000 ALTER TABLE `chi_tiet_gio` DISABLE KEYS */;
INSERT INTO `chi_tiet_gio` VALUES (1,1,1,1),(2,1,2,1),(3,2,3,2);
/*!40000 ALTER TABLE `chi_tiet_gio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_gia`
--

DROP TABLE IF EXISTS `danh_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `danh_gia` (
  `maDanhGia` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maKhachHang` bigint(20) unsigned NOT NULL,
  `maSanPham` bigint(20) unsigned NOT NULL,
  `diem` tinyint(3) unsigned NOT NULL,
  `noiDung` text DEFAULT NULL,
  `trangThai` enum('CHO_DUYET','DA_DUYET','DA_AN') NOT NULL,
  `taoLuc` datetime NOT NULL,
  PRIMARY KEY (`maDanhGia`),
  KEY `fk_danh_gia_maKhachHang` (`maKhachHang`),
  KEY `fk_danh_gia_maSanPham` (`maSanPham`),
  CONSTRAINT `fk_danh_gia_maKhachHang` FOREIGN KEY (`maKhachHang`) REFERENCES `khach_hang` (`maKhachHang`) ON UPDATE CASCADE,
  CONSTRAINT `fk_danh_gia_maSanPham` FOREIGN KEY (`maSanPham`) REFERENCES `san_pham` (`maSanPham`) ON UPDATE CASCADE,
  CONSTRAINT `ck_danh_gia_diem` CHECK (`diem` between 1 and 5)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_gia`
--

LOCK TABLES `danh_gia` WRITE;
/*!40000 ALTER TABLE `danh_gia` DISABLE KEYS */;
INSERT INTO `danh_gia` VALUES (1,2,3,5,'Sữa rửa mặt dịu nhẹ, dùng rất thích.','DA_DUYET','2026-11-10 19:20:00'),(2,2,5,4,'Kem dưỡng ẩm tốt, chất kem dễ thoa.','DA_DUYET','2026-11-10 19:25:00');
/*!40000 ALTER TABLE `danh_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_muc`
--

DROP TABLE IF EXISTS `danh_muc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `danh_muc` (
  `maDanhMuc` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tenDanhMuc` varchar(150) NOT NULL,
  `moTa` text DEFAULT NULL,
  `dangHienThi` tinyint(1) NOT NULL,
  PRIMARY KEY (`maDanhMuc`),
  UNIQUE KEY `tenDanhMuc` (`tenDanhMuc`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_muc`
--

LOCK TABLES `danh_muc` WRITE;
/*!40000 ALTER TABLE `danh_muc` DISABLE KEYS */;
INSERT INTO `danh_muc` VALUES (1,'Chăm sóc da','Sản phẩm làm sạch, cấp ẩm và phục hồi da',1),(2,'Trang điểm','Sản phẩm trang điểm hằng ngày',1),(3,'Chống nắng','Kem chống nắng và sản phẩm bảo vệ da',1),(4,'Chăm sóc tóc','Sản phẩm chăm sóc tóc và da đầu',1),(5,'Thiên nhiên','Sản phẩm có thành phần thiên nhiên',1);
/*!40000 ALTER TABLE `danh_muc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_hang`
--

DROP TABLE IF EXISTS `don_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `don_hang` (
  `maDon` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maKhachHang` bigint(20) unsigned NOT NULL,
  `maGiamGia` bigint(20) unsigned DEFAULT NULL,
  `maNhanVienXuLy` bigint(20) unsigned DEFAULT NULL,
  `nguoiNhan` varchar(120) NOT NULL,
  `dienThoaiNhan` varchar(20) NOT NULL,
  `diaChiNhanLucDat` varchar(500) NOT NULL,
  `tongTienHang` decimal(14,2) NOT NULL,
  `tienGiam` decimal(14,2) NOT NULL,
  `phiVanChuyen` decimal(14,2) NOT NULL,
  `tongThanhToan` decimal(14,2) NOT NULL,
  `trangThai` enum('CHO_XAC_NHAN','DA_XAC_NHAN','DANG_CHUAN_BI','DANG_GIAO','DA_GIAO','DA_HUY') NOT NULL,
  `taoLuc` datetime NOT NULL,
  PRIMARY KEY (`maDon`),
  KEY `fk_don_hang_maKhachHang` (`maKhachHang`),
  KEY `fk_don_hang_maGiamGia` (`maGiamGia`),
  KEY `fk_don_hang_maNhanVienXuLy` (`maNhanVienXuLy`),
  CONSTRAINT `fk_don_hang_maGiamGia` FOREIGN KEY (`maGiamGia`) REFERENCES `ma_giam_gia` (`maGiamGia`) ON UPDATE CASCADE,
  CONSTRAINT `fk_don_hang_maKhachHang` FOREIGN KEY (`maKhachHang`) REFERENCES `khach_hang` (`maKhachHang`) ON UPDATE CASCADE,
  CONSTRAINT `fk_don_hang_maNhanVienXuLy` FOREIGN KEY (`maNhanVienXuLy`) REFERENCES `nhan_vien` (`maNhanVien`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_hang`
--

LOCK TABLES `don_hang` WRITE;
/*!40000 ALTER TABLE `don_hang` DISABLE KEYS */;
INSERT INTO `don_hang` VALUES (1,1,NULL,NULL,'Nguyễn Tuấn Anh','0901234567','Số 10 Nguyễn Du, Bắc Ninh',640000.00,0.00,0.00,640000.00,'DANG_GIAO','2026-11-16 09:42:00'),(2,2,1,1,'Trần Minh Anh','0912345678','25 Trần Phú, Hà Nội',500000.00,50000.00,0.00,450000.00,'DA_GIAO','2026-11-02 14:20:00'),(3,1,NULL,NULL,'Nguyễn Tuấn Anh','0901234567','Số 10 Nguyễn Du, Bắc Ninh, Hà Nội',580000.00,0.00,0.00,580000.00,'DA_HUY','2026-11-17 12:10:45'),(4,1,NULL,NULL,'Nguyễn Tuấn Anh','0901234567','Số 10 Nguyễn Du, Bắc Ninh, Hồ Chí Minh',1050000.00,0.00,0.00,1050000.00,'CHO_XAC_NHAN','2026-11-17 12:19:46'),(5,1,NULL,NULL,'Nguyễn Tuấn Anh','0901234567','Số 10 Nguyễn Du, Bắc Ninh, Hồ Chí Minh',290000.00,0.00,30000.00,320000.00,'DA_HUY','2026-11-17 12:20:28'),(6,1,NULL,NULL,'Nguyễn Tuấn Anh','0901234567','Số 10 Nguyễn Du, Bắc Ninh, Hà Nội',180000.00,0.00,30000.00,210000.00,'DA_GIAO','2026-11-17 13:01:46'),(7,1,2,NULL,'Nguyễn Tuấn Anh','0901234567','Số 10 Nguyễn Du, Bắc Ninh, Hà Nội',860000.00,86000.00,0.00,774000.00,'DANG_GIAO','2026-11-17 13:25:27'),(8,1,NULL,NULL,'Nguyễn Tuấn Anh','0901234567','Số 10 Nguyễn Du, Bắc Ninh, Hồ Chí Minh',350000.00,0.00,30000.00,380000.00,'DANG_GIAO','2026-11-17 13:32:18'),(9,1,NULL,NULL,'Nguyễn Tuấn Anh','0901234567','Số 10 Nguyễn Du, Bắc Ninh, Hà Nội',5940000.00,0.00,0.00,5940000.00,'CHO_XAC_NHAN','2026-11-17 13:34:02');
/*!40000 ALTER TABLE `don_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `giao_dich_thanh_toan`
--

DROP TABLE IF EXISTS `giao_dich_thanh_toan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `giao_dich_thanh_toan` (
  `maGiaoDich` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maDon` bigint(20) unsigned NOT NULL,
  `phuongThuc` enum('COD','ONLINE') NOT NULL,
  `congThanhToan` varchar(100) DEFAULT NULL,
  `maGiaoDichCong` varchar(150) DEFAULT NULL,
  `soTien` decimal(14,2) NOT NULL,
  `trangThai` enum('CHO_XU_LY','THANH_CONG','THAT_BAI','HOAN_TIEN') NOT NULL,
  `khoaXuLyMotLan` varchar(100) DEFAULT NULL,
  `taoLuc` datetime NOT NULL,
  PRIMARY KEY (`maGiaoDich`),
  UNIQUE KEY `khoaXuLyMotLan` (`khoaXuLyMotLan`),
  KEY `fk_giao_dich_thanh_toan_maDon` (`maDon`),
  CONSTRAINT `fk_giao_dich_thanh_toan_maDon` FOREIGN KEY (`maDon`) REFERENCES `don_hang` (`maDon`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giao_dich_thanh_toan`
--

LOCK TABLES `giao_dich_thanh_toan` WRITE;
/*!40000 ALTER TABLE `giao_dich_thanh_toan` DISABLE KEYS */;
INSERT INTO `giao_dich_thanh_toan` VALUES (1,1,'COD',NULL,NULL,640000.00,'CHO_XU_LY','ORDER-1-COD','2026-11-16 09:42:00'),(2,2,'COD',NULL,NULL,450000.00,'THANH_CONG','ORDER-2-COD','2026-11-02 14:20:00'),(3,3,'COD',NULL,NULL,580000.00,'HOAN_TIEN','ORDER-3-1794892245839','2026-11-17 12:10:45'),(4,4,'COD',NULL,NULL,1050000.00,'CHO_XU_LY','ORDER-4-1794892786979','2026-11-17 12:19:46'),(5,5,'COD',NULL,NULL,320000.00,'HOAN_TIEN','ORDER-5-1794892828018','2026-11-17 12:20:28'),(6,6,'COD',NULL,NULL,210000.00,'CHO_XU_LY','ORDER-6-1794895306129','2026-11-17 13:01:46'),(7,7,'COD',NULL,NULL,774000.00,'CHO_XU_LY','ORDER-7-1794896727668','2026-11-17 13:25:27'),(8,8,'COD',NULL,NULL,380000.00,'CHO_XU_LY','ORDER-8-1794897138847','2026-11-17 13:32:18'),(9,9,'COD',NULL,NULL,5940000.00,'CHO_XU_LY','ORDER-9-1794897242330','2026-11-17 13:34:02');
/*!40000 ALTER TABLE `giao_dich_thanh_toan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gio_hang`
--

DROP TABLE IF EXISTS `gio_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gio_hang` (
  `maGio` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maKhachHang` bigint(20) unsigned NOT NULL,
  `capNhatLuc` datetime NOT NULL,
  PRIMARY KEY (`maGio`),
  UNIQUE KEY `maKhachHang` (`maKhachHang`),
  CONSTRAINT `fk_gio_hang_maKhachHang` FOREIGN KEY (`maKhachHang`) REFERENCES `khach_hang` (`maKhachHang`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gio_hang`
--

LOCK TABLES `gio_hang` WRITE;
/*!40000 ALTER TABLE `gio_hang` DISABLE KEYS */;
INSERT INTO `gio_hang` VALUES (1,1,'2026-11-17 09:00:00'),(2,2,'2026-11-16 16:30:00');
/*!40000 ALTER TABLE `gio_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khach_hang`
--

DROP TABLE IF EXISTS `khach_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `khach_hang` (
  `maKhachHang` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maTaiKhoan` bigint(20) unsigned NOT NULL,
  `hoTen` varchar(120) NOT NULL,
  `dienThoai` varchar(20) DEFAULT NULL,
  `diaChiMacDinh` varchar(500) DEFAULT NULL,
  `loaiDa` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`maKhachHang`),
  UNIQUE KEY `maTaiKhoan` (`maTaiKhoan`),
  CONSTRAINT `fk_khach_hang_maTaiKhoan` FOREIGN KEY (`maTaiKhoan`) REFERENCES `tai_khoan` (`maTaiKhoan`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khach_hang`
--

LOCK TABLES `khach_hang` WRITE;
/*!40000 ALTER TABLE `khach_hang` DISABLE KEYS */;
INSERT INTO `khach_hang` VALUES (1,3,'Nguyễn Tuấn Anh','0901234567','Số 10 Nguyễn Du, Bắc Ninh','Da hỗn hợp'),(2,4,'Trần Minh Anh','0912345678','25 Trần Phú, Hà Nội','Da khô');
/*!40000 ALTER TABLE `khach_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ma_giam_gia`
--

DROP TABLE IF EXISTS `ma_giam_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ma_giam_gia` (
  `maGiamGia` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maCode` varchar(40) NOT NULL,
  `loaiGiam` enum('PERCENT','FIXED') NOT NULL,
  `mucGiam` decimal(14,2) NOT NULL,
  `giaTriToiThieu` decimal(14,2) NOT NULL,
  `gioiHanLuot` int(10) unsigned NOT NULL,
  `soLuotDaDung` int(10) unsigned NOT NULL,
  `batDau` datetime NOT NULL,
  `ketThuc` datetime NOT NULL,
  `kichHoat` tinyint(1) NOT NULL,
  PRIMARY KEY (`maGiamGia`),
  UNIQUE KEY `maCode` (`maCode`),
  CONSTRAINT `ck_khuyen_mai_ngay` CHECK (`batDau` < `ketThuc`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ma_giam_gia`
--

LOCK TABLES `ma_giam_gia` WRITE;
/*!40000 ALTER TABLE `ma_giam_gia` DISABLE KEYS */;
INSERT INTO `ma_giam_gia` VALUES (1,'WELCOME50','FIXED',50000.00,300000.00,1000,12,'2026-11-01 00:00:00','2026-12-31 23:59:59',1),(2,'BEAUTY10','PERCENT',10.00,500000.00,500,29,'2026-11-01 00:00:00','2026-11-30 23:59:59',1),(3,'ABCD','PERCENT',50000.00,300000.00,100,0,'0006-11-12 11:33:00','2026-11-12 13:02:00',1);
/*!40000 ALTER TABLE `ma_giam_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nguon_kien_thuc`
--

DROP TABLE IF EXISTS `nguon_kien_thuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nguon_kien_thuc` (
  `maNguon` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maSanPham` bigint(20) unsigned DEFAULT NULL,
  `loaiNguon` enum('SAN_PHAM','CHINH_SACH','BAI_VIET','FAQ') NOT NULL,
  `tieuDe` varchar(200) NOT NULL,
  `noiDung` text NOT NULL,
  `hieuLuc` tinyint(1) NOT NULL,
  `capNhatLuc` datetime NOT NULL,
  PRIMARY KEY (`maNguon`),
  KEY `fk_nguon_kien_thuc_maSanPham` (`maSanPham`),
  CONSTRAINT `fk_nguon_kien_thuc_maSanPham` FOREIGN KEY (`maSanPham`) REFERENCES `san_pham` (`maSanPham`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguon_kien_thuc`
--

LOCK TABLES `nguon_kien_thuc` WRITE;
/*!40000 ALTER TABLE `nguon_kien_thuc` DISABLE KEYS */;
INSERT INTO `nguon_kien_thuc` VALUES (1,1,'SAN_PHAM','Glow Reset Serum - công dụng','Serum hỗ trợ cấp ẩm và làm sáng da, phù hợp da hỗn hợp và da khô.',1,'2026-11-01 09:00:00'),(2,2,'SAN_PHAM','Cloud Veil SPF 50+ - hướng dẫn','Thoa lại sau mỗi 2 giờ khi hoạt động ngoài trời hoặc đổ mồ hôi.',1,'2026-11-01 09:10:00'),(3,NULL,'FAQ','Chính sách đổi trả','Sản phẩm lỗi do vận chuyển được hỗ trợ đổi trả trong vòng 7 ngày.',1,'2026-11-01 10:00:00');
/*!40000 ALTER TABLE `nguon_kien_thuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nhan_vien` (
  `maNhanVien` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maTaiKhoan` bigint(20) unsigned NOT NULL,
  `hoTen` varchar(120) NOT NULL,
  `chucVu` varchar(80) DEFAULT NULL,
  `dangLamViec` tinyint(1) NOT NULL,
  PRIMARY KEY (`maNhanVien`),
  UNIQUE KEY `maTaiKhoan` (`maTaiKhoan`),
  CONSTRAINT `fk_nhan_vien_maTaiKhoan` FOREIGN KEY (`maTaiKhoan`) REFERENCES `tai_khoan` (`maTaiKhoan`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien`
--

LOCK TABLES `nhan_vien` WRITE;
/*!40000 ALTER TABLE `nhan_vien` DISABLE KEYS */;
INSERT INTO `nhan_vien` VALUES (1,2,'Lê Thu Hà','Nhân viên tư vấn',1);
/*!40000 ALTER TABLE `nhan_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phien_tu_van`
--

DROP TABLE IF EXISTS `phien_tu_van`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phien_tu_van` (
  `maPhien` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maKhachHang` bigint(20) unsigned DEFAULT NULL,
  `loaiDa` varchar(40) DEFAULT NULL,
  `nganSach` decimal(14,2) DEFAULT NULL,
  `thanhPhanCanTranh` text DEFAULT NULL,
  `batDau` datetime NOT NULL,
  `ketThuc` datetime DEFAULT NULL,
  PRIMARY KEY (`maPhien`),
  KEY `fk_phien_tu_van_maKhachHang` (`maKhachHang`),
  CONSTRAINT `fk_phien_tu_van_maKhachHang` FOREIGN KEY (`maKhachHang`) REFERENCES `khach_hang` (`maKhachHang`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phien_tu_van`
--

LOCK TABLES `phien_tu_van` WRITE;
/*!40000 ALTER TABLE `phien_tu_van` DISABLE KEYS */;
INSERT INTO `phien_tu_van` VALUES (1,1,'Da hỗn hợp',400000.00,'Hương liệu mạnh','2026-11-17 08:50:00',NULL);
/*!40000 ALTER TABLE `phien_tu_van` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `san_pham`
--

DROP TABLE IF EXISTS `san_pham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `san_pham` (
  `maSanPham` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maDanhMuc` bigint(20) unsigned NOT NULL,
  `tenSanPham` varchar(255) NOT NULL,
  `giaBan` decimal(14,2) NOT NULL,
  `thanhPhan` text DEFAULT NULL,
  `congDung` text DEFAULT NULL,
  `cachSuDung` text DEFAULT NULL,
  `anhDaiDien` varchar(500) DEFAULT NULL,
  `anhHover` varchar(500) DEFAULT NULL,
  `trangThai` enum('DANG_BAN','DA_AN') NOT NULL,
  `taoLuc` datetime NOT NULL,
  PRIMARY KEY (`maSanPham`),
  KEY `fk_san_pham_maDanhMuc` (`maDanhMuc`),
  CONSTRAINT `fk_san_pham_maDanhMuc` FOREIGN KEY (`maDanhMuc`) REFERENCES `danh_muc` (`maDanhMuc`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `san_pham`
--

LOCK TABLES `san_pham` WRITE;
/*!40000 ALTER TABLE `san_pham` DISABLE KEYS */;
INSERT INTO `san_pham` VALUES (1,1,'Moonseal Moonlight Aurora Toner',350000.00,'Xem thành phần trên bao bì sản phẩm.','Moonseal Moonlight Aurora Toner','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/1-0.jpg','/uploads/products/retailer-1795699181669/1-1.jpg','DANG_BAN','2026-11-01 09:00:00'),(2,3,'Mixsoon Bean Sunscreen SPF 50',290000.00,'Xem thành phần trên bao bì sản phẩm.','Mixsoon Bean Sunscreen SPF 50','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/2-0.jpg','/uploads/products/retailer-1795699181669/2-1.jpg','DANG_BAN','2026-11-01 09:10:00'),(3,1,'Moonseal Moonlight Aurora Serum',180000.00,'Xem thành phần trên bao bì sản phẩm.','Moonseal Moonlight Aurora Serum','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/3-0.jpg','/uploads/products/retailer-1795699181669/3-1.jpg','DANG_BAN','2026-11-01 09:20:00'),(4,2,'Quietone Glam Gigantic Mascara',220000.00,'Xem thành phần trên bao bì sản phẩm.','Quietone Glam Gigantic Mascara','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/4-0.jpg','/uploads/products/retailer-1795699181669/4-1.jpg','DANG_BAN','2026-11-01 09:30:00'),(5,1,'Bephor Braid Rev Scalp Cleansing Toner',320000.00,'Xem thành phần trên bao bì sản phẩm.','Bephor Braid Rev Scalp Cleansing Toner','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/5-0.jpg','/uploads/products/retailer-1795699181669/5-1.jpg','DANG_BAN','2026-11-01 09:40:00'),(6,4,'Pyunkang Yul Shampoo Dancheong',320000.00,'Xem thành phần trên bao bì sản phẩm.','Pyunkang Yul Shampoo Dancheong','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/6-0.jpg','/uploads/products/retailer-1795699181669/6-1.jpg','DANG_BAN','2026-11-17 13:07:38'),(7,5,'Coconut Lime Nourishing Body Cream',285000.00,'Xem thành phần trên bao bì sản phẩm.','Coconut Lime Nourishing Body Cream','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/7-0.jpg','/uploads/products/retailer-1795699181669/7-1.jpg','DANG_BAN','2026-11-26 17:59:22'),(8,1,'Umbraphil Rice PDRN Skin Booster Essence',250000.00,'Xem thành phần trên bao bì sản phẩm.','Umbraphil Rice PDRN Skin Booster Essence','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/8-0.jpg','/uploads/products/retailer-1795699181669/8-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(9,1,'Teluris Rose Bubble Toner + Free Gift',250000.00,'Xem thành phần trên bao bì sản phẩm.','Teluris Rose Bubble Toner + Free Gift','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/9-0.jpg','/uploads/products/retailer-1795699181669/9-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(10,1,'Teluris Pore Perfecting Toner + Free Gift',250000.00,'Xem thành phần trên bao bì sản phẩm.','Teluris Pore Perfecting Toner + Free Gift','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/10-0.jpg','/uploads/products/retailer-1795699181669/10-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(11,1,'Teluris Hydro Purification Foam Cleanser + Free Gift',250000.00,'Xem thành phần trên bao bì sản phẩm.','Teluris Hydro Purification Foam Cleanser + Free Gift','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/11-0.jpg','/uploads/products/retailer-1795699181669/11-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(12,1,'Teluris Glow Plump Serum + Free Gift',250000.00,'Xem thành phần trên bao bì sản phẩm.','Teluris Glow Plump Serum + Free Gift','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/12-0.jpg','/uploads/products/retailer-1795699181669/12-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(13,1,'Umbraphil Mugwort PDRN Pore Perfecting Serum',250000.00,'Xem thành phần trên bao bì sản phẩm.','Umbraphil Mugwort PDRN Pore Perfecting Serum','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/13-0.jpg','/uploads/products/retailer-1795699181669/13-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(14,1,'Umbraphil Mugwort Skin Prep Glow Serum',250000.00,'Xem thành phần trên bao bì sản phẩm.','Umbraphil Mugwort Skin Prep Glow Serum','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/14-0.jpg','/uploads/products/retailer-1795699181669/14-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(15,2,'Quietone Expandable Edge Mascara',250000.00,'Xem thành phần trên bao bì sản phẩm.','Quietone Expandable Edge Mascara','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/15-0.jpg','/uploads/products/retailer-1795699181669/15-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(16,2,'Heimish Dailism Smudge Stop Mascara',250000.00,'Xem thành phần trên bao bì sản phẩm.','Heimish Dailism Smudge Stop Mascara','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/16-0.jpg','/uploads/products/retailer-1795699181669/16-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(17,2,'Limitless Mascara',250000.00,'Xem thành phần trên bao bì sản phẩm.','Limitless Mascara','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/17-0.jpg','/uploads/products/retailer-1795699181669/17-0.jpg','DANG_BAN','2026-11-26 20:06:10'),(18,2,'Fruit Pigmented® Cocoa Butter Matte Lipstick',250000.00,'Xem thành phần trên bao bì sản phẩm.','Fruit Pigmented® Cocoa Butter Matte Lipstick','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/18-0.jpg','/uploads/products/retailer-1795699181669/18-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(19,2,'Fruit Pigmented Full Coverage Water to Powder Foundation',250000.00,'Xem thành phần trên bao bì sản phẩm.','Fruit Pigmented Full Coverage Water to Powder Foundation','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/19-0.jpg','/uploads/products/retailer-1795699181669/19-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(20,2,'Cruelty Free Eye Liner Brush #6',250000.00,'Xem thành phần trên bao bì sản phẩm.','Cruelty Free Eye Liner Brush #6','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/20-0.jpg','/uploads/products/retailer-1795699181669/20-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(21,2,'Fruit Pigmented® Lip Gloss',250000.00,'Xem thành phần trên bao bì sản phẩm.','Fruit Pigmented® Lip Gloss','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/21-0.jpg','/uploads/products/retailer-1795699181669/21-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(22,2,'Fruit Pigmented® Eye Shadow',250000.00,'Xem thành phần trên bao bì sản phẩm.','Fruit Pigmented® Eye Shadow','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/22-0.jpg','/uploads/products/retailer-1795699181669/22-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(23,3,'Purito Sun Day Adventure Sunscreen',250000.00,'Xem thành phần trên bao bì sản phẩm.','Purito Sun Day Adventure Sunscreen','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/23-0.jpg','/uploads/products/retailer-1795699181669/23-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(24,3,'Goodal Green Tangerine Vita C Dark Spot UV Defense Sunscreen',250000.00,'Xem thành phần trên bao bì sản phẩm.','Goodal Green Tangerine Vita C Dark Spot UV Defense Sunscreen','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/24-0.jpg','/uploads/products/retailer-1795699181669/24-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(25,3,'Melixir Airfit Invisible Sunscreen',250000.00,'Xem thành phần trên bao bì sản phẩm.','Melixir Airfit Invisible Sunscreen','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/25-0.jpg','/uploads/products/retailer-1795699181669/25-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(26,3,'Dr. Ceuracle Hydra Barrier Sunscreen',250000.00,'Xem thành phần trên bao bì sản phẩm.','Dr. Ceuracle Hydra Barrier Sunscreen','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/26-0.jpg','/uploads/products/retailer-1795699181669/26-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(27,3,'Tocobo Cotton Airy Sun Stick',250000.00,'Xem thành phần trên bao bì sản phẩm.','Tocobo Cotton Airy Sun Stick','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/27-0.jpg','/uploads/products/retailer-1795699181669/27-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(28,3,'Heimish RX Hyaluronic Acid Hydrating Sunscreen',250000.00,'Xem thành phần trên bao bì sản phẩm.','Heimish RX Hyaluronic Acid Hydrating Sunscreen','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/28-0.jpg','/uploads/products/retailer-1795699181669/28-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(29,3,'Green Tea SPF 30',250000.00,'Xem thành phần trên bao bì sản phẩm.','Green Tea SPF 30','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/29-0.jpg','/uploads/products/retailer-1795699181669/29-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(30,3,'Day-Light Protection Airy Sunscreen',250000.00,'Xem thành phần trên bao bì sản phẩm.','Day-Light Protection Airy Sunscreen','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/30-0.jpg','/uploads/products/retailer-1795699181669/30-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(31,4,'Pyunkang Yul Treatment Dancheong Hair Conditioner',250000.00,'Xem thành phần trên bao bì sản phẩm.','Pyunkang Yul Treatment Dancheong Hair Conditioner','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/31-0.jpg','/uploads/products/retailer-1795699181669/31-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(32,4,'Contently After All! Sleek Conditioner',250000.00,'Xem thành phần trên bao bì sản phẩm.','Contently After All! Sleek Conditioner','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/32-0.jpg','/uploads/products/retailer-1795699181669/32-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(33,4,'Contently After All! Revitalizing Shampoo',250000.00,'Xem thành phần trên bao bì sản phẩm.','Contently After All! Revitalizing Shampoo','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/33-0.jpg','/uploads/products/retailer-1795699181669/33-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(34,4,'107 Scalp Cooling Breeze Shampoo',250000.00,'Xem thành phần trên bao bì sản phẩm.','107 Scalp Cooling Breeze Shampoo','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/34-0.jpg','/uploads/products/retailer-1795699181669/34-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(35,4,'107 Scalp Purifying Microbiome Shampoo',250000.00,'Xem thành phần trên bao bì sản phẩm.','107 Scalp Purifying Microbiome Shampoo','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/35-0.jpg','/uploads/products/retailer-1795699181669/35-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(36,4,'Urang Daily Oil Control Shampoo Bar',250000.00,'Xem thành phần trên bao bì sản phẩm.','Urang Daily Oil Control Shampoo Bar','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/36-0.jpg','/uploads/products/retailer-1795699181669/36-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(37,4,'Glossy Locks Sour Cherry Clarifying Shampoo',250000.00,'Xem thành phần trên bao bì sản phẩm.','Glossy Locks Sour Cherry Clarifying Shampoo','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/37-0.jpg','/uploads/products/retailer-1795699181669/37-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(38,4,'Multi-Vitamin Healthy Hair Leave-In Conditioner',250000.00,'Xem thành phần trên bao bì sản phẩm.','Multi-Vitamin Healthy Hair Leave-In Conditioner','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/38-0.jpg','/uploads/products/retailer-1795699181669/38-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(39,5,'Vanilla Bean Shower Gel & Body Cream',250000.00,'Xem thành phần trên bao bì sản phẩm.','Vanilla Bean Shower Gel & Body Cream','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/39-0.jpg','/uploads/products/retailer-1795699181669/39-0.jpg','DANG_BAN','2026-11-26 20:06:10'),(40,5,'Mangosteen Shower Gel',250000.00,'Xem thành phần trên bao bì sản phẩm.','Mangosteen Shower Gel','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/40-0.jpg','/uploads/products/retailer-1795699181669/40-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(41,5,'Pink Grapefruit Shower Gel',250000.00,'Xem thành phần trên bao bì sản phẩm.','Pink Grapefruit Shower Gel','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/41-0.jpg','/uploads/products/retailer-1795699181669/41-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(42,5,'Honey Almond Shower Gel',250000.00,'Xem thành phần trên bao bì sản phẩm.','Honey Almond Shower Gel','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/42-0.jpg','/uploads/products/retailer-1795699181669/42-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(43,5,'Eucalyptus Shower Gel',250000.00,'Xem thành phần trên bao bì sản phẩm.','Eucalyptus Shower Gel','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/43-0.jpg','/uploads/products/retailer-1795699181669/43-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(44,5,'Blood Orange Shower Gel',250000.00,'Xem thành phần trên bao bì sản phẩm.','Blood Orange Shower Gel','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/44-0.jpg','/uploads/products/retailer-1795699181669/44-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(45,5,'Vanilla Bean Shower Gel',250000.00,'Xem thành phần trên bao bì sản phẩm.','Vanilla Bean Shower Gel','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/45-0.jpg','/uploads/products/retailer-1795699181669/45-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(46,5,'Coconut Shower Gel',250000.00,'Xem thành phần trên bao bì sản phẩm.','Coconut Shower Gel','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/46-0.jpg','/uploads/products/retailer-1795699181669/46-1.jpg','DANG_BAN','2026-11-26 20:06:10'),(47,2,'Fruit Pigmented® Pomegranate Oil Moisturizing Lipstick',250000.00,'Xem thành phần trên bao bì sản phẩm.','Fruit Pigmented® Pomegranate Oil Moisturizing Lipstick','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/47-0.jpg','/uploads/products/retailer-1795699181669/47-1.jpg','DANG_BAN','2026-11-26 20:06:29'),(48,3,'Airy Stick Sunscreen',250000.00,'Xem thành phần trên bao bì sản phẩm.','Airy Stick Sunscreen','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/48-0.jpg','/uploads/products/retailer-1795699181669/48-1.jpg','DANG_BAN','2026-11-26 20:06:29'),(49,4,'Multi-Vitamin Healthy Hair Shampoo',250000.00,'Xem thành phần trên bao bì sản phẩm.','Multi-Vitamin Healthy Hair Shampoo','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/49-0.jpg','/uploads/products/retailer-1795699181669/49-1.jpg','DANG_BAN','2026-11-26 20:06:29'),(50,5,'French Lavender Shower Gel',250000.00,'Xem thành phần trên bao bì sản phẩm.','French Lavender Shower Gel','Sử dụng theo hướng dẫn trên bao bì.','/uploads/products/retailer-1795699181669/50-0.jpg','/uploads/products/retailer-1795699181669/50-1.jpg','DANG_BAN','2026-11-26 20:06:29');
/*!40000 ALTER TABLE `san_pham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tai_khoan`
--

DROP TABLE IF EXISTS `tai_khoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tai_khoan` (
  `maTaiKhoan` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `matKhauBam` varchar(255) NOT NULL,
  `vaiTro` enum('KHACH_HANG','NHAN_VIEN','QUAN_TRI') NOT NULL,
  `trangThai` enum('HOAT_DONG','KHOA') NOT NULL,
  `taoLuc` datetime NOT NULL,
  PRIMARY KEY (`maTaiKhoan`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tai_khoan`
--

LOCK TABLES `tai_khoan` WRITE;
/*!40000 ALTER TABLE `tai_khoan` DISABLE KEYS */;
INSERT INTO `tai_khoan` VALUES (1,'admin@mypham-ai.vn','$2b$10$7sKeId0CaqtxiJzFriP8YeWGHBbbaLCrlNCQYHNdDFjur2e0rteUa','QUAN_TRI','HOAT_DONG','2026-11-01 08:00:00'),(2,'nhanvien@mypham-ai.vn','$2b$10$7sKeId0CaqtxiJzFriP8YeWGHBbbaLCrlNCQYHNdDFjur2e0rteUa','NHAN_VIEN','HOAT_DONG','2026-11-02 08:00:00'),(3,'tuananh@example.com','$2b$10$7sKeId0CaqtxiJzFriP8YeWGHBbbaLCrlNCQYHNdDFjur2e0rteUa','KHACH_HANG','HOAT_DONG','2026-11-03 09:15:00'),(4,'minhanh@example.com','$2b$10$7sKeId0CaqtxiJzFriP8YeWGHBbbaLCrlNCQYHNdDFjur2e0rteUa','KHACH_HANG','HOAT_DONG','2026-11-04 10:20:00');
/*!40000 ALTER TABLE `tai_khoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tin_nhan_tu_van`
--

DROP TABLE IF EXISTS `tin_nhan_tu_van`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tin_nhan_tu_van` (
  `maTinNhan` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maPhien` bigint(20) unsigned NOT NULL,
  `maNguon` bigint(20) unsigned DEFAULT NULL,
  `vaiTroGui` enum('KHACH_HANG','AI','NHAN_VIEN') NOT NULL,
  `noiDung` text NOT NULL,
  `taoLuc` datetime NOT NULL,
  PRIMARY KEY (`maTinNhan`),
  KEY `fk_tin_nhan_tu_van_maPhien` (`maPhien`),
  KEY `fk_tin_nhan_tu_van_maNguon` (`maNguon`),
  CONSTRAINT `fk_tin_nhan_tu_van_maNguon` FOREIGN KEY (`maNguon`) REFERENCES `nguon_kien_thuc` (`maNguon`) ON UPDATE CASCADE,
  CONSTRAINT `fk_tin_nhan_tu_van_maPhien` FOREIGN KEY (`maPhien`) REFERENCES `phien_tu_van` (`maPhien`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tin_nhan_tu_van`
--

LOCK TABLES `tin_nhan_tu_van` WRITE;
/*!40000 ALTER TABLE `tin_nhan_tu_van` DISABLE KEYS */;
INSERT INTO `tin_nhan_tu_van` VALUES (1,1,NULL,'KHACH_HANG','Da hỗn hợp, ngân sách khoảng 400.000đ thì nên dùng serum nào?','2026-11-17 08:50:00'),(2,1,1,'AI','Bạn có thể tham khảo Glow Reset Serum vì sản phẩm hỗ trợ cấp ẩm và có giá 350.000đ.','2026-11-17 08:50:05');
/*!40000 ALTER TABLE `tin_nhan_tu_van` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ton_kho`
--

DROP TABLE IF EXISTS `ton_kho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ton_kho` (
  `maSanPham` bigint(20) unsigned NOT NULL,
  `soLuongThucTe` int(10) unsigned NOT NULL,
  `soLuongGiu` int(10) unsigned NOT NULL,
  `nguongCanhBao` int(10) unsigned NOT NULL,
  `capNhatLuc` datetime NOT NULL,
  PRIMARY KEY (`maSanPham`),
  CONSTRAINT `fk_ton_kho_maSanPham` FOREIGN KEY (`maSanPham`) REFERENCES `san_pham` (`maSanPham`) ON UPDATE CASCADE,
  CONSTRAINT `ck_ton_kho` CHECK (`soLuongGiu` <= `soLuongThucTe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ton_kho`
--

LOCK TABLES `ton_kho` WRITE;
/*!40000 ALTER TABLE `ton_kho` DISABLE KEYS */;
INSERT INTO `ton_kho` VALUES (1,42,6,10,'2026-11-17 13:32:18'),(2,28,2,8,'2026-11-17 13:25:27'),(3,34,33,10,'2026-11-17 13:34:02'),(4,19,1,8,'2026-11-17 13:25:27'),(5,16,0,8,'2026-11-17 11:35:25'),(6,104,0,5,'2026-11-17 13:07:38'),(7,10,0,5,'2026-11-26 17:59:22'),(8,20,0,5,'2026-11-26 20:06:10'),(9,20,0,5,'2026-11-26 20:06:10'),(10,20,0,5,'2026-11-26 20:06:10'),(11,20,0,5,'2026-11-26 20:06:10'),(12,20,0,5,'2026-11-26 20:06:10'),(13,20,0,5,'2026-11-26 20:06:10'),(14,20,0,5,'2026-11-26 20:06:10'),(15,20,0,5,'2026-11-26 20:06:10'),(16,20,0,5,'2026-11-26 20:06:10'),(17,20,0,5,'2026-11-26 20:06:10'),(18,20,0,5,'2026-11-26 20:06:10'),(19,20,0,5,'2026-11-26 20:06:10'),(20,20,0,5,'2026-11-26 20:06:10'),(21,20,0,5,'2026-11-26 20:06:10'),(22,20,0,5,'2026-11-26 20:06:10'),(23,20,0,5,'2026-11-26 20:06:10'),(24,20,0,5,'2026-11-26 20:06:10'),(25,20,0,5,'2026-11-26 20:06:10'),(26,20,0,5,'2026-11-26 20:06:10'),(27,20,0,5,'2026-11-26 20:06:10'),(28,20,0,5,'2026-11-26 20:06:10'),(29,20,0,5,'2026-11-26 20:06:10'),(30,20,0,5,'2026-11-26 20:06:10'),(31,20,0,5,'2026-11-26 20:06:10'),(32,20,0,5,'2026-11-26 20:06:10'),(33,20,0,5,'2026-11-26 20:06:10'),(34,20,0,5,'2026-11-26 20:06:10'),(35,20,0,5,'2026-11-26 20:06:10'),(36,20,0,5,'2026-11-26 20:06:10'),(37,20,0,5,'2026-11-26 20:06:10'),(38,20,0,5,'2026-11-26 20:06:10'),(39,20,0,5,'2026-11-26 20:06:10'),(40,20,0,5,'2026-11-26 20:06:10'),(41,20,0,5,'2026-11-26 20:06:10'),(42,20,0,5,'2026-11-26 20:06:10'),(43,20,0,5,'2026-11-26 20:06:10'),(44,20,0,5,'2026-11-26 20:06:10'),(45,20,0,5,'2026-11-26 20:06:10'),(46,20,0,5,'2026-11-26 20:06:10'),(47,20,0,5,'2026-11-26 20:06:29'),(48,20,0,5,'2026-11-26 20:06:29'),(49,20,0,5,'2026-11-26 20:06:29'),(50,20,0,5,'2026-11-26 20:06:29');
/*!40000 ALTER TABLE `ton_kho` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yeu_cau_ho_tro`
--

DROP TABLE IF EXISTS `yeu_cau_ho_tro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `yeu_cau_ho_tro` (
  `maYeuCau` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `maKhachHang` bigint(20) unsigned NOT NULL,
  `maNhanVien` bigint(20) unsigned DEFAULT NULL,
  `maDon` bigint(20) unsigned DEFAULT NULL,
  `loaiYeuCau` enum('HO_TRO','HUY_DON','DOI_TRA') NOT NULL,
  `noiDung` text NOT NULL,
  `phanHoi` text DEFAULT NULL,
  `trangThai` enum('MOI','DANG_XU_LY','DA_GIAI_QUYET','TU_CHOI') NOT NULL,
  `taoLuc` datetime NOT NULL,
  PRIMARY KEY (`maYeuCau`),
  KEY `fk_yeu_cau_ho_tro_maKhachHang` (`maKhachHang`),
  KEY `fk_yeu_cau_ho_tro_maNhanVien` (`maNhanVien`),
  KEY `fk_yeu_cau_ho_tro_maDon` (`maDon`),
  CONSTRAINT `fk_yeu_cau_ho_tro_maDon` FOREIGN KEY (`maDon`) REFERENCES `don_hang` (`maDon`) ON UPDATE CASCADE,
  CONSTRAINT `fk_yeu_cau_ho_tro_maKhachHang` FOREIGN KEY (`maKhachHang`) REFERENCES `khach_hang` (`maKhachHang`) ON UPDATE CASCADE,
  CONSTRAINT `fk_yeu_cau_ho_tro_maNhanVien` FOREIGN KEY (`maNhanVien`) REFERENCES `nhan_vien` (`maNhanVien`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yeu_cau_ho_tro`
--

LOCK TABLES `yeu_cau_ho_tro` WRITE;
/*!40000 ALTER TABLE `yeu_cau_ho_tro` DISABLE KEYS */;
INSERT INTO `yeu_cau_ho_tro` VALUES (1,1,1,1,'HO_TRO','Xin hỏi đơn hàng dự kiến giao ngày nào?','Đơn hàng đang được chuẩn bị và dự kiến giao trong 2-3 ngày.','DA_GIAI_QUYET','2026-11-16 10:10:00'),(2,2,NULL,2,'DOI_TRA','Sản phẩm bị móp vỏ hộp khi nhận hàng.',NULL,'MOI','2026-11-17 08:40:00');
/*!40000 ALTER TABLE `yeu_cau_ho_tro` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-26 21:40:39

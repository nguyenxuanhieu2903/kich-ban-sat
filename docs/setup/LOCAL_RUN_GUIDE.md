# Hướng Dẫn Chạy Cục Bộ (Local Run Guide)

**Dự án:** Kịch Bản Sát  
**Môi trường:** Windows Native

---

## 1. Khởi Động Backend (Spring Boot)

### 1.1. Chuẩn bị biến môi trường (Tùy chọn)
Mặc định profile `local` (`application-local.yml`) đã được cấu hình các giá trị mặc định an toàn cho máy phát triển cá nhân:
- Port: `8080`
- JDBC URL: `jdbc:postgresql://localhost:5432/kichbansat_db`
- Username: `kichbansat_app`
- Password: `kichbansat_secret`

Nếu máy của bạn có cấu hình database khác, có thể ghi đè bằng cách set biến môi trường trước khi chạy:
```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/kichbansat_db"
$env:SPRING_DATASOURCE_USERNAME="kichbansat_app"
$env:SPRING_DATASOURCE_PASSWORD="your_password"
```

### 1.2. Biên dịch và Chạy Backend
Mở terminal tại thư mục `backend/`:

```powershell
cd backend

# Cách 1: Sử dụng Maven lệnh trực tiếp
mvn spring-boot:run

# Cách 2: Sử dụng đường dẫn Maven IntelliJ nếu chưa gán PATH
& "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.3\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" spring-boot:run
```

### 1.3. Kiểm tra trạng thái Backend
Sau khi ứng dụng khởi động thành công (thông thường hiển thị `Started KichBanSatApplication in X seconds`):
- Health check Actuator: Mở trình duyệt truy cập `http://localhost:8080/actuator/health` -> Nhận kết quả `{"status":"UP"}`.
- API Health check: Truy cập `http://localhost:8080/api/v1/health` -> Nhận kết quả `ApiResponse` với trạng thái `UP`.

---

## 2. Khởi Động Frontend (Next.js)

### 2.1. Cài đặt Dependencies
Mở terminal tại thư mục `frontend/`:

```powershell
cd frontend

# Cài đặt các gói thư viện
cmd /c npm install
```

### 2.2. Chạy Dev Server
```powershell
cmd /c npm run dev
```
Trình duyệt sẽ sẵn sàng phục vụ tại: `http://localhost:3000`.

---

## 3. Quy Trình Kiểm Thử & Đóng Gói (Build & Test Commands)

Trước khi commit mã nguồn lên Git, bắt buộc phải chạy bộ lệnh kiểm tra này:

### 3.1. Kiểm tra Backend
```powershell
cd backend
mvn clean test
mvn clean package -DskipTests=false
```

### 3.2. Kiểm tra Frontend
```powershell
cd frontend
# 1. Kiểm tra lỗi kiểu dữ liệu TypeScript (Strict mode)
cmd /c npm run typecheck

# 2. Kiểm tra quy chuẩn mã nguồn ESLint
cmd /c npm run lint

# 3. Biên dịch Production Build
cmd /c npm run build
```

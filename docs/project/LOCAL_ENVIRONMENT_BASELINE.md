# Môi Trường Cơ Sở Phát Triển Local (Local Environment Baseline)

**Dự án:** Kịch Bản Sát  
**Hệ điều hành:** Windows Native (x64)  
**Ngày cập nhật:** 15/11/2026

---

## 1. Thông số Công cụ và Phiên bản Chuẩn (Toolchain Baseline)

Tất cả các thành viên trong nhóm phát triển Kịch Bản Sát cần đảm bảo máy trạm local đáp ứng hoặc tương thích với các thông số cơ sở dưới đây:

| Phần mềm | Phiên bản cơ sở | Vị trí cài đặt khuyến nghị / thực tế | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Java JDK** | 21.0.12.1 LTS | `C:\Program Files\Java\jdk-21.0.12.1` | Biên dịch và chạy Backend Spring Boot 3.x |
| **Maven** | 3.9.16+ | `C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.3\plugins\maven-plugin\lib\maven3` hoặc Maven độc lập | Quản lý vòng đời build Backend |
| **Node.js** | v24.22.1 LTS | `C:\Program Files\nodejs\` | Runtime môi trường Frontend |
| **npm** | 11.19.1+ | `C:\Program Files\nodejs\npm.cmd` | Trình quản lý package Frontend |
| **PostgreSQL** | 18.6 x64 | `C:\Program Files\PostgreSQL\18\` | Hệ quản trị cơ sở dữ liệu quan hệ |
| **Git** | 2.52.0+ | `C:\Program Files\Git\` | Quản lý phiên bản mã nguồn phân tán |

---

## 2. Quy hoạch Cổng Mạng (Port Allocation)

Để tránh xung đột cổng khi chạy đồng thời các dịch vụ trên môi trường Windows Native:

- **Frontend (Next.js):** Cổng `3000` (`http://localhost:3000`)
- **Backend (Spring Boot):** Cổng `8080` (`http://localhost:8080`)
- **Actuator Health Endpoint:** `http://localhost:8080/actuator/health`
- **Database (PostgreSQL):** Cổng `5432` (`localhost:5432`)

---

## 3. Biến Môi Trường Cơ Sở (Environment Variables)

Hệ thống hỗ trợ cấu hình thông qua các biến môi trường hệ thống hoặc file cấu hình cục bộ không commit (`.env` cho frontend và runtime env cho backend):

### 3.1. Backend Variables
```bash
# Cấu hình Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/kichbansat_db
SPRING_DATASOURCE_USERNAME=kichbansat_app
SPRING_DATASOURCE_PASSWORD=kichbansat_secret

# Cấu hình Spring Profile
SPRING_PROFILES_ACTIVE=local

# Cấu hình Server & Bảo mật
SERVER_PORT=8080
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 3.2. Frontend Variables
```bash
# Kết nối Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

---

## 4. Lệnh Kiểm tra Nhanh Tình Trạng Môi Trường (Health Check Commands)

Khi khởi động máy tính hoặc clone dự án về máy mới, chạy các lệnh sau để đảm bảo môi trường sẵn sàng:

```powershell
# 1. Kiểm tra Git
git --version

# 2. Kiểm tra Java (Bắt buộc Java 21)
java -version

# 3. Kiểm tra Maven
mvn -version   # Hoặc dùng đường dẫn mvn.cmd / mvnw.cmd

# 4. Kiểm tra Node & npm
node -v
cmd /c npm -v

# 5. Kiểm tra Service PostgreSQL
Get-Service -Name "*postgres*"
```

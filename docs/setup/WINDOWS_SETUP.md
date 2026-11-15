# Hướng Dẫn Cài Đặt Môi Trường Windows Native (Windows Setup Guide)

**Dự án:** Kịch Bản Sát  
**Môi trường:** Windows Native (Không dùng Docker/WSL cho dự án này)

---

## 1. Yêu Cầu Phần Mềm Cần Thiết

1. **Java Development Kit (JDK 21 LTS):** Khuyến nghị Oracle JDK 21 hoặc Eclipse Temurin 21.
2. **Apache Maven (3.9.x+):** Bộ công cụ build Backend Java.
3. **Node.js (LTS v20+ hoặc v24+):** Runtime chạy Next.js.
4. **PostgreSQL (16+ hoặc 18+):** Hệ quản trị cơ sở dữ liệu quan hệ.
5. **Git for Windows (2.40+):** Quản lý phiên bản mã nguồn.

---

## 2. Các Bước Cài Đặt và Cấu Hình Chi Tiết

### 2.1. Cấu hình Java 21
1. Tải và cài đặt JDK 21 từ trang chủ Oracle hoặc Adoptium.
2. Thiết lập biến môi trường hệ thống:
   - `JAVA_HOME`: `C:\Program Files\Java\jdk-21.0.12.1`
   - Bổ sung vào `PATH`: `%JAVA_HOME%\bin`
3. Kiểm tra bằng PowerShell:
   ```powershell
   java -version
   ```
   *Kết quả mong đợi:* Hiển thị `java version "21.x.x"`.

### 2.2. Cấu hình Apache Maven
1. Nếu sử dụng IntelliJ IDEA, Maven đã có sẵn tại:  
   `C:\Program Files\JetBrains\IntelliJ IDEA <version>\plugins\maven-plugin\lib\maven3`
2. Hoặc tải Maven bản binary zip từ `maven.apache.org`, giải nén vào `C:\Program Files\apache-maven-3.9.x`.
3. Bổ sung thư mục `bin` của Maven vào biến môi trường `PATH`.
4. Kiểm tra bằng lệnh:
   ```powershell
   mvn -version
   ```

### 2.3. Cấu hình Node.js & npm (Xử lý lỗi Execution Policy trên Windows)
1. Tải và cài đặt Node.js LTS từ `nodejs.org`.
2. Trên PowerShell, nếu gặp lỗi `npm.ps1 cannot be loaded because running scripts is disabled`:
   - Cách 1 (Khuyến nghị): Chạy lệnh sau trong PowerShell (Run as Administrator):
     ```powershell
     Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
     ```
   - Cách 2: Gọi trực tiếp lệnh batch file `npm.cmd` thay vì `npm` (ví dụ `npm.cmd run dev` hoặc `cmd /c npm run dev`).
3. Kiểm tra:
   ```powershell
   node -v
   cmd /c npm -v
   ```

### 2.4. Cấu hình PostgreSQL 18
1. Đảm bảo dịch vụ PostgreSQL đang chạy:
   ```powershell
   Get-Service -Name "*postgres*"
   ```
   Nếu dịch vụ chưa chạy, khởi động bằng: `Start-Service postgresql-x64-18`.
2. Tạo database và user riêng cho ứng dụng (Tuyệt đối không dùng superuser `postgres` cho runtime):
   Mở terminal và đăng nhập psql:
   ```powershell
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
   ```
   Thực thi các lệnh SQL sau:
   ```sql
   -- 1. Tạo user ứng dụng
   CREATE USER kichbansat_app WITH PASSWORD 'kichbansat_secret';

   -- 2. Tạo database dự án
   CREATE DATABASE kichbansat_db OWNER kichbansat_app;

   -- 3. Cấp quyền
   GRANT ALL PRIVILEGES ON DATABASE kichbansat_db TO kichbansat_app;
   \c kichbansat_db
   GRANT ALL ON SCHEMA public TO kichbansat_app;
   \q
   ```

### 2.5. Cấu hình Git Line Endings trên Windows
Để tránh xung đột ký tự xuống dòng `CRLF` và `LF` giữa các thành viên:
```powershell
git config --global core.autocrlf true
```

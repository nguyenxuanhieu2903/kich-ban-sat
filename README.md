# Kịch Bản Sát — Web-based Booking Platform

Nền tảng web hỗ trợ người chơi khám phá game kịch bản (Murder Mystery Game / Larp / RPG), tự tạo phòng chơi và đề xuất thời gian linh hoạt (mốc `HH:00` hoặc `HH:30`), kết nối người chơi để thành lập nhóm, sau đó phối hợp cùng Admin và Dungeon Master (DM) để tổ chức phiên chơi trực tiếp tại địa điểm quán.

---

## 1. Công Nghệ Nền Tảng (Tech Stack)

### Backend
- **Ngôn ngữ & Runtime:** Java 21 LTS
- **Framework:** Spring Boot 3.x (Spring Web, Spring Security, Spring Data JPA, Spring Boot Actuator)
- **Quản lý dự án & Build:** Maven 3.9+
- **Cơ sở dữ liệu:** PostgreSQL 18
- **Quản lý Migration:** Flyway
- **Kiểm thử:** JUnit 5, Mockito, Spring Boot Test

### Frontend
- **Framework:** Next.js (App Router, React)
- **Ngôn ngữ:** TypeScript (Strict Mode)
- **Kiểm tra mã nguồn:** ESLint
- **Kiến trúc:** Feature-oriented Architecture kết hợp Shared UI Primitives

### Môi trường phát triển
- **Hệ điều hành:** Windows Native (Không dùng Docker/WSL cho giai đoạn MVP)
- **Branch làm việc chính:** `develop`

---

## 2. Cấu Trúc Thư Mục Dự Án (Repository Structure)

```text
Booking_kich-ban-sat/
├── backend/                            # Ứng dụng Backend Spring Boot
│   ├── src/main/java/com/kichbansat/   # Mã nguồn Java (Feature-oriented + Layered)
│   ├── src/main/resources/             # Cấu hình application.yml & Flyway migrations
│   └── pom.xml                         # Cấu hình Maven dependencies
├── frontend/                           # Ứng dụng Frontend Next.js App Router
│   ├── src/app/                        # Next.js App Router (public, auth, player, dm, admin)
│   ├── src/features/                   # Feature slices độc lập
│   ├── src/shared/                     # UI Primitives, API client, Hooks, Types
│   └── package.json                    # Cấu hình npm & dependencies
├── docs/                               # Toàn bộ tài liệu kỹ thuật dự án
│   ├── project/                        # Báo cáo kiểm toán và môi trường cơ sở
│   ├── architecture/                   # Kiến trúc tổng thể, Backend và Frontend
│   ├── database/                       # Thiết kế cơ sở dữ liệu và tiêu chuẩn Phase 5
│   ├── api/                            # Hợp đồng API và tiêu chuẩn Phase 6
│   ├── decisions/                      # Sổ quyết định đã duyệt và quyết định mở (Open Decisions)
│   ├── setup/                          # Hướng dẫn cài đặt Windows và chạy cục bộ
│   └── testing/                        # Chiến lược kiểm thử chất lượng và đồng thời
├── PRODUCT_SPEC_V15_Final.md           # [SOURCE OF TRUTH] Đặc tả yêu cầu & nghiệp vụ sản phẩm
├── IMPLEMENTATION_PLAN_V15_Final.md    # [SOURCE OF TRUTH] Kế hoạch triển khai & quản trị dự án
├── .gitignore                          # Quy chuẩn loại trừ file môi trường & build artifact
├── README.md                           # Tài liệu tổng quan dự án
└── CONTRIBUTING.md                     # Quy định phát triển và Git workflow
```

---

## 3. Khởi Động Nhanh Cục Bộ (Quick Start)

### 3.1. Khởi động Backend
```powershell
cd backend
mvn spring-boot:run
```
*Health check:* Truy cập `http://localhost:8080/actuator/health` hoặc `http://localhost:8080/api/v1/health`.

### 3.2. Khởi động Frontend
```powershell
cd frontend
cmd /c npm install
cmd /c npm run dev
```
*Giao diện người dùng:* Mở trình duyệt tại `http://localhost:3000`.

---

## 4. Tài Liệu Hướng Dẫn Chi Tiết
- [Báo cáo Kiểm toán Repository](docs/project/REPOSITORY_AUDIT.md)
- [Môi trường Cơ sở Local](docs/project/LOCAL_ENVIRONMENT_BASELINE.md)
- [Kiến trúc Hệ thống Tổng thể](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [Kiến trúc Backend](docs/architecture/BACKEND_ARCHITECTURE.md)
- [Kiến trúc Frontend](docs/architecture/FRONTEND_ARCHITECTURE.md)
- [Quy chuẩn Cơ sở Dữ liệu](docs/database/README.md)
- [Quy chuẩn API](docs/api/README.md)
- [Sổ Quyết định Nghiệp vụ](docs/decisions/OPEN_DECISIONS.md)
- [Hướng dẫn Cài đặt Windows](docs/setup/WINDOWS_SETUP.md)
- [Hướng dẫn Chạy Cục bộ](docs/setup/LOCAL_RUN_GUIDE.md)
- [Chiến lược Kiểm thử](docs/testing/TESTING_STRATEGY.md)

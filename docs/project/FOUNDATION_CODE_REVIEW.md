# FOUNDATION CODE REVIEW REPORT

**Dự án:** Kịch Bản Sát — Web-based Booking Platform  
**Phạm vi:** Project Foundation Phase (Toàn bộ mã nguồn, cấu hình, kiểm thử và tài liệu dự án)  
**Ngày thực hiện:** 15/11/2026  
**Vai trò thẩm định:** Senior Principal Software Architect, Senior Backend Engineer, Senior Frontend Engineer, Application Security Reviewer  
**Tài liệu đối chiếu chuẩn (Source of Truth):**
- `PRODUCT_SPEC_V15_Final.md` (Product Scope & Business Rules Baseline)
- `IMPLEMENTATION_PLAN_V15_Final.md` (Execution Roadmap & Definition of Done)

---

## 1. Executive Summary

### 1.1. Tổng quan chất lượng Foundation
Đợt kiểm tra kỹ thuật độc lập này đã rà soát toàn bộ source code của dự án **Booking — Kịch Bản Sát** ở giai đoạn Foundation Phase. Hệ thống được xây dựng theo mô hình **Feature-oriented Architecture kết hợp Layered Architecture**, phân tách ranh giới rõ ràng giữa hạ tầng dùng chung (`common`, `infrastructure`, `shared`) và các phân hệ nghiệp vụ (`features`).

Chất lượng nền tảng hiện tại đạt mức **rất tốt và có kỷ luật kỹ thuật cao**:
1. **Tuân thủ triệt để ranh giới thiết kế (Design Gates):** Không phát hiện bất kỳ business entity, JPA repository, database schema hoặc migration nghiệp vụ nào bị tạo sớm trước khi Phase 5 (Database Design) và Phase 6 (API Contract) được nghiệm thu.
2. **Kiến trúc mã nguồn chuẩn mực:** Cấu trúc phân gói Backend (`com.kichbansat.features.*`) và Frontend (`src/features/*`) bám sát 9 bounded contexts được định nghĩa trong tài liệu kiến trúc.
3. **An ninh bảo mật mức cơ bản hoàn chỉnh:** Không phát hiện bất kỳ secret, private key, JWT secret hay credential thực tế nào bị commit vào Git. Cơ chế CORS, CSRF, PasswordEncoder, và chặn lộ stack trace đã được thiết lập đúng chuẩn phòng thủ.
4. **Kiểm thử độc lập xác thực 100%:** Toàn bộ lệnh kiểm tra tự động (`mvn clean compile`, `mvn test`, `mvn package`, `npm run typecheck`, `npm run lint`, `npm run build`) đều kết thúc với mã thoát `0`.

### 1.2. Mức độ sẵn sàng phát triển tiếp
- **Đánh giá:** **PASS WITH CONDITIONS (ĐẠT CÓ ĐIỀU KIỆN)**.
- Toàn bộ cơ sở hạ tầng khung (scaffolding), môi trường build, runtime context và cấu trúc kiểm thử đã sẵn sàng để chuyển sang **Phase 5 — Database Design**.
- Các điều kiện cần xử lý hoặc ghi nhận thuộc nhóm điều kiện kỹ thuật (không phải blocker dừng dự án).

### 1.3. Các rủi ro quan trọng nhất cần lưu ý
1. **Lệch chuẩn Response khi xảy ra lỗi bảo mật tại Filter Chain (CR-001):** Spring Security chưa cấu hình `AuthenticationEntryPoint` và `AccessDeniedHandler` tùy biến, khiến các lỗi 401/403 tại tầng filter có nguy cơ trả về format mặc định của Spring Boot thay vì chuẩn `ApiResponse`.
2. **Trùng lặp công thức tính cọc trên Frontend (CR-005):** Hàm `calculateDepositAndRemaining` được viết tại Frontend formatter; nếu sau này được dùng để gửi số tiền lên Backend thay vì chỉ hiển thị ước tính, sẽ phát sinh nguy cơ giả mạo số tiền (Price Tampering).
3. **Yêu cầu quyền mở rộng PostgreSQL cho Flyway (CR-003):** Script `V0__init_schema.sql` chứa lệnh `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`. Trong môi trường cloud/managed database có quyền hạn chế, lệnh này có thể gây lỗi permission nếu không dùng hàm gốc `gen_random_uuid()`.

---

## 2. Review Scope

### 2.1. Danh sách module và tài nguyên đã kiểm tra
- **Tài liệu đặc tả & điều hành:**
  - `PRODUCT_SPEC_V15_Final.md`
  - `IMPLEMENTATION_PLAN_V15_Final.md`
  - `docs/architecture/*` (`BACKEND_ARCHITECTURE.md`, `FRONTEND_ARCHITECTURE.md`, `SYSTEM_ARCHITECTURE.md`)
  - `docs/decisions/OPEN_DECISIONS.md`
  - `docs/testing/*` (`TESTING_STRATEGY.md`, `FOUNDATION_VERIFICATION_REPORT.md`)
  - `docs/setup/*`, `docs/project/*`
- **Backend (Spring Boot 3.3.5 / Java 21):**
  - Quản lý cấu hình & dependency: `pom.xml`, `application.yml`, `application-local.yml`, `application-test.yml`, `.env.example`.
  - Khung ứng dụng & Persistence: `KichBanSatApplication.java`, `JpaAuditConfig.java`, `V0__init_schema.sql`.
  - Bảo mật & Mạng: `SecurityConfig.java`, `CorsConfig.java`.
  - Xử lý lỗi & Phản hồi: `GlobalExceptionHandler.java`, `ErrorCode.java`, `BaseException.java`, `ApiResponse.java`, `PageResponse.java`.
  - Controller & DTO mẫu: `HealthController.java`, `HealthResponse.java`.
  - Ranh giới phân hệ: 9 file `package-info.java` trong `com.kichbansat.features.*`.
  - Kiểm thử: `KichBanSatApplicationTests.java`, `HealthControllerTest.java`.
- **Frontend (Next.js 14.2.18 / React 18 / TypeScript 5.6):**
  - Quản lý cấu hình & build: `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.mjs`, `.eslintrc.json`, `.env.example`.
  - App Router & Layout: `layout.tsx`, `page.tsx`, `error.tsx`, `not-found.tsx`, `globals.css`.
  - Route Groups: `(admin)/management`, `(auth)/login`, `(dm)/assignments`, `(player)/dashboard`, `(public)/games`.
  - Ranh giới phân hệ: 9 file `index.ts` trong `src/features/*`.
  - Thư viện chia sẻ & API Client: `api-client.ts`, `formatters/index.ts`, `types/index.ts`.
  - Shared Components: `Navbar.tsx`, `Footer.tsx`, `Badge.tsx`, `Button.tsx`, `Card.tsx`, `Container.tsx`, `EmptyState.tsx`, `ErrorState.tsx`, `LoadingSpinner.tsx`.
- **Git & Kho lưu trữ:**
  - `.gitignore`, lịch sử commit (`git log`), trạng thái nhánh và working tree.

### 2.2. Danh sách module chưa kiểm tra & Lý do
- **Business Entities, Repositories, Domain Services:** Chưa triển khai vì đang ở Foundation Phase; tuân thủ nghiêm ngặt quy tắc không tạo code nghiệp vụ trước Phase 5 (Database Design) và Phase 6 (API Contract).
- **Background Jobs (Scheduling, Deadline Sweepers):** Thuộc phạm vi Phase 6.
- **Thanh toán tích hợp thực tế:** MVP quy định mô phỏng luồng thanh toán nội bộ, không tích hợp cổng ngân hàng bên ngoài.

---

## 3. Backend Review

### 3.1. Architecture & Package Structure
- **Tuân thủ kiến trúc:** Cấu trúc phân gói tuân thủ tuyệt đối quy hoạch:
  - `com.kichbansat.common.*`: Chứa các thành phần dùng chung (exception, response, config).
  - `com.kichbansat.infrastructure.*`: Chứa cấu hình hạ tầng kỹ thuật (persistence audit, security).
  - `com.kichbansat.features.*`: Chứa 9 bounded contexts độc lập (`audit`, `dm`, `game`, `gameroom`, `identity`, `notification`, `payment`, `session`, `venue`).
- **Phân tách trách nhiệm:**
  - Không có controller nào chứa business logic. `HealthController` chỉ thực hiện mapping đơn giản dữ liệu trạng thái.
  - Không có repository nào bị gọi trực tiếp từ controller (hiện chưa có repository nghiệp vụ).
  - DTO (`HealthResponse`) và envelope response (`ApiResponse`, `PageResponse`) được phân tách riêng biệt.
  - Không xuất hiện God Class hay circular dependency.

### 3.2. Spring Boot Configuration
- **Profile & Môi trường:**
  - Cấu hình phân tách rạch ròi: `application.yml` (mặc định), `application-local.yml` (chạy local kích hoạt log SQL chi tiết), `application-test.yml` (chạy kiểm thử với H2 database).
  - Profile mặc định là `local` thông qua `${SPRING_PROFILES_ACTIVE:local}`.
- **Quản lý Credentials:**
  - Toàn bộ thông số nhạy cảm (port, datasource URL, username, password, cors origins) đều ưu tiên lấy từ biến môi trường.
  - File `.env.example` cung cấp giá trị mẫu rõ ràng cho môi trường local, không lộ credentials production.
- **Hibernate DDL Safety:**
  - `application.yml` thiết lập `spring.jpa.hibernate.ddl-auto: validate`. Đây là cấu hình chuẩn production, đảm bảo Hibernate tuyệt đối không tự ý sinh, sửa hay xóa bảng trong PostgreSQL.
  - `application-test.yml` sử dụng `ddl-auto: create-drop` chỉ dành riêng cho database ảo in-memory H2 trong quá trình chạy test.

### 3.3. Security
- **Cấu hình SecurityFilterChain:**
  - Phù hợp với kiến trúc Stateless REST API: `sessionCreationPolicy(SessionCreationPolicy.STATELESS)`.
  - `csrf(AbstractHttpConfigurer::disable)`: Lý do vô hiệu hóa CSRF là hợp lý vì hệ thống dự kiến sử dụng Bearer token không phụ thuộc vào ambient browser credentials (session cookie).
- **CORS Allowlist:**
  - Được cấu hình chặt chẽ qua `CorsConfig`, lấy danh sách từ biến môi trường `APP_CORS_ALLOWED_ORIGINS` (mặc định `http://localhost:3000`).
  - Hỗ trợ đầy đủ các method (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`), cho phép credentials và đặt `maxAge: 3600L`.
- **Ranh giới Phân quyền (Authorization Boundary):**
  - Áp dụng nguyên tắc **Secure by Default**:
    ```java
    .requestMatchers("/actuator/health", "/actuator/info").permitAll()
    .requestMatchers("/api/v1/health").permitAll()
    .requestMatchers("/error").permitAll()
    .anyRequest().authenticated()
    ```
  - Mọi endpoint ngoài danh sách public đều bắt buộc phải xác thực.
- **Actuator Exposure:**
  - Chỉ expose `health,info,metrics`.
  - Chi tiết health check được ẩn: `management.endpoint.health.show-details: never`.
  - Endpoint `/actuator/metrics` không nằm trong danh sách permitAll nên được bảo vệ an toàn dưới filter xác thực.
- **Vấn đề bảo mật phát hiện (Findings):**
  - Thiếu `AuthenticationEntryPoint` và `AccessDeniedHandler` tùy biến trong `SecurityConfig` (Chi tiết tại **CR-001**).
  - Kích hoạt cảnh báo tự sinh mật khẩu `UserDetailsServiceAutoConfiguration` trong log test (Chi tiết tại **CR-002**).

### 3.4. Flyway & Persistence
- **Migration Baseline:**
  - File migration duy nhất hiện tại là `V0__init_schema.sql`.
  - Xác nhận: **Không hề có bất kỳ bảng nghiệp vụ nào (như `games`, `game_rooms`, `users`) được tạo trước khi ERD Phase 5 được duyệt.**
- **Tính nhất quán giữa Flyway và Hibernate:**
  - Flyway chịu trách nhiệm quản lý migration (`flyway.enabled: true`, `baseline-on-migrate: true`).
  - Hibernate ở chế độ `validate`, đảm bảo tính thống nhất hai chiều.
- **Điểm lưu ý:**
  - Lệnh `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` cần được rà soát với PostgreSQL 13+ native `gen_random_uuid()` (Chi tiết tại **CR-003**).

### 3.5. Exception Handling
- **Cấu trúc xử lý ngoại lệ:**
  - `GlobalExceptionHandler` bắt toàn diện các nhóm lỗi: `BaseException` (lỗi nghiệp vụ), `MethodArgumentNotValidException` và `ConstraintViolationException` (lỗi validation), `AccessDeniedException` (403), `AuthenticationException` (401), `NoResourceFoundException` (404), `Exception` (500).
- **Bảo mật thông tin lỗi:**
  - Lỗi 500 được ghi log chi tiết nội bộ (`log.error("Unhandled internal server error: ", ex)`), nhưng chỉ trả ra client thông báo chung `INTERNAL_SERVER_ERROR`, tuyệt đối không rò rỉ stack trace hoặc tên class nội bộ.
- **Response Format:**
  - Định dạng phản hồi trả về qua lớp `ApiResponse` nhất quán: `success`, `message`, `data`, `errorCode`, `errors`, `timestamp`.

### 3.6. Dependencies (Backend `pom.xml`)
- Quản lý phiên bản chặt chẽ thông qua `spring-boot-starter-parent` phiên bản `3.3.5`.
- Phiên bản Java: `21`.
- Không có dependency thừa, không có dependency bị xung đột hoặc trùng lặp.
- Các scope được phân định chuẩn xác (`runtime` cho PostgreSQL driver, `test` cho H2 database và Spring Security Test).

---

## 4. Frontend Review

### 4.1. Feature Boundaries & Organization
- **Phân chia thư mục:**
  - `src/app/`: Quản lý định tuyến Next.js App Router và giao diện các trang.
  - `src/features/`: Gồm 9 thư mục phân hệ độc lập tương ứng với Backend bounded contexts. Hiện tại chứa điểm export danh mục đặc tả (`index.ts`).
  - `src/shared/`: Chứa các thành phần dùng chung (`components`, `lib`, `types`).
- **Chiều phụ thuộc (Dependency Direction):**
  - Không có hiện tượng `shared/` import ngược từ `features/`.
  - Không có logic nghiệp vụ bị phân tán rải rác.
  - Các trang page chỉ đóng vai trò layout và trình bày khung, không ôm đồm xử lý logic tính toán.

### 4.2. Routing (Next.js App Router)
- **Route Groups:**
  - Phân chia rõ ràng bằng route groups: `(public)`, `(auth)`, `(player)`, `(dm)`, `(admin)`.
  - Các route groups giúp phân định ngữ cảnh giao diện mà không làm biến đổi cấu trúc URL công khai.
- **Phân định ranh giới bảo vệ:**
  - Các trang trong `(admin)` hay `(dm)` hiện tại là các placeholder giao diện.
  - Kiến trúc ghi nhận rõ: **Bảo vệ trên Frontend chỉ mang tính chất định hướng trải nghiệm người dùng (UX Guard), Backend Spring Boot mới là nơi thực thi quyền hạn (Authorization Enforcer).**

### 4.3. API Client
- **Tập trung hóa:**
  - API Client được xây dựng tập trung tại `src/shared/lib/api/api-client.ts` thông qua hàm `fetchApi<T>()`.
  - Không có tình trạng hardcode endpoint rải rác trong component.
- **Cấu hình & Xử lý phản hồi:**
  - Base URL lấy từ biến môi trường `NEXT_PUBLIC_API_BASE_URL` với fallback chuẩn `http://localhost:8080/api/v1`.
  - Lớp `ApiException` đóng gói đầy đủ `status`, `errorCode` và mảng `errors`.
- **Điểm cần hoàn thiện:**
  - Thiếu thiết lập timeout/AbortController và chính sách credentials mặc định (Chi tiết tại **CR-006**).

### 4.4. TypeScript Strict Mode & Type Safety
- **Cấu hình:**
  - `tsconfig.json` bật đầy đủ: `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`.
- **Đánh giá rà soát kiểu:**
  - Không phát hiện từ khóa `any` nào trong toàn bộ mã nguồn frontend.
  - Phát hiện một điểm ép kiểu hai bước `null as unknown as T` tại nhánh fallback của `api-client.ts` khi server trả về dữ liệu không phải JSON (Chi tiết tại **CR-007**).
  - Kiểu dữ liệu `ApiResponse<T>`, `PageResponse<T>`, `HealthStatus`, `UserRole` được định nghĩa nhất quán với Backend.

### 4.5. Dependencies (Frontend `package.json`)
- Sử dụng bộ thư viện tinh gọn tuyệt đối:
  - Runtime dependencies: `next` (^14.2.18), `react` (^18.3.1), `react-dom` (^18.3.1).
  - Dev dependencies: TypeScript, ESLint, type definitions chuẩn.
- Không cài đặt thư viện bên ngoài không cần thiết.
- Khóa phiên bản đầy đủ trong `package-lock.json`.

---

## 5. Business Logic & Hardcode Review

Rà soát đối chiếu toàn bộ source code với các quy tắc nghiệp vụ trong `PRODUCT_SPEC_V15_Final.md`:

| Trường hợp / Giá trị tìm thấy | Vị trí xuất hiện | Phân loại | Đánh giá & Rủi ro |
|---|---|---|---|
| Mốc giờ `HH:00` và `HH:30` | `frontend/src/app/page.tsx:47` | 3. Business rule đã được tài liệu chấp nhận | Đúng theo Product Spec 1.3 mục 4. Là text hiển thị giới thiệu tính năng. Không có rủi ro. |
| Giới hạn tối đa 3 phòng mở/host | `frontend/src/app/page.tsx:100`, `dashboard/page.tsx:18` | 3. Business rule đã được tài liệu chấp nhận | Đúng theo Product Spec 1.3 mục 4 và Testing Strategy 2.3. Là thông tin hiển thị UI. |
| Thời hạn thành lập phòng 4 giờ | `frontend/src/app/page.tsx:48` | 3. Business rule đã được tài liệu chấp nhận | Đúng theo Product Spec 1.3 mục 5. Hiển thị UI giới thiệu luồng. |
| Thời gian chuẩn bị tối thiểu 12 giờ của DM | `frontend/src/app/page.tsx:180` | 3. Business rule đã được tài liệu chấp nhận | Đúng theo Product Spec 1.3 mục 8. |
| Đặt cọc 30% làm tròn lên 1.000đ; còn lại 70% | `frontend/src/shared/lib/formatters/index.ts:35-45` | 3. Business rule đã được tài liệu chấp nhận | Thuật toán đúng theo quyết định **ACC-15**. Tuy nhiên, đây là logic tài chính chỉ được dùng để hiển thị phía client, Backend bắt buộc phải tự tính lại. |
| Hoàn tiền 0% hoặc 100% | `frontend/src/app/(admin)/management/page.tsx:18` | 3. Business rule đã được tài liệu chấp nhận | Đúng theo quyết định **ACC-18** và Product Spec 1.3 mục 13. |
| Vai trò `GUEST`, `PLAYER`, `DM`, `ADMIN` | `frontend/src/shared/types/index.ts:29` | 3. Business rule đã được tài liệu chấp nhận | Khớp hoàn toàn với vai trò hệ thống tại Product Spec 1.2 và 1.3. |
| Fallback URL `http://localhost:8080/api/v1` | `frontend/src/shared/lib/api/api-client.ts:22` | 1. Technical constant hợp lý | Giá trị fallback tiêu chuẩn khi chạy dev không có file `.env.local`. |
| Fallback CORS `http://localhost:3000` | `backend/src/main/resources/application.yml:47` | 1. Technical constant hợp lý | Giá trị fallback tiêu chuẩn cho local dev frontend. |
| Fallback DB `kichbansat_secret` | `backend/src/main/resources/application.yml:14` | 2. Configuration có thể thay đổi | Cần đảm bảo môi trường production bắt buộc truyền env var không dùng fallback này (CR-010). |

**Kết luận:** Không phát hiện bất kỳ business rule nào bị chế tác tùy tiện hoặc sai lệch so với `PRODUCT_SPEC_V15_Final.md`.

---

## 6. Git & Repository Security

### 6.1. Trạng thái Git & Branch
- **Nhánh hiện tại:** `main` (commit `cda23f3`).
- **Working Tree:** Hoàn toàn sạch (`nothing to commit, working tree clean`).
- **Nhánh phụ:** `develop` cùng trỏ tại commit `cda23f3`.

### 6.2. Kiểm tra File Nhạy cảm & Secret Exposure
- Đã thực hiện kiểm tra sâu qua toàn bộ lịch sử commit (`git log -p`) và quét từ khóa nhạy cảm (`git grep -i -E "secret|password|private_key|api_key"`):
  - **Không có secret thật:** Không có private key, AWS key, API token, mật khẩu sản xuất hoặc database production nào bị commit.
  - Các kết quả chứa chuỗi "secret" chỉ là tên biến môi trường hoặc mật khẩu mẫu phục vụ môi trường local (`kichbansat_secret`).
- File cấu hình môi trường `.env`, `.env.local`, `.env.*` không hề bị đưa vào Git tracking.

### 6.3. Đánh giá `.gitignore`
File `.gitignore` tại thư mục gốc được cấu hình chặt chẽ (80 dòng), bao phủ:
- File nhạy cảm: `.env`, `.env.*`, `*.pem`, `*.key`, `*.pfx`.
- Build artifacts: `backend/target/`, `frontend/node_modules/`, `frontend/.next/`, `frontend/out/`, `*.tsbuildinfo`, `next-env.d.ts`.
- File hệ điều hành & IDE: `.idea/`, `.vscode/*`, `Thumbs.db`, `.DS_Store`.
- File nhật ký & tạm: `logs/`, `*.log`, `scratch/`, `temp/`.

---

## 7. Build & Test Results

Đội ngũ thẩm định đã thực hiện kiểm thử độc lập, không mặc định dựa vào kết quả lưu trước đó:

| Component | Command | Result | Evidence |
|---|---|:---:|---|
| **Backend** | `mvn clean compile` | **PASS** | `Compiling 20 source files with javac [debug parameters release 21] to target\classes`. Total time: 2.872s. Exit code 0. |
| **Backend** | `mvn test` | **PASS** | `Running HealthControllerTest` & `KichBanSatApplicationTests`. `Tests run: 2, Failures: 0, Errors: 0, Skipped: 0`. Context và JPA Entity Manager khởi động chuẩn xác. Exit code 0. |
| **Backend** | `mvn package` | **PASS** | Đóng gói thành công file thực thi `target/kichbansat-backend-0.0.1-SNAPSHOT.jar` (kèm lớp repackage của Spring Boot). Exit code 0. |
| **Frontend** | `npm run typecheck` | **PASS** | `tsc --noEmit` hoàn tất không có bất kỳ lỗi kiểu dữ liệu nào. Exit code 0. |
| **Frontend** | `npm run lint` | **PASS** | `next lint` thực thi hoàn tất: `✔ No ESLint warnings or errors`. Exit code 0. |
| **Frontend** | `npm run build` | **PASS** | `next build` tạo thành công 9/9 static routes (`/`, `/_not-found`, `/assignments`, `/dashboard`, `/games`, `/login`, `/management`), First Load JS shared: 87.2 kB. Exit code 0. |
| **Database** | PostgreSQL Service | **RUNNING** | Service `postgresql-x64-18` đang ở trạng thái `Running` trên máy host local. |

---

## 8. Findings

### CR-001: Missing AuthenticationEntryPoint & AccessDeniedHandler in Spring Security Filter Chain
- **ID:** CR-001
- **Severity:** MEDIUM
- **Category:** Security / Architecture
- **File:** `backend/src/main/java/com/kichbansat/infrastructure/security/SecurityConfig.java`
- **Line:** 27-41
- **Description:** Khi một request không có thông tin xác thực gửi tới endpoint yêu cầu đăng nhập (ví dụ `/actuator/metrics`), lỗi được chặn tại tầng Filter Chain trước khi đến DispatcherServlet. Hiện tại `SecurityConfig` chưa đăng ký `AuthenticationEntryPoint` và `AccessDeniedHandler`, nên Spring Security sẽ xử lý theo cơ chế mặc định (trả về lỗi HTTP thô hoặc chuyển hướng), không đi qua `GlobalExceptionHandler`.
- **Evidence:**
  ```java
  http
      .cors(cors -> cors.configurationSource(corsConfigurationSource))
      .csrf(AbstractHttpConfigurer::disable)
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
          .requestMatchers("/actuator/health", "/actuator/info").permitAll()
          .requestMatchers("/api/v1/health").permitAll()
          .requestMatchers("/error").permitAll()
          .anyRequest().authenticated()
      );
  ```
- **Impact:** Phản hồi lỗi không nhất quán với định dạng chuẩn của `ApiResponse` (thiếu envelope `{ success: false, errorCode: "UNAUTHORIZED_ACCESS", ... }`), gây khó khăn cho việc xử lý lỗi đồng bộ trên Frontend API client.
- **Recommended Fix:** Trong Phase 6/7 khi hoàn thiện Security, triển khai `DelegatingAuthenticationEntryPoint` hoặc custom `AuthenticationEntryPoint` ghi trực tiếp JSON `ApiResponse` ra response output stream.
- **Related Specification:** `IMPLEMENTATION_PLAN_V15_Final.md` mục 0.5 (Rule 8) và Section Security.
- **Status:** OPEN

---

### CR-002: Default Spring Security In-Memory User Generation Warning
- **ID:** CR-002
- **Severity:** LOW
- **Category:** Security / Configuration
- **File:** `backend/src/main/java/com/kichbansat/infrastructure/security/SecurityConfig.java`
- **Line:** 18-48
- **Description:** Spring Boot Security tự động kích hoạt `UserDetailsServiceAutoConfiguration` sinh mật khẩu ngẫu nhiên trong log khi khởi động ứng dụng do chưa có bean `UserDetailsService` tùy biến.
- **Evidence:**
  ```text
  WARN 18520 --- [kichbansat-backend] [ main] .s.s.UserDetailsServiceAutoConfiguration :
  Using generated security password: d80ee8c1-7c8f-4b89-a72f-270a513cc0de
  This generated password is for development use only. Your security configuration must be updated before running your application in production.
  ```
- **Impact:** Không ảnh hưởng tiêu cực trong giai đoạn Foundation vì endpoints nhạy cảm chưa mở, nhưng tạo log warning không mong muốn.
- **Recommended Fix:** Trong Phase 7 khi triển khai feature `identity`, cung cấp `UserDetailsService` hoặc JWT filter tùy chỉnh để thay thế auto-configuration này.
- **Related Specification:** `PRODUCT_SPEC_V15_Final.md` Section 1.3 (Identity/Auth).
- **Status:** OPEN

---

### CR-003: Postgres Extension `uuid-ossp` Permission Dependency
- **ID:** CR-003
- **Severity:** LOW
- **Category:** Persistence / Database Portability
- **File:** `backend/src/main/resources/db/migration/V0__init_schema.sql`
- **Line:** 10
- **Description:** File migration thực thi lệnh `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`. Trên một số hệ quản trị PostgreSQL bản quyền hạn chế (non-superuser app user) hoặc môi trường cloud, lệnh này có thể thất bại nếu user chưa được cấp quyền superuser.
- **Evidence:**
  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```
- **Impact:** PostgreSQL 13 trở lên (và môi trường local hiện tại là PostgreSQL 18.6) đã tích hợp sẵn hàm `gen_random_uuid()` trong nhân core mà không cần bất kỳ extension nào. Việc phụ thuộc vào extension làm giảm tính linh hoạt khi triển khai.
- **Recommended Fix:** Tại Phase 5 khi thiết kế migrations, ưu tiên sử dụng hàm gốc `gen_random_uuid()` của PostgreSQL hoặc đảm bảo tài liệu cài đặt chỉ định sẵn extension cho database admin.
- **Related Specification:** `IMPLEMENTATION_PLAN_V15_Final.md` Phase 5 (Database Design).
- **Status:** OPEN

---

### CR-004: HealthResponse DTO Uses Mutable POJO Pattern Instead of Java Record
- **ID:** CR-004
- **Severity:** LOW
- **Category:** Clean Code / Modern Java
- **File:** `backend/src/main/java/com/kichbansat/common/controller/dto/HealthResponse.java`
- **Line:** 5-53
- **Description:** DTO `HealthResponse` được khai báo bằng class với các getter/setter truyền thống thay vì sử dụng tính năng Java `record` của Java 21.
- **Evidence:**
  ```java
  public class HealthResponse {
      private String status;
      private String application;
      ...
  ```
- **Impact:** Mã nguồn dài dòng, tiềm ẩn rủi ro thay đổi trạng thái (mutation).
- **Recommended Fix:** Chuyển đổi thành `public record HealthResponse(String status, String application, String version, Instant timestamp) {}` trong đợt refactor kỹ thuật tương lai.
- **Related Specification:** `IMPLEMENTATION_PLAN_V15_Final.md` Section 0.3 (Java 21).
- **Status:** OPEN

---

### CR-005: Client-Side Deposit Business Calculation in Shared Formatters
- **ID:** CR-005
- **Severity:** MEDIUM
- **Category:** Business Logic Coupling / Security
- **File:** `frontend/src/shared/lib/formatters/index.ts`
- **Line:** 35-45
- **Description:** Hàm `calculateDepositAndRemaining` tính toán tiền cọc 30% làm tròn lên hàng nghìn (1.000đ) được đặt trong thư viện chia sẻ của Frontend.
- **Evidence:**
  ```typescript
  export function calculateDepositAndRemaining(totalAmount: number): {
    deposit: number;
    remaining: number;
  } {
    const rawDeposit = totalAmount * 0.3;
    const deposit = Math.ceil(rawDeposit / 1000) * 1000;
    const remaining = Math.max(0, totalAmount - deposit);
    return { deposit, remaining };
  }
  ```
- **Impact:** Nếu sau này form thanh toán lấy kết quả của hàm này gửi lên Backend, kẻ tấn công có thể chỉnh sửa giá trị request để gian lận tiền cọc. Theo nguyên tắc Zero-Trust, Backend phải tự tính toán số tiền cọc; Frontend chỉ được dùng hàm này để ước tính giao diện (UI preview).
- **Recommended Fix:** Bổ sung ghi chú cảnh báo (JSDoc) nêu rõ hàm chỉ phục vụ ước tính giao diện; Backend Payment Service trong Phase 7 bắt buộc phải tính toán độc lập số tiền cọc.
- **Related Specification:** `IMPLEMENTATION_PLAN_V15_Final.md` mục 0.5 (Rule 5 & 6) và `PRODUCT_SPEC_V15_Final.md` ACC-15.
- **Status:** OPEN

---

### CR-006: Missing Request Timeout and Credentials Handling in API Client
- **ID:** CR-006
- **Severity:** LOW
- **Category:** Frontend Robustness
- **File:** `frontend/src/shared/lib/api/api-client.ts`
- **Line:** 24-77
- **Description:** Hàm `fetchApi` chưa tích hợp bộ đếm thời gian (Timeout qua `AbortController`) và chưa cấu hình cờ gửi credentials mặc định (`credentials: "same-origin"` hoặc `"include"`).
- **Evidence:** `fetchApi` chỉ wrap `fetch(url, config)` trực tiếp mà không có signal timeout.
- **Impact:** Nếu backend hoặc mạng gặp sự cố treo kết nối, request có thể bị pending vô hạn trên trình duyệt.
- **Recommended Fix:** Bổ sung tham số `timeoutMs` (mặc định 10.000ms - 15.000ms) sử dụng `AbortController.timeout()` trong Phase 6 khi chuẩn hóa API Client.
- **Related Specification:** `IMPLEMENTATION_PLAN_V15_Final.md` Section API Client.
- **Status:** OPEN

---

### CR-007: Unsafe Type Assertion in Non-JSON API Fallback
- **ID:** CR-007
- **Severity:** LOW
- **Category:** TypeScript Type Safety
- **File:** `frontend/src/shared/lib/api/api-client.ts`
- **Line:** 55
- **Description:** Trong trường hợp server trả về content-type không phải `application/json`, hàm fallback gán `data: null as unknown as T`.
- **Evidence:**
  ```typescript
  responseData = {
    success: response.ok,
    message: text || response.statusText,
    data: null as unknown as T,
    timestamp: new Date().toISOString(),
  };
  ```
- **Impact:** Nếu kiểu `T` được caller định nghĩa là non-nullable (ví dụ `User` hoặc `HealthStatus`), việc trả về `null` qua ép kiểu có thể gây lỗi runtime `TypeError: Cannot read properties of null` ở phía gọi.
- **Recommended Fix:** Cho phép `data?: T | null` hoặc ném `ApiException` khi server trả về nội dung sai định dạng JSON mong đợi.
- **Related Specification:** TypeScript Strict Mode.
- **Status:** OPEN

---

### CR-008: Provisional API Envelope Alignment Pending Phase 6 Approval
- **ID:** CR-008
- **Severity:** INFO
- **Category:** API Contract Governance
- **File:** `backend/src/main/java/com/kichbansat/common/response/ApiResponse.java`, `PageResponse.java` & `frontend/src/shared/types/index.ts`
- **Line:** Toàn bộ file
- **Description:** Cấu trúc envelope `{ success, message, data, errorCode, errors, timestamp }` và cấu trúc phân trang `{ items, pageNumber, pageSize, totalElements, totalPages, isLast }` hiện đang là cấu trúc tạm thời của Foundation.
- **Evidence:** Cả Backend và Frontend đều đã có các class/interface này.
- **Impact:** Cần được chính thức phê duyệt và văn bản hóa trong **Phase 6 — API Contract & Background Jobs** để tránh thay đổi phá vỡ sau này.
- **Recommended Fix:** Giữ nguyên cho Foundation; chính thức chuẩn hóa trong tài liệu OpenAPI tại Phase 6.
- **Related Specification:** `IMPLEMENTATION_PLAN_V15_Final.md` Phase 6 Gate (G2).
- **Status:** ACCEPTED RISK

---

### CR-009: Inline Styles in Shared Components Instead of CSS Utility Framework
- **ID:** CR-009
- **Severity:** INFO
- **Category:** Maintainability / Frontend Design
- **File:** `frontend/src/shared/components/**/*`
- **Line:** Toàn bộ components
- **Description:** Các component giao diện (`Button`, `Card`, `Badge`, `Navbar`, v.v.) hiện đang áp dụng CSS Variables kết hợp inline styles trực tiếp (`style={{ ... }}`).
- **Evidence:** `package.json` không cài đặt Tailwind CSS hay CSS-in-JS library.
- **Impact:** Giúp Foundation nhẹ, zero-dependency và chạy build siêu tốc. Tuy nhiên, khi sang Phase 7 xây dựng các màn hình phức tạp (lưới phòng chơi, timeline, bộ đếm deadline), inline style có thể gây khó khăn trong việc quản lý pseudo-classes (`:hover`, `:focus`), responsive media queries và animations.
- **Recommended Fix:** Giữ nguyên ở Foundation; nhóm Frontend cân nhắc áp dụng Tailwind CSS hoặc CSS Modules trước khi triển khai các vertical slice phức tạp tại Phase 7.
- **Related Specification:** `IMPLEMENTATION_PLAN_V15_Final.md` mục 0.4 (Frontend ownership).
- **Status:** OPEN

---

### CR-010: Default Password Fallback in Configuration Template
- **ID:** CR-010
- **Severity:** LOW
- **Category:** Security / Configuration
- **File:** `backend/src/main/resources/application.yml`
- **Line:** 14
- **Description:** Cấu hình datasource password có giá trị mặc định: `password: ${SPRING_DATASOURCE_PASSWORD:kichbansat_secret}`.
- **Evidence:** Line 14 trong `application.yml`.
- **Impact:** Nếu triển khai môi trường production mà quên khai báo biến môi trường, hệ thống có thể thử kết nối bằng mật khẩu mặc định dễ đoán.
- **Recommended Fix:** Tách cấu hình profile production (`application-prod.yml`) yêu cầu bắt buộc biến `SPRING_DATASOURCE_PASSWORD` không có fallback mặc định.
- **Related Specification:** OWASP Top 10 Security Misconfiguration.
- **Status:** OPEN

---

## 9. Open Decisions

Danh sách các vấn đề kỹ thuật cần Tech Lead / Architect thống nhất trước khi triển khai sâu hơn:

1. **Quyết định OD-01 — Chuẩn hóa Envelope Phân trang:**
   - Trường `isLast` trong `PageResponse.java` có thể bị Jackson serialize thành `last` hoặc `isLast`. Cần chốt rõ tên trường JSON trong API Contract Phase 6 (`last` hay `isLast`, `page` hay `pageNumber`).
2. **Quyết định OD-02 — Cơ chế Cookie vs Bearer Token cho Authentication:**
   - Nếu dùng `Bearer token` trong Header: CSRF disable hiện tại là an toàn.
   - Nếu dùng `HttpOnly Cookie`: Phải kích hoạt lại CSRF protection và cấu hình `SameSite=Lax/Strict`.
3. **Quyết định OD-03 — Lựa chọn giải pháp Styling cho Phase 7:**
   - Tiếp tục dùng Pure CSS / CSS Variables hay tích hợp Tailwind CSS để tăng tốc độ xây dựng giao diện responsive và tương tác trạng thái phức tạp.
4. **Quyết định OD-04 — Hàm UUID PostgreSQL cho Phase 5:**
   - Thống nhất sử dụng hàm gốc `gen_random_uuid()` của PostgreSQL thay vì phụ thuộc extension `uuid-ossp` trong toàn bộ migrations Phase 5.

---

## 10. Remediation Roadmap

Kế hoạch khắc phục và chuẩn bị theo mức độ ưu tiên:

### P0: Bắt buộc sửa trước khi phát triển tiếp
- Không có lỗi nào thuộc mức độ P0 gây cản trở Foundation.

### P1: Nên giải quyết trước / trong Phase 5 & Phase 6
- **CR-003:** Chuyển sang sử dụng `gen_random_uuid()` trong thiết kế schema Phase 5.
- **CR-001:** Bổ sung cấu hình `AuthenticationEntryPoint` và `AccessDeniedHandler` trả về `ApiResponse` chuẩn trong Phase 6.
- **CR-008:** Phê duyệt chính thức `ApiResponse` và `PageResponse` trong OpenAPI spec của Phase 6.
- **CR-006:** Bổ sung timeout và credentials handling cho Frontend `api-client.ts`.

### P2: Có thể xử lý ở Phase 7 (Implementation)
- **CR-002:** Triển khai `UserDetailsService` và Security Filter chính thức để loại bỏ cảnh báo auto-generated password.
- **CR-005:** Triển khai validation tính cọc độc lập tại Backend Payment Service, đảm bảo Frontend chỉ dùng `calculateDepositAndRemaining` làm preview.
- **CR-007:** Chuẩn hóa kiểu dữ liệu an toàn cho fallback của `fetchApi`.
- **CR-010:** Tạo file cấu hình `application-prod.yml` không có default credentials.

### P3: Cải tiến tùy chọn (Enhancement)
- **CR-004:** Refactor `HealthResponse` và các read-only DTOs sang Java `record`.
- **CR-009:** Xem xét áp dụng Tailwind CSS cho các màn hình Phase 7.

---

## 11. Foundation Readiness

### Kết luận: **PASS WITH CONDITIONS**

#### Lý do:
1. Cơ sở hạ tầng nền tảng cả Backend và Frontend đều biên dịch, kiểm thử và build production thành công 100%.
2. Không vi phạm bất kỳ Design Gate nào: không có entity, repository hoặc schema nghiệp vụ nào bị tạo sớm.
3. Không phát hiện bất kỳ bí mật, khóa bảo mật hay dữ liệu nhạy cảm nào bị lộ.
4. Bounded Context và cấu trúc thư viện đã khớp hoàn toàn với kiến trúc đã được phê duyệt.
5. Tất cả 10 findings phát hiện đều ở mức MEDIUM, LOW hoặc INFO, không có lỗi CRITICAL hay HIGH nào làm gián đoạn hệ thống.

#### Điều kiện để chuyển sang Phase 5 — Database Design:
- [x] Xác nhận baseline tài liệu nghiệp vụ `PRODUCT_SPEC_V15_Final.md` và `IMPLEMENTATION_PLAN_V15_Final.md`.
- [x] Đảm bảo Working Tree Git hoàn toàn sạch trước khi tạo branch mới cho Phase 5.
- [ ] Trong Phase 5, tuân thủ ghi nhận **CR-003**: Sử dụng `gen_random_uuid()` chuẩn của PostgreSQL khi thiết kế bảng và khóa chính UUID.
- [ ] Giữ nguyên tắc Read-Only cho đến khi kế hoạch thiết kế ERD Phase 5 được User / Product Owner phê duyệt.

---

## 12. Final Verification

- **Xác nhận Source Code:** Không có file mã nguồn nào bị thay đổi nội dung trong suốt quá trình review.
- **Xác nhận File Structure:** Không có file nào bị xóa, đổi tên hoặc di chuyển.
- **Xác nhận Git State:**
  - Không có commit mới nào được tạo.
  - Không thực hiện bất kỳ lệnh `push`, `pull`, `fetch`, `merge` hay `reset`.
  - Trạng thái `git status`: `On branch main, nothing to commit, working tree clean`.
- **Danh sách các lệnh đã thực thi độc lập để xác minh:**
  1. `git status ; git branch -v`
  2. `Get-ChildItem -Recurse -Depth 3`
  3. `git log --oneline -n 10`
  4. `git log -p -n 4`
  5. `git log --all --stat`
  6. `git grep -i -E "secret|password|private_key|api_key"`
  7. `java -version` & `mvn -v`
  8. `node -v` & `cmd.exe /c npm -v`
  9. `& "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.3\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" -f backend/pom.xml clean compile`
  10. `& "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.3\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" -f backend/pom.xml test`
  11. `& "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.3\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" -f backend/pom.xml package`
  12. `cd frontend ; cmd.exe /c npm run typecheck`
  13. `cd frontend ; cmd.exe /c npm run lint`
  14. `cd frontend ; cmd.exe /c npm run build`
  15. `Get-Service *postgres*`
  16. `git status`

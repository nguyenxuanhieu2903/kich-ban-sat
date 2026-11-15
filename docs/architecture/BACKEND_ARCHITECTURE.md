# Kiến Trúc Backend (Backend Architecture)

**Dự án:** Kịch Bản Sát  
**Công nghệ:** Java 21, Spring Boot 3.x, Maven, Spring Data JPA, Spring Security, PostgreSQL, Flyway  
**Root Package:** `com.kichbansat`

---

## 1. Phong Cách Kiến Trúc (Architectural Style)

Backend áp dụng mô hình kết hợp **Feature-oriented Architecture (Kiến trúc hướng tính năng)** ở cấp phân hệ và **Layered Architecture (Kiến trúc phân tầng)** bên trong từng tính năng:

```text
backend/src/main/java/com/kichbansat/
├── KichBanSatApplication.java          # Entry point của ứng dụng Spring Boot
├── common/                             # Các thành phần tái sử dụng chung toàn hệ thống
│   ├── config/                         # WebMvc, Jackson, CORS, App properties
│   ├── exception/                      # GlobalExceptionHandler, BaseException, ErrorCodes
│   ├── response/                       # ApiResponse<T>, PageResponse<T> envelope
│   └── validation/                     # Custom validators, validation groups
├── infrastructure/                     # Các tích hợp kỹ thuật nền tảng
│   ├── security/                       # SecurityFilterChain, PasswordEncoder, Token/Session
│   ├── persistence/                    # JPA Audit, Flyway config, Custom repository helpers
│   ├── scheduler/                      # Background task scheduler infrastructure
│   └── observability/                  # Actuator metrics, Logging filters
└── features/                           # Các Feature Slices (Nghiệp vụ độc lập)
    ├── identity/                       # Tài khoản, người dùng, vai trò
    ├── game/                           # Kịch bản kịch bản sát, quy tắc game
    ├── gameroom/                       # Phòng chơi, slot tham gia, phòng chờ
    ├── dm/                             # Hồ sơ DM, phân công, phản hồi
    ├── venue/                          # Cơ sở vật chất, phòng vật lý
    ├── session/                        # Phiên chơi thực tế, lịch trình
    ├── payment/                        # Thanh toán cọc 30%, 70%, hoàn tiền
    ├── notification/                   # Trung tâm thông báo, phân phát polling
    └── audit/                          # Ghi vết nhật ký hệ thống
```

---

## 2. Quy Định Phân Tầng Bên Trong Feature (Internal Feature Layers)

Bên trong mỗi feature, chỉ khởi tạo các tầng khi thực sự có nhu cầu nghiệp vụ, tuân thủ nghiêm ngặt nguyên tắc Single Responsibility:

```text
features/<feature_name>/
├── controller/     # Tiếp nhận HTTP request, kích hoạt Bean Validation, trả về ApiResponse<DTO>
├── service/        # Điều phối nghiệp vụ, quản lý transaction (@Transactional), kiểm tra State Machine
├── repository/     # Giao tiếp cơ sở dữ liệu kế thừa JpaRepository / JpaSpecificationExecutor
├── entity/         # Đối tượng ánh xạ cơ sở dữ liệu quan hệ (JPA Entities)
├── dto/            # Data Transfer Objects phân tách rõ rệt:
│   ├── request/    # DTO đầu vào kèm Bean Validation annotations (@NotNull, @Size, ...)
│   └── response/   # DTO đầu ra trả về cho client (Tuyệt đối không expose trực tiếp Entity)
├── mapper/         # Chuyển đổi hai chiều giữa Entity và DTO (MapStruct hoặc Mapper thủ công)
├── enums/          # Các tập trạng thái định danh (State Machine Enums)
└── exception/      # Ngoại lệ nghiệp vụ đặc thù của feature
```

### 2.1. Trách nhiệm chi tiết từng tầng:
- **Controller:** Tuyệt đối không chứa logic tính toán hoặc điều kiện nghiệp vụ. Controller chỉ làm nhiệm vụ parse tham số, gọi Service và đóng gói kết quả vào `ApiResponse<T>`.
- **Service:** Là nơi duy nhất quyết định logic xử lý, kiểm tra tính hợp lệ của trạng thái chuyển đổi (State Machine Invariants) và quản lý ranh giới giao dịch cơ sở dữ liệu (`@Transactional`).
- **DTO vs Entity:** Entity đại diện cho mô hình dữ liệu lưu trữ dưới PostgreSQL; DTO đại diện cho hợp đồng API đã thống nhất. Không bao giờ serialize trực tiếp JPA Entity ra JSON để tránh rò rỉ dữ liệu hoặc lỗi LazyInitializationException.

---

## 3. Ranh Giới Giao Tiếp Giữa Các Feature (Inter-feature Communication)

1. **Giao tiếp qua Service Interface hoặc Public Service:** Khi Feature A cần dữ liệu từ Feature B, A chỉ được phép gọi Service công khai của B, không được tự ý inject Repository của B hoặc query trực tiếp bảng của B.
2. **Tránh Cyclic Dependency (Phụ thuộc vòng):** Nếu hai feature có xu hướng phụ thuộc lẫn nhau, cần trích xuất khái niệm dùng chung vào một feature trung gian hoặc đưa sự kiện qua ApplicationEventPublisher.

---

## 4. Xử Lý Lỗi và Phản Hồi Chuẩn Hóa (Error Handling & Response Contract)

Mọi phản hồi từ Backend đều tuân thủ cấu trúc envelope thống nhất:

```json
{
  "success": true,
  "message": "Thao tác thành công",
  "data": { ... },
  "timestamp": "2026-11-15T10:30:00Z"
}
```

Khi có lỗi (Validation error hoặc Business Exception), `GlobalExceptionHandler` bắt và chuẩn hóa:

```json
{
  "success": false,
  "message": "Dữ liệu yêu cầu không hợp lệ",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "startTime",
      "message": "Thời gian bắt đầu phải đúng mốc HH:00 hoặc HH:30"
    }
  ],
  "timestamp": "2026-11-15T10:30:00Z"
}
```

*Tuyệt đối không trả về Stack Trace ra bên ngoài client nhằm đảm bảo an ninh bảo mật.*

---

## 5. Phạm Vi Triển Khai Giai Đoạn Foundation (Phase Foundation Scope)

Trong giai đoạn Foundation hiện tại:
- Khởi tạo Spring Boot context, dependency injection, packaging.
- Thiết lập `GlobalExceptionHandler` và envelope phản hồi.
- Cấu hình Spring Security với filter chain cho phép các endpoint cơ sở hoạt động an toàn.
- Thiết lập Actuator Health check tại `/actuator/health`.
- Chuẩn bị hạ tầng Flyway tại `resources/db/migration/`.
- **Tuyệt đối không tự tạo bảng nghiệp vụ, entity hoặc migration nghiệp vụ khi ERD chưa được phê duyệt ở Phase 5.**

# Thiết Kế Cơ Sở Dữ Liệu (Database Design & Migrations)

**Dự án:** Kịch Bản Sát  
**Hệ quản trị CSDL:** PostgreSQL 18  
**Công cụ quản lý Migration:** Flyway  
**Trạng thái hiện tại:** **DESIGN GATE PENDING (Thuộc phạm vi Phase 5)**

---

## 1. Nguyên Tắc Quản Trị Dữ Liệu (Data Governance Rules)

Căn cứ theo `PRODUCT_SPEC_V15_Final.md` và `IMPLEMENTATION_PLAN_V15_Final.md`:

1. **Không Kế Thừa Schema Cũ:** Nhóm phát triển tự phân tích và thiết kế lại toàn bộ ERD, mô hình quan hệ, ràng buộc khóa ngoại, chỉ mục (indexes) và migration scripts trong Phase 5.
2. **Không Tạo Bảng Nghiệp Vụ Giả Định Trong Phase Foundation:**
   - Trong giai đoạn Foundation hiện tại, tuyệt đối **KHÔNG** tự ý tạo các bảng nghiệp vụ như `games`, `game_rooms`, `room_participants`, `dm_assignments`, `sessions`, `payments` khi ERD chưa được thống nhất và phê duyệt.
   - Thư mục migration (`backend/src/main/resources/db/migration/`) chỉ chứa file khởi tạo hạ tầng cơ sở `V0__init_schema.sql`.

---

## 2. Tiêu Chuẩn Thiết Kế Cho Phase 5 (Phase 5 Design Standards)

Khi bước vào Phase 5, toàn bộ thiết kế cơ sở dữ liệu phải tuân thủ các quy tắc sau:

- **Quy ước đặt tên (Naming Conventions):**
  - Tên bảng: Số nhiều, viết thường, phân cách bằng dấu gạch dưới (`snake_case`, ví dụ: `game_rooms`, `room_participants`).
  - Tên cột: Viết thường `snake_case` (ví dụ: `created_at`, `start_time`, `max_players`).
  - Khóa chính: `id` (Kiểu `BIGSERIAL` / `BIGINT` hoặc `UUID` theo quyết định kỹ thuật của Phase 5).
  - Khóa ngoại: `<tên_bảng_số_ít>_id` (ví dụ: `game_room_id`, `user_id`).
- **Trường Kiểm toán Mặc định (Audit Columns):**
  - Mọi bảng chính đều phải có `created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()` và `updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`.
- **Khóa Lạc quan (Optimistic Locking):**
  - Bảng chứa trạng thái State Machine phức tạp (như `game_rooms`, `sessions`) bắt buộc có trường `version BIGINT NOT NULL DEFAULT 0` để xử lý tranh chấp cập nhật đồng thời (Concurrency Control).
- **Đơn vị Tiền tệ:**
  - Tiền tệ VNĐ lưu kiểu `BIGINT` (không dùng `FLOAT` hoặc `DOUBLE` để tránh sai số dấu phẩy động).

---

## 3. Quy Trình Chạy và Quản Lý Flyway Migration

- Mọi thay đổi schema đều phải thông qua script version Flyway theo định dạng:  
  `V<Version>__<Mo_ta_ngan_gon>.sql` (ví dụ: `V1__init_identity_schema.sql`).
- Script đã được commit và chạy trên bất kỳ môi trường nào thì tuyệt đối **không được sửa đổi nội dung**. Nếu cần sửa, phải tạo script version mới kế tiếp.

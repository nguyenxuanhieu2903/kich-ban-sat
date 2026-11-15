# Chiến Lược Kiểm Thử (Testing Strategy)

**Dự án:** Kịch Bản Sát  
**Mục tiêu:** Đảm bảo độ tin cậy, tính toàn vẹn trạng thái nghiệp vụ và an toàn đồng thời cho toàn bộ hệ thống đặt phòng.

---

## 1. Kim Tự Tháp Kiểm Thử (Testing Pyramid)

Hệ thống áp dụng chiến lược kiểm thử phân tầng:

```text
       /\
      /  \     End-to-End Tests (Cypress / Playwright - Phase 7)
     /----\
    /      \    Integration Tests (MockMvc, SpringBootTest, Testcontainers)
   /--------\
  /          \   Unit Tests (JUnit 5, Mockito, React Testing Library)
 /------------\
```

---

## 2. Kiểm Thử Backend (Backend Testing Standards)

### 2.1. Unit Tests (JUnit 5 & Mockito)
- **Đối tượng:** Service layer, Domain validation, State Machine transitions, Helper/Formatters.
- **Tiêu chuẩn:**
  - Mock toàn bộ Repository và External Services khi kiểm thử Service.
  - Kiểm thử tối thiểu 2 nhánh cho mỗi logic: Happy Path (Thành công) và Error/Boundary Path (Ngoại lệ vi phạm điều kiện).
  - Kiểm thử các hàm tính toán tài chính (Cọc 30% làm tròn lên 1.000đ, số tiền còn lại 70%).

### 2.2. Integration Tests (Spring Boot Test & MockMvc)
- **Đối tượng:** Controller endpoints, Security Filter Chain, Global Exception Handling, Database Transactions.
- **Tiêu chuẩn:**
  - Kiểm thử cơ chế xác thực và phân quyền (RBAC): Đảm bảo `PLAYER` không thể truy cập các endpoint quản trị của `ADMIN` hoặc `DM`.
  - Kiểm thử ràng buộc toàn vẹn dữ liệu: Rollback tự động khi có ngoại lệ phát sinh trong `@Transactional`.

### 2.3. Kiểm thử Xung đột Tranh chấp & Đồng thời (Concurrency & Invariants Testing)
Đây là trọng tâm nghiệp vụ của Kịch Bản Sát, được thiết kế kiểm thử trong Phase 7:
1. **Tranh chấp Slot cuối cùng (Last-slot Race Condition):** Hai người chơi cùng bấm tham gia phòng chỉ còn đúng 1 vị trí trống tại cùng một mili-giây. Kết quả: Đúng 1 người thành công, người còn lại nhận lỗi `409 Conflict` hoặc `ROOM_FULL`.
2. **Tranh chấp Hạn nộp cọc (Deadline Race Condition):** Request thanh toán đến server đúng thời điểm bộ đếm deadline 2 giờ hết hạn. Hệ thống căn cứ vào timestamp server nhận request để bảo vệ quyền lợi người chơi.
3. **Giới hạn số phòng tạo:** Kiểm tra không cho phép một tài khoản tạo quá 3 GameRoom đang hoạt động cùng lúc.

---

## 3. Kiểm Thử Frontend (Frontend Testing Standards)

### 3.1. Type Safety Check (TypeScript Strict Mode)
- Lệnh: `npm run typecheck` (`tsc --noEmit`).
- Tiêu chuẩn: Zero type errors, không cho phép ép kiểu `any` lỏng lẻo.

### 3.2. Static Code Analysis (ESLint)
- Lệnh: `npm run lint`.
- Tiêu chuẩn: Tuân thủ nghiêm ngặt Next.js core web vitals và recommended rules. Không cho phép unused variables hoặc unhandled promises.

### 3.3. Component UI & State Coverage
- Đảm bảo component xử lý đầy đủ 4 trạng thái:
  1. `Loading`: Hiển thị Skeleton hoặc Spinner.
  2. `Empty`: Hiển thị thông điệp trống thân thiện khi danh sách rỗng.
  3. `Error`: Hiển thị thông điệp lỗi rõ ràng và nút thử lại (Retry).
  4. `Success`: Render dữ liệu an toàn.

---

## 4. Tiêu Chí Nghiệm Thu Giai Đoạn Foundation (Foundation Acceptance Criteria)

Một milestone thuộc Foundation chỉ được xem là ĐẠT khi thỏa mãn đầy đủ các chỉ số:

| Hạng mục kiểm tra | Tiêu chí ĐẠT | Trạng thái hiện tại |
| :--- | :--- | :--- |
| **Backend Compile** | `mvn clean compile` không có lỗi | Milestone 2 |
| **Backend Unit Test** | `mvn test` chạy thành công 100% test case | Milestone 2 |
| **Backend Startup** | Khởi động Spring Boot thành công, `/actuator/health` trả về `UP` | Milestone 2 |
| **Frontend Typecheck** | `tsc --noEmit` thoát mã 0 (0 error) | Milestone 3 |
| **Frontend Lint** | `npm run lint` thoát mã 0 (0 warning / error) | Milestone 3 |
| **Frontend Build** | `npm run build` tạo thành công thư mục `.next` | Milestone 3 |
| **Bảo mật Secret** | Không có token, password hoặc private key commit vào Git | Toàn bộ |
| **Git Governance** | Đúng 1 commit cho mỗi milestone, có commit hash xác thực | Toàn bộ |

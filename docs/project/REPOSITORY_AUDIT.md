# Báo cáo Kiểm toán Repository (Repository Audit Report)

**Dự án:** Kịch Bản Sát — Web-based Booking Platform  
**Ngày kiểm toán:** 15/11/2026  
**Người thực hiện:** Senior Principal Software Architect & DevOps Engineer  
**Trạng thái kiểm toán:** HOÀN THÀNH — ĐẠT TIÊU CHUẨN NỀN TẢNG (BASELINE VERIFIED)

---

## 1. Mục tiêu kiểm toán

Kiểm tra toàn diện trạng thái repository, cấu trúc thư mục, các file hiện hữu, trạng thái Git và môi trường máy trạm local (Windows Native) trước khi tiến hành khởi tạo Project Foundation.

Nguyên tắc tối thượng:
- Bảo vệ tuyệt đối 2 tài liệu chuẩn nguồn (`PRODUCT_SPEC_V15_Final.md` và `IMPLEMENTATION_PLAN_V15_Final.md`).
- Không xóa, di chuyển hoặc ghi đè file hiện hữu chưa xác định rõ mục đích.
- Không tự ý thêm code/database/API nghiệp vụ giả lập khi chưa qua phê duyệt Phase 5 và Phase 6.

---

## 2. Kết quả kiểm toán Repository & Files

### 2.1. Thư mục gốc dự án
- **Đường dẫn tuyệt đối:** `D:\LapTrinhWeb\Project\Booking_kich-ban-sat`
- **Tình trạng trước kiểm toán:** Thư mục chỉ chứa 2 file tài liệu đặc tả nguồn. Không có file rác, không có source code cũ bị lẫn lộn.

### 2.2. Danh mục tài liệu nguồn được bảo vệ
1. `PRODUCT_SPEC_V15_Final.md` (Dung lượng: 122,929 bytes, Ngày sửa đổi: 15/11/2026):
   - Nguồn chuẩn đặc tả sản phẩm (Product Specification V15 Final, Baseline Phase 3 & Phase 4 Accepted).
   - Xác định toàn bộ Business Rules, Domain Invariants, State Machines cho `GameRoom`, `RoomParticipant`, `DMAssignment`, `ScheduleProposal`, `Session`, `PlayerPayment`, `Refund`.
2. `IMPLEMENTATION_PLAN_V15_Final.md` (Dung lượng: 76,944 bytes, Ngày sửa đổi: 15/11/2026):
   - Nguồn chuẩn kế hoạch triển khai (Implementation Plan V15 Final).
   - Xác định trình tự 4 tuần, Design Gates (Phase 5: Database Design, Phase 6: API Contract, Phase 7: Implementation & Testing), Repository Governance và Quy tắc Commit Milestone.

### 2.3. Trạng thái Git ban đầu
- **Tình trạng:** Thư mục chưa được khởi tạo Git repository (`fatal: not a git repository`).
- **Hành động xử lý:** Khởi tạo Git repository an toàn với branch mặc định `develop` (`git init -b develop`).
- **Cấu hình Git User:** Đã xác nhận `user.name = Hieunx_2903`, `user.email = nguyenxuanhieu2903@gmail.com` (khớp với repository chính thức `nguyenxuanhieu2903/kich-ban-sat`).
- **Working Tree:** Đã thiết lập `.gitignore` bảo vệ, loại bỏ các file tạm, file môi trường `.env`, artifact build của Maven/Next.js.

---

## 3. Kiểm toán Môi trường Local (Local Environment Baseline)

| Thành phần | Phiên bản phát hiện | Đường dẫn nhị phân / Ghi chú | Đánh giá |
| :--- | :--- | :--- | :--- |
| **Hệ điều hành** | Windows 10/11 x64 | Windows Native (không Docker) | ĐẠT |
| **Git** | 2.52.0.windows.1 | `git` trong PATH | ĐẠT |
| **Java SDK** | 21.0.12.1 LTS | `C:\Program Files\Java\jdk-21.0.12.1` | ĐẠT (Khớp chuẩn Java 21) |
| **Apache Maven** | 3.9.16 | `C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.3\plugins\maven-plugin\lib\maven3\bin\mvn.cmd` | ĐẠT (Khả dụng và tương thích Java 21) |
| **Node.js** | v24.22.1 LTS | `node` trong PATH | ĐẠT |
| **npm** | 11.19.1 | `npm.cmd` trong PATH | ĐẠT |
| **PostgreSQL** | 18.6 | `C:\Program Files\PostgreSQL\18\bin\psql.exe` | ĐẠT (Service `postgresql-x64-18` đang chạy) |

---

## 4. Nhận diện Rủi ro & Biện pháp Xử lý (Risk Assessment & Mitigation)

1. **Rủi ro PowerShell Script Execution Policy với `npm`:**
   - *Hiện tượng:* Khi gọi lệnh `npm -v` trên PowerShell thuần, PowerShell chặn script `npm.ps1` do chính sách ExecutionPolicy mặc định của Windows.
   - *Xử lý:* Gọi trực tiếp `npm.cmd` hoặc thông qua `cmd /c npm ...`.
2. **Rủi ro biến môi trường Maven (`mvn`):**
   - *Hiện tượng:* Lệnh `mvn` chưa được gán vào biến môi trường hệ thống `PATH`.
   - *Xử lý:* Hướng dẫn cấu hình `PATH` trong tài liệu `WINDOWS_SETUP.md` và cung cấp đường dẫn Maven khả dụng hiện tại; đồng thời khuyến nghị sử dụng Maven Wrapper (`mvnw.cmd`) cho dự án Backend.
3. **Rủi ro xâm phạm Secret hoặc Dữ liệu Nhạy cảm:**
   - *Xử lý:* Đã đưa toàn bộ biến thể `.env*` vào `.gitignore`. Cấu hình Backend đọc tham số kết nối từ Environment Variables với fallback an toàn cho profile `local`.
4. **Rủi ro Over-engineering hoặc vi phạm Design Gate:**
   - *Xử lý:* Nghiêm cấm tạo các bảng, Entity, Repository, DTO và Endpoint nghiệp vụ giả trong Phase Foundation. Mọi thứ liên quan đến schema nghiệp vụ phải chờ kết quả phê duyệt Phase 5 (Database Design) và Phase 6 (API Contract).

---

## 5. Kết luận

Repository và môi trường phát triển local đã được kiểm toán đầy đủ, sẵn sàng cho việc thiết lập tài liệu kiến trúc (Milestone 1) và khởi tạo bộ khung Backend/Frontend Foundation (Milestone 2, Milestone 3).

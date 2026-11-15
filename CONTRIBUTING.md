# Quy Chuẩn Đóng Góp và Quy Trình Git (Contributing Guidelines)

**Dự án:** Kịch Bản Sát  
**Branch chính thức:** `develop`

---

## 1. Nguyên Tắc Git Workflow

1. **Phân nhánh (Branching Model):**
   - Branch phát triển chính: `develop`.
   - Các nhánh tính năng con: `feature/<tên_tính_năng>` (ví dụ: `feature/gameroom-lobby`, `feature/payment-mock`).
   - Các nhánh sửa lỗi: `fix/<tên_lỗi>`.
   - Tuyệt đối không commit trực tiếp vào `main`/`master` mà không qua Pull Request và kiểm thử tích hợp.
2. **Quy tắc An Toàn Dữ Liệu:**
   - **Tuyệt đối CẤM:** `git reset --hard`, `git clean -fd`, `git push --force`.
   - Trước khi thực hiện commit, luôn kiểm tra:
     ```powershell
     git status
     git diff
     ```
3. **Quy định Commit Message (Conventional Commits):**
   - Cấu trúc: `<type>: <mô tả ngắn bằng tiếng Việt hoặc tiếng Anh>`
   - Các tiền tố hợp lệ:
     - `feat`: Thêm tính năng mới
     - `fix`: Sửa lỗi
     - `docs`: Thêm hoặc cập nhật tài liệu
     - `chore`: Cấu hình nền tảng, cập nhật dependencies, setup công cụ
     - `test`: Thêm hoặc tối ưu test case
     - `refactor`: Tái cấu trúc mã nguồn không làm thay đổi hành vi nghiệp vụ
     - `style`: Định dạng code, dấu cách, căn lề (không ảnh hưởng logic)

---

## 2. Tiêu Chí Hoàn Thành Một Task / Slice (Definition of Done - DoD)

Một hạng mục chỉ được nghiệm thu và merge khi thỏa mãn 100% các tiêu chí sau:

1. **Đúng Đặc Tả:** Tuân thủ chặt chẽ `PRODUCT_SPEC_V15_Final.md`. Không tự thêm bớt business rules.
2. **Biên dịch Sạch Sẽ:** Backend biên dịch thành công (`mvn clean compile`), Frontend typecheck không lỗi (`tsc --noEmit`).
3. **Kiểm Thử Đầy Đủ:** Bộ test tự động vượt qua 100% (`mvn test`, unit test frontend nếu có).
4. **Bảo Mật:** Không commit file `.env`, không lộ password/secret, không log thông tin nhạy cảm.
5. **Clean Code & Review:** Tuân thủ SOLID, Separation of Concerns, không over-engineering.
6. **Tài Liệu Hóa:** Cập nhật tài liệu kiến trúc, database design hoặc API contract nếu có thay đổi liên quan.

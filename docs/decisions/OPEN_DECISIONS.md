# Sổ Quyết Định Mở & Nhật Ký Quyết Định Nghiệp Vụ (Decision Log)

**Dự án:** Kịch Bản Sát  
**Tài liệu tham chiếu:** `PRODUCT_SPEC_V15_Final.md` và `IMPLEMENTATION_PLAN_V15_Final.md`

---

## 1. Các Quyết Định Nghiệp Vụ ĐÃ ACCEPTED (Accepted Baseline)

> **Cảnh báo:** Toàn bộ các quyết định dưới đây đã được phê duyệt chính thức ở Phase 3 và Phase 4. Tuyệt đối **KHÔNG** mở lại thành Open Decision hoặc tự ý sửa đổi trong quá trình thiết kế kỹ thuật hay triển khai mã nguồn.

| Mã | Nội dung quyết định đã Accepted |
| :--- | :--- |
| **ACC-01** | **Vòng đời GameRoom & Participant:** Tuân thủ toàn bộ State Machine Matrix, Invariants và Side Effects của Phase 3. |
| **ACC-02** | **Hủy phòng bởi Admin:** Admin có toàn quyền hủy bất kỳ GameRoom nào chưa ở trạng thái kết thúc (Non-terminal); bắt buộc phải nhập lý do (`reason`). |
| **ACC-03** | **Cửa sổ tuyển thay thế (Replacement Window):** Thời hạn mở tuyển thay thế tối thiểu 30 phút, tối đa 4 giờ và không được vượt quá thời điểm bắt đầu phiên chơi. |
| **ACC-04** | **Hết hạn cửa sổ thay thế:** Khi hết hạn tuyển thay thế mà chưa đủ người, chuyển phòng về `WAITING_FOR_ADMIN_DECISION`, tuyệt đối không tự động hủy phòng. |
| **ACC-05** | **Mở lại tuyển người (Reopen Recruitment):** Admin được phép mở lại tuyển người không giới hạn số lần trong phạm vi MVP; bắt buộc nhập lý do, tạo window/history mới và tăng bộ đếm `reopen_count`. |
| **ACC-06** | **Tham gia lại (Rejoin):** Người chơi ở trạng thái `LEFT` hoặc `CANCELLED_UNPAID` được phép rejoin; hệ thống tạo record participant mới độc lập và bảo lưu toàn bộ record cũ. |
| **ACC-07** | **Rejoin khi đang chờ hoàn tiền:** Cho phép rejoin ngay cả khi lượt chơi cũ đang trong trạng thái chờ hoàn tiền (`REFUND_PENDING`); các giao dịch thanh toán/hoàn tiền cũ và mới là độc lập. |
| **ACC-08** | **Hạn nộp tiền cọc (Deposit Deadline):** Hạn nộp cọc 2 giờ được tính riêng cho từng participant; người chơi mới vào phòng sau không làm đặt lại deadline của các người chơi đã vào trước. |
| **ACC-09** | **Điều kiện trạng thái READY:** Phòng chuyển sang `READY` khi và chỉ khi 100% active participants đã nộp cọc 30%; không bắt buộc phải nộp 70% còn lại trước khi chuyển READY. |
| **ACC-10** | **Thời hạn phản hồi của DM:** Yêu cầu phân công DM (`DMAssignment`) ở trạng thái `PENDING` không tự động timeout; Admin chủ động theo dõi và điều phối. |
| **ACC-11** | **Thu hồi phân công DM:** Admin được quyền thu hồi phân công DM đã `ACCEPTED` trước khi phiên chơi bắt đầu (`IN_PROGRESS`); bắt buộc nhập lý do và đưa GameRoom về `WAITING_FOR_ORGANIZATION`. |
| **ACC-12** | **Đề xuất đổi lịch (ScheduleProposal):** Mỗi GameRoom tại một thời điểm chỉ có tối đa 1 proposal `PROPOSED`; yêu cầu 100% active participants biểu quyết đồng ý trong vòng 2 giờ; bất kỳ lượt từ chối hoặc hết hạn đều chuyển `REJECTED` và giữ nguyên lịch cũ. |
| **ACC-13** | **Khởi động phiên chơi:** DM được phân công hoặc Admin có quyền xác nhận bắt đầu Session từ trạng thái `READY_FOR_SESSION`. |
| **ACC-14** | **Hủy phiên chơi khẩn cấp:** Chỉ duy nhất Admin có quyền hủy khẩn cấp phiên chơi đang diễn ra (`IN_PROGRESS`); bắt buộc nhập lý do. |
| **ACC-15** | **Tiền tệ và Làm tròn cọc:** Đơn vị tiền tệ lưu trữ là VNĐ (`BIGINT`); giá vé cố định theo người; tiền cọc 30% làm tròn lên hàng nghìn (`1.000đ`); số tiền còn lại `remaining = total - deposit`. |
| **ACC-16** | **Thử lại thanh toán (Payment Retry):** Cho phép retry thanh toán không giới hạn trong thời hạn 2 giờ; căn cứ vào timestamp server nhận request để xử lý tranh chấp sát deadline. |
| **ACC-17** | **Cơ chế Hoàn tiền (Refund):** Mô phỏng hoàn tiền thủ công do Admin thực hiện và xác nhận bằng mã tham chiếu/ghi chú; cho phép retry thủ công không giới hạn khi gặp lỗi `FAILED`. |
| **ACC-18** | **Chính sách hoàn tiền khi xin rời sau cọc:** Admin trực tiếp quyết định hoàn 100% hoặc 0% dựa trên tình huống thực tế và bắt buộc phải nhập lý do. |

---

## 2. Danh Sách Các Quyết Định Đang Mở (Open Decisions)

Các quyết định dưới đây chưa được chốt trong Product Spec V15 Final và sẽ được nhóm làm rõ trước khi triển khai vertical slice liên quan:

### OPEN-01: Danh sách trường GameRoom được phép chỉnh sửa và thời điểm khóa chỉnh sửa
- **Bối cảnh:** Host có được phép chỉnh sửa ghi chú, mô tả phòng hoặc thời gian đề xuất sau khi đã có người khác tham gia hay không?
- **Phương án A:** Chỉ cho phép sửa khi phòng ở trạng thái `RECRUITING` và chưa có thành viên nào khác tham gia ngoài Host.
- **Phương án B:** Cho phép sửa ghi chú bất kỳ lúc nào trước `READY`, nhưng khóa vĩnh viễn thời gian bắt đầu sau khi chuyển sang `WAITING_FOR_DM_ASSIGNMENT`.
- **Trạng thái:** `OPEN` (Chờ làm rõ trước Slice GameRoom Management).

### OPEN-02: Quy chuẩn cấu hình điều kiện riêng của GameRule
- **Bối cảnh:** Một số kịch bản có yêu cầu giới tính nhân vật (ví dụ 3 nam 2 nữ) hoặc độ tuổi tối thiểu. Cần quyết định cấu hình dưới dạng JSON Schema hay trường tĩnh.
- **Trạng thái:** `OPEN` (Chờ làm rõ trong Phase 5 Database Design).

### OPEN-03: Tần suất Polling định kỳ cho từng màn hình
- **Bối cảnh:** MVP sử dụng Polling thay cho WebSocket. Cần tối ưu tần suất gửi request để tránh quá tải server.
- **Đề xuất:** Màn hình Lobby/Room chi tiết: 5-10s; Notification Center: 30s; Trang danh sách: 60s hoặc manual refresh.
- **Trạng thái:** `OPEN` (Chờ chốt trong Phase 6 API Contract).

### OPEN-04: Thời gian đệm (Buffer Time) giữa các phiên chơi của DM và Phòng vật lý
- **Bối cảnh:** Sau mỗi phiên chơi, DM cần nghỉ ngơi và phòng vật lý cần dọn dẹp setup lại đạo cụ.
- **Đề xuất:** Tối thiểu 30 phút giữa 2 phiên chơi liên tiếp.
- **Trạng thái:** `OPEN` (Chờ chốt trong Phase 5/6 khi thiết kế Schedule validation).

### OPEN-05: Chặn tham gia/rejoin sát giờ bắt đầu nếu không đủ 2 giờ đặt cọc
- **Bối cảnh:** Nếu phòng sắp đến giờ bắt đầu mà có người mới vào, thời hạn cọc 2 giờ có thể vượt qua giờ chơi thực tế.
- **Trạng thái:** `OPEN` (Chờ chốt trong Phase 6).

### OPEN-06: Cơ chế áp dụng GameRule khi kịch bản cập nhật phiên bản mới
- **Bối cảnh:** Nếu Admin cập nhật giá vé hoặc số người chơi của kịch bản, các phòng đang tuyển người có bị ảnh hưởng hay không.
- **Đề xuất:** Áp dụng Snapshot pattern: GameRoom lưu lại bản sao cấu hình tại thời điểm tạo phòng.
- **Trạng thái:** `OPEN` (Chờ phê duyệt trong Phase 5 ERD).

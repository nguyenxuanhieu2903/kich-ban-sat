# Đặc Tả Giao Diện Lập Trình (API Specification & Contracts)

**Dự án:** Kịch Bản Sát  
**Giao thức:** RESTful JSON over HTTP  
**Trạng thái hiện tại:** **DESIGN GATE PENDING (Thuộc phạm vi Phase 6)**

---

## 1. Nguyên Tắc Thiết Kế API (API Design Principles)

Căn cứ theo `PRODUCT_SPEC_V15_Final.md` và `IMPLEMENTATION_PLAN_V15_Final.md`:

1. **Thiết kế Mới Toàn Diện:** Nhóm phát triển tự thiết kế API Contract mới trong Phase 6. Không kế thừa endpoint, payload hoặc cấu trúc API cũ từ các repository tham khảo.
2. **Không Tạo Endpoint Nghiệp Vụ Giả Lập Trong Foundation:**
   - Trong giai đoạn Foundation, chỉ duy trì endpoint kiểm tra sức khỏe hạ tầng (`/actuator/health` và `/api/v1/health`).
   - Tuyệt đối không tạo trước các endpoint nghiệp vụ (`/api/v1/rooms`, `/api/v1/games`, `/api/v1/payments`) khi hợp đồng API chưa được kiểm duyệt và phê duyệt tại Phase 6.

---

## 2. Tiêu Chuẩn Giao Thức (Protocol Standards)

### 2.1. Mã Phản Hồi HTTP (HTTP Status Codes)
- `200 OK`: Yêu cầu xử lý thành công (truy vấn hoặc cập nhật dữ liệu).
- `201 Created`: Tạo mới tài nguyên thành công.
- `204 No Content`: Thao tác xóa thành công không cần nội dung trả về.
- `400 Bad Request`: Dữ liệu gửi lên không đúng định dạng hoặc vi phạm quy tắc validation.
- `401 Unauthorized`: Người dùng chưa xác thực (chưa đăng nhập hoặc token không hợp lệ).
- `403 Forbidden`: Người dùng không có quyền truy cập vào tài nguyên hoặc thực hiện hành động này.
- `404 Not Found`: Không tìm thấy tài nguyên được yêu cầu.
- `409 Conflict`: Xung đột trạng thái (vi phạm quy tắc State Machine hoặc lỗi Optimistic Locking).
- `500 Internal Server Error`: Lỗi hệ thống ngoài dự kiến (được che chắn, không lộ stack trace).

### 2.2. Chuẩn Cấu Trúc Envelope Phản Hồi (Standard Response Envelope)
Mọi response trả về client đều thống nhất cấu trúc:

```json
{
  "success": true,
  "message": "Thông điệp mô tả kết quả xử lý",
  "data": { ... },
  "timestamp": "2026-11-15T10:30:00Z"
}
```

Trường hợp lỗi:
```json
{
  "success": false,
  "message": "Mô tả ngắn gọn về lỗi",
  "errorCode": "MA_LOI_HE_THONG",
  "errors": [
    {
      "field": "tên_trường_vi_phạm",
      "message": "Chi tiết lỗi của trường"
    }
  ],
  "timestamp": "2026-11-15T10:30:00Z"
}
```

---

## 3. Các Endpoint Cơ Sở Giai Đoạn Foundation (Foundation Endpoints)

| Phương thức | Đường dẫn | Quyền truy cập | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/actuator/health` | Public | Kiểm tra trạng thái hoạt động của Spring Boot runtime |
| `GET` | `/api/v1/health` | Public | Kiểm tra kết nối ứng dụng nền tảng và trả về thông tin hệ thống |

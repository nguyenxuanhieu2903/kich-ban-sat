# Kiến Trúc Frontend (Frontend Architecture)

**Dự án:** Kịch Bản Sát  
**Công nghệ:** Next.js (App Router), React, TypeScript (Strict Mode), ESLint  
**Mô hình kiến trúc:** Feature-oriented Architecture

---

## 1. Triết Lý Thiết Kế và Quyền Sở Hữu (Ownership & Principles)

Theo quy định tại `PRODUCT_SPEC_V15_Final.md` và `IMPLEMENTATION_PLAN_V15_Final.md`:
- Nhóm phát triển tự thiết kế và xây dựng lại toàn bộ Frontend. Không kế thừa mã nguồn, UI hoặc kiến trúc cũ từ các repository tham khảo.
- Áp dụng **Feature-oriented Architecture (Kiến trúc hướng tính năng)** kết hợp với **Next.js App Router (Route Groups)** nhằm đảm bảo tính phân tách module, dễ bảo trì và dễ mở rộng.
- **Type Safety Tuyệt Đối:** Bật chế độ `strict: true` trong TypeScript. Không sử dụng kiểu dữ liệu `any`.
- **Zero-Unnecessary-Dependencies:** Sử dụng Web Standard Fetch API kết hợp TypeScript thay vì cài đặt các thư viện cồng kềnh như Axios, TanStack Query hay Redux khi chưa có nhu cầu kỹ thuật phức tạp thực tế.

---

## 2. Cấu Trúc Thư Mục Chuẩn (Directory Layout)

```text
frontend/src/
├── app/                                # Routing và Composition theo Next.js App Router
│   ├── (public)/                       # Route group cho người dùng chưa đăng nhập / khách
│   │   ├── games/                      # Khám phá danh mục kịch bản
│   │   └── rooms/                      # Danh sách phòng chơi công khai
│   ├── (auth)/                         # Đăng nhập, đăng ký tài khoản
│   ├── (player)/                       # Portal dành cho Player (Dashboard, Tạo phòng, Đặt cọc)
│   ├── (dm)/                           # Portal dành cho DM (Nhận phân công, Xem lịch)
│   ├── (admin)/                        # Portal Quản trị (Duyệt phòng, Xếp lịch, Gán phòng)
│   ├── layout.tsx                      # Root layout bao bọc toàn ứng dụng
│   ├── page.tsx                        # Trang chủ công khai (Landing & Explore)
│   ├── not-found.tsx                   # Giao diện khi không tìm thấy đường dẫn (404)
│   ├── error.tsx                       # Giao diện bắt lỗi cấp ứng dụng
│   └── globals.css                     # Biến màu, typography và reset CSS toàn cục
├── features/                           # Logic và UI theo từng phân hệ nghiệp vụ
│   ├── identity/                       # Components & logic xác thực, đăng nhập, hồ sơ
│   ├── game/                           # Danh sách kịch bản, thẻ game, chi tiết game
│   ├── game-room/                      # Chi tiết phòng, danh sách người tham gia, lobby
│   ├── dm/                             # Giao diện nhận/từ chối phân công cho DM
│   ├── venue/                          # Quản lý danh sách phòng vật lý của quán
│   ├── session/                        # Quản lý phiên chơi thực tế, khởi chạy phiên
│   ├── payment/                        # Giao diện mô phỏng cọc 30%, 70% và hoàn tiền
│   ├── notification/                   # Trung tâm thông báo (Notification Center, Polling)
│   └── audit/                          # Giao diện xem lịch sử thao tác cho Admin
└── shared/                             # Thành phần tái sử dụng toàn hệ thống
    ├── components/                     # Components dùng chung (Không phụ thuộc vào features)
    │   ├── ui/                         # UI primitives (Button, Card, Badge, Container, Input)
    │   ├── layout/                     # Layout primitives (Navbar, Footer, PageHeader)
    │   └── feedback/                   # LoadingSpinner, ErrorAlert, EmptyState
    ├── hooks/                          # Custom React Hooks chung (useDebounce, usePolling)
    ├── lib/                            # Thư viện tiện ích
    │   ├── api/                        # API client chuẩn hóa với Fetch API
    │   ├── utils/                      # Helper định dạng class, helper tính toán
    │   └── formatters/                 # Định dạng tiền tệ VNĐ, ngày giờ Việt Nam
    ├── providers/                      # Context Providers (Theme, Toast, Auth State)
    ├── config/                         # Hằng số cấu hình hệ thống, env keys
    ├── types/                          # Kiểu dữ liệu chung toàn hệ thống (ApiResponse<T>, ...)
    └── styles/                         # Biến giao diện (Design Tokens)
```

---

## 3. Quy Tắc Phân Định Trách Nhiệm (Responsibility Rules)

1. **Route Pages mỏng (`app/**/page.tsx`):**
   - File `page.tsx` chỉ đóng vai trò lấy tham số đường dẫn (params/searchParams), import component chính từ thư mục `features/` tương ứng và render.
   - Không viết trực tiếp logic nghiệp vụ, state phức tạp hoặc query dữ liệu lớn trong `page.tsx`.
2. **Quyền sở hữu của Feature (`features/*`):**
   - Mỗi feature tự quản lý components nội bộ, custom hooks phục vụ tính năng đó, API call và kiểu dữ liệu DTO liên quan.
   - Khi Feature A muốn tái sử dụng component từ Feature B, component đó phải được thẩm định xem có nên đưa vào `shared/components/` hay không.
3. **Thành phần Dùng chung (`shared/*`):**
   - Tuyệt đối không import bất kỳ file nào từ `features/` hoặc `app/` vào `shared/`. Mối quan hệ phụ thuộc là một chiều: `app -> features -> shared`.
4. **Xử lý Trạng thái Trực quan (UI States):**
   - Mọi màn hình hoặc danh sách hiển thị đều phải thiết kế đủ 4 trạng thái: **Loading (Đang tải)**, **Empty (Trống/Chưa có dữ liệu)**, **Error (Lỗi kết nối/nghiệp vụ)** và **Success (Hiển thị dữ liệu)**.

---

## 4. Giao Tiếp API và Chuẩn Hóa Phản Hồi (API Client Contract)

- Frontend sử dụng client `fetchApi<T>()` đặt tại `shared/lib/api/api-client.ts`.
- Mọi kết quả gọi về đều bóc tách theo cấu trúc `ApiResponse<T>`:
```typescript
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  errors?: Array<{ field: string; message: string }>;
  timestamp: string;
}
```
- Khi gặp mã lỗi từ 4xx đến 5xx, client ném ra một đối tượng `ApiException` có định dạng rõ ràng, cho phép component hiển thị thông báo lỗi thân thiện thay vì làm sập ứng dụng.

---

## 5. Phạm Vi Triển Khai Giai Đoạn Foundation (Phase Foundation Scope)

- Khởi tạo Next.js App Router với TypeScript strict mode.
- Cấu hình layout gốc `RootLayout` với Navbar định hướng và Footer chuẩn thương hiệu.
- Thiết lập các UI Primitives thuần túy: Container, Button, Card, Badge, Header.
- Xây dựng trang Home Page Foundation trình bày tổng quan dự án và các portal chức năng.
- **Tuyệt đối không hardcode endpoint API giả hoặc tạo dữ liệu giả lập không có căn cứ từ Product Spec.**

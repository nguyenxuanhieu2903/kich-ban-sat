import React from "react";
import Link from "next/link";
import { Container } from "@/shared/components/ui/Container";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          paddingTop: "5rem",
          paddingBottom: "5rem",
          borderBottom: "1px solid var(--border-color)",
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(225, 29, 72, 0.15), transparent 70%)",
        }}
      >
        <Container>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <Badge variant="danger" style={{ marginBottom: "1.25rem" }}>
              Nền Tảng Đặt Chỗ Kịch Bản Sát
            </Badge>
            <h1
              style={{
                fontSize: "2.75rem",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                marginBottom: "1.5rem",
                color: "var(--text-primary)",
              }}
            >
              Khám Phá Kịch Bản & Tạo Phòng Chơi Linh Hoạt
            </h1>
            <p
              style={{
                fontSize: "1.15rem",
                color: "var(--text-secondary)",
                marginBottom: "2.5rem",
                lineHeight: 1.7,
              }}
            >
              Hệ thống hỗ trợ người chơi tự đề xuất thời gian bắt đầu theo mốc{" "}
              <strong style={{ color: "var(--text-primary)" }}>HH:00</strong> hoặc{" "}
              <strong style={{ color: "var(--text-primary)" }}>HH:30</strong>, tập hợp đủ người trong thời hạn 4 giờ,
              sau đó phối hợp với Quản trị viên và Dungeon Master để tổ chức phiên chơi trực tiếp tại địa điểm quán.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="#portals">
                <Button variant="primary" size="lg">
                  Khám Phá Phân Hệ
                </Button>
              </Link>
              <Link href="#architecture">
                <Button variant="outline" size="lg">
                  Kiến Trúc Kỹ Thuật
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Rules & Workflow Highlights */}
      <section style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              Đặc Điểm Nghiệp Vụ Cốt Lõi (Baseline V15 Final)
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
              Các nguyên tắc State Machine và Invariants đã được nghiệm thu chính thức trong Phase 3 và Phase 4
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <Card>
              <CardHeader>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>⏱️</div>
                <CardTitle>Thời Gian Bắt Đầu Linh Hoạt</CardTitle>
              </CardHeader>
              <CardContent>
                Không chọn suất cứng cố định. Người tạo phòng đề xuất mốc <code>HH:00</code> hoặc <code>HH:30</code>.
                Hệ thống mở thời hạn thành lập 4 giờ và kiểm soát tối đa 3 phòng mở/người chơi.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>🎭</div>
                <CardTitle>Điều Phối DM & Phòng Vật Lý</CardTitle>
              </CardHeader>
              <CardContent>
                Phân biệt rõ ràng giữa <code>GameRoom</code> (nhóm người chơi) và <code>PhysicalRoom</code> (phòng chơi thực tế).
                Admin phân công DM, kiểm tra sức chứa và yêu cầu chuẩn bị tối thiểu 12 giờ.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>💳</div>
                <CardTitle>Quy Trình Cọc 30% & 70%</CardTitle>
              </CardHeader>
              <CardContent>
                Mô phỏng thanh toán cọc 30% làm tròn lên hàng nghìn (<code>1.000đ</code>) với hạn nộp 2 giờ tính riêng cho từng người.
                70% còn lại thanh toán trước hoặc tại quán.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>🔄</div>
                <CardTitle>Cửa Sổ Thay Thế & Reopen</CardTitle>
              </CardHeader>
              <CardContent>
                Khi có người rút lui sau khi phòng đã đủ, mở cửa sổ tuyển thay thế từ 30 phút đến 4 giờ.
                Admin có quyền mở lại tuyển người (reopen) kèm lý do bắt buộc.
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Portals Section */}
      <section
        id="portals"
        style={{
          paddingTop: "4rem",
          paddingBottom: "4rem",
          borderTop: "1px solid var(--border-color)",
          backgroundColor: "rgba(20, 27, 45, 0.3)",
        }}
      >
        <Container>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              Các Phân Hệ & Cổng Người Dùng (User Portals)
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
              Cấu trúc định tuyến Next.js App Router phân quyền độc lập kết nối chung một Backend
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Public Portal */}
            <Card>
              <CardHeader>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Badge variant="info">Khách / Public</Badge>
                  <span>🌐</span>
                </div>
                <CardTitle style={{ marginTop: "0.75rem" }}>Public Portal</CardTitle>
              </CardHeader>
              <CardContent>
                Truy cập tự do không cần đăng nhập. Khám phá danh mục kịch bản Murder Mystery, thông tin cốt truyện, số lượng nhân vật và các phòng chơi đang mở công khai.
              </CardContent>
              <CardFooter>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Route Group: (public)</span>
              </CardFooter>
            </Card>

            {/* Player Portal */}
            <Card>
              <CardHeader>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Badge variant="success">Người Chơi / Player</Badge>
                  <span>🎲</span>
                </div>
                <CardTitle style={{ marginTop: "0.75rem" }}>Player Portal</CardTitle>
              </CardHeader>
              <CardContent>
                Đăng nhập tài khoản Player. Tự tạo phòng chơi mới, tham gia lobby, nộp cọc 30% trong hạn 2 giờ, biểu quyết đề xuất đổi lịch và nhận thông báo cập nhật phòng.
              </CardContent>
              <CardFooter>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Route Group: (player)</span>
              </CardFooter>
            </Card>

            {/* DM Portal */}
            <Card>
              <CardHeader>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Badge variant="warning">Quản Trò / DM</Badge>
                  <span>🧙‍♂️</span>
                </div>
                <CardTitle style={{ marginTop: "0.75rem" }}>DM Portal</CardTitle>
              </CardHeader>
              <CardContent>
                Khu vực dành riêng cho Dungeon Master. Tiếp nhận yêu cầu phân công từ Admin, phản hồi chấp nhận hoặc từ chối, theo dõi lịch phiên chơi và kích hoạt bắt đầu phiên.
              </CardContent>
              <CardFooter>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Route Group: (dm)</span>
              </CardFooter>
            </Card>

            {/* Admin Portal */}
            <Card>
              <CardHeader>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Badge variant="danger">Quản Trị / Admin</Badge>
                  <span>⚙️</span>
                </div>
                <CardTitle style={{ marginTop: "0.75rem" }}>Admin Portal</CardTitle>
              </CardHeader>
              <CardContent>
                Quản lý kịch bản, cấu hình phòng vật lý, phân công DM, sắp xếp phòng chơi, can thiệp hủy/reopen phòng và duyệt quy trình hoàn tiền mô phỏng (0% hoặc 100%).
              </CardContent>
              <CardFooter>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Route Group: (admin)</span>
              </CardFooter>
            </Card>
          </div>
        </Container>
      </section>

      {/* Technical Architecture Overview */}
      <section id="architecture" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              Nền Tảng Công Nghệ & Tiêu Chuẩn Kỹ Thuật
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
              Sự kết hợp giữa Spring Boot 3.x, Next.js App Router và PostgreSQL 18
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Backend Spring Boot 3.x</CardTitle>
              </CardHeader>
              <CardContent>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <li>☕ <strong>Java 21 LTS:</strong> Hiệu năng cao, Type safety</li>
                  <li>🧱 <strong>Feature-oriented + Layered:</strong> Slices độc lập, phân tầng Controller-Service-Repository</li>
                  <li>🛡️ <strong>Spring Security:</strong> Phân quyền RBAC nghiêm ngặt, CORS least privilege</li>
                  <li>📊 <strong>Flyway & Actuator:</strong> Migration kiểm soát phiên bản & giám sát sức khỏe</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frontend Next.js App Router</CardTitle>
              </CardHeader>
              <CardContent>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <li>⚡ <strong>Next.js 14+:</strong> App Router với Route Groups phân tách rõ rệt</li>
                  <li>🔒 <strong>TypeScript Strict Mode:</strong> Không ép kiểu <code>any</code>, an toàn tại compile time</li>
                  <li>🎨 <strong>Pure Design Tokens:</strong> Không phụ thuộc thư viện UI cồng kềnh ngoài luồng</li>
                  <li>🔄 <strong>UI States Chuẩn Hóa:</strong> Xử lý toàn diện Loading, Empty, Error và Success</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}

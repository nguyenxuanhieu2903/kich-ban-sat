import React from "react";
import Link from "next/link";
import { Container } from "@/shared/components/ui/Container";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export default function PlayerDashboardPage() {
  return (
    <Container style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
        <Badge variant="success" style={{ marginBottom: "1rem" }}>
          Player Route Group: (player)/dashboard
        </Badge>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
          Bảng Điều Khiển Người Chơi (Player Portal)
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Quản lý phòng đã tạo (tối đa 3 phòng đang hoạt động), lịch sử tham gia và quy trình nộp cọc 30%.
        </p>
        <Link href="/">
          <Button variant="outline">Về Trang Chủ</Button>
        </Link>
      </div>
    </Container>
  );
}

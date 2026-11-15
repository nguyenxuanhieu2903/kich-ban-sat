import React from "react";
import Link from "next/link";
import { Container } from "@/shared/components/ui/Container";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export default function DmAssignmentsPage() {
  return (
    <Container style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
        <Badge variant="warning" style={{ marginBottom: "1rem" }}>
          DM Route Group: (dm)/assignments
        </Badge>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
          Cổng Quản Trò (DM Portal)
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Khu vực tiếp nhận phân công từ Admin, phản hồi nhận/từ chối dẫn game và xác nhận bắt đầu Session.
        </p>
        <Link href="/">
          <Button variant="outline">Về Trang Chủ</Button>
        </Link>
      </div>
    </Container>
  );
}

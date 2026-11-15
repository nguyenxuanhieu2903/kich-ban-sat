import React from "react";
import Link from "next/link";
import { Container } from "@/shared/components/ui/Container";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export default function AdminManagementPage() {
  return (
    <Container style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
        <Badge variant="danger" style={{ marginBottom: "1rem" }}>
          Admin Route Group: (admin)/management
        </Badge>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
          Cổng Quản Trị Hệ Thống (Admin Portal)
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Phân công DM, bố trí phòng vật lý (PhysicalRoom), can thiệp hủy/reopen phòng và xử lý hoàn tiền 0% hoặc 100%.
        </p>
        <Link href="/">
          <Button variant="outline">Về Trang Chủ</Button>
        </Link>
      </div>
    </Container>
  );
}

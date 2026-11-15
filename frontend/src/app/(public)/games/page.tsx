import React from "react";
import Link from "next/link";
import { Container } from "@/shared/components/ui/Container";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export default function GamesPage() {
  return (
    <Container style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
        <Badge variant="info" style={{ marginBottom: "1rem" }}>
          Public Route Group: (public)/games
        </Badge>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
          Danh Mục Kịch Bản Murder Mystery
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Khu vực khám phá danh mục kịch bản dành cho khách vãng lai và người chơi.
          Tính năng sẽ được hoàn thiện trong Phase 7 sau khi chốt API Contract (Phase 6).
        </p>
        <Link href="/">
          <Button variant="outline">Về Trang Chủ</Button>
        </Link>
      </div>
    </Container>
  );
}

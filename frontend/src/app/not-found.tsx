import React from "react";
import Link from "next/link";
import { Container } from "@/shared/components/ui/Container";
import { Button } from "@/shared/components/ui/Button";

export default function NotFound() {
  return (
    <Container style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div
        style={{
          textAlign: "center",
          maxWidth: "500px",
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <span style={{ fontSize: "4rem" }}>🔍</span>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>404</h1>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Không tìm thấy trang</h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Đường dẫn bạn yêu cầu không tồn tại hoặc đã được di chuyển.
        </p>
        <Link href="/">
          <Button variant="primary">Về Trang Chủ</Button>
        </Link>
      </div>
    </Container>
  );
}

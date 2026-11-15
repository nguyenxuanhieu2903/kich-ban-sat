import React from "react";
import { Container } from "../ui/Container";

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-surface)",
        paddingTop: "3rem",
        paddingBottom: "3rem",
        marginTop: "5rem",
        color: "var(--text-muted)",
        fontSize: "0.875rem",
      }}
    >
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
            Kịch Bản Sát — Nền Tảng Đặt Chỗ Board Game Kịch Bản & Murder Mystery
          </p>
          <p>
            Thiết kế theo Feature-oriented Architecture + Layered Architecture |
            Spring Boot 3.x + Next.js App Router + PostgreSQL 18
          </p>
          <p style={{ fontSize: "0.8rem" }}>
            Baseline V15 Final | Bản quyền & phát triển bởi đội ngũ kỹ thuật Kịch Bản Sát &copy; {new Date().getFullYear()}
          </p>
        </div>
      </Container>
    </footer>
  );
};

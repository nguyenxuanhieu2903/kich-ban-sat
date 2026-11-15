import React from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { Badge } from "../ui/Badge";

export const Navbar: React.FC = () => {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border-color)",
        backgroundColor: "rgba(11, 15, 25, 0.85)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "4.5rem",
          }}
        >
          {/* Logo / Brand */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontWeight: 800,
              fontSize: "1.25rem",
              letterSpacing: "-0.025em",
            }}
          >
            <span
              style={{
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "1.1rem",
              }}
            >
              🗡️
            </span>
            <span>KỊCH BẢN SÁT</span>
            <Badge variant="warning">MVP Foundation</Badge>
          </Link>

          {/* Navigation Links */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.75rem",
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "var(--text-secondary)",
            }}
          >
            <Link href="/" style={{ color: "var(--text-primary)" }}>
              Trang Chủ
            </Link>
            <Link href="#explore" style={{ transition: "color 0.2s" }}>
              Khám Phá Game
            </Link>
            <Link href="#portals" style={{ transition: "color 0.2s" }}>
              Cổng Chức Năng
            </Link>
            <Link href="#architecture" style={{ transition: "color 0.2s" }}>
              Kiến Trúc
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
};

import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/shared/components/layout/Navbar";
import { Footer } from "@/shared/components/layout/Footer";

export const metadata: Metadata = {
  title: "Kịch Bản Sát — Nền Tảng Đặt Chỗ Board Game Kịch Bản",
  description:
    "Nền tảng đặt phòng chơi Murder Mystery Game linh hoạt theo mốc giờ hoặc nửa giờ, kết nối người chơi, DM và phòng vật lý tại quán.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

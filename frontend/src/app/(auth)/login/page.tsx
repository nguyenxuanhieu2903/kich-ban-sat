import React from "react";
import Link from "next/link";
import { Container } from "@/shared/components/ui/Container";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export default function LoginPage() {
  return (
    <Container style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "420px", margin: "0 auto" }}>
        <Card>
          <CardHeader style={{ textAlign: "center" }}>
            <Badge variant="warning" style={{ marginBottom: "0.75rem" }}>
              Auth Route Group: (auth)/login
            </Badge>
            <CardTitle>Đăng Nhập Tài Khoản</CardTitle>
          </CardHeader>
          <CardContent style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Giao diện xác thực người dùng sẽ được tích hợp với Spring Security API trong Phase 7.
            </p>
            <Link href="/">
              <Button variant="outline" style={{ width: "100%" }}>
                Về Trang Chủ
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

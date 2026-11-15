"use client";

import React, { useEffect } from "react";
import { Container } from "@/shared/components/ui/Container";
import { ErrorState } from "@/shared/components/feedback/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely
    console.error("Next.js runtime error caught:", error);
  }, [error]);

  return (
    <Container style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <ErrorState
        title="Đã xảy ra sự cố không mong muốn"
        message={error.message || "Ứng dụng gặp lỗi trong quá trình xử lý giao diện."}
        onRetry={reset}
      />
    </Container>
  );
}

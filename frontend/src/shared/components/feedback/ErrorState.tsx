import React from "react";
import { Button } from "../ui/Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Đã xảy ra lỗi",
  message = "Không thể tải hoặc xử lý dữ liệu yêu cầu. Vui lòng thử lại sau.",
  onRetry,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        textAlign: "center",
        gap: "1rem",
        backgroundColor: "rgba(239, 68, 68, 0.05)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        borderRadius: "var(--radius-lg)",
        maxWidth: "500px",
        margin: "2rem auto",
      }}
    >
      <div style={{ fontSize: "2.5rem" }}>⚠️</div>
      <h4 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-danger)" }}>
        {title}
      </h4>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Thử Lại
        </Button>
      )}
    </div>
  );
};

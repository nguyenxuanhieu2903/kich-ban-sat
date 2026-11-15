import React from "react";

export interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "📭",
  title = "Chưa có dữ liệu",
  description = "Hiện tại không có thông tin hoặc danh sách đang trống.",
  action,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3.5rem 1.5rem",
        textAlign: "center",
        gap: "0.75rem",
        backgroundColor: "rgba(20, 27, 45, 0.4)",
        border: "1px dashed var(--border-color)",
        borderRadius: "var(--radius-lg)",
        margin: "1.5rem 0",
      }}
    >
      <div style={{ fontSize: "2.5rem" }}>{icon}</div>
      <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)" }}>
        {title}
      </h4>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "400px" }}>
        {description}
      </p>
      {action && <div style={{ marginTop: "0.5rem" }}>{action}</div>}
    </div>
  );
};

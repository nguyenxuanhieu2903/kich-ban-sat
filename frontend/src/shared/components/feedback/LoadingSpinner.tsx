import React from "react";

export interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Đang tải dữ liệu...",
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        gap: "1rem",
        color: "var(--text-secondary)",
      }}
    >
      <div
        style={{
          width: "2.5rem",
          height: "2.5rem",
          border: "3px solid var(--border-color)",
          borderTopColor: "var(--color-primary)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ fontSize: "0.95rem" }}>{message}</p>
    </div>
  );
};

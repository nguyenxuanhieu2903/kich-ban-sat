import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "success":
        return {
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          color: "var(--color-success)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
        };
      case "warning":
        return {
          backgroundColor: "rgba(245, 158, 11, 0.15)",
          color: "var(--color-accent)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
        };
      case "danger":
        return {
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: "var(--color-danger)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
        };
      case "info":
        return {
          backgroundColor: "rgba(14, 165, 233, 0.15)",
          color: "var(--color-info)",
          border: "1px solid rgba(14, 165, 233, 0.3)",
        };
      case "default":
      default:
        return {
          backgroundColor: "rgba(148, 163, 184, 0.15)",
          color: "var(--text-secondary)",
          border: "1px solid var(--border-color)",
        };
    }
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.2rem 0.6rem",
        fontSize: "0.75rem",
        fontWeight: 600,
        borderRadius: "var(--radius-full)",
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
};

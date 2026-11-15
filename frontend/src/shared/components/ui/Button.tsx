import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: "var(--color-secondary)",
          color: "#ffffff",
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)",
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: "var(--text-secondary)",
        };
      case "danger":
        return {
          backgroundColor: "var(--color-danger)",
          color: "#ffffff",
        };
      case "primary":
      default:
        return {
          backgroundColor: "var(--color-primary)",
          color: "#ffffff",
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case "sm":
        return { padding: "0.35rem 0.75rem", fontSize: "0.875rem" };
      case "lg":
        return { padding: "0.75rem 1.5rem", fontSize: "1.125rem" };
      case "md":
      default:
        return { padding: "0.5rem 1rem", fontSize: "1rem" };
    }
  };

  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontWeight: 600,
    borderRadius: "var(--radius-md)",
    transition: "all 0.15s ease-in-out",
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
    opacity: disabled || isLoading ? 0.6 : 1,
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  return (
    <button style={baseStyles} disabled={disabled || isLoading} {...props}>
      {isLoading ? <span>Đang xử lý...</span> : children}
    </button>
  );
};

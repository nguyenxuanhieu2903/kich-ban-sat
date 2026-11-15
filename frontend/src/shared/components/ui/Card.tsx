import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        overflow: "hidden",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <div
      style={{
        padding: "1.25rem 1.5rem",
        borderBottom: "1px solid var(--border-color)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  style,
  ...props
}) => {
  return (
    <h3
      style={{
        fontSize: "1.25rem",
        fontWeight: 700,
        color: "var(--text-primary)",
        ...style,
      }}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <div
      style={{
        padding: "1.5rem",
        color: "var(--text-secondary)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <div
      style={{
        padding: "1rem 1.5rem",
        borderTop: "1px solid var(--border-color)",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

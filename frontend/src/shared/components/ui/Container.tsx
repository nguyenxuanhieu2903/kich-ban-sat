import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children, style, ...props }) => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "var(--container-max-width)",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

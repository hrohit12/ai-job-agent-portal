import React from "react";
import { cn } from "../../lib/utils";

export const AuroraText = ({
  children,
  className,
  as: Component = "span",
  ...props
}) => {
  return (
    <Component
      className={cn(
        "relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-aurora-text",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

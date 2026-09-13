import type { ButtonHTMLAttributes, ReactNode } from "react";
import Button from "./Button";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export default function IconButton({
  label,
  children,
  style,
  ...rest
}: IconButtonProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      aria-label={label}
      title={label}
      style={{ width: 28, padding: 0, ...style }}
      {...rest}
    >
      {children}
    </Button>
  );
}

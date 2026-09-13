import type { CSSProperties, ReactNode } from "react";

type TextElement = "span" | "strong";

interface TextProps {
  children: ReactNode;
  as?: TextElement;
  style?: CSSProperties;
}

export default function Text({
  children,
  as: Element = "span",
  style,
}: TextProps) {
  return <Element style={style}>{children}</Element>;
}

import type { ElementType, HTMLAttributes } from "react";

/**
 * Pembungkus konten halaman: lebar maksimum 1440 dan padding horizontal
 * mengikuti breakpoint (mobile 24, tablet 40, desktop 86). Lihat globals.css.
 */
type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
};

export function Container({
  as: Tag = "div",
  className = "",
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full max-w-page px-page ${className}`}
      {...rest}
    />
  );
}

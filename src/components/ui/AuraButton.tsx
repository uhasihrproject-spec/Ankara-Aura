import Link from "next/link";
import type { MouseEventHandler } from "react";

type Variant = "fill" | "ghost";

function cx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

export default function AuraButton({
  href,
  children,
  variant = "fill",
  className,
  style,
  onClick,
  type = "button",
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  style?: React.CSSProperties;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center select-none whitespace-nowrap " +
    "transition-[transform,background,color,border-color] duration-200 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30";

  const fill =
    "bg-black text-white border border-black " +
    "px-5 py-2.5 text-[11px] tracking-[0.16em] uppercase " +
    "hover:bg-transparent hover:text-black hover:-translate-y-0.5";

  const ghost =
    "text-black/70 border-b border-black/15 pb-[2px] " +
    "hover:text-black hover:border-black";

  const styles = cx(base, variant === "fill" ? fill : "text-[18px]", variant === "fill" ? "" : ghost, className);

  if (href) {
    return (
      <Link href={href} className={styles} style={style} onClick={onClick as MouseEventHandler<HTMLAnchorElement> | undefined}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={styles} style={style} onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}>
      {children}
    </button>
  );
}

import Link from "next/link";

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
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  style?: React.CSSProperties;
}) {
  const base =
    "inline-flex items-center justify-center select-none whitespace-nowrap " +
    "transition-[transform,background,color,border-color] duration-200 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30";

  const fill =
    "bg-black text-white border border-black " +
    "hover:bg-transparent hover:text-black hover:-translate-y-0.5";

  const ghost =
    "text-black/70 border-b border-black/15 pb-[2px] " +
    "hover:text-black hover:border-black";

  const styles = cx(
    base,
    variant === "fill" ? "px-8 py-3 text-[11px] tracking-[0.18em] uppercase" : "text-[18px]",
    variant === "fill" ? fill : ghost,
    className
  );

  return (
    <Link href={href} className={styles} style={style}>
      {children}
    </Link>
  );
}
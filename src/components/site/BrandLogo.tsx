import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  subtitle?: string;
  light?: boolean;
  compact?: boolean;
  className?: string;
};

export default function BrandLogo({
  href = "/",
  subtitle = "Luxury streetwear · Accra",
  light = false,
  compact = false,
  className = "",
}: BrandLogoProps) {
  return (
    <Link href={href} className={`aa-brand ${light ? "aa-brand--light" : ""} ${compact ? "aa-brand--compact" : ""} ${className}`.trim()} aria-label="Ankara Aura home">
      <span className="aa-brand__mark" aria-hidden>
        <span className="aa-brand__core">AA</span>
        <span className="aa-brand__ring" />
      </span>
      <span className="aa-brand__wordmark">
        <strong>Ankara Aura</strong>
        <span>{subtitle}</span>
      </span>
    </Link>
  );
}

import type { Product } from "@/lib/products";

export default function ProductVisual({ product, size = 320 }: { product: Product; size?: number }) {
  const palette: Record<string, { bg: string; accent: string; stripe: string }> = {
    "ankara-oversized-tee": { bg: "#141414", accent: "#d4a843", stripe: "#c8502a" },
    "kente-blazer": { bg: "#0d1f12", accent: "#2d6a4f", stripe: "#d4a843" },
    "mono-cargo-pant": { bg: "#090909", accent: "#6a6a6a", stripe: "#d4a843" },
    "adinkra-hoodie": { bg: "#1a0a0d", accent: "#8b2635", stripe: "#d4a843" },
    "wax-print-tee": { bg: "#0d1a2e", accent: "#1a3a5c", stripe: "#d4a843" },
    "linen-short-set": { bg: "#f0ebe0", accent: "#d4a843", stripe: "#c8502a" },
    "denim-jumpsuit": { bg: "#112030", accent: "#5f7ea4", stripe: "#d4a843" },
  };
  const c = palette[product.slug] ?? { bg: "#111", accent: "#d4a843", stripe: "#c8502a" };
  const half = size / 2;
  const uid = `${product.slug}-${size}`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`bg-${uid}`} cx="50%" cy="38%" r="55%">
          <stop offset="0%" stopColor={c.accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c.bg} />
        </radialGradient>
        <pattern id={`pat-${uid}`} width="28" height="28" patternUnits="userSpaceOnUse">
          <polygon points="14,1 27,14 14,27 1,14" fill="none" stroke={c.stripe} strokeWidth="0.55" opacity="0.35" />
          <circle cx="14" cy="14" r="1.6" fill={c.accent} opacity="0.2" />
        </pattern>
        <clipPath id={`clip-${uid}`}>
          <ellipse cx={half} cy={half * 1.05} rx={half * 0.7} ry={half * 0.8} />
        </clipPath>
      </defs>
      <ellipse cx={half} cy={half * 1.05} rx={half * 0.7} ry={half * 0.8} fill={`url(#bg-${uid})`} />
      <ellipse cx={half} cy={half * 1.05} rx={half * 0.7} ry={half * 0.8} fill={`url(#pat-${uid})`} clipPath={`url(#clip-${uid})`} />
      <path d={`M${half - 36} ${half * 0.3} Q${half} ${half * 0.2} ${half + 36} ${half * 0.3}`} fill="none" stroke={c.stripe} strokeWidth="1.2" opacity="0.7" />
      <line x1={half} y1={half * 0.26} x2={half} y2={half * 1.82} stroke={c.stripe} strokeWidth="0.7" strokeDasharray="4,5" opacity="0.5" />
      <rect x={half * 0.32} y={half * 0.86} width={half * 1.36} height={half * 0.1} fill={c.accent} opacity="0.24" rx="2" />
    </svg>
  );
}

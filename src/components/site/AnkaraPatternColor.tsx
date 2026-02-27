export default function AnkaraPatternColor({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 360 360"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="ank" width="72" height="72" patternUnits="userSpaceOnUse">
          {/* muted “wax print” palette */}
          <rect width="72" height="72" fill="#ffffff" />

          {/* blocks */}
          <rect x="0" y="0" width="36" height="36" fill="#0f172a" opacity="0.9" />
          <rect x="36" y="36" width="36" height="36" fill="#0f172a" opacity="0.9" />

          <rect x="36" y="0" width="36" height="36" fill="#14b8a6" opacity="0.35" />
          <rect x="0" y="36" width="36" height="36" fill="#f59e0b" opacity="0.25" />

          {/* geometry */}
          <circle cx="18" cy="18" r="8" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.55" />
          <circle cx="54" cy="54" r="8" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.55" />

          <path d="M36 10 L62 36 L36 62 L10 36 Z" fill="none" stroke="#111827" strokeWidth="2" opacity="0.25" />
          <path d="M6 6 H66 V66 H6 Z" fill="none" stroke="#111827" strokeWidth="2" opacity="0.15" />
        </pattern>

        {/* Fade it so it stays premium */}
        <linearGradient id="fade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0.0" />
          <stop offset="0.45" stopColor="white" stopOpacity="0.6" />
          <stop offset="1" stopColor="white" stopOpacity="0.85" />
        </linearGradient>

        <mask id="softMask">
          <rect width="100%" height="100%" fill="url(#fade)" />
        </mask>
      </defs>

      <rect width="100%" height="100%" fill="url(#ank)" mask="url(#softMask)" />
    </svg>
  );
}
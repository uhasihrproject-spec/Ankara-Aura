export default function AnkaraPattern({
  id = "ankara-pattern",
  opacity = 0.08,
  color = "#d4a843",
}: {
  id?: string;
  opacity?: number;
  color?: string;
}) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity }}
    >
      <defs>
        <pattern id={`${id}-frame`} width="80" height="80" patternUnits="userSpaceOnUse">
          <polygon points="40,4 76,40 40,76 4,40" fill="none" stroke={color} strokeWidth="0.8" />
          <polygon points="40,18 62,40 40,62 18,40" fill="none" stroke={color} strokeWidth="0.45" />
          <circle cx="4" cy="4" r="1.8" fill={color} />
          <circle cx="76" cy="76" r="1.8" fill={color} />
        </pattern>
        <pattern id={`${id}-ghost`} width="28" height="28" patternUnits="userSpaceOnUse">
          <polygon points="14,1 27,14 14,27 1,14" fill="none" stroke={color} strokeWidth="0.35" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-ghost)`} />
      <rect width="100%" height="100%" fill={`url(#${id}-frame)`} />
    </svg>
  );
}

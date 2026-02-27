import React from "react";

type StrokeTextProps = {
  text: string;
  className?: string;

  /** Choose the font family by className on parent (e.g. font-[Bebas_Neue]) */
  strokeWidth?: number;          // outline thickness
  strokeColor?: string;          // outline color
  fillColor?: string;            // inside color (default transparent)
  fillOpacity?: number;          // useful if you want faint fill

  /** Set this if you want a fixed height. Otherwise it scales with font-size via CSS on wrapper */
  height?: number;               // px
  viewBoxWidth?: number;         // px for internal sizing
  letterSpacingEm?: number;      // adds spacing like editorial type
};

/**
 * StrokeText — crisp outline text (like your "LUXURY" example)
 * Use it inside any layout. Control size using wrapper class (e.g. text-[90px]).
 */
export default function StrokeText({
  text,
  className = "",
  strokeWidth = 6,
  strokeColor = "#0b0b0a",
  fillColor = "transparent",
  fillOpacity = 1,
  height,
  viewBoxWidth = 1200,
  letterSpacingEm = 0,
}: StrokeTextProps) {
  // A tall-ish viewBox so the stroke doesn't clip
  const vbH = 220;

  return (
    <span
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: height ? `${height}px` : "auto",
      }}
    >
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${vbH}`}
        width="100%"
        height={height ? height : "1em"}
        preserveAspectRatio="xMinYMid meet"
        aria-label={text}
        role="img"
      >
        <text
          x="0"
          y="165"
          style={{
            letterSpacing: `${letterSpacingEm}em`,
          }}
          fill={fillColor}
          fillOpacity={fillOpacity}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          paintOrder="stroke fill"
          strokeLinejoin="miter"
        >
          {text}
        </text>
      </svg>

      {/* Make the SVG text inherit font from wrapper */}
      <style>{`
        svg text {
          font: inherit;
        }
      `}</style>
    </span>
  );
}
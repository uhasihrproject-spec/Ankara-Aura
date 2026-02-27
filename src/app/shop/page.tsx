"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

/* ─── Ankara SVG pattern (inline, scalable) ─── */
function AnkaraPattern({ opacity = 0.12 }) {
  return (
    <svg
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        opacity,
        pointerEvents: "none",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="ankara-hero" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          {/* outer diamond */}
          <polygon points="50,3 97,50 50,97 3,50" fill="none" stroke="#d4a843" strokeWidth="1.4"/>
          {/* inner diamond */}
          <polygon points="50,20 80,50 50,80 20,50" fill="none" stroke="#d4a843" strokeWidth="0.9"/>
          {/* tiny center */}
          <polygon points="50,36 64,50 50,64 36,50" fill="none" stroke="#d4a843" strokeWidth="0.6"/>
          {/* corner dots */}
          <circle cx="3"  cy="3"  r="2.5" fill="#d4a843"/>
          <circle cx="97" cy="3"  r="2.5" fill="#d4a843"/>
          <circle cx="3"  cy="97" r="2.5" fill="#1a3a5c"/>
          <circle cx="97" cy="97" r="2.5" fill="#2d6a4f"/>
          {/* cross lines */}
          <line x1="50" y1="37" x2="50" y2="63" stroke="#d4a843" strokeWidth="0.5" strokeDasharray="2,4"/>
          <line x1="37" y1="50" x2="63" y2="50" stroke="#d4a843" strokeWidth="0.5" strokeDasharray="2,4"/>
          {/* mid edge triangles */}
          <polygon points="50,3 56,14 44,14" fill="#d4a843" opacity="0.4"/>
          <polygon points="97,50 86,56 86,44" fill="#d4a843" opacity="0.4"/>
          <polygon points="50,97 56,86 44,86" fill="#1a3a5c" opacity="0.4"/>
          <polygon points="3,50 14,56 14,44" fill="#2d6a4f" opacity="0.4"/>
        </pattern>
        {/* second tighter pattern for variation */}
        <pattern id="ankara-fine" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="#d4a843" strokeWidth="0.5" opacity="0.5"/>
          <circle cx="20" cy="20" r="1.5" fill="#d4a843" opacity="0.6"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ankara-fine)"/>
      <rect width="100%" height="100%" fill="url(#ankara-hero)"/>
    </svg>
  );
}

/* ─── Placeholder product visual (colour swatch + wax texture) ─── */
function ProductVisual({ product, size = 420 }: { product: Product; size?: number }) {
  const colors: Record<string, { bg: string; accent: string; stripe: string }> = {
    "ankara-oversized-tee": { bg: "#1a1a1a", accent: "#d4a843", stripe: "#d4a843" },
    "kente-blazer":          { bg: "#0d1f12", accent: "#2d6a4f", stripe: "#d4a843" },
    "mono-cargo-pant":       { bg: "#0b0b0a", accent: "#333",    stripe: "#555"    },
    "adinkra-hoodie":        { bg: "#1a0a0d", accent: "#8b2635", stripe: "#d4a843" },
    "wax-print-tee":         { bg: "#0d1a2e", accent: "#1a3a5c", stripe: "#d4a843" },
    "linen-short-set":       { bg: "#f0ebe0", accent: "#d4a843", stripe: "#d4a843" },
  };
  const c = colors[product.slug] || { bg: "#111", accent: "#d4a843", stripe: "#d4a843" };
  const half = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.5))" }}>
      <defs>
        <radialGradient id={`grd-${product.slug}`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={c.accent} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={c.bg}/>
        </radialGradient>
        <pattern id={`wax-${product.slug}`} width="30" height="30" patternUnits="userSpaceOnUse">
          <polygon points="15,2 28,15 15,28 2,15" fill="none" stroke={c.stripe} strokeWidth="0.8" opacity="0.4"/>
          <circle cx="15" cy="15" r="2" fill={c.accent} opacity="0.25"/>
        </pattern>
        <clipPath id={`clip-${product.slug}`}>
          <ellipse cx={half} cy={half * 1.05} rx={half * 0.72} ry={half * 0.82}/>
        </clipPath>
      </defs>
      {/* body shape */}
      <ellipse cx={half} cy={half * 1.05} rx={half * 0.72} ry={half * 0.82} fill={`url(#grd-${product.slug})`}/>
      <ellipse cx={half} cy={half * 1.05} rx={half * 0.72} ry={half * 0.82} fill={`url(#wax-${product.slug})`} clipPath={`url(#clip-${product.slug})`}/>
      {/* collar */}
      <path d={`M${half - 40} ${half * 0.3} Q${half} ${half * 0.22} ${half + 40} ${half * 0.3}`} fill="none" stroke={c.stripe} strokeWidth="1.5" opacity="0.7"/>
      {/* center seam */}
      <line x1={half} y1={half * 0.28} x2={half} y2={half * 1.85} stroke={c.stripe} strokeWidth="0.8" strokeDasharray="4,6" opacity="0.5"/>
      {/* accent band */}
      <rect x={half * 0.3} y={half * 0.85} width={half * 1.4} height={half * 0.12} fill={c.accent} opacity="0.35" rx="2"/>
      {/* shoulder highlights */}
      <ellipse cx={half * 0.42} cy={half * 0.45} rx="28" ry="18" fill={c.stripe} opacity="0.18"/>
      <ellipse cx={half * 1.58} cy={half * 0.45} rx="28" ry="18" fill={c.stripe} opacity="0.18"/>
    </svg>
  );
}


const HERO_PRODUCTS = PRODUCTS.filter(p => p.featured).slice(0, 5);

export default function ShopPage() {
  const [activeIdx,   setActiveIdx]   = useState(0);
  const [prevIdx,     setPrevIdx]     = useState<number | null>(null);
  const [direction,   setDirection]   = useState(1); // 1=next, -1=prev
  const [animating,   setAnimating]   = useState(false);
  const [addedSlug,   setAddedSlug]   = useState<string | null>(null);
  const [filter,      setFilter]      = useState("All");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addToCart } = useCart();

  const active = HERO_PRODUCTS[activeIdx];

  const go = (nextIdx: number, dir: 1 | -1) => {
    if (animating || nextIdx === activeIdx) return;
    setDirection(dir);
    setPrevIdx(activeIdx);
    setAnimating(true);
    setActiveIdx(nextIdx);
    setTimeout(() => { setPrevIdx(null); setAnimating(false); }, 900);
  };

  const next = () => go((activeIdx + 1) % HERO_PRODUCTS.length, 1);
  const prev = () => go((activeIdx - 1 + HERO_PRODUCTS.length) % HERO_PRODUCTS.length, -1);

  // auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDirection(1);
      setPrevIdx((current) => {
        const prevIndex = current ?? activeIdx;
        setAnimating(true);
        setActiveIdx((idx) => (idx + 1) % HERO_PRODUCTS.length);
        return prevIndex;
      });
      setTimeout(() => { setPrevIdx(null); setAnimating(false); }, 900);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeIdx]);

  // pause on hover
  const pauseAuto = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const resumeAuto = () => {
    timerRef.current = setInterval(() => {
      setDirection(1);
      setPrevIdx((current) => {
        const prevIndex = current ?? activeIdx;
        setAnimating(true);
        setActiveIdx((idx) => (idx + 1) % HERO_PRODUCTS.length);
        return prevIndex;
      });
      setTimeout(() => { setPrevIdx(null); setAnimating(false); }, 900);
    }, 5000);
  };

  const tags = ["All", ...Array.from(new Set(PRODUCTS.flatMap(p => p.tags)))];
  const filteredProducts = filter === "All"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.tags.includes(filter));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400&display=swap');

        :root {
          --ink:    #0b0b0a;
          --cream:  #f7f6f4;
          --kente:  #d4a843;
          --gold:   #d4a843;
          --indigo: #1a3a5c;
          --forest: #2d6a4f;
          --border: rgba(8,8,7,0.10);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .shop-page {
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ══════════ HERO ══════════ */
        .hero {
          position: relative;
          height: 100svh;
          min-height: 600px;
          overflow: hidden;
          background: var(--ink);
          cursor: none;
        }

        /* custom cursor */
        .hero-cursor {
          position: absolute;
          width: 48px; height: 48px;
          border: 1.5px solid var(--kente);
          border-radius: 50%;
          pointer-events: none;
          z-index: 100;
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s, background 0.2s;
          mix-blend-mode: difference;
        }

        /* ── slide layers ── */
        .hero-slide {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }

        /* entering slide */
        .hero-slide.enter {
          animation: slideEnter 0.9s cubic-bezier(0.77,0,0.175,1) both;
        }
        /* leaving slide */
        .hero-slide.leave {
          animation: slideLeave 0.9s cubic-bezier(0.77,0,0.175,1) both;
          pointer-events: none;
        }
        @keyframes slideEnter {
          from { opacity: 0; transform: translateX(calc(var(--dir) * 60px)); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideLeave {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(calc(var(--dir) * -60px)); }
        }

        /* ── big BG product name — BEHIND model ── */
        .hero-bg-text {
          position: absolute;
          inset: 0;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
          z-index: 1;
        }
        .hero-bg-text span {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(80px, 14vw, 180px);
          letter-spacing: 0.03em;
          color: transparent;
          -webkit-text-stroke: 1px rgba(247,246,244,0.12);
          white-space: nowrap;
          text-align: center;
          line-height: 1;
          user-select: none;
          animation: textPan 8s linear infinite;
        }
        @keyframes textPan {
          0%   { transform: translateX(-2%); }
          50%  { transform: translateX(2%); }
          100% { transform: translateX(-2%); }
        }

        /* ── model layer (ABOVE bg-text, BELOW fg-text) ── */
        .hero-model {
          position: absolute;
          z-index: 2;
          bottom: 0;
          left: 50%; transform: translateX(-50%);
          height: 88%;
          display: flex; align-items: flex-end; justify-content: center;
          animation: modelFloat 6s ease-in-out infinite;
        }
        @keyframes modelFloat {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(-12px); }
        }
        .hero-model img,
        .hero-model svg {
          height: 100%;
          width: auto;
          max-width: 600px;
          object-fit: contain;
        }

        /* ── FG text layer (ABOVE model) ── */
        .hero-fg-text {
          position: absolute;
          inset: 0;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
          z-index: 3;
        }
        .hero-fg-text span {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(80px, 14vw, 180px);
          letter-spacing: 0.03em;
          color: rgba(247,246,244,0.08);
          white-space: nowrap;
          text-align: center;
          line-height: 1;
          user-select: none;
          /* clip to ONLY the top portion — creating the "text behind" illusion */
          clip-path: inset(0 0 42% 0);
        }

        /* ── bottom info bar ── */
        .hero-info {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 10;
          display: flex; align-items: flex-end; justify-content: space-between;
          padding: 32px 48px 40px;
          background: linear-gradient(to top, rgba(8,8,7,0.7) 0%, transparent 100%);
        }
        .hero-info-left { display: flex; flex-direction: column; gap: 6px; }
        .hero-tag {
          font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--kente); font-family: 'DM Sans', sans-serif;
        }
        .hero-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 4vw, 52px);
          letter-spacing: 0.06em; color: var(--cream); line-height: 1;
        }
        .hero-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(22px, 3vw, 38px);
          color: var(--gold); letter-spacing: 0.04em;
        }
        .hero-desc {
          font-size: 13px; color: rgba(247,246,244,0.5);
          max-width: 360px; line-height: 1.6; margin-top: 4px;
        }
        .hero-info-right { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
        .hero-cta {
          font-size: 11px; letter-spacing: 0.16em;
          text-transform: uppercase;
          background: var(--ink); color: var(--cream);
          padding: 9px 20px; text-decoration: none;
          border: 1px solid var(--ink); cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.18s;
          font-family: 'DM Sans', sans-serif;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .hero-cta:hover { background: transparent; color: var(--cream); transform: translateY(-1px); }
        .hero-cta span { position: relative; z-index: 1; }

        /* ── arrows ── */
        .hero-arrow {
          position: absolute; top: 50%; z-index: 20;
          transform: translateY(-50%);
          width: 48px; height: 48px;
          border: 1.5px solid rgba(247,246,244,0.2);
          border-radius: 50%; background: rgba(247,246,244,0.04);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color 0.2s, background 0.2s, transform 0.2s;
          color: rgba(247,246,244,0.6);
        }
        .hero-arrow:hover { border-color: var(--kente); background: var(--ink); color: var(--cream); transform: translateY(-50%) scale(1.1); }
        .hero-arrow.left  { left: 28px; }
        .hero-arrow.right { right: 28px; }
        .hero-arrow svg { width: 18px; height: 18px; stroke: currentColor; stroke-width: 1.8; fill: none; stroke-linecap: round; stroke-linejoin: round; }

        /* ── dots ── */
        .hero-dots {
          position: absolute; bottom: 130px; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 8px; z-index: 20;
        }
        .hero-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(247,246,244,0.25);
          cursor: pointer; transition: background 0.3s, transform 0.3s;
          border: none; padding: 0;
        }
        .hero-dot.active { background: var(--kente); transform: scale(1.4); }

        /* ── slide counter ── */
        .hero-counter {
          position: absolute; top: 28px; right: 48px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px; letter-spacing: 0.12em;
          color: rgba(247,246,244,0.3); z-index: 20;
        }
        .hero-counter strong { color: rgba(247,246,244,0.7); }

        /* ══════════ PRODUCTS SECTION ══════════ */
        .products-section {
          padding: 80px 48px 100px;
          max-width: 1300px; margin: 0 auto;
        }
        .section-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 48px; gap: 24px; flex-wrap: wrap;
        }
        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px; letter-spacing: 0.08em; color: var(--ink); line-height: 1;
        }
        .section-sub {
          font-family: 'Caveat', cursive;
          font-size: 16px; color: rgba(8,8,7,0.4); margin-top: 4px;
        }

        /* filter pills */
        .filter-pills {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .pill {
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          padding: 7px 16px; border: 1px solid var(--border);
          background: none; cursor: pointer; color: rgba(8,8,7,0.5);
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .pill.active, .pill:hover {
          background: var(--ink); color: var(--cream); border-color: var(--ink);
        }

        /* product grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2px;
        }

        /* product card */
        .product-card {
          position: relative;
          background: var(--ink);
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 3/4;
          display: block;
          text-decoration: none;
        }
        .product-card-visual {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .product-card:hover .product-card-visual { transform: scale(1.05); }

        /* ankara pattern overlay on card */
        .product-card-pattern {
          position: absolute; inset: 0;
          opacity: 0.08; pointer-events: none;
        }
        .product-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(8,8,7,0.85) 0%, rgba(8,8,7,0.1) 55%, transparent 100%);
          z-index: 2;
        }
        .product-card-info {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px 22px; z-index: 3;
        }
        .product-card-tag {
          font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--kente); margin-bottom: 4px;
        }
        .product-card-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; letter-spacing: 0.06em;
          color: var(--cream); line-height: 1; margin-bottom: 6px;
        }
        .product-card-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; color: var(--gold); letter-spacing: 0.04em;
        }

        /* quick-add button appears on hover */
        .product-card-quick {
          position: absolute; top: 16px; right: 16px;
          z-index: 4;
          background: var(--ink); color: var(--cream);
          border: 1px solid rgba(247,246,244,0.45); cursor: pointer;
          font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
          padding: 9px 14px;
          opacity: 0; transform: translateY(-8px);
          transition: opacity 0.3s, transform 0.3s, background 0.2s, color 0.2s;
          pointer-events: none;
        }
        .product-card:hover .product-card-quick {
          opacity: 1; transform: translateY(0); pointer-events: all;
        }
        .product-card-quick.added {
          background: var(--gold); color: var(--ink); border-color: var(--gold); opacity: 1; transform: translateY(0); pointer-events: all;
        }

        /* ── added flash ── */
        .added-flash {
          position: fixed; bottom: 32px; left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: var(--ink); color: var(--cream);
          font-family: 'Caveat', cursive; font-size: 18px;
          padding: 14px 32px; z-index: 999;
          border-left: 3px solid var(--kente);
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s, transform 0.3s;
        }
        .added-flash.show {
          opacity: 1; transform: translateX(-50%) translateY(0);
        }

        @media (max-width: 768px) {
          .hero-info { padding: 24px 24px 32px; }
          .hero-arrow { display: none; }
          .products-section { padding: 48px 20px 64px; }
          .section-head { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="shop-page">

        {/* ══════════ HERO CAROUSEL ══════════ */}
        <section
          className="hero"
          onMouseEnter={pauseAuto}
          onMouseLeave={resumeAuto}
        >
          <AnkaraPattern opacity={0.10} />

          {/* prev slide (leaving) */}
          {prevIdx !== null && (
            <div
              className="hero-slide leave"
              style={{ ["--dir" as string]: direction } as CSSProperties}
              key={`leave-${prevIdx}`}
            >
              <div className="hero-bg-text">
                <span>{HERO_PRODUCTS[prevIdx].name.toUpperCase()}</span>
              </div>
              <div className="hero-model">
                <ProductVisual product={HERO_PRODUCTS[prevIdx]} size={500} />
              </div>
              <div className="hero-fg-text">
                <span>{HERO_PRODUCTS[prevIdx].name.toUpperCase()}</span>
              </div>
            </div>
          )}

          {/* active slide (entering) */}
          <div
            className={`hero-slide${animating ? " enter" : ""}`}
            style={{ ["--dir" as string]: direction } as CSSProperties}
            key={`enter-${activeIdx}`}
          >
            <div className="hero-bg-text">
              <span>{active.name.toUpperCase()}</span>
            </div>
            <div className="hero-model">
              <ProductVisual product={active} size={500} />
            </div>
            <div className="hero-fg-text">
              <span>{active.name.toUpperCase()}</span>
            </div>
          </div>

          {/* counter */}
          <div className="hero-counter">
            <strong>{String(activeIdx + 1).padStart(2, "0")}</strong>
            &nbsp;/&nbsp;
            {String(HERO_PRODUCTS.length).padStart(2, "0")}
          </div>

          {/* arrows */}
          <button className="hero-arrow left" onClick={prev} aria-label="Previous">
            <svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>
          </button>
          <button className="hero-arrow right" onClick={next} aria-label="Next">
            <svg viewBox="0 0 24 24"><polyline points="9,6 15,12 9,18"/></svg>
          </button>

          {/* dots */}
          <div className="hero-dots">
            {HERO_PRODUCTS.map((_, i) => (
              <button
                key={i}
                className={`hero-dot${i === activeIdx ? " active" : ""}`}
                onClick={() => go(i, i > activeIdx ? 1 : -1)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* info bar */}
          <div className="hero-info">
            <div className="hero-info-left">
              <div className="hero-tag">{active.tags[0]}</div>
              <div className="hero-name">{active.name}</div>
              <div className="hero-price">GH₵ {active.price.toLocaleString()}</div>
              <div className="hero-desc">{active.desc}</div>
            </div>
            <div className="hero-info-right">
              <Link href={`/shop/${active.slug}`} className="hero-cta">
                <span>View Piece →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════ PRODUCTS GRID ══════════ */}
        <section className="products-section">
          <div className="section-head">
            <div>
              <div className="section-title">All Pieces</div>
              <div className="section-sub">{PRODUCTS.length} pieces available</div>
            </div>
            <div className="filter-pills">
              {tags.map(t => (
                <button
                  key={t}
                  className={`pill${filter === t ? " active" : ""}`}
                  onClick={() => setFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/shop/${product.slug}`}
                className="product-card"
              >
                {/* ankara pattern on card */}
                <svg className="product-card-pattern" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id={`cp-${product.slug}`} width="50" height="50" patternUnits="userSpaceOnUse">
                      <polygon points="25,2 48,25 25,48 2,25" fill="none" stroke="#d4a843" strokeWidth="0.7"/>
                      <circle cx="25" cy="25" r="2" fill="#d4a843" opacity="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#cp-${product.slug})`}/>
                </svg>

                <div className="product-card-visual">
                  <ProductVisual product={product} size={280} />
                </div>
                <div className="product-card-overlay"/>

                <div className="product-card-info">
                  <div className="product-card-tag">{product.tags[0]}</div>
                  <div className="product-card-name">{product.name}</div>
                  <div className="product-card-price">GH₵ {product.price.toLocaleString()}</div>
                </div>

                <div
                  className={`product-card-quick${addedSlug === product.slug ? " added" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart({ slug: product.slug, name: product.name, price: product.price, size: "M", qty: 1 });
                    setAddedSlug(product.slug);
                    setTimeout(() => setAddedSlug(null), 1800);
                  }}
                >
                  {addedSlug === product.slug ? "✓ Added" : "Quick Add"}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
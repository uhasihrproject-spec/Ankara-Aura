"use client";

/**
 * Ankara Aura — HomePage  (v3 — clean, error-free, expanded)
 *
 * Sections:
 *  01  Tagline Strip (marquee)
 *  02  Stats Bar
 *  03  Featured Collections (interactive)
 *  04  Culture Quote (full-bleed, animated)
 *  05  The Drop — editorial product grid
 *  06  Brand Story
 *  07  Process Strip (dark)
 *  08  Second Quote — editorial full-bleed
 *  09  Craftsmanship Detail Rows
 *  10  Lookbook Preview (horizontal drag-scroll)
 *  11  Signature Experience (unboxing, dark)
 *  12  As Seen On / Press Strip
 *  13  Testimonials
 *  14  Newsletter / Inner Circle
 *  15  Bottom Marquee
 */

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { getFeaturedProducts, COLLECTIONS } from "@/lib/products";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

/* ─── INTERSECTION OBSERVER HOOK ─── */
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── COUNT-UP ─── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const dur = 1400;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target]);
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      {val}{suffix}
    </span>
  );
}

/* ─── MARQUEE ─── */
function Marquee({
  items,
  speed = 45,
  reverse = false,
  dark = false,
}: {
  items: string[];
  speed?: number;
  reverse?: boolean;
  dark?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="mq-viewport">
      <div
        className="mq-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((t, i) => (
          <span key={i} className={`mq-item${dark ? " mq-item--dark" : ""}`}>
            {t}
            <span className="mq-dot" aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── COLLECTIONS SECTION ─── */
function CollectionsSection() {
  const [active, setActive] = useState(0);
  const { ref, visible } = useReveal(0.08);
  const count = COLLECTIONS.length;

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % count), 4000);
    return () => clearInterval(t);
  }, [count]);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`s reveal collections-s${visible ? " in" : ""}`}
    >
      <div className="wm wm-collections" aria-hidden>COLLECTIONS</div>
      <div className="page-w">
        <div className="cols-layout">
          <div className="cols-text">
            <p className="lbl">Collections</p>
            <nav className="cols-list" aria-label="Collections">
              {COLLECTIONS.map((col, i) => (
                <button
                  key={col.slug}
                  className={`col-btn${active === i ? " on" : ""}`}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                >
                  <span className="col-btn-num">0{i + 1}</span>
                  <span className="col-btn-stroke">{col.name}</span>
                  <span className="col-btn-fill">{col.name}</span>
                </button>
              ))}
            </nav>
            <p className="col-tagline">{COLLECTIONS[active].tagline}</p>
            <Link href={`/shop?collection=${COLLECTIONS[active].slug}`} className="arrow-link">
              <span>Explore Collection</span>
              <svg width="32" height="10" viewBox="0 0 32 10" fill="none" aria-hidden>
                <path d="M0 5h30M25 1.5l5 3.5-5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="cols-img-wrap">
            {COLLECTIONS.map((col, i) => (
              <div key={col.slug} className={`col-frame${active === i ? " on" : ""}`}>
                <img src={col.image} alt={col.name} className="col-img" />
                <div className="col-frame-label">{col.name}</div>
              </div>
            ))}
            <div className="col-dots">
              {COLLECTIONS.map((_, i) => (
                <button
                  key={i}
                  className={`col-dot${active === i ? " on" : ""}`}
                  onClick={() => setActive(i)}
                  aria-label={`Collection ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PRODUCT TILE ─── */
function ProductTile({
  product,
  index,
  layout = "portrait",
}: {
  product: Product;
  index: number;
  layout?: "portrait" | "landscape";
}) {
  const [hovered, setHovered] = useState(false);
  const img1 = product.images?.[0] ?? "/placeholder.jpg";
  const img2 = product.images?.[1] ?? img1;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={`ptile ptile--${layout}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="ptile-img-wrap">
        <img
          src={img1}
          alt={product.name}
          className={`ptile-img ptile-img--a${hovered ? " out" : ""}`}
        />
        <img
          src={img2}
          alt={product.name}
          className={`ptile-img ptile-img--b${hovered ? " in" : ""}`}
        />
        <div className="ptile-overlay">
          <span className="ptile-tag">{product.tags[0]}</span>
          <span className="ptile-cta">
            View Piece
            <svg width="20" height="7" viewBox="0 0 20 7" fill="none" aria-hidden>
              <path d="M0 3.5h18M15 1l3 2.5L15 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>
      <div className="ptile-meta">
        <span className="ptile-name">{product.name}</span>
        <span className="ptile-price">GH₵ {product.price.toLocaleString()}</span>
      </div>
    </Link>
  );
}

/* ─── FEATURED TILE (dark, editorial) ─── */
function FeaturedTile({
  product,
  index,
  variant = "compact",
  onQuickAdd,
}: {
  product: Product;
  index: number;
  variant?: "hero" | "compact" | "wide";
  onQuickAdd?: (product: Product) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const img1 = product.images?.[0] ?? null;
  const img2 = product.images?.[1] ?? img1;
  const initial = product.name.charAt(0);

  const aspectMap = {
    hero: "ptile--portrait",
    compact: "ptile--square",
    wide: "ptile--landscape",
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={`ptile ${aspectMap[variant]}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <span className="ptile-num">0{index + 1}</span>
      <div className="ptile-img-wrap">
        {img1 ? (
          <>
            <img src={img1} alt={product.name} className={`ptile-img ptile-img--a${hovered ? " out" : ""}`} />
            {img2 && <img src={img2} alt={product.name} className={`ptile-img ptile-img--b${hovered ? " in" : ""}`} />}
          </>
        ) : (
          <div className="ptile-placeholder">
            <span className="ptile-placeholder-letter">{initial}</span>
          </div>
        )}
        <div className="ptile-overlay">
          <span className="ptile-tag">{product.tags[0]}</span>
          <span className="ptile-name">{product.name}</span>
          <div className="ptile-meta-row">
            <span className="ptile-price">GH₵ {product.price.toLocaleString()}</span>
            <span className="ptile-cta">
              View Piece
              <svg width="18" height="6" viewBox="0 0 18 6" fill="none" aria-hidden>
                <path d="M0 3h16M13 1l3 2-3 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickAdd?.(product);
              }}
              className="ptile-cta"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── MAIN PAGE ─── */
export default function HomePage() {
  const featured = getFeaturedProducts();

  const statsR    = useReveal(0.2);
  const quoteR    = useReveal(0.15);
  const dropR     = useReveal(0.08);
  const storyR    = useReveal(0.08);
  const processR  = useReveal(0.1);
  const quote2R   = useReveal(0.15);
  const craftR    = useReveal(0.08);
  const lookR     = useReveal(0.1);
  const expR      = useReveal(0.08);
  const pressR    = useReveal(0.1);
  const testiR    = useReveal(0.15);
  const newsR     = useReveal(0.12);

  const [email, setEmail]   = useState("");
  const [subbed, setSubbed] = useState(false);
<<<<<<< HEAD
=======
  const [homeAddedSlug, setHomeAddedSlug] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [subLoading, setSubLoading] = useState(false);
>>>>>>> 93fb4a5713c555eeee468f1464b0285576d0304c
  const [testiIdx, setTestiIdx] = useState(0);

  const testimonials = [
    { quote: "I didn't just buy a shirt. I bought a piece of something that feels like it was made for me to carry forward.", name: "Kofi A.", city: "Accra" },
    { quote: "The unboxing alone was worth it. I've never felt like that opening a package. Every detail was considered.", name: "Ama S.", city: "Kumasi" },
    { quote: "Wearing this to the office changed how I carry myself. It's not fashion — it's presence.", name: "Kwame O.", city: "London" },
  ];

  useEffect(() => {
    const t = setInterval(() => setTestiIdx((i) => (i + 1) % testimonials.length), 5500);
    return () => clearInterval(t);
  }, [testimonials.length]);

  const handleSub = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (email.trim()) setSubbed(true);
    },
    [email]
  );

  /* drag-scroll lookbook */
  const lookRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, scrollLeft: 0 });
  const onLookDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = lookRef.current;
    if (!el) return;
    dragState.current = { dragging: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
  };
  const onLookMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = lookRef.current;
    if (!el || !dragState.current.dragging) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.4;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  };
  const onLookUp = () => {
    const el = lookRef.current;
    if (!el) return;
    dragState.current.dragging = false;
    el.style.cursor = "grab";
  };

  const handleHomeQuickAdd = (product: Product) => {
    addToCart({ slug: product.slug, name: product.name, price: product.price, size: "M", qty: 1 });
    setHomeAddedSlug(product.slug);
    setTimeout(() => setHomeAddedSlug(null), 1400);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink:    #0b0b0a;
          --cream:  #f7f6f4;
          --kente:  #d4a843;
          --gold:   #d4a843;
          --indigo: #1a3a5c;
          --forest: #2d6a4f;
          --b:      rgba(8,8,7,0.09);
          --fd:     'Bebas Neue', sans-serif;
          --fb:     'DM Sans', sans-serif;
          --fa:     'Caveat', cursive;
        }

        html { scroll-behavior: smooth; }
        body { background: var(--cream); color: var(--ink); font-family: var(--fb); overflow-x: hidden; }
        img  { display: block; max-width: 100%; }

        /* ── LAYOUT ── */
        .page-w { max-width: 1240px; margin: 0 auto; padding: 0 48px; }
        @media (max-width: 768px) { .page-w { padding: 0 20px; } }

        /* ── REVEAL SYSTEM ── */
        .s {
          opacity: 0;
          transform: translateY(48px);
          transition:
            opacity 1.1s cubic-bezier(0.16,1,0.3,1),
            transform 1.1s cubic-bezier(0.16,1,0.3,1);
        }
        .s.in { opacity: 1; transform: none; }
        .reveal { position: relative; overflow: hidden; }

        /* stagger children — with clip reveal */
        .stag {
          opacity: 0;
          transform: translateY(32px);
          clip-path: inset(0 0 100% 0);
          transition:
            opacity 0.9s cubic-bezier(0.16,1,0.3,1),
            transform 0.9s cubic-bezier(0.16,1,0.3,1),
            clip-path 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .s.in .stag { opacity: 1; transform: none; clip-path: inset(0 0 0% 0); }
        .stag:nth-child(1) { transition-delay: 0.06s; }
        .stag:nth-child(2) { transition-delay: 0.15s; }
        .stag:nth-child(3) { transition-delay: 0.24s; }
        .stag:nth-child(4) { transition-delay: 0.33s; }
        .stag:nth-child(5) { transition-delay: 0.42s; }
        .stag:nth-child(6) { transition-delay: 0.51s; }

        /* ── LABELS ── */
        .lbl {
          font-size: 9.5px; letter-spacing: 0.26em;
          text-transform: uppercase; color: rgba(8,8,7,0.35);
          margin-bottom: 20px; font-family: var(--fb);
        }

        /* ── WATERMARKS ── */
        .wm {
          position: absolute;
          font-family: var(--fd);
          letter-spacing: 0.06em;
          color: rgba(8,8,7,0.028);
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          z-index: 0;
          line-height: 1;
        }
        .wm-collections { font-size: clamp(72px, 14vw, 200px); top: 50%; left: -2%; transform: translateY(-50%); }
        .wm-quote       { font-size: clamp(100px, 22vw, 340px); top: 50%; left: 50%; transform: translate(-50%,-50%); color: rgba(247,246,244,0.055); text-align: center; }
        .wm-story       { font-size: clamp(80px, 16vw, 260px); bottom: -10%; right: -4%; opacity: 0.035; }
        .wm-craft       { font-size: clamp(60px, 10vw, 160px); top: 8%; left: -2%; }
        .wm-exp         { font-size: clamp(100px, 18vw, 280px); top: 50%; left: 50%; transform: translate(-50%,-50%); color: rgba(247,246,244,0.03); }
        .wm-newsletter  { font-size: clamp(80px, 14vw, 220px); bottom: -8%; right: -2%; }
        .wm-testi       { font-size: clamp(80px, 18vw, 260px); top: 50%; left: 50%; transform: translate(-50%,-50%); color: rgba(8,8,7,0.02); }
        .wm-press       { font-size: clamp(60px, 10vw, 150px); top: 50%; left: -2%; transform: translateY(-50%); opacity: 0.025; }
        .wm-q2          { font-size: clamp(90px, 18vw, 300px); top: 50%; left: 50%; transform: translate(-50%,-50%); color: rgba(247,246,244,0.05); }

        /* ── ARROW LINK ── */
        .arrow-link {
          display: inline-flex; align-items: center; gap: 14px;
          font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--ink);
          text-decoration: none;
          border-bottom: 1px solid var(--ink);
          padding-bottom: 5px;
          width: fit-content;
          transition: color 0.25s, border-color 0.25s, gap 0.3s;
        }
        .arrow-link:hover { color: var(--kente); border-color: var(--kente); gap: 22px; }
        .arrow-link svg { transition: transform 0.25s; }
        .arrow-link:hover svg { transform: translateX(5px); }

        .arrow-link--light {
          color: rgba(247,246,244,0.7);
          border-bottom-color: rgba(247,246,244,0.3);
        }
        .arrow-link--light:hover { color: var(--gold); border-color: var(--gold); }

        /* ═══════════════════════════════════════════
           00 — HERO SECTION
        ═══════════════════════════════════════════ */
        .hero-s {
          position: relative; overflow: hidden;
          background: var(--cream);
          border-bottom: 1px solid var(--b);
          min-height: 100svh;
          display: flex; flex-direction: column;
        }

        /* animated ankara pattern bg */
        .hero-bg-pattern {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
        }

        /* ghost ANKARA text behind everything */
        .hero-ghost {
          position: absolute; pointer-events: none; user-select: none; z-index: 1;
          font-family: var(--fd);
          font-size: clamp(110px, 18vw, 240px);
          line-height: 0.86; letter-spacing: -0.02em;
          -webkit-text-stroke: 1.2px rgba(11,11,10,0.06);
          color: transparent; white-space: nowrap;
          animation: heroGhostDrift 20s ease-in-out infinite alternate;
        }
        @keyframes heroGhostDrift {
          from { transform: translateX(-1%); }
          to   { transform: translateX(1%); }
        }

        /* eyebrow bar */
        .hero-eyebrow {
          position: relative; z-index: 3;
          display: flex; align-items: center;
          padding: 22px 48px 0;
          gap: 16px;
          opacity: 0; transform: translateY(18px);
          animation: revealUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s forwards;
        }
        .hero-eyebrow-text {
          font-family: var(--fa); font-size: 15px; color: rgba(8,8,7,0.38);
        }
        .hero-eyebrow-rule { flex: 1; height: 1px; background: var(--b); }
        .hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--kente);
          animation: kentePulse 2.5s ease-in-out infinite;
        }
        @keyframes kentePulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.6); }
        }

        /* main grid */
        .hero-grid {
          position: relative; z-index: 2;
          display: grid; grid-template-columns: 1fr 1fr;
          flex: 1;
          margin: 28px 0 0;
          border-top: 1px solid var(--b);
          border-left: 48px solid transparent;
          border-right: 48px solid transparent;
        }
        .hero-left {
          padding: 52px 48px 52px 0;
          border-right: 1px solid var(--b);
          display: flex; flex-direction: column;
          justify-content: space-between; gap: 28px;
        }
        .hero-right {
          position: relative; overflow: hidden;
          display: flex; flex-direction: column; justify-content: flex-end;
          background: rgba(8,8,7,0.025);
        }

        /* headline clip-reveal animation */
        .hero-headline-wrap { overflow: hidden; }
        .hero-headline-fill, .hero-headline-stroke {
          font-family: var(--fd);
          font-size: clamp(86px, 12.5vw, 172px);
          line-height: 0.86;
          letter-spacing: -0.01em;
          display: block;
          transform: translateY(105%);
          animation: clipReveal 1s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .hero-headline-fill  { color: var(--ink); animation-delay: 0.22s; }
        .hero-headline-stroke {
          -webkit-text-stroke: 2.5px var(--ink);
          color: transparent;
          animation-delay: 0.32s;
        }
        @keyframes clipReveal {
          from { transform: translateY(105%); }
          to   { transform: translateY(0); }
        }

        .hero-sub {
          font-family: var(--fa);
          font-size: clamp(19px, 2.5vw, 28px);
          color: rgba(8,8,7,0.45); line-height: 1.35;
          opacity: 0; transform: translateY(20px);
          animation: revealUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s forwards;
          display: block; margin-top: 12px;
        }

        .hero-body {
          font-family: var(--fa); font-size: 18px;
          line-height: 1.65; color: rgba(8,8,7,0.52);
          max-width: 360px; font-weight: 500;
          opacity: 0; transform: translateY(20px);
          animation: revealUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.65s forwards;
        }

        .hero-cta-row {
          display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
          opacity: 0; transform: translateY(20px);
          animation: revealUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.78s forwards;
        }

        /* right panel label (slides in from right) */
        .hero-label {
          position: absolute; top: 24px; left: 24px; z-index: 4;
          background: var(--ink); color: var(--cream);
          padding: 14px 18px;
          opacity: 0; transform: translateX(22px);
          animation: revealRight 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s forwards;
        }
        @keyframes revealRight {
          from { opacity: 0; transform: translateX(22px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .hero-label-sub { margin: 0; font-family: var(--fa); font-size: 12px; opacity: 0.5; }
        .hero-label-main { margin: 5px 0 0; font-family: var(--fd); font-size: 26px; letter-spacing: 0.04em; line-height: 1.1; }

        /* floating model placeholder */
        .hero-model-ph {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          z-index: 2;
          animation: modelFloat 7s ease-in-out infinite;
        }
        @keyframes modelFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-14px); }
        }
        .hero-ph-big {
          font-family: var(--fd);
          font-size: clamp(52px, 7.5vw, 96px);
          -webkit-text-stroke: 1.5px rgba(0,0,0,0.08);
          color: transparent; line-height: 0.9; text-align: center;
          letter-spacing: -0.02em;
        }
        .hero-ph-hw { font-family: var(--fa); font-size: 15px; color: rgba(0,0,0,0.2); text-align: center; margin-top: 8px; }

        /* product strip at bottom of right panel */
        .hero-strip {
          position: relative; z-index: 4;
          border-top: 1px solid var(--b);
          background: var(--cream);
          padding: 18px 24px;
          display: flex; align-items: center; justify-content: space-between; gap: 14px;
          opacity: 0;
          animation: revealUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.9s forwards;
        }
        .hero-strip-name { font-family: var(--fa); font-size: 14px; color: rgba(8,8,7,0.5); margin-bottom: 3px; }
        .hero-strip-price { font-family: var(--fd); font-size: 28px; line-height: 1; letter-spacing: 0.02em; }

        /* stats row below grid */
        .hero-stats {
          display: grid; grid-template-columns: repeat(4,1fr);
          border-left: 48px solid transparent;
          border-right: 48px solid transparent;
          border-top: 1px solid var(--b);
          margin-bottom: 0;
          position: relative; z-index: 2;
        }
        .hero-stat {
          padding: 20px 28px; border-right: 1px solid var(--b);
          opacity: 0; transform: translateY(20px);
          animation: revealUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .hero-stat:last-child { border-right: none; }
        .hero-stat:nth-child(1) { animation-delay: 1.0s; }
        .hero-stat:nth-child(2) { animation-delay: 1.1s; }
        .hero-stat:nth-child(3) { animation-delay: 1.2s; }
        .hero-stat:nth-child(4) { animation-delay: 1.3s; }
        .hero-stat-n { font-family: var(--fd); font-size: 34px; line-height: 1; color: var(--kente); }
        .hero-stat-l { font-family: var(--fa); font-size: 14px; color: rgba(8,8,7,0.38); margin-top: 3px; }

        @keyframes revealUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; border-left-width: 20px; border-right-width: 20px; }
          .hero-left { border-right: none; border-bottom: 1px solid var(--b); padding: 40px 0; }
          .hero-right { min-height: 420px; }
          .hero-eyebrow { padding: 20px 20px 0; }
          .hero-stats { grid-template-columns: 1fr 1fr; border-left-width: 20px; border-right-width: 20px; }
          .hero-stat:nth-child(2) { border-right: none; }
        }

        /* ═══════════════════════════════════════════
           01 — TAGLINE STRIP
        ═══════════════════════════════════════════ */
        .strip {
          border-top: 1px solid var(--b);
          border-bottom: 1px solid var(--b);
          height: 44px; overflow: hidden;
          display: flex; align-items: center;
          position: relative;
        }
        .strip::before, .strip::after {
          content: ''; position: absolute; top: 0; bottom: 0;
          width: 80px; z-index: 2; pointer-events: none;
        }
        .strip::before { left: 0;  background: linear-gradient(90deg, var(--cream), transparent); }
        .strip::after  { right: 0; background: linear-gradient(-90deg, var(--cream), transparent); }

        .mq-viewport { overflow: hidden; width: 100%; }
        .mq-track {
          display: flex; align-items: center;
          width: max-content;
          animation: mqScroll linear infinite;
        }
        @keyframes mqScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .strip:hover .mq-track { animation-play-state: paused; }

        .mq-item {
          font-family: var(--fd);
          font-size: 12px; letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(8,8,7,0.45);
          white-space: nowrap; padding: 0 8px;
          cursor: default; transition: color 0.2s;
        }
        .mq-item:hover { color: var(--kente); }
        .mq-item--dark  { color: rgba(247,246,244,0.3); }
        .mq-item--dark:hover { color: var(--gold); }
        .mq-dot { color: var(--kente); margin: 0 18px; font-size: 7px; opacity: 0.7; }

        /* ═══════════════════════════════════════════
           02 — STATS BAR
        ═══════════════════════════════════════════ */
        .stats-s { padding: 80px 0; border-bottom: 1px solid var(--b); }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .stat-item {
          padding: 0 40px;
          border-left: 1px solid var(--b);
          display: flex; flex-direction: column; gap: 8px;
        }
        .stat-item:first-child { border-left: none; padding-left: 0; }
        .stat-num {
          font-family: var(--fd);
          font-size: clamp(44px, 6vw, 80px);
          letter-spacing: 0.02em; line-height: 1;
          color: var(--kente);
        }
        .stat-label {
          font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(8,8,7,0.38);
        }
        .stat-sub {
          font-family: var(--fa);
          font-size: 13px; color: rgba(8,8,7,0.38); margin-top: 2px;
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 32px 0; }
          .stat-item { padding: 0 24px; }
          .stat-item:nth-child(odd) { border-left: none; padding-left: 0; }
        }
        @media (max-width: 460px) {
          .stats-grid { grid-template-columns: 1fr; }
          .stat-item { border-left: none; border-top: 1px solid var(--b); padding: 24px 0 0; }
          .stat-item:first-child { border-top: none; padding-top: 0; }
        }

        /* ═══════════════════════════════════════════
           03 — COLLECTIONS
        ═══════════════════════════════════════════ */
        .collections-s { padding: 120px 0; }
        .cols-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
        }
        .cols-text { display: flex; flex-direction: column; gap: 0; position: relative; z-index: 1; }
        .cols-list { display: flex; flex-direction: column; margin-bottom: 40px; }

        .col-btn {
          background: none; border: none; cursor: pointer;
          text-align: left; padding: 10px 0;
          border-bottom: 1px solid transparent;
          position: relative; overflow: hidden;
          display: grid;
          grid-template-columns: 44px 1fr;
          align-items: center;
          transition: border-color 0.3s;
        }
        .col-btn.on { border-bottom-color: var(--kente); }
        .col-btn-num {
          font-family: var(--fa); font-size: 13px;
          color: rgba(8,8,7,0.3);
          transition: color 0.25s;
        }
        .col-btn.on .col-btn-num { color: var(--kente); }

        .col-btn-stroke,
        .col-btn-fill {
          font-family: var(--fd);
          font-size: clamp(30px, 4vw, 56px);
          letter-spacing: 0.03em; line-height: 1.05;
          display: block;
          transition: transform 0.42s cubic-bezier(0.77,0,0.175,1), opacity 0.35s;
        }
        .col-btn-stroke {
          -webkit-text-stroke: 1px rgba(8,8,7,0.22);
          color: transparent;
        }
        .col-btn-fill {
          position: absolute;
          left: 44px; top: 10px;
          color: var(--ink);
          transform: translateY(110%);
          opacity: 0;
        }
        .col-btn.on  .col-btn-stroke { transform: translateY(-110%); opacity: 0; }
        .col-btn.on  .col-btn-fill   { transform: translateY(0); opacity: 1; }
        .col-btn:not(.on):hover .col-btn-stroke { -webkit-text-stroke-color: rgba(8,8,7,0.5); }

        .col-tagline {
          font-family: var(--fa); font-size: 17px;
          color: rgba(8,8,7,0.45); line-height: 1.65;
          max-width: 320px; margin-bottom: 32px; min-height: 56px;
        }

        .cols-img-wrap {
          position: relative; aspect-ratio: 2/3;
          background: #e8e6e2; overflow: hidden;
        }
        .col-frame {
          position: absolute; inset: 0;
          opacity: 0; transition: opacity 0.75s cubic-bezier(0.4,0,0.2,1);
        }
        .col-frame.on { opacity: 1; }
        .col-img {
          width: 100%; height: 100%; object-fit: cover;
          transform: scale(1.06);
          transition: transform 7s cubic-bezier(0.4,0,0.2,1);
        }
        .col-frame.on .col-img { transform: scale(1); }
        .col-frame-label {
          position: absolute; bottom: 20px; left: 20px;
          font-family: var(--fd); font-size: 13px;
          letter-spacing: 0.12em; color: rgba(247,246,244,0.55);
        }
        .col-dots {
          position: absolute; bottom: 20px; right: 20px;
          display: flex; gap: 6px; z-index: 2;
        }
        .col-dot {
          width: 28px; height: 2px;
          background: rgba(247,246,244,0.3);
          border: none; cursor: pointer; padding: 0;
          transition: background 0.3s, width 0.3s;
        }
        .col-dot.on { background: white; width: 44px; }

        @media (max-width: 860px) {
          .collections-s { padding: 80px 0; }
          .cols-layout { grid-template-columns: 1fr; gap: 40px; }
          .cols-img-wrap { aspect-ratio: 4/3; }
        }

        /* ═══════════════════════════════════════════
           04 — CULTURE QUOTE (dark)
        ═══════════════════════════════════════════ */
        .quote-s {
          padding: 160px 0;
          background: var(--ink);
          position: relative; overflow: hidden;
          text-align: center;
        }
        .quote-inner {
          max-width: 1000px; margin: 0 auto;
          padding: 0 48px;
          position: relative; z-index: 1;
        }
        .quote-mark {
          font-family: var(--fd);
          font-size: clamp(80px, 16vw, 200px);
          line-height: 0.5;
          color: var(--kente); opacity: 0.2;
          display: block; margin-bottom: 20px;
        }
        .quote-text {
          font-family: var(--fd);
          font-size: clamp(30px, 5.5vw, 76px);
          letter-spacing: 0.03em; line-height: 1.12;
          color: var(--cream);
        }
        .quote-text em {
          font-style: normal;
          -webkit-text-stroke: 1px rgba(247,246,244,0.4);
          color: transparent;
        }
        .quote-attr {
          margin-top: 48px;
          font-family: var(--fa);
          font-size: 16px; color: rgba(247,246,244,0.32);
          letter-spacing: 0.04em;
        }
        .quote-divider {
          width: 40px; height: 1px;
          background: var(--kente); opacity: 0.5;
          margin: 32px auto 0;
        }
        /* animated kente stripe borders */
        .quote-stripes, .quote-stripes-top {
          position: absolute; left: 0; right: 0;
          height: 4px;
          background: repeating-linear-gradient(
            90deg,
            var(--kente)  0, var(--kente)  20px,
            var(--gold)   20px, var(--gold)  40px,
            var(--indigo) 40px, var(--indigo) 60px,
            var(--forest) 60px, var(--forest) 80px
          );
          background-size: 80px 100%;
          animation: stripeMove 4s linear infinite;
        }
        .quote-stripes     { bottom: 0; }
        .quote-stripes-top { top: 0; animation-direction: reverse; }
        @keyframes stripeMove {
          from { background-position: 0 0; }
          to   { background-position: 80px 0; }
        }
        @media (max-width: 768px) {
          .quote-s { padding: 100px 0; }
          .quote-inner { padding: 0 24px; }
        }

        /* ═══════════════════════════════════════════
           05 — THE DROP (editorial, dark)
        ═══════════════════════════════════════════ */
        .drop-s {
          padding: 0;
          border-top: 1px solid var(--b);
          background: var(--ink);
          position: relative; overflow: hidden;
        }

        /* Ankara pattern bg */
        .drop-pattern {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 0;
          opacity: 0.05;
        }

        /* Header row */
        .drop-header {
          display: flex; align-items: flex-end;
          justify-content: space-between;
          padding: 80px 64px 60px;
          gap: 24px; position: relative; z-index: 2;
          border-bottom: 1px solid rgba(247,246,244,0.06);
        }
        .drop-headline {
          font-family: var(--fd);
          font-size: clamp(64px, 11vw, 160px);
          line-height: 0.85; letter-spacing: 0.02em;
          color: var(--cream);
        }
        .drop-headline-stroke {
          -webkit-text-stroke: 1.5px rgba(247,246,244,0.25);
          color: transparent; display: block;
        }
        .drop-headline-kente {
          color: var(--kente); display: block;
        }
        .drop-header-right {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 16px;
          padding-bottom: 8px;
        }
        .drop-season {
          font-family: var(--fa); font-size: 14px;
          color: rgba(247,246,244,0.3); letter-spacing: 0.06em;
        }

        /* Grid */
        .drop-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 1px;
          background: rgba(247,246,244,0.05);
          position: relative; z-index: 1;
        }
        .drop-grid.two { grid-template-columns: 1fr 1fr; }

        /* right column stack */
        .drop-right-col { display: flex; flex-direction: column; gap: 1px; }

        /* tile */
        .ptile {
          display: block; text-decoration: none; color: inherit;
          position: relative; overflow: hidden;
          background: var(--ink);
          opacity: 0; transform: translateY(36px);
          transition:
            opacity 0.85s cubic-bezier(0.16,1,0.3,1),
            transform 0.85s cubic-bezier(0.16,1,0.3,1);
        }
        .drop-s.in .ptile { opacity: 1; transform: none; }
        .ptile--portrait  .ptile-img-wrap { aspect-ratio: 3/4; }
        .ptile--landscape .ptile-img-wrap { aspect-ratio: 4/3; }
        .ptile--square    .ptile-img-wrap { aspect-ratio: 1/1; }

        /* kente sweep on hover */
        .ptile::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: repeating-linear-gradient(
            90deg,
            var(--kente) 0, var(--kente) 16px,
            var(--gold) 16px, var(--gold) 32px,
            var(--indigo) 32px, var(--indigo) 48px,
            var(--forest) 48px, var(--forest) 64px
          );
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.77,0,0.175,1);
          z-index: 5;
        }
        .ptile:hover::before { transform: scaleX(1); }

        .ptile-img-wrap { position: relative; overflow: hidden; }
        .ptile-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.9s cubic-bezier(0.4,0,0.2,1), opacity 0.45s;
        }
        .ptile-img--a { opacity: 1; transform: scale(1.02); }
        .ptile-img--a.out { opacity: 0; transform: scale(1.08); }
        .ptile-img--b { opacity: 0; transform: scale(1.08); }
        .ptile-img--b.in  { opacity: 1; transform: scale(1.02); }
        .ptile:hover .ptile-img--a:not(.out) { transform: scale(1.07); }

        /* placeholder visual for no-image */
        .ptile-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(247,246,244,0.03);
        }
        .ptile-placeholder-letter {
          font-family: var(--fd);
          font-size: clamp(80px, 12vw, 160px);
          color: transparent;
          -webkit-text-stroke: 1px rgba(247,246,244,0.1);
          letter-spacing: 0.05em;
          user-select: none;
        }

        .ptile-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: flex-end;
          padding: 28px;
          background: linear-gradient(to top, rgba(8,8,7,0.75) 0%, rgba(8,8,7,0.1) 55%, transparent 100%);
          z-index: 3;
        }

        /* number badge */
        .ptile-num {
          position: absolute; top: 20px; left: 20px; z-index: 4;
          font-family: var(--fa); font-size: 12px;
          color: rgba(247,246,244,0.3); letter-spacing: 0.06em;
        }

        .ptile-tag {
          font-family: var(--fd); font-size: 9px; letter-spacing: 0.26em;
          text-transform: uppercase; color: var(--kente);
          margin-bottom: 6px; display: block;
        }
        .ptile-name {
          font-family: var(--fd);
          font-size: clamp(20px, 2.5vw, 34px);
          letter-spacing: 0.05em; color: var(--cream); line-height: 1;
          transform: translateY(12px);
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .ptile:hover .ptile-name { transform: translateY(0); }

        .ptile-meta-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 10px;
          transform: translateY(12px); opacity: 0;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1) 0.05s, opacity 0.35s 0.05s;
        }
        .ptile:hover .ptile-meta-row { transform: translateY(0); opacity: 1; }
        .ptile-price {
          font-family: var(--fa); font-size: 15px; color: var(--gold);
        }
        .ptile-cta {
          display: flex; align-items: center; gap: 8px;
          font-size: 9px; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(247,246,244,0.7);
          border-bottom: 1px solid rgba(247,246,244,0.3);
          padding-bottom: 2px;
        }

        /* drop footer */
        .drop-footer {
          padding: 40px 64px;
          border-top: 1px solid rgba(247,246,244,0.06);
          display: flex; justify-content: space-between; align-items: center;
          position: relative; z-index: 2;
        }
        .drop-footer-count {
          font-family: var(--fa); font-size: 14px;
          color: rgba(247,246,244,0.28);
        }

        @media (max-width: 900px) {
          .drop-header { padding: 56px 24px 40px; }
          .drop-grid { grid-template-columns: 1fr; }
          .drop-right-col { display: contents; }
          .drop-footer { padding: 32px 24px; flex-direction: column; gap: 16px; align-items: flex-start; }
        }

        /* ═══════════════════════════════════════════
           06 — BRAND STORY
        ═══════════════════════════════════════════ */
        .story-s {
          padding: 140px 0;
          border-top: 1px solid var(--b);
          overflow: hidden; position: relative;
        }
        .story-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px; align-items: center;
          position: relative; z-index: 1;
        }
        .story-big {
          font-family: var(--fd);
          font-size: clamp(54px, 8.5vw, 120px);
          line-height: 0.9; letter-spacing: 0.02em;
        }
        .story-big .sk {
          -webkit-text-stroke: 1.5px var(--ink);
          color: transparent; display: block;
        }
        .story-accent { width: 36px; height: 2px; background: var(--kente); margin-top: 36px; }
        .story-right { display: flex; flex-direction: column; gap: 24px; }
        .story-p {
          font-size: 15px; line-height: 1.9;
          color: rgba(8,8,7,0.62); font-weight: 300;
        }
        .story-p strong { color: var(--ink); font-weight: 500; }
        .story-pillars {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px 20px;
          border-top: 1px solid var(--b); padding-top: 24px;
        }
        .sp {
          font-family: var(--fd); font-size: 12px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(8,8,7,0.4);
          display: flex; align-items: center; gap: 8px;
        }
        .sp::before { content: ''; width: 4px; height: 4px; background: var(--kente); border-radius: 50%; flex-shrink: 0; }
        @media (max-width: 860px) {
          .story-s { padding: 80px 0; }
          .story-layout { grid-template-columns: 1fr; gap: 48px; }
        }

        /* ═══════════════════════════════════════════
           07 — PROCESS STRIP (dark)
        ═══════════════════════════════════════════ */
        .process-s {
          border-top: 1px solid var(--b);
          overflow: hidden;
          background: var(--ink);
        }
        .process-row {
          display: flex; align-items: stretch; overflow: hidden;
        }
        .process-item {
          flex: 1; padding: 64px 40px;
          border-right: 1px solid rgba(247,246,244,0.07);
          position: relative; overflow: hidden;
          transition: background 0.4s; cursor: default;
        }
        .process-item:last-child { border-right: none; }
        .process-item::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 0;
          background: var(--kente); opacity: 0.07;
          transition: height 0.45s cubic-bezier(0.4,0,0.2,1);
        }
        .process-item:hover::before { height: 100%; }
        .process-item:hover .pi-num { color: var(--gold); }
        .pi-num {
          font-family: var(--fa); font-size: 12px; color: var(--kente);
          display: block; margin-bottom: 18px; transition: color 0.3s;
        }
        .pi-name {
          font-family: var(--fd);
          font-size: clamp(18px, 2.5vw, 30px);
          letter-spacing: 0.06em; color: var(--cream);
          line-height: 1; margin-bottom: 16px;
        }
        .pi-desc {
          font-size: 12px; line-height: 1.8;
          color: rgba(247,246,244,0.38); font-weight: 300;
        }
        @media (max-width: 768px) {
          .process-row { flex-direction: column; }
          .process-item {
            border-right: none; border-bottom: 1px solid rgba(247,246,244,0.07);
            padding: 40px 24px;
          }
          .process-item:last-child { border-bottom: none; }
        }

        /* ═══════════════════════════════════════════
           08 — SECOND QUOTE (light, editorial)
        ═══════════════════════════════════════════ */
        .quote2-s {
          padding: 140px 0;
          border-top: 1px solid var(--b);
          position: relative; overflow: hidden;
        }
        .quote2-inner {
          max-width: 900px; margin: 0 auto;
          padding: 0 48px;
          position: relative; z-index: 1;
        }
        .quote2-num {
          font-family: var(--fa); font-size: 13px;
          color: var(--kente); display: block; margin-bottom: 28px;
          letter-spacing: 0.08em;
        }
        .quote2-text {
          font-family: var(--fd);
          font-size: clamp(36px, 6.5vw, 90px);
          letter-spacing: 0.025em; line-height: 1.05;
          color: var(--ink);
        }
        .quote2-text .hollow {
          -webkit-text-stroke: 1.5px var(--ink);
          color: transparent;
        }
        .quote2-attr {
          margin-top: 40px;
          display: flex; align-items: center; gap: 20px;
        }
        .quote2-line { flex: 1; max-width: 60px; height: 1px; background: var(--kente); opacity: 0.5; }
        .quote2-name {
          font-family: var(--fa); font-size: 15px; color: rgba(8,8,7,0.38);
        }
        @media (max-width: 768px) {
          .quote2-s { padding: 80px 0; }
          .quote2-inner { padding: 0 20px; }
        }

        /* ═══════════════════════════════════════════
           09 — CRAFTSMANSHIP
        ═══════════════════════════════════════════ */
        .craft-s { padding: 120px 0; position: relative; overflow: hidden; }
        .craft-head {
          display: grid; grid-template-columns: 1fr auto;
          align-items: end; gap: 60px; margin-bottom: 72px;
        }
        .craft-title {
          font-family: var(--fd);
          font-size: clamp(48px, 7vw, 100px);
          line-height: 0.9; letter-spacing: 0.02em;
        }
        .craft-title .sk {
          -webkit-text-stroke: 1.5px var(--ink);
          color: transparent; display: block;
        }
        .craft-note {
          font-family: var(--fa); font-size: 15px;
          color: rgba(8,8,7,0.38); max-width: 220px;
          text-align: right; line-height: 1.6;
        }
        .craft-rows { position: relative; z-index: 1; }
        .craft-row {
          display: grid;
          grid-template-columns: 56px 1fr 1fr;
          gap: 40px; align-items: start;
          padding: 36px 0;
          border-bottom: 1px solid var(--b);
          position: relative; overflow: hidden;
          transition: padding-left 0.35s; cursor: default;
        }
        .craft-row::after {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0; width: 0;
          background: var(--kente); opacity: 0.04;
          transition: width 0.45s cubic-bezier(0.4,0,0.2,1);
        }
        .craft-row:hover { padding-left: 12px; }
        .craft-row:hover::after { width: 100%; }
        .craft-row:hover .cr-num { color: var(--kente); }
        .cr-num {
          font-family: var(--fa); font-size: 13px;
          color: rgba(8,8,7,0.28); margin-top: 8px;
          transition: color 0.3s;
        }
        .cr-name {
          font-family: var(--fd);
          font-size: clamp(22px, 3.2vw, 44px);
          letter-spacing: 0.04em; color: var(--ink); line-height: 1;
        }
        .cr-desc {
          font-size: 13px; line-height: 1.8;
          color: rgba(8,8,7,0.5); font-weight: 300; margin-top: 6px;
        }
        @media (max-width: 768px) {
          .craft-s { padding: 80px 0; }
          .craft-head { grid-template-columns: 1fr; gap: 20px; }
          .craft-note { text-align: left; }
          .craft-row { grid-template-columns: 40px 1fr; gap: 16px; }
          .cr-desc { display: none; }
        }

        /* ═══════════════════════════════════════════
           10 — LOOKBOOK (horizontal scroll)
        ═══════════════════════════════════════════ */
        .look-s { padding: 100px 0; border-top: 1px solid var(--b); overflow: hidden; }
        .look-head {
          display: flex; align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 40px; gap: 20px;
          padding: 0 48px;
        }
        .look-title {
          font-family: var(--fd);
          font-size: clamp(40px, 6vw, 84px);
          letter-spacing: 0.03em; line-height: 0.9;
        }
        .look-title .sk {
          -webkit-text-stroke: 1.5px var(--ink);
          color: transparent; display: block;
        }
        .look-hint {
          font-family: var(--fa); font-size: 13px;
          color: rgba(8,8,7,0.35); align-self: flex-end;
          margin-bottom: 8px; white-space: nowrap;
        }
        .look-scroll {
          display: flex; gap: 3px;
          overflow-x: auto;
          padding: 0 48px 24px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          cursor: grab;
          user-select: none;
        }
        .look-scroll::-webkit-scrollbar { display: none; }
        .look-item {
          flex-shrink: 0; position: relative; overflow: hidden;
          background: #e0dedd;
        }
        .look-item:nth-child(odd)  { width: clamp(220px, 28vw, 380px); aspect-ratio: 2/3; }
        .look-item:nth-child(even) { width: clamp(280px, 36vw, 480px); aspect-ratio: 4/5; align-self: flex-end; }
        .look-item-inner {
          width: 100%; height: 100%;
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .look-item:hover .look-item-inner { transform: scale(1.03); }
        .look-item-label {
          position: absolute; bottom: 16px; left: 16px;
          font-family: var(--fd); font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(247,246,244,0.65);
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .look-head { padding: 0 20px; flex-direction: column; align-items: flex-start; gap: 12px; }
          .look-scroll { padding: 0 20px 20px; }
        }

        /* ═══════════════════════════════════════════
           11 — SIGNATURE EXPERIENCE (dark)
        ═══════════════════════════════════════════ */
        .exp-s {
          padding: 140px 0;
          background: var(--ink);
          position: relative; overflow: hidden;
        }
        .exp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px; margin-top: 72px;
        }
        .exp-item {
          padding: 40px 32px;
          border: 1px solid rgba(247,246,244,0.06);
          display: flex; flex-direction: column; gap: 14px;
          position: relative; overflow: hidden;
          transition: border-color 0.35s;
          background: rgba(247,246,244,0.012);
          cursor: default;
        }
        .exp-item::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 0;
          background: rgba(200,80,42,0.07);
          transition: height 0.45s cubic-bezier(0.4,0,0.2,1);
        }
        .exp-item::after {
          content: '';
          position: absolute; top: 0; left: 0; width: 0; height: 2px;
          background: linear-gradient(90deg, var(--kente), var(--gold));
          transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .exp-item:hover { border-color: rgba(200,80,42,0.3); }
        .exp-item:hover::before { height: 100%; }
        .exp-item:hover::after  { width: 100%; }
        .exp-num {
          font-family: var(--fa); font-size: 12px; color: var(--kente);
        }
        .exp-name {
          font-family: var(--fd);
          font-size: clamp(18px, 2.5vw, 28px);
          letter-spacing: 0.06em; color: var(--cream); line-height: 1;
        }
        .exp-desc {
          font-size: 12px; line-height: 1.8;
          color: rgba(247,246,244,0.36); font-weight: 300;
        }
        .exp-title {
          font-family: var(--fd);
          font-size: clamp(44px, 7vw, 96px);
          line-height: 0.9; letter-spacing: 0.03em; color: var(--cream);
        }
        .exp-title em {
          font-style: normal;
          -webkit-text-stroke: 1px rgba(247,246,244,0.32);
          color: transparent; display: block;
        }
        .exp-note {
          margin-top: 56px; padding-top: 40px;
          border-top: 1px solid rgba(247,246,244,0.07);
          display: flex; align-items: center; gap: 40px;
        }
        .exp-note-text {
          font-family: var(--fa); font-size: 17px;
          color: rgba(247,246,244,0.4); max-width: 480px; line-height: 1.65;
        }
        .exp-note-text strong { color: rgba(247,246,244,0.7); }
        .exp-gold-bar {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, var(--kente), var(--gold), transparent);
          opacity: 0.35;
        }
        @media (max-width: 860px) {
          .exp-s { padding: 80px 0; }
          .exp-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 540px) {
          .exp-grid { grid-template-columns: 1fr; }
          .exp-note { flex-direction: column; }
        }

        /* ═══════════════════════════════════════════
           12 — PRESS / AS SEEN ON
        ═══════════════════════════════════════════ */
        .press-s {
          padding: 80px 0;
          border-top: 1px solid var(--b);
          position: relative; overflow: hidden;
        }
        .press-inner {
          display: flex; flex-direction: column;
          align-items: center; gap: 40px;
          position: relative; z-index: 1;
        }
        .press-label {
          font-family: var(--fa); font-size: 14px;
          color: rgba(8,8,7,0.3); letter-spacing: 0.06em;
        }
        .press-logos {
          display: flex; align-items: center;
          gap: 0; flex-wrap: wrap;
          justify-content: center;
        }
        .press-logo-wrap {
          display: flex; align-items: center;
        }
        .press-logo {
          font-family: var(--fd);
          font-size: clamp(18px, 3vw, 28px);
          letter-spacing: 0.14em;
          color: rgba(8,8,7,0.15);
          cursor: default;
          transition: color 0.3s, letter-spacing 0.3s;
          text-transform: uppercase;
        }
        .press-logo:hover { color: rgba(8,8,7,0.4); letter-spacing: 0.22em; }
        .press-divider {
          width: 3px; height: 3px; background: var(--b);
          border-radius: 50%; flex-shrink: 0;
        }
        @media (max-width: 600px) {
          .press-logos { gap: 32px; }
          .press-divider { display: none; }
        }

        /* ═══════════════════════════════════════════
           13 — TESTIMONIALS (carousel)
        ═══════════════════════════════════════════ */
        .testi-s {
          padding: 120px 0;
          border-top: 1px solid var(--b);
          position: relative; overflow: hidden;
        }
        .testi-inner {
          max-width: 860px; margin: 0 auto;
          padding: 0 48px; text-align: center;
          position: relative; z-index: 1;
        }
        .testi-bq-mark {
          font-family: var(--fd);
          font-size: clamp(80px, 14vw, 160px);
          line-height: 0.55; color: var(--kente); opacity: 0.14;
          display: block; margin-bottom: 8px;
        }
        .testi-slides { position: relative; min-height: 160px; }
        .testi-slide {
          position: absolute; inset: 0;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1);
          pointer-events: none;
        }
        .testi-slide.active {
          opacity: 1; transform: none;
          pointer-events: auto; position: relative;
        }
        .testi-quote {
          font-family: var(--fd);
          font-size: clamp(20px, 3.5vw, 40px);
          letter-spacing: 0.03em; line-height: 1.2;
          color: var(--ink); margin-bottom: 36px;
        }
        .testi-divider { width: 36px; height: 1px; background: var(--b); margin: 0 auto 20px; }
        .testi-name {
          font-family: var(--fa); font-size: 14px;
          color: rgba(8,8,7,0.38); letter-spacing: 0.04em;
        }
        .testi-dots {
          display: flex; justify-content: center; gap: 8px; margin-top: 40px;
        }
        .testi-dot {
          width: 24px; height: 2px;
          background: rgba(8,8,7,0.15);
          border: none; cursor: pointer; padding: 0;
          transition: background 0.3s, width 0.3s;
        }
        .testi-dot.on { background: var(--kente); width: 40px; }
        @media (max-width: 768px) { .testi-inner { padding: 0 24px; } }

        /* ═══════════════════════════════════════════
           14 — NEWSLETTER
        ═══════════════════════════════════════════ */
        .news-s {
          padding: 140px 0;
          border-top: 1px solid var(--b);
          position: relative; overflow: hidden;
        }
        .news-layout {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
          position: relative; z-index: 1;
        }
        .news-title {
          font-family: var(--fd);
          font-size: clamp(48px, 7vw, 100px);
          line-height: 0.9; letter-spacing: 0.02em;
        }
        .news-title em {
          font-style: normal;
          -webkit-text-stroke: 1.5px var(--ink);
          color: transparent; display: block;
        }
        .news-right { display: flex; flex-direction: column; gap: 24px; }
        .news-desc {
          font-family: var(--fa); font-size: 17px;
          color: rgba(8,8,7,0.42); line-height: 1.65;
        }
        .news-form {
          display: flex; flex-direction: column;
          border-top: 1px solid var(--ink);
          border-bottom: 1px solid var(--ink);
        }
        .news-row { display: flex; }
        .news-input {
          flex: 1; padding: 18px 0;
          border: none; background: transparent;
          font-family: var(--fb); font-size: 14px;
          color: var(--ink); outline: none;
          letter-spacing: 0.04em;
        }
        .news-input::placeholder { color: rgba(8,8,7,0.28); }
        .news-btn {
          background: none; border: none;
          border-left: 1px solid var(--ink);
          padding: 18px 24px; cursor: pointer;
          font-family: var(--fb);
          font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--ink);
          transition: background 0.25s, color 0.25s;
          white-space: nowrap;
        }
        .news-btn:hover { background: var(--ink); color: var(--cream); }
        .news-success {
          font-family: var(--fa); font-size: 16px;
          color: var(--forest); padding: 18px 0;
        }
        .news-fine {
          font-size: 9.5px; letter-spacing: 0.14em;
          text-transform: uppercase; color: rgba(8,8,7,0.22);
        }
        @media (max-width: 860px) {
          .news-s { padding: 80px 0; }
          .news-layout { grid-template-columns: 1fr; gap: 48px; }
        }

        /* ═══════════════════════════════════════════
           BOTTOM MARQUEE STRIP
        ═══════════════════════════════════════════ */
        .bottom-strip {
          border-top: 1px solid var(--b);
          height: 44px; overflow: hidden;
          display: flex; align-items: center;
          position: relative;
          background: var(--ink);
        }
        .bottom-strip .mq-dot { color: var(--gold); }

        /* ── global responsive ── */
        @media (max-width: 768px) {
          .story-s  { padding: 80px 0; }
          .craft-s  { padding: 80px 0; }
          .look-s   { padding: 72px 0; }
          .testi-s  { padding: 80px 0; }
          .quote2-s { padding: 80px 0; }
        }
      `}</style>

      {/* ══════════════════════════════════════════
          01 — TAGLINE STRIP
      ══════════════════════════════════════════ */}
      <div className="strip" aria-hidden="true">
        <Marquee
          items={[
            "Crafted in Culture",
            "Worn with Presence",
            "Built for Legacy",
            "African Soul",
            "Street Luxury",
            "Modern Elegance",
            "Quiet Power",
            "Rooted Identity",
            "Woven with Intention",
          ]}
          speed={48}
        />
      </div>

      {/* ══════════════════════════════════════════
          02 — STATS BAR
      ══════════════════════════════════════════ */}
      <section
        ref={statsR.ref as React.RefObject<HTMLElement>}
        className={`s stats-s${statsR.visible ? " in" : ""}`}
      >
        <div className="page-w">
          <div className="stats-grid">
            {[
              { num: 100, suffix: "%", label: "Authentic Fabric",  sub: "Sourced from Ghana" },
              { num: 4,   suffix: "",  label: "Collections",       sub: "Each with a purpose" },
              { num: 6,   suffix: "",  label: "Box Elements",      sub: "In every order" },
              { num: 1,   suffix: "",  label: "Standard",          sub: "Uncompromising" },
            ].map((st, i) => (
              <div key={i} className="stat-item stag">
                <span className="stat-num">
                  <CountUp target={st.num} suffix={st.suffix} />
                </span>
                <span className="stat-label">{st.label}</span>
                <span className="stat-sub">{st.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          03 — COLLECTIONS
      ══════════════════════════════════════════ */}
      <CollectionsSection />

      {/* ══════════════════════════════════════════
          04 — CULTURE QUOTE (dark)
      ══════════════════════════════════════════ */}
      <section
        ref={quoteR.ref as React.RefObject<HTMLElement>}
        className={`s quote-s${quoteR.visible ? " in" : ""}`}
      >
        <div className="wm wm-quote" aria-hidden>AURA</div>
        <div className="quote-stripes-top" aria-hidden />
        <div className="quote-inner">
          <span className="quote-mark" aria-hidden>&ldquo;</span>
          <blockquote className="quote-text">
            Africa didn&apos;t just give the world <em>pattern —</em>
            <br />it gave it a reason to look.
          </blockquote>
          <div className="quote-divider" />
          <p className="quote-attr">— The Ankara Aura Philosophy</p>
        </div>
        <div className="quote-stripes" aria-hidden />
      </section>

      {/* ══════════════════════════════════════════
          05 — THE DROP (dark editorial)
      ══════════════════════════════════════════ */}
      <section
        ref={dropR.ref as React.RefObject<HTMLElement>}
        className={`s drop-s${dropR.visible ? " in" : ""}`}
      >
        {/* ankara pattern bg */}
        <svg className="drop-pattern" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <pattern id="dp" width="80" height="80" patternUnits="userSpaceOnUse">
              <polygon points="40,3 77,40 40,77 3,40" fill="none" stroke="#d4a843" strokeWidth="0.8"/>
              <polygon points="40,20 60,40 40,60 20,40" fill="none" stroke="#d4a843" strokeWidth="0.5"/>
              <circle cx="40" cy="40" r="2" fill="#d4a843" opacity="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dp)"/>
        </svg>

        {/* header */}
        <div className="drop-header">
          <h2 className="drop-headline">
            <span className="drop-headline-kente">THE</span>
            <span className="drop-headline-stroke">DROP</span>
          </h2>
          <div className="drop-header-right">
            <span className="drop-season">{homeAddedSlug ? "Added to bag ✓" : "SS 2025 — Featured Pieces"}</span>
            <Link href="/shop" className="arrow-link arrow-link--light">
              <span>View All Pieces</span>
              <svg width="28" height="9" viewBox="0 0 28 9" fill="none" aria-hidden>
                <path d="M0 4.5h26M22 1.5l4 3-4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* grid */}
        <div className={`drop-grid${featured.length <= 2 ? " two" : ""}`}>
          {/* hero tile — tall left */}
          {featured[0] && (
            <FeaturedTile product={featured[0]} index={0} variant="hero" onQuickAdd={handleHomeQuickAdd} />
          )}
          {/* right column */}
          <div className="drop-right-col">
            {featured.slice(1, 3).map((p, i) => (
              <FeaturedTile key={p.slug} product={p} index={i + 1} variant="compact" onQuickAdd={handleHomeQuickAdd} />
            ))}
          </div>
          {/* fourth tile spans full */}
          {featured[3] && (
            <div style={{ gridColumn: featured.length <= 2 ? "auto" : "1 / -1" }}>
              <FeaturedTile product={featured[3]} index={3} variant="wide" onQuickAdd={handleHomeQuickAdd} />
            </div>
          )}
        </div>

        {/* footer */}
        <div className="drop-footer">
          <span className="drop-footer-count">{featured.length} pieces this season</span>
          <Link href="/shop" className="arrow-link arrow-link--light">
            <span>Shop the Full Drop</span>
            <svg width="28" height="9" viewBox="0 0 28 9" fill="none" aria-hidden>
              <path d="M0 4.5h26M22 1.5l4 3-4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          06 — BRAND STORY
      ══════════════════════════════════════════ */}
      <section
        ref={storyR.ref as React.RefObject<HTMLElement>}
        className={`s story-s${storyR.visible ? " in" : ""}`}
      >
        <div className="wm wm-story" aria-hidden>ANKARA</div>
        <div className="page-w">
          <div className="story-layout">
            <div>
              <p className="lbl stag">Our Vision</p>
              <h2 className="story-big stag">
                More<br />Than<br /><span className="sk">Clothes.</span>
              </h2>
              <div className="story-accent stag" />
            </div>
            <div className="story-right">
              <p className="story-p stag">
                Ankara Aura was born from a belief that{" "}
                <strong>African textile culture</strong> deserves a seat at
                the table of modern luxury — not as a novelty, but as a
                foundation.
              </p>
              <p className="story-p stag">
                We take the geometry of Kente, the symbolism of Adinkra, and
                the vibrancy of wax print, then distil them into{" "}
                <strong>pieces built for contemporary living</strong>. Quiet.
                Intentional. Unmistakably ours.
              </p>
              <p className="story-p stag">
                This is not heritage preserved behind glass. This is{" "}
                <strong>culture worn with presence</strong> — every day, in
                every room.
              </p>
              <div className="story-pillars stag">
                {["Cultural Roots", "Modern Identity", "African Elegance", "Quiet Power"].map((pl) => (
                  <div key={pl} className="sp">{pl}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          07 — PROCESS STRIP (dark)
      ══════════════════════════════════════════ */}
      <section
        ref={processR.ref as React.RefObject<HTMLElement>}
        className={`s process-s${processR.visible ? " in" : ""}`}
      >
        <div className="process-row">
          {[
            { num: "01", name: "Source",    desc: "We begin in the markets of Accra and Kumasi. No synthetic substitutes. No imported imitations." },
            { num: "02", name: "Design",    desc: "Pattern, proportion, placement — every decision made by hand before a single seam is cut." },
            { num: "03", name: "Construct", desc: "Local craftsmanship. Expert hands. A process that respects the fabric and the people who made it." },
            { num: "04", name: "Release",   desc: "When the piece is right, it releases. Not before. We would rather wait than compromise." },
          ].map((item, i) => (
            <div key={i} className="process-item stag" style={{ transitionDelay: `${i * 0.08}s` }}>
              <span className="pi-num">{item.num}</span>
              <h3 className="pi-name">{item.name}</h3>
              <p className="pi-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          08 — SECOND QUOTE (editorial, light)
      ══════════════════════════════════════════ */}
      <section
        ref={quote2R.ref as React.RefObject<HTMLElement>}
        className={`s quote2-s${quote2R.visible ? " in" : ""}`}
      >
        <div className="wm wm-q2" aria-hidden>WORN</div>
        <div className="quote2-inner">
          <span className="quote2-num">— A note on purpose</span>
          <blockquote className="quote2-text">
            Clothing that knows <span className="hollow">where it came from</span>
            <br />never forgets where it is going.
          </blockquote>
          <div className="quote2-attr">
            <div className="quote2-line" />
            <p className="quote2-name">The Ankara Aura Standard</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          09 — CRAFTSMANSHIP
      ══════════════════════════════════════════ */}
      <section
        ref={craftR.ref as React.RefObject<HTMLElement>}
        className={`s craft-s${craftR.visible ? " in" : ""}`}
      >
        <div className="wm wm-craft" aria-hidden>CRAFT</div>
        <div className="page-w">
          <div className="craft-head">
            <h2 className="craft-title">
              The Detail<br /><span className="sk">Is The Work.</span>
            </h2>
            <p className="craft-note">
              Four pillars that define how every Ankara Aura piece is made.
            </p>
          </div>
          <div className="craft-rows">
            {[
              { num: "01", name: "Fabric Selection",   desc: "Only cloths with genuine cultural lineage. Sourced from Ghanaian weavers and curated African textile markets. Nothing mass-produced." },
              { num: "02", name: "Precision Tailoring", desc: "Every seam is intentional. We pattern-cut around print geometry so the fabric tells its own story, undisturbed." },
              { num: "03", name: "Cultural Geometry",   desc: "Adinkra symbolism. Kente proportions. Wax print scale. Each pattern placement is chosen with meaning, not randomness." },
              { num: "04", name: "Modern Structure",    desc: "Clean silhouettes that sit between streetwear ease and tailored restraint. Built to wear across contexts without apology." },
            ].map((item, i) => (
              <div
                key={i}
                className="craft-row stag"
                style={{ transitionDelay: `${i * 0.09}s` }}
              >
                <span className="cr-num">{item.num}</span>
                <span className="cr-name">{item.name}</span>
                <p className="cr-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          10 — LOOKBOOK PREVIEW
      ══════════════════════════════════════════ */}
      <section
        ref={lookR.ref as React.RefObject<HTMLElement>}
        className={`s look-s${lookR.visible ? " in" : ""}`}
      >
        <div className="look-head">
          <div>
            <p className="lbl">Lookbook</p>
            <h2 className="look-title">
              The<br /><span className="sk">Visual.</span>
            </h2>
          </div>
          <span className="look-hint">← drag to explore →</span>
        </div>
        <div
          ref={lookRef}
          className="look-scroll"
          onMouseDown={onLookDown}
          onMouseMove={onLookMove}
          onMouseUp={onLookUp}
          onMouseLeave={onLookUp}
        >
          {[
            { label: "Ankara Core",       bg: "#d4a843" },
            { label: "Monochrome Series", bg: "#1a1a1a" },
            { label: "Limited Drop",      bg: "#1a3a5c" },
            { label: "Signature Cuts",    bg: "#2d6a4f" },
            { label: "Kente Details",     bg: "#d4a843" },
            { label: "Street Luxury",     bg: "#8b2635" },
          ].map((item, i) => (
            <div
              key={i}
              className="look-item"
              style={{ background: item.bg }}
            >
              <div
                className="look-item-inner"
                style={{
                  background: `repeating-linear-gradient(
                    135deg,
                    rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px,
                    transparent 2px, transparent 12px
                  )`,
                }}
              />
              <span className="look-item-label">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          11 — SIGNATURE EXPERIENCE (dark)
      ══════════════════════════════════════════ */}
      <section
        ref={expR.ref as React.RefObject<HTMLElement>}
        className={`s exp-s${expR.visible ? " in" : ""}`}
      >
        <div className="wm wm-exp" aria-hidden>AURA</div>
        <div className="page-w">
          <p className="lbl" style={{ color: "rgba(247,246,244,0.28)" }}>The Unboxing</p>
          <h2 className="exp-title">
            The Package
            <em>Is the Message.</em>
          </h2>
          <div className="exp-grid">
            {[
              { num: "I",   name: "The Garment",        desc: "Folded with precision. Tissue-wrapped. Presented as an object worth receiving." },
              { num: "II",  name: "Branded Hanger",     desc: "Solid wood. Ankara Aura mark. Because how it hangs matters as much as how it fits." },
              { num: "III", name: "100-Page Hardcover",  desc: "A book on African textile culture, Adinkra symbolism, and the story behind every fabric." },
              { num: "IV",  name: "Handwritten Letter",  desc: "Personal. Not printed. Because you chose Ankara Aura, and that means something." },
              { num: "V",   name: "Magnetic Luxury Box", desc: "Heavy board. Matte finish. Kente-stripe ribbon. Opens with intention. Keeps forever." },
              { num: "VI",  name: "Transparent Lid",     desc: "See what you're opening before you open it. Restraint as theatre." },
            ].map((item, i) => (
              <div
                key={i}
                className="exp-item stag"
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <span className="exp-num">{item.num}</span>
                <h3 className="exp-name">{item.name}</h3>
                <p className="exp-desc">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="exp-note">
            <p className="exp-note-text">
              <strong>Every order ships as one complete experience.</strong>{" "}
              The garment is only part of what arrives.
            </p>
            <div className="exp-gold-bar" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          12 — PRESS / AS SEEN ON
      ══════════════════════════════════════════ */}
      <section
        ref={pressR.ref as React.RefObject<HTMLElement>}
        className={`s press-s${pressR.visible ? " in" : ""}`}
      >
        <div className="wm wm-press" aria-hidden>PRESS</div>
        <div className="page-w">
          <div className="press-inner">
            <p className="press-label">As featured in</p>
            <div className="press-logos">
              {["Vanguard", "Pulse GH", "Glam Africa", "Afar Magazine", "The Native"].map((name, i) => (
                <div key={name} className="press-logo-wrap">
                  {i > 0 && <div className="press-divider" />}
                  <span className="press-logo">{name}</span>
                </div>
              ))}
              
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          13 — TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section
        ref={testiR.ref as React.RefObject<HTMLElement>}
        className={`s testi-s${testiR.visible ? " in" : ""}`}
      >
        <div className="wm wm-testi" aria-hidden>WORN</div>
        <div className="testi-inner">
          <span className="testi-bq-mark" aria-hidden>&ldquo;</span>
          <div className="testi-slides">
            {testimonials.map((t, i) => (
              <div key={i} className={`testi-slide${testiIdx === i ? " active" : ""}`}>
                <blockquote className="testi-quote">{t.quote}</blockquote>
                <div className="testi-divider" />
                <p className="testi-name">— {t.name}, {t.city}</p>
              </div>
            ))}
          </div>
          <div className="testi-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testi-dot${testiIdx === i ? " on" : ""}`}
                onClick={() => setTestiIdx(i)}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          14 — NEWSLETTER
      ══════════════════════════════════════════ */}
      <section
        ref={newsR.ref as React.RefObject<HTMLElement>}
        className={`s news-s${newsR.visible ? " in" : ""}`}
      >
        <div className="wm wm-newsletter" aria-hidden>CIRCLE</div>
        <div className="page-w">
          <div className="news-layout">
            <div>
              <p className="lbl stag">Stay Connected</p>
              <h2 className="news-title stag">
                Enter the
                <em>Inner Circle.</em>
              </h2>
            </div>
            <div className="news-right">
              <p className="news-desc stag">
                New drops. Cultural stories. Early access to limited pieces.
                <br />No noise — only what matters.
              </p>
              {subbed ? (
                <p className="news-success">You&apos;re in. Welcome to the circle.</p>
              ) : (
                <form className="news-form stag" onSubmit={handleSub}>
                  <div className="news-row">
                    <input
                      className="news-input"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="news-btn">Join</button>
                  </div>
                </form>
              )}
              <p className="news-fine stag">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          15 — BOTTOM MARQUEE (dark)
      ══════════════════════════════════════════ */}
      <div className="bottom-strip" aria-hidden="true">
        <Marquee
          items={[
            "ANKARA AURA",
            "STREET LUXURY",
            "AFRICAN SOUL",
            "CRAFTED IN CULTURE",
            "BUILT FOR LEGACY",
            "WORN WITH PRESENCE",
          ]}
          speed={30}
          reverse
          dark
        />
      </div>
    </>
  );
}
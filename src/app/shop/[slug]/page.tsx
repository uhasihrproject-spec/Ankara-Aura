"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { PRODUCTS, getProduct } from "@/lib/products";

/* ── reuse ProductVisual from shop page (or import it) ── */
function ProductVisual({ product, size = 420 }) {
  const colors = {
    "ankara-oversized-tee": { bg: "#1a1a1a", accent: "#c8502a", stripe: "#d4a843" },
    "kente-blazer":          { bg: "#0d1f12", accent: "#2d6a4f", stripe: "#c8502a" },
    "mono-cargo-pant":       { bg: "#0b0b0a", accent: "#333",    stripe: "#555"    },
    "adinkra-hoodie":        { bg: "#1a0a0d", accent: "#8b2635", stripe: "#d4a843" },
    "wax-print-tee":         { bg: "#0d1a2e", accent: "#1a3a5c", stripe: "#c8502a" },
    "linen-short-set":       { bg: "#f0ebe0", accent: "#c8502a", stripe: "#d4a843" },
  };
  const c = colors[product.slug] || { bg: "#111", accent: "#c8502a", stripe: "#d4a843" };
  const half = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`grd2-${product.slug}`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={c.accent} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={c.bg}/>
        </radialGradient>
        <pattern id={`wax2-${product.slug}`} width="30" height="30" patternUnits="userSpaceOnUse">
          <polygon points="15,2 28,15 15,28 2,15" fill="none" stroke={c.stripe} strokeWidth="0.8" opacity="0.4"/>
          <circle cx="15" cy="15" r="2" fill={c.accent} opacity="0.25"/>
        </pattern>
        <clipPath id={`clip2-${product.slug}`}>
          <ellipse cx={half} cy={half * 1.05} rx={half * 0.72} ry={half * 0.82}/>
        </clipPath>
      </defs>
      <ellipse cx={half} cy={half * 1.05} rx={half * 0.72} ry={half * 0.82} fill={`url(#grd2-${product.slug})`}/>
      <ellipse cx={half} cy={half * 1.05} rx={half * 0.72} ry={half * 0.82} fill={`url(#wax2-${product.slug})`} clipPath={`url(#clip2-${product.slug})`}/>
      <path d={`M${half - 40} ${half * 0.3} Q${half} ${half * 0.22} ${half + 40} ${half * 0.3}`} fill="none" stroke={c.stripe} strokeWidth="1.5" opacity="0.7"/>
      <line x1={half} y1={half * 0.28} x2={half} y2={half * 1.85} stroke={c.stripe} strokeWidth="0.8" strokeDasharray="4,6" opacity="0.5"/>
      <rect x={half * 0.3} y={half * 0.85} width={half * 1.4} height={half * 0.12} fill={c.accent} opacity="0.35" rx="2"/>
      <ellipse cx={half * 0.42} cy={half * 0.45} rx="28" ry="18" fill={c.stripe} opacity="0.18"/>
      <ellipse cx={half * 1.58} cy={half * 0.45} rx="28" ry="18" fill={c.stripe} opacity="0.18"/>
    </svg>
  );
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const VIEWS = ["front", "back", "detail", "flat"];

function AnkaraPattern() {
  return (
    <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.07,pointerEvents:"none" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ap-slug" width="80" height="80" patternUnits="userSpaceOnUse">
          <polygon points="40,3 77,40 40,77 3,40" fill="none" stroke="#c8502a" strokeWidth="1.2"/>
          <polygon points="40,18 62,40 40,62 18,40" fill="none" stroke="#d4a843" strokeWidth="0.7"/>
          <circle cx="3"  cy="3"  r="2" fill="#c8502a"/><circle cx="77" cy="3"  r="2" fill="#d4a843"/>
          <circle cx="3"  cy="77" r="2" fill="#1a3a5c"/><circle cx="77" cy="77" r="2" fill="#2d6a4f"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ap-slug)"/>
    </svg>
  );
}

export default function ProductPage({ params }) {
  const slug    = params?.slug;
  const product = getProduct(slug);
  const { addToCart, items } = useCart();

  const [selectedSize,  setSelectedSize]  = useState(null);
  const [qty,           setQty]           = useState(1);
  const [activeView,    setActiveView]    = useState(0);
  const [added,         setAdded]         = useState(false);
  const [sizeError,     setSizeError]     = useState(false);
  const [zoomed,        setZoomed]        = useState(false);

  const inCart = items.some(i => i.slug === slug && i.size === selectedSize);

  // related products
  const related = PRODUCTS.filter(p => p.slug !== slug && p.tags.some(t => product?.tags.includes(t))).slice(0, 3);

  if (!product) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: "#0b0b0a" }}>
        PRODUCT NOT FOUND
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 800); return; }
    addToCart({
      slug:    product.slug,
      name:    product.name,
      price:   product.price,
      size:    selectedSize,
      qty,
      color:   "#c8502a", // fallback
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400&display=swap');
        :root {
          --ink:#0b0b0a; --cream:#f7f6f4; --kente:#c8502a;
          --gold:#d4a843; --indigo:#1a3a5c; --forest:#2d6a4f;
          --border:rgba(8,8,7,0.10);
        }
        *{box-sizing:border-box;margin:0;padding:0;}

        .pdp { background:var(--cream); font-family:'DM Sans',sans-serif; min-height:100vh; }

        /* breadcrumb */
        .breadcrumb {
          padding: 18px 48px;
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(8,8,7,0.38); display: flex; gap: 8px; align-items: center;
          border-bottom: 1px solid var(--border);
        }
        .breadcrumb a { color: inherit; text-decoration: none; transition: color 0.2s; }
        .breadcrumb a:hover { color: var(--kente); }
        .breadcrumb-sep { opacity: 0.3; }

        /* main layout */
        .pdp-main {
          display: grid; grid-template-columns: 1fr 1fr;
          max-width: 1300px; margin: 0 auto;
          min-height: 90vh;
        }

        /* ── LEFT: gallery ── */
        .pdp-gallery {
          position: sticky; top: 64px;
          height: calc(100vh - 64px);
          display: flex; flex-direction: column;
          background: var(--ink); overflow: hidden;
        }
        .pdp-gallery-main {
          flex: 1; position: relative;
          display: flex; align-items: center; justify-content: center;
          cursor: zoom-in; overflow: hidden;
        }
        .pdp-gallery-main.zoomed { cursor: zoom-out; }
        .pdp-gallery-pattern { position:absolute;inset:0; }

        .gallery-visual {
          position: relative; z-index: 2;
          transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .pdp-gallery-main:hover .gallery-visual { transform: scale(1.04); }
        .pdp-gallery-main.zoomed .gallery-visual { transform: scale(1.5); }

        /* view selector thumbnails */
        .pdp-thumbs {
          display: flex; gap: 2px;
          padding: 2px; background: rgba(247,246,244,0.05);
          flex-shrink: 0;
        }
        .pdp-thumb {
          flex: 1; height: 72px;
          background: rgba(247,246,244,0.04);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
          position: relative; overflow: hidden;
        }
        .pdp-thumb.active { background: rgba(200,80,42,0.2); }
        .pdp-thumb:hover  { background: rgba(247,246,244,0.08); }
        .pdp-thumb-label {
          font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(247,246,244,0.35); font-family: 'DM Sans', sans-serif;
        }
        .pdp-thumb.active .pdp-thumb-label { color: var(--kente); }

        /* ── RIGHT: info ── */
        .pdp-info {
          padding: 48px 56px 80px;
          display: flex; flex-direction: column; gap: 0;
          overflow-y: auto;
        }

        .pdp-collection {
          font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--kente); margin-bottom: 10px;
        }
        .pdp-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 5vw, 64px);
          letter-spacing: 0.06em; color: var(--ink);
          line-height: 0.92; margin-bottom: 16px;
        }
        .pdp-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px; color: var(--ink); letter-spacing: 0.04em;
          margin-bottom: 6px;
        }
        .pdp-price-sub {
          font-family: 'Caveat', cursive;
          font-size: 14px; color: rgba(8,8,7,0.38);
          margin-bottom: 32px;
        }

        .pdp-divider {
          height: 1px; background: var(--border);
          margin: 28px 0;
        }

        .pdp-label {
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(8,8,7,0.4); margin-bottom: 12px;
        }

        /* size grid */
        .size-grid {
          display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;
        }
        .size-btn {
          width: 52px; height: 52px;
          border: 1.5px solid var(--border);
          background: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; letter-spacing: 0.1em;
          color: rgba(8,8,7,0.6);
          transition: border-color 0.2s, background 0.2s, color 0.2s, transform 0.2s;
        }
        .size-btn:hover { border-color: var(--ink); color: var(--ink); transform: scale(1.05); }
        .size-btn.active {
          border-color: var(--kente); background: var(--kente);
          color: white; transform: scale(1.05);
        }
        .size-btn.error { border-color: #c0392b; animation: shake 0.4s; }
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-4px)}
          40%{transform:translateX(4px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }

        /* qty row */
        .qty-row {
          display: flex; align-items: center; gap: 0;
          margin-bottom: 28px;
          border: 1px solid var(--border);
          width: fit-content;
        }
        .qty-ctrl {
          width: 44px; height: 44px;
          border: none; background: none; cursor: pointer;
          font-size: 18px; color: var(--ink);
          transition: background 0.2s; display: flex; align-items: center; justify-content: center;
        }
        .qty-ctrl:hover { background: rgba(8,8,7,0.05); }
        .qty-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 0.1em;
          min-width: 44px; text-align: center;
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
          height: 44px; display: flex; align-items: center; justify-content: center;
        }

        /* add to cart */
        .atc-btn {
          width: 100%; padding: 18px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px; letter-spacing: 0.22em;
          text-transform: uppercase;
          border: none; cursor: pointer;
          position: relative; overflow: hidden;
          background: var(--ink); color: var(--cream);
          transition: transform 0.18s, box-shadow 0.2s;
          margin-bottom: 12px;
        }
        .atc-btn::before {
          content: ''; position: absolute; inset: 0;
          background: var(--kente);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.77,0,0.175,1);
        }
        .atc-btn:hover::before { transform: scaleX(1); }
        .atc-btn span { position: relative; z-index: 1; }
        .atc-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(200,80,42,0.25); }
        .atc-btn.added { background: var(--forest); }
        .atc-btn.added::before { display: none; }
        .atc-btn.size-error { background: #c0392b; }
        .atc-btn.size-error::before { display: none; }

        .wishlist-btn {
          width: 100%; padding: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
          border: 1.5px solid var(--border); background: none; cursor: pointer;
          color: rgba(8,8,7,0.5);
          transition: border-color 0.2s, color 0.2s;
        }
        .wishlist-btn:hover { border-color: var(--ink); color: var(--ink); }

        /* desc */
        .pdp-desc {
          font-size: 14px; line-height: 1.7;
          color: rgba(8,8,7,0.6); margin-top: 8px;
        }

        /* accordion details */
        .pdp-accord {
          border-top: 1px solid var(--border);
          margin-top: 32px;
        }
        .accord-item { border-bottom: 1px solid var(--border); }
        .accord-btn {
          width: 100%; display: flex; justify-content: space-between; align-items: center;
          padding: 16px 0; background: none; border: none; cursor: pointer;
          font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(8,8,7,0.6); font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .accord-btn:hover { color: var(--kente); }
        .accord-btn svg { width: 14px; height: 14px; stroke: currentColor; stroke-width: 1.8; fill: none; transition: transform 0.3s; }
        .accord-btn.open svg { transform: rotate(45deg); }
        .accord-body {
          font-size: 13px; line-height: 1.7; color: rgba(8,8,7,0.55);
          overflow: hidden; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), padding 0.3s;
          max-height: 0; padding-bottom: 0;
        }
        .accord-body.open { max-height: 300px; padding-bottom: 16px; }

        /* ── TOAST ── */
        .pdp-toast {
          position: fixed; bottom: 32px; left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: var(--ink); color: var(--cream);
          font-family: 'Caveat', cursive; font-size: 18px;
          padding: 14px 32px; z-index: 9999;
          border-left: 3px solid var(--kente);
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s, transform 0.3s;
          white-space: nowrap;
        }
        .pdp-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

        /* ── related ── */
        .related {
          padding: 64px 48px 100px;
          max-width: 1300px; margin: 0 auto;
          border-top: 1px solid var(--border);
        }
        .related-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px; letter-spacing: 0.08em; color: var(--ink);
          margin-bottom: 32px;
        }
        .related-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;
        }
        .related-card {
          background: var(--ink); aspect-ratio: 3/4;
          display: block; text-decoration: none; overflow: hidden;
          position: relative;
          transition: transform 0.4s;
        }
        .related-card:hover { transform: scale(0.98); }
        .related-card-visual {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .related-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(8,8,7,0.8) 0%, transparent 60%);
        }
        .related-card-info {
          position: absolute; bottom: 0; left: 0; right: 0; padding: 20px;
        }
        .related-card-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 0.06em; color: var(--cream);
        }
        .related-card-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px; color: var(--gold);
        }

        @media (max-width: 900px) {
          .pdp-main { grid-template-columns: 1fr; }
          .pdp-gallery { position: relative; height: 70vw; min-height: 340px; top: 0; }
          .pdp-info { padding: 32px 24px 60px; }
          .breadcrumb { padding: 14px 24px; }
          .related { padding: 40px 24px 64px; }
          .related-grid { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      <div className="pdp">
        {/* breadcrumb */}
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href="/shop">Shop</Link>
          <span className="breadcrumb-sep">/</span>
          <span style={{ color: "rgba(8,8,7,0.7)" }}>{product.name}</span>
        </div>

        <div className="pdp-main">

          {/* ── LEFT: gallery ── */}
          <div className="pdp-gallery">
            <div
              className={`pdp-gallery-main${zoomed ? " zoomed" : ""}`}
              onClick={() => setZoomed(z => !z)}
            >
              <AnkaraPattern />
              <div className="gallery-visual">
                <ProductVisual product={product} size={360} />
              </div>
            </div>
            <div className="pdp-thumbs">
              {VIEWS.map((v, i) => (
                <button
                  key={v}
                  className={`pdp-thumb${activeView === i ? " active" : ""}`}
                  onClick={() => setActiveView(i)}
                >
                  <span className="pdp-thumb-label">{v}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: info ── */}
          <div className="pdp-info">
            {product.collection && (
              <div className="pdp-collection">{product.collection.replace(/-/g, " ")}</div>
            )}
            <h1 className="pdp-name">{product.name}</h1>
            <div className="pdp-price">GH₵ {product.price.toLocaleString()}</div>
            <div className="pdp-price-sub">Free shipping over GH₵500 · Made in Accra</div>

            <div className="pdp-divider"/>

            {/* size */}
            <div className="pdp-label">
              Select Size
              {selectedSize && <span style={{ color:"var(--kente)", marginLeft: 8 }}>— {selectedSize}</span>}
            </div>
            <div className="size-grid">
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`size-btn${selectedSize === s ? " active" : ""}${sizeError && !selectedSize ? " error" : ""}`}
                  onClick={() => { setSelectedSize(s); setSizeError(false); }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* qty */}
            <div className="pdp-label">Quantity</div>
            <div className="qty-row">
              <button className="qty-ctrl" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="qty-val">{qty}</span>
              <button className="qty-ctrl" onClick={() => setQty(q => q + 1)}>+</button>
            </div>

            {/* add to cart */}
            <button
              className={`atc-btn${added ? " added" : ""}${sizeError ? " size-error" : ""}`}
              onClick={handleAddToCart}
            >
              <span>
                {sizeError
                  ? "← Select a size first"
                  : added
                  ? "✓ Added to Cart"
                  : inCart
                  ? "Add Another"
                  : "Add to Cart"}
              </span>
            </button>
            <button className="wishlist-btn">♡ &nbsp; Save to Wishlist</button>

            <div className="pdp-divider"/>

            {/* description */}
            <p className="pdp-desc">{product.desc}</p>

            {/* accordion */}
            <div className="pdp-accord">
              {[
                { label: "Materials & Care", body: "100% African wax cotton outer. Machine wash cold, gentle cycle. Do not bleach. Hang to dry." },
                { label: "Fit & Sizing",     body: "Model is 6'1\" wearing size M. This piece runs true to size. Oversized fit — size down for a more tailored look." },
                { label: "Shipping & Returns", body: "Orders ship within 2–3 business days from Accra. Free returns within 14 days of delivery, unworn and with tags attached." },
              ].map(({ label, body }) => (
                <AccordionItem key={label} label={label} body={body} />
              ))}
            </div>
          </div>
        </div>

        {/* related */}
        {related.length > 0 && (
          <section className="related">
            <div className="related-title">You Might Also Like</div>
            <div className="related-grid">
              {related.map(p => (
                <Link key={p.slug} href={`/shop/${p.slug}`} className="related-card">
                  <div className="related-card-visual">
                    <ProductVisual product={p} size={200} />
                  </div>
                  <div className="related-card-overlay"/>
                  <div className="related-card-info">
                    <div className="related-card-name">{p.name}</div>
                    <div className="related-card-price">GH₵ {p.price.toLocaleString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* toast */}
      <div className={`pdp-toast${added ? " show" : ""}`}>
        ✓ {product.name} · {selectedSize} added to your bag
      </div>
    </>
  );
}

function AccordionItem({ label, body }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="accord-item">
      <button className={`accord-btn${open ? " open" : ""}`} onClick={() => setOpen(o => !o)}>
        {label}
        <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <div className={`accord-body${open ? " open" : ""}`}>{body}</div>
    </div>
  );
}
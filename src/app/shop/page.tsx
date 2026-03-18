"use client";

import { useState, useEffect, useRef, useCallback, type CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COLLECTIONS, PRODUCTS } from "@/lib/products";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

/* ─────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────── */
function AnkaraPattern({ id = "ap", opacity = 0.08, color = "#d4a843" }: {
  id?: string; opacity?: number; color?: string;
}) {
  return (
    <svg
      aria-hidden
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity, pointerEvents:"none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={`${id}-h`} width="80" height="80" patternUnits="userSpaceOnUse">
          <polygon points="40,3 77,40 40,77 3,40" fill="none" stroke={color} strokeWidth="0.9"/>
          <polygon points="40,18 62,40 40,62 18,40" fill="none" stroke={color} strokeWidth="0.5"/>
          <circle cx="3"  cy="3"  r="2" fill={color}/>
          <circle cx="77" cy="3"  r="2" fill={color}/>
          <circle cx="3"  cy="77" r="2" fill="#1a3a5c"/>
          <circle cx="77" cy="77" r="2" fill="#2d6a4f"/>
        </pattern>
        <pattern id={`${id}-f`} width="32" height="32" patternUnits="userSpaceOnUse">
          <polygon points="16,1 31,16 16,31 1,16" fill="none" stroke={color} strokeWidth="0.4" opacity="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-f)`}/>
      <rect width="100%" height="100%" fill={`url(#${id}-h)`}/>
    </svg>
  );
}

function ProductVisual({ product, size = 280 }: { product: Product; size?: number }) {
  const palette: Record<string, { bg: string; accent: string }> = {
    "ankara-oversized-tee": { bg:"#1a1a1a", accent:"#d4a843" },
    "kente-blazer":          { bg:"#0d1f12", accent:"#2d6a4f" },
    "mono-cargo-pant":       { bg:"#0b0b0a", accent:"#444"    },
    "adinkra-hoodie":        { bg:"#1a0a0d", accent:"#8b2635" },
    "wax-print-tee":         { bg:"#0d1a2e", accent:"#1a3a5c" },
    "linen-short-set":       { bg:"#f0ebe0", accent:"#d4a843" },
  };
  const c = palette[product.slug] ?? { bg:"#111", accent:"#d4a843" };
  const h = size / 2;
  const uid = `${product.slug}-${size}`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`vg-${uid}`} cx="50%" cy="38%" r="55%">
          <stop offset="0%" stopColor={c.accent} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={c.bg}/>
        </radialGradient>
        <pattern id={`vp-${uid}`} width="26" height="26" patternUnits="userSpaceOnUse">
          <polygon points="13,1 25,13 13,25 1,13" fill="none" stroke={c.accent} strokeWidth="0.6" opacity="0.3"/>
        </pattern>
        <clipPath id={`vc-${uid}`}>
          <ellipse cx={h} cy={h * 1.05} rx={h * 0.7} ry={h * 0.8}/>
        </clipPath>
      </defs>
      <ellipse cx={h} cy={h * 1.05} rx={h * 0.7} ry={h * 0.8} fill={`url(#vg-${uid})`}/>
      <ellipse cx={h} cy={h * 1.05} rx={h * 0.7} ry={h * 0.8} fill={`url(#vp-${uid})`} clipPath={`url(#vc-${uid})`}/>
      <path d={`M${h-34} ${h*0.3} Q${h} ${h*0.2} ${h+34} ${h*0.3}`} fill="none" stroke={c.accent} strokeWidth="1.3" opacity="0.55"/>
      <line x1={h} y1={h*0.27} x2={h} y2={h*1.82} stroke={c.accent} strokeWidth="0.6" strokeDasharray="3,5" opacity="0.35"/>
      <rect x={h*0.32} y={h*0.84} width={h*1.36} height={h*0.1} fill={c.accent} opacity="0.22" rx="2"/>
    </svg>
  );
}

function TypingDots() {
  return (
    <span style={{ display:"inline-flex", gap:5, alignItems:"center", padding:"2px 0" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          display:"block", width:6, height:6, borderRadius:"50%",
          background:"#d4a843",
          animation:`shopDot 1.2s ease-in-out ${i * 0.17}s infinite`,
        }}/>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────
   AURA AI — full-width embedded section
───────────────────────────────────────── */
function AuraSection({ onHighlight }: { onHighlight: (slugs: string[]) => void }) {
  const [input,    setInput]    = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; text: string; products: Product[] }>>([]);
  const [loading,  setLoading]  = useState(false);
  const [cartSlug, setCartSlug] = useState<string | null>(null);
  const chatRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const CHIPS = ["Something for a wedding", "All-black fit", "Casual streetwear", "Under GH₵ 500", "I want to stand out", "Smart casual"];

  const send = useCallback(async (txt?: string) => {
    const msg = (txt ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role:"user", text:msg, products:[] }]);
    setLoading(true);

    const catalog = PRODUCTS.map(p =>
      `slug:"${p.slug}" name:"${p.name}" price:GH₵${p.price} tags:${p.tags.join(",")} desc:"${p.desc}"`
    ).join("\n");

    const system = `You are Aura — the personal stylist for Ankara Aura, a luxury African streetwear brand from Accra, Ghana. Warm, stylish, genuine, slightly playful. Like a knowledgeable friend, never corporate.

CATALOG:
${catalog}

Recommend 1–3 products that genuinely fit what the user wants. Be specific about why each piece works. Conversational and warm.

Respond ONLY in this exact JSON (no markdown, no backticks, no extra text):
{"message":"your warm conversational recommendation","products":["slug1","slug2"]}`;

    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system,
          messages: [
            ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.text })),
            { role: "user" as const, content: msg },
          ],
        }),
      });
      const data  = await res.json();
      const raw   = (data.content as Array<{ type: string; text?: string }>)
        ?.find(b => b.type === "text")?.text ?? "{}";

      let parsed: { message?: string; products?: string[] } = {};
      try { parsed = JSON.parse(raw.replace(/```json|```/g, "").trim()); }
      catch { parsed = { message: raw }; }

      const matched = (parsed.products ?? [])
        .map((s: string) => PRODUCTS.find(p => p.slug === s))
        .filter((p): p is Product => Boolean(p));

      setMessages(prev => [...prev, {
        role: "assistant",
        text: parsed.message ?? "Here's what I'd pick for you:",
        products: matched,
      }]);

      if (matched.length > 0) {
        onHighlight(matched.map(p => p.slug));
        setTimeout(() => onHighlight([]), 6000);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Something went sideways on my end — give it another shot?",
        products: [],
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, onHighlight]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const isEmpty = messages.length === 0 && !loading;

  return (
    <section className="aa-section">
      <AnkaraPattern id="aa-bg" opacity={0.04} color="#d4a843"/>

      {/* ── Left: branding panel ── */}
      <div className="aa-left">
        <div className="aa-eyebrow">AI Stylist</div>
        <h2 className="aa-heading">
          <span className="aa-h1">MEET</span>
          <span className="aa-h2">AURA.</span>
        </h2>
        <p className="aa-copy">
          Tell Aura what you&apos;re after — an occasion, a vibe, a budget, a feeling. She knows every piece in the collection and will find exactly what fits you.
        </p>
        <div className="aa-chips">
          {CHIPS.map(c => (
            <button key={c} className="aa-chip" onClick={() => { setInput(c); send(c); }}>
              {c}
            </button>
          ))}
        </div>
        <div className="aa-kente"/>
      </div>

      {/* ── Right: chat panel ── */}
      <div className="aa-chat">
        {/* header */}
        <div className="aa-chat-hd">
          <div className="aa-avatar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0b0b0a" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div>
            <div className="aa-chat-name">AURA</div>
            <div className="aa-chat-sub">Personal Stylist · AI</div>
          </div>
          <div className="aa-online">
            <div className="aa-dot"/>
            <span>Online</span>
          </div>
        </div>

        {/* messages */}
        <div className="aa-msgs" ref={chatRef}>
          {/* greeting */}
          <div className="aa-msg aa-ai">
            <div className="aa-bubble">
              Hey! 👋 I&apos;m Aura — tell me what you&apos;re looking for and I&apos;ll find the perfect pieces for you.
            </div>
          </div>

          {messages.map((m, i) => (
            <div key={i} className={`aa-msg ${m.role === "user" ? "aa-user" : "aa-ai"}`}>
              <div className="aa-bubble">{m.text}</div>
              {m.products.length > 0 && (
                <div className="aa-cards">
                  {m.products.map(p => (
                    <div key={p.slug} className="aa-card">
                      <Link href={`/shop/${p.slug}`} className="aa-card-link">
                        <div className="aa-card-img">
                          <ProductVisual product={p} size={50}/>
                        </div>
                        <div className="aa-card-info">
                          <div className="aa-card-name">{p.name}</div>
                          <div className="aa-card-price">GH₵ {p.price.toLocaleString()}</div>
                        </div>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(247,246,244,0.3)" strokeWidth="2" strokeLinecap="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                      <button
                        className={`aa-card-btn${cartSlug === p.slug ? " done" : ""}`}
                        onClick={() => {
                          addToCart({ slug:p.slug, name:p.name, price:p.price, size:"M", qty:1 });
                          setCartSlug(p.slug);
                          setTimeout(() => setCartSlug(null), 1800);
                        }}
                        aria-label="Add to cart"
                      >
                        {cartSlug === p.slug
                          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                          : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(247,246,244,0.45)" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        }
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="aa-msg aa-ai">
              <div className="aa-bubble"><TypingDots/></div>
            </div>
          )}
        </div>

        {/* input */}
        <div className="aa-input-row">
          <input
            ref={inputRef}
            className="aa-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Describe your vibe or occasion…"
          />
          <button
            className={`aa-send${input.trim() && !loading ? " on" : ""}`}
            onClick={() => send()}
            disabled={!input.trim() || loading}
            aria-label="Send"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const HERO_PRODUCTS = PRODUCTS.filter((p) => p.featured).slice(0, 5);
const COLLECTION_MENU = [{ slug: "all", name: "All Collections", tagline: "Everything currently available in the shop." }, ...COLLECTIONS];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialCollection = searchParams.get("collection");
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [collection, setCollection] = useState(
    initialCollection && COLLECTIONS.some((item) => item.slug === initialCollection) ? initialCollection : "all",
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addToCart } = useCart();

  const active = HERO_PRODUCTS[activeIdx];
  const activeCollection = collection === "all"
    ? COLLECTIONS[0]
    : COLLECTIONS.find((item) => item.slug === collection) ?? COLLECTIONS[0];

  const go = useCallback((nextIdx: number, dir: 1 | -1) => {
    if (animating || nextIdx === activeIdx) return;
    setDirection(dir);
    setPrevIdx(activeIdx);
    setAnimating(true);
    setActiveIdx(nextIdx);
    setTimeout(() => {
      setPrevIdx(null);
      setAnimating(false);
    }, 850);
  }, [animating, activeIdx]);

  const next = () => go((activeIdx + 1) % HERO_PRODUCTS.length, 1);
  const prev = () => go((activeIdx - 1 + HERO_PRODUCTS.length) % HERO_PRODUCTS.length, -1);

  const startAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx((idx) => {
        const n = (idx + 1) % HERO_PRODUCTS.length;
        setDirection(1);
        setPrevIdx(idx);
        setAnimating(true);
        setTimeout(() => {
          setPrevIdx(null);
          setAnimating(false);
        }, 850);
        return n;
      });
    }, 5000);
  }, []);

  useEffect(() => {
    startAuto();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAuto]);

  const categories = ["All", ...Array.from(new Set(PRODUCTS.flatMap((p) => p.tags)))];
  const q = query.trim().toLowerCase();
  const filtered = PRODUCTS.filter((p) => {
    const collectionOk = collection === "all" || p.collection === collection;
    const categoryOk = category === "All" || p.tags.includes(category);
    return collectionOk && categoryOk && (!q || `${p.name} ${p.desc} ${p.tags.join(" ")}`.toLowerCase().includes(q));
  });

  return (
    <div className="shop-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ink:#0b0b0a; --cream:#f7f6f4; --gold:#d4a843; --clay:#c8502a;
          --forest:#2d6a4f; --indigo:#1a3a5c; --dim:rgba(11,11,10,0.1);
        }
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }

        .shop-shell {
          background:
            radial-gradient(circle at top left, rgba(212,168,67,.08), transparent 32%),
            linear-gradient(180deg, #fbfaf8 0%, var(--cream) 42%, #f3efe8 100%);
          animation:shopReveal .7s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes shopReveal { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }

        .hero {
          position:relative; min-height:calc(100svh - 62px); overflow:hidden; background:var(--ink);
          border-bottom:1px solid rgba(247,246,244,.08);
        }
        .hero::after {
          content:""; position:absolute; inset:0;
          background:linear-gradient(180deg, rgba(11,11,10,.16) 0%, rgba(11,11,10,.2) 40%, rgba(11,11,10,.78) 100%);
          pointer-events:none; z-index:1;
        }
        .h-slide { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
        .h-slide.enter { animation:hEnter .85s cubic-bezier(.77,0,.175,1) both; }
        .h-slide.leave { animation:hLeave .85s cubic-bezier(.77,0,.175,1) both; pointer-events:none; }
        @keyframes hEnter { from { opacity:0; transform:translateX(calc(var(--d)*56px)); } to { opacity:1; transform:none; } }
        @keyframes hLeave { from { opacity:1; transform:none; } to { opacity:0; transform:translateX(calc(var(--d)*-56px)); } }

        .h-bg-txt, .h-fg-txt {
          position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none;
        }
        .h-bg-txt { z-index:0; }
        .h-bg-txt span {
          font-family:'Bebas Neue',sans-serif; font-size:clamp(74px,14vw,190px); letter-spacing:.08em;
          color:transparent; -webkit-text-stroke:1px rgba(247,246,244,.1); white-space:nowrap;
        }
        .h-model { position:relative; z-index:2; filter:drop-shadow(0 40px 80px rgba(0,0,0,.35)); }
        .h-fg-txt { z-index:3; align-items:flex-end; padding-bottom:20svh; }
        .h-fg-txt span {
          font-family:'Bebas Neue',sans-serif; font-size:clamp(40px,7vw,88px); letter-spacing:.15em;
          color:rgba(247,246,244,.92); text-shadow:0 18px 40px rgba(0,0,0,.28);
        }
        .h-content {
          position:relative; z-index:4; max-width:1240px; margin:0 auto; padding:96px 36px 48px;
          min-height:calc(100svh - 62px); display:flex; align-items:flex-end;
        }
        .h-copy { max-width:520px; }
        .h-eyebrow {
          display:inline-flex; align-items:center; gap:10px; margin-bottom:18px;
          color:rgba(247,246,244,.7); font-size:11px; letter-spacing:.28em; text-transform:uppercase;
        }
        .h-eyebrow::before { content:""; width:42px; height:1px; background:rgba(212,168,67,.65); }
        .h-title {
          font-family:'Bebas Neue',sans-serif; font-size:clamp(48px,7vw,96px); line-height:.9;
          letter-spacing:.12em; color:var(--cream); margin-bottom:14px;
        }
        .h-text { color:rgba(247,246,244,.78); line-height:1.8; max-width:420px; font-size:14px; }
        .h-actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:24px; }
        .h-cta, .h-cta-sub {
          display:inline-flex; align-items:center; justify-content:center; min-height:44px; padding:0 20px;
          text-decoration:none; font-size:10px; letter-spacing:.18em; text-transform:uppercase;
          transition:transform .2s ease, background .2s ease, color .2s ease, border-color .2s ease;
        }
        .h-cta { background:var(--gold); color:var(--ink); border:1px solid var(--gold); }
        .h-cta-sub { border:1px solid rgba(247,246,244,.22); color:var(--cream); background:rgba(247,246,244,.04); }
        .h-cta:hover, .h-cta-sub:hover { transform:translateY(-2px); }
        .h-cta-sub:hover { border-color:var(--gold); color:var(--gold); }
        .h-aside {
          margin-left:auto; width:min(360px, 100%); position:relative; z-index:4;
          border:1px solid rgba(247,246,244,.1); background:rgba(247,246,244,.06);
          backdrop-filter:blur(10px); padding:24px;
        }
        .h-tag { color:var(--gold); font-size:10px; letter-spacing:.26em; text-transform:uppercase; margin-bottom:12px; }
        .h-name { font-family:'Bebas Neue',sans-serif; font-size:38px; letter-spacing:.08em; color:var(--cream); line-height:.92; }
        .h-price { font-family:'Bebas Neue',sans-serif; font-size:28px; color:var(--gold); letter-spacing:.06em; margin:12px 0 10px; }
        .h-desc { color:rgba(247,246,244,.72); font-size:14px; line-height:1.7; }
        .h-meta { display:flex; flex-wrap:wrap; gap:8px; margin-top:18px; }
        .h-meta span {
          border:1px solid rgba(247,246,244,.12); color:rgba(247,246,244,.78); padding:7px 10px;
          font-size:9px; letter-spacing:.16em; text-transform:uppercase;
        }
        .h-counter {
          position:absolute; right:40px; top:34px; z-index:4; color:rgba(247,246,244,.52);
          font-family:'Bebas Neue',sans-serif; letter-spacing:.12em; font-size:18px;
        }
        .h-counter strong { color:var(--gold); font-weight:400; }
        .h-arrow {
          position:absolute; top:50%; transform:translateY(-50%); z-index:4; width:52px; height:52px;
          border-radius:50%; border:1px solid rgba(247,246,244,.16); background:rgba(247,246,244,.04);
          color:var(--cream); display:grid; place-items:center; cursor:pointer;
        }
        .h-arrow.l { left:24px; } .h-arrow.r { right:24px; }
        .h-arrow:hover { border-color:var(--gold); color:var(--gold); }
        .h-arrow svg { width:20px; height:20px; fill:none; stroke:currentColor; strokeWidth:1.6; }
        .h-dots { position:absolute; left:36px; bottom:36px; z-index:4; display:flex; gap:10px; }
        .h-dot { width:44px; height:3px; border:none; background:rgba(247,246,244,.18); cursor:pointer; }
        .h-dot.on { background:var(--gold); }

        .shop-story { max-width:1240px; margin:0 auto; padding:72px 36px 22px; }
        .shop-story__grid { display:grid; grid-template-columns:1.3fr .9fr; gap:24px; align-items:start; }
        .shop-story__panel {
          position:relative; overflow:hidden; border:1px solid rgba(11,11,10,.1); background:rgba(255,255,255,.7); padding:34px;
        }
        .shop-story__pattern { position:absolute; inset:0; opacity:.06; pointer-events:none; }
        .shop-story__label { color:rgba(11,11,10,.42); font-size:11px; letter-spacing:.28em; text-transform:uppercase; margin-bottom:16px; }
        .shop-story__title { font-family:'Bebas Neue',sans-serif; font-size:clamp(36px,5vw,62px); letter-spacing:.12em; line-height:.92; color:var(--ink); margin-bottom:16px; }
        .shop-story__copy { color:rgba(11,11,10,.66); font-size:15px; line-height:1.8; max-width:620px; }
        .shop-story__stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; margin-top:26px; }
        .shop-story__stat { border:1px solid rgba(11,11,10,.08); padding:16px; background:rgba(247,246,244,.82); }
        .shop-story__stat strong { display:block; font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:.08em; color:var(--ink); }
        .shop-story__stat span { color:rgba(11,11,10,.5); font-size:10px; letter-spacing:.18em; text-transform:uppercase; }
        .shop-story__focus { border:1px solid rgba(11,11,10,.08); background:linear-gradient(180deg, rgba(212,168,67,.12), rgba(255,255,255,.92)); padding:28px; }
        .shop-story__focus h3 { font-family:'Bebas Neue',sans-serif; font-size:36px; letter-spacing:.1em; color:var(--ink); }
        .shop-story__focus p { margin-top:12px; color:rgba(11,11,10,.62); line-height:1.75; font-size:14px; }
        .shop-story__focus button {
          margin-top:18px; padding:0 18px; height:42px; border:1px solid var(--ink); background:var(--ink); color:var(--cream);
          text-transform:uppercase; letter-spacing:.18em; font-size:10px; cursor:pointer;
        }

        .collections-section { max-width:1240px; margin:0 auto; padding:22px 36px 72px; }
        .collections-head { display:flex; align-items:end; justify-content:space-between; gap:18px; margin-bottom:24px; }
        .collections-title { font-family:'Bebas Neue',sans-serif; font-size:42px; letter-spacing:.12em; color:var(--ink); }
        .collections-sub { color:rgba(11,11,10,.5); max-width:460px; line-height:1.7; font-size:14px; }
        .collections-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; }
        .collection-card {
          position:relative; overflow:hidden; min-height:250px; border:1px solid rgba(11,11,10,.08); background:var(--ink); color:var(--cream);
          padding:22px; display:flex; flex-direction:column; justify-content:flex-end; text-align:left; cursor:pointer;
          transition:transform .25s ease, border-color .25s ease, box-shadow .25s ease;
        }
        .collection-card:hover, .collection-card.active {
          transform:translateY(-4px); border-color:rgba(212,168,67,.52); box-shadow:0 18px 50px rgba(11,11,10,.16);
        }
        .collection-card svg { position:absolute; inset:0; opacity:.18; }
        .collection-card__count { position:absolute; top:18px; right:18px; color:rgba(247,246,244,.44); font-size:11px; letter-spacing:.24em; text-transform:uppercase; }
        .collection-card__name { position:relative; z-index:1; font-family:'Bebas Neue',sans-serif; font-size:32px; letter-spacing:.1em; line-height:.95; }
        .collection-card__tag { position:relative; z-index:1; margin-top:10px; color:rgba(247,246,244,.78); line-height:1.6; font-size:13px; }
        .collection-card__link { position:relative; z-index:1; margin-top:16px; color:var(--gold); font-size:10px; letter-spacing:.2em; text-transform:uppercase; }

        .aa-section { margin-top:0; }

        .products-section { max-width:1240px; margin:0 auto; padding:72px 36px 120px; }
        .sec-head { display:flex; align-items:flex-end; justify-content:space-between; gap:24px; flex-wrap:wrap; margin-bottom:30px; }
        .sec-title { font-family:'Bebas Neue',sans-serif; font-size:48px; letter-spacing:.1em; color:var(--ink); line-height:.9; }
        .sec-sub { color:rgba(11,11,10,.48); font-size:14px; line-height:1.7; margin-top:10px; max-width:520px; }
        .filter-shell {
          width:min(760px,100%); border:1px solid rgba(11,11,10,.08); background:rgba(255,255,255,.82);
          display:grid; grid-template-columns:1.1fr .8fr .8fr; gap:0;
        }
        .filter-item { position:relative; border-right:1px solid rgba(11,11,10,.08); }
        .filter-item:last-child { border-right:none; }
        .filter-label {
          position:absolute; left:16px; top:10px; color:rgba(11,11,10,.38); font-size:9px; letter-spacing:.18em; text-transform:uppercase;
        }
        .search-input, .filter-select {
          width:100%; height:72px; border:none; background:transparent; padding:28px 16px 10px; color:var(--ink);
          font-size:12px; letter-spacing:.12em; text-transform:uppercase; outline:none; font-family:'DM Sans',sans-serif;
        }
        .filter-select { appearance:none; cursor:pointer; }
        .filter-caret { position:absolute; right:16px; top:31px; font-size:12px; color:rgba(11,11,10,.4); pointer-events:none; }
        .curation-note {
          display:flex; flex-wrap:wrap; gap:8px; margin-bottom:26px;
        }
        .curation-pill {
          border:1px solid rgba(11,11,10,.08); background:rgba(255,255,255,.76); color:rgba(11,11,10,.62);
          padding:8px 12px; font-size:10px; letter-spacing:.16em; text-transform:uppercase;
        }
        .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:16px; }
        .card {
          position:relative; overflow:hidden; display:block; aspect-ratio:3/4; text-decoration:none; background:linear-gradient(180deg, #141414 0%, #080808 100%);
          border:1px solid rgba(11,11,10,.08); transition:transform .28s ease, box-shadow .28s ease, border-color .28s ease;
        }
        .card:hover { transform:translateY(-4px); border-color:rgba(212,168,67,.35); box-shadow:0 20px 50px rgba(11,11,10,.12); }
        .card-vis { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; transition:transform .55s cubic-bezier(.4,0,.2,1); }
        .card:hover .card-vis { transform:scale(1.05); }
        .card-pat { position:absolute; inset:0; opacity:.08; pointer-events:none; }
        .card-grad { position:absolute; inset:0; background:linear-gradient(to top, rgba(8,8,7,.92) 0%, rgba(8,8,7,.12) 56%, transparent 100%); z-index:2; }
        .card-info { position:absolute; left:0; right:0; bottom:0; padding:22px 20px; z-index:3; }
        .card-tag { color:var(--gold); font-size:9px; letter-spacing:.24em; text-transform:uppercase; margin-bottom:6px; }
        .card-name { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:.08em; color:var(--cream); line-height:.95; }
        .card-price { margin-top:8px; color:var(--gold); font-family:'Bebas Neue',sans-serif; font-size:19px; }
        .card-add {
          position:absolute; top:14px; right:14px; z-index:4; padding:9px 14px; border:1px solid rgba(247,246,244,.32);
          background:rgba(247,246,244,.06); color:var(--cream); opacity:0; transform:translateY(-8px);
          transition:opacity .25s ease, transform .25s ease, background .2s ease, color .2s ease, border-color .2s ease;
          font-size:10px; letter-spacing:.16em; text-transform:uppercase; pointer-events:none;
        }
        .card:hover .card-add { opacity:1; transform:translateY(0); pointer-events:auto; }
        .card-add.done { opacity:1; transform:translateY(0); background:var(--gold); color:var(--ink); border-color:var(--gold); pointer-events:auto; }
        .card.glow { border-color:rgba(212,168,67,.7); box-shadow:0 0 0 1px rgba(212,168,67,.42), 0 20px 55px rgba(212,168,67,.12); }
        .empty-state { padding:28px 0; color:rgba(11,11,10,.46); font-size:11px; letter-spacing:.18em; text-transform:uppercase; }

        @media (max-width: 1080px) {
          .shop-story__grid, .collections-grid { grid-template-columns:1fr 1fr; }
          .h-content { flex-direction:column; align-items:flex-start; justify-content:flex-end; gap:24px; }
          .h-aside { margin-left:0; }
          .filter-shell { grid-template-columns:1fr; }
          .filter-item { border-right:none; border-bottom:1px solid rgba(11,11,10,.08); }
          .filter-item:last-child { border-bottom:none; }
        }
        @media (max-width: 720px) {
          .hero { min-height:760px; }
          .h-content { padding:88px 20px 30px; min-height:760px; }
          .h-arrow { display:none; }
          .h-dots { left:20px; bottom:20px; }
          .h-counter { right:20px; top:24px; }
          .shop-story, .collections-section, .products-section { padding-left:20px; padding-right:20px; }
          .shop-story__grid, .collections-grid, .shop-story__stats { grid-template-columns:1fr; }
          .collections-head, .sec-head { align-items:flex-start; }
          .grid { gap:12px; }
        }
      `}</style>

      <section
        className="hero"
        onMouseEnter={() => {
          if (timerRef.current) clearInterval(timerRef.current);
        }}
        onMouseLeave={startAuto}
      >
        <AnkaraPattern id="hero-p" opacity={0.08} />

        {prevIdx !== null && (
          <div className="h-slide leave" style={{ ["--d" as string]: direction } as CSSProperties} key={`l-${prevIdx}`}>
            <div className="h-bg-txt"><span>{HERO_PRODUCTS[prevIdx].name.toUpperCase()}</span></div>
            <div className="h-model"><ProductVisual product={HERO_PRODUCTS[prevIdx]} size={480} /></div>
            <div className="h-fg-txt"><span>{HERO_PRODUCTS[prevIdx].name.toUpperCase()}</span></div>
          </div>
        )}

        <div className={`h-slide${animating ? " enter" : ""}`} style={{ ["--d" as string]: direction } as CSSProperties} key={`e-${activeIdx}`}>
          <div className="h-bg-txt"><span>{active.name.toUpperCase()}</span></div>
          <div className="h-model"><ProductVisual product={active} size={480} /></div>
          <div className="h-fg-txt"><span>{active.name.toUpperCase()}</span></div>
        </div>

        <div className="h-counter">
          <strong>{String(activeIdx + 1).padStart(2, "0")}</strong> / {String(HERO_PRODUCTS.length).padStart(2, "0")}
        </div>
        <button className="h-arrow l" onClick={prev} aria-label="Previous">
          <svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6" /></svg>
        </button>
        <button className="h-arrow r" onClick={next} aria-label="Next">
          <svg viewBox="0 0 24 24"><polyline points="9,6 15,12 9,18" /></svg>
        </button>
        <div className="h-dots">
          {HERO_PRODUCTS.map((_, i) => (
            <button
              key={i}
              className={`h-dot${i === activeIdx ? " on" : ""}`}
              onClick={() => go(i, i > activeIdx ? 1 : -1)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="h-content">
          <div className="h-copy">
            <div className="h-eyebrow">The full Ankara Aura shop experience</div>
            <h1 className="h-title">Collections, categories, and styling — all in one place.</h1>
            <p className="h-text">
              Explore the pieces through curated collections, filter by category, and move from discovery to cart without the main site feeling overcrowded.
            </p>
            <div className="h-actions">
              <a href="#catalog" className="h-cta">Shop the catalog</a>
              <button type="button" className="h-cta-sub" onClick={() => setCollection(active.collection ?? "all")}>Open this collection</button>
            </div>
          </div>

          <aside className="h-aside">
            <div className="h-tag">{active.collection?.replace(/-/g, " ") ?? active.tags[0]}</div>
            <div className="h-name">{active.name}</div>
            <div className="h-price">GH₵ {active.price.toLocaleString()}</div>
            <div className="h-desc">{active.desc}</div>
            <div className="h-meta">
              {active.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <div className="h-actions">
              <Link href={`/shop/${active.slug}`} className="h-cta">View piece</Link>
              <button type="button" className="h-cta-sub" onClick={() => setCollection(active.collection ?? "all")}>Shop related</button>
            </div>
          </aside>
        </div>
      </section>

      <section className="shop-story">
        <div className="shop-story__grid">
          <div className="shop-story__panel">
            <div className="shop-story__pattern"><AnkaraPattern id="shop-story" opacity={1} /></div>
            <div className="shop-story__label">Shop overview</div>
            <h2 className="shop-story__title">A storefront that still feels like Ankara Aura.</h2>
            <p className="shop-story__copy">
              The main site stays editorial and focused. Inside the shop, the browsing experience becomes more practical: collections up front, categories in a dropdown, and room to move between pieces, wishlist, cart, and customization.
            </p>
            <div className="shop-story__stats">
              <div className="shop-story__stat"><strong>{COLLECTIONS.length}</strong><span>Collections to browse</span></div>
              <div className="shop-story__stat"><strong>{categories.length - 1}</strong><span>Categories in the menu</span></div>
              <div className="shop-story__stat"><strong>{PRODUCTS.length}</strong><span>Current pieces available</span></div>
            </div>
          </div>

          <div className="shop-story__focus">
            <div className="shop-story__label">Current focus</div>
            <h3>{activeCollection.name}</h3>
            <p>{activeCollection.tagline}</p>
            <button type="button" onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>
              Browse this selection
            </button>
          </div>
        </div>
      </section>

      <section className="collections-section">
        <div className="collections-head">
          <div>
            <div className="collections-title">Collections</div>
            <p className="collections-sub">
              Start broad with a collection, then narrow the catalog with category filters when you know the kind of piece you want.
            </p>
          </div>
        </div>

        <div className="collections-grid">
          {COLLECTIONS.map((item) => {
            const count = PRODUCTS.filter((product) => product.collection === item.slug).length;
            return (
              <button
                key={item.slug}
                type="button"
                className={`collection-card${collection === item.slug ? " active" : ""}`}
                onClick={() => setCollection(item.slug)}
              >
                <AnkaraPattern id={`collection-${item.slug}`} opacity={0.16} />
                <span className="collection-card__count">{String(count).padStart(2, "0")} pieces</span>
                <span className="collection-card__name">{item.name}</span>
                <span className="collection-card__tag">{item.tagline}</span>
                <span className="collection-card__link">Filter catalog →</span>
              </button>
            );
          })}
        </div>
      </section>

      <AuraSection onHighlight={setHighlighted} />

      <section className="products-section" id="catalog">
        <div className="sec-head">
          <div>
            <div className="sec-title">Shop the catalog</div>
            <div className="sec-sub">
              {filtered.length} piece{filtered.length === 1 ? "" : "s"} showing for {COLLECTION_MENU.find((item) => item.slug === collection)?.name ?? "All Collections"}.
            </div>
          </div>

          <div className="filter-shell">
            <div className="filter-item">
              <div className="filter-label">Search</div>
              <input
                className="search-input"
                type="search"
                placeholder="Search pieces"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="filter-item">
              <div className="filter-label">Collection</div>
              <select className="filter-select" value={collection} onChange={(e) => setCollection(e.target.value)}>
                {COLLECTION_MENU.map((item) => (
                  <option key={item.slug} value={item.slug}>{item.name}</option>
                ))}
              </select>
              <span className="filter-caret">⌄</span>
            </div>
            <div className="filter-item">
              <div className="filter-label">Category</div>
              <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <span className="filter-caret">⌄</span>
            </div>
          </div>
        </div>

        <div className="curation-note">
          <span className="curation-pill">{activeCollection.name}</span>
          <span className="curation-pill">{category === "All" ? "All categories" : category}</span>
          {query && <span className="curation-pill">Search: {query}</span>}
          {collection !== "all" && (
            <button type="button" className="curation-pill" onClick={() => setCollection("all")}>
              Clear collection
            </button>
          )}
        </div>

        {filtered.length === 0 && <p className="empty-state">No pieces match this selection yet.</p>}

        <div className="grid">
          {filtered.map((product) => (
            <Link
              key={product.slug}
              href={`/shop/${product.slug}`}
              className={`card${highlighted.includes(product.slug) ? " glow" : ""}`}
            >
              <svg className="card-pat" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`cp-${product.slug}`} width="48" height="48" patternUnits="userSpaceOnUse">
                    <polygon points="24,2 46,24 24,46 2,24" fill="none" stroke="#d4a843" strokeWidth="0.6"/>
                    <circle cx="24" cy="24" r="1.8" fill="#d4a843" opacity="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#cp-${product.slug})`}/>
              </svg>
              <div className="card-vis"><ProductVisual product={product} size={270} /></div>
              <div className="card-grad" />
              <div className="card-info">
                <div className="card-tag">{product.collection?.replace(/-/g, " ") ?? product.tags[0]}</div>
                <div className="card-name">{product.name}</div>
                <div className="card-price">GH₵ {product.price.toLocaleString()}</div>
              </div>
              <div
                className={`card-add${addedSlug === product.slug ? " done" : ""}`}
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
  );
}

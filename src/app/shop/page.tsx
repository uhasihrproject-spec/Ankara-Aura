"use client";

import { useState, useEffect, useRef, useCallback, type CSSProperties } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
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
const HERO_PRODUCTS = PRODUCTS.filter(p => p.featured).slice(0, 5);

export default function ShopPage() {
  const [activeIdx,   setActiveIdx]   = useState(0);
  const [prevIdx,     setPrevIdx]     = useState<number | null>(null);
  const [direction,   setDirection]   = useState(1);
  const [animating,   setAnimating]   = useState(false);
  const [addedSlug,   setAddedSlug]   = useState<string | null>(null);
  const [filter,      setFilter]      = useState("All");
  const [query,       setQuery]       = useState("");
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [introVisible, setIntroVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addToCart } = useCart();

  const active = HERO_PRODUCTS[activeIdx];

  const go = useCallback((nextIdx: number, dir: 1 | -1) => {
    if (animating || nextIdx === activeIdx) return;
    setDirection(dir);
    setPrevIdx(activeIdx);
    setAnimating(true);
    setActiveIdx(nextIdx);
    setTimeout(() => { setPrevIdx(null); setAnimating(false); }, 850);
  }, [animating, activeIdx]);

  const next = () => go((activeIdx + 1) % HERO_PRODUCTS.length, 1);
  const prev = () => go((activeIdx - 1 + HERO_PRODUCTS.length) % HERO_PRODUCTS.length, -1);

  const startAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx(idx => {
        const n = (idx + 1) % HERO_PRODUCTS.length;
        setDirection(1); setPrevIdx(idx); setAnimating(true);
        setTimeout(() => { setPrevIdx(null); setAnimating(false); }, 850);
        return n;
      });
    }, 5000);
  }, []);

  useEffect(() => { startAuto(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [startAuto]);

  useEffect(() => {
    const introTimer = window.setTimeout(() => setIntroVisible(false), 1700);
    return () => window.clearTimeout(introTimer);
  }, []);

  const tags    = ["All", ...Array.from(new Set(PRODUCTS.flatMap(p => p.tags)))];
  const q       = query.trim().toLowerCase();
  const filtered = PRODUCTS.filter(p => {
    const tagOk = filter === "All" || p.tags.includes(filter);
    return tagOk && (!q || `${p.name} ${p.desc} ${p.tags.join(" ")}`.toLowerCase().includes(q));
  });

  return (
    <div className={`shop-shell${introVisible ? "" : " ready"}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400&display=swap');

        :root {
          --ink:#0b0b0a; --cream:#f7f6f4; --gold:#d4a843; --kente:#c8502a;
          --forest:#2d6a4f; --indigo:#1a3a5c; --dim:rgba(11,11,10,0.1);
        }
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .shop-shell { background:var(--cream); }
        .shop-shell.ready .shop-main { animation:shopMainIn .8s cubic-bezier(.22,1,.36,1) both; }
        .shop-main { opacity:0; }
        @keyframes shopMainIn { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }

        .shop-intro {
          position:fixed; inset:0; z-index:120;
          background:radial-gradient(circle at top, rgba(212,168,67,.2), transparent 40%), var(--ink);
          color:var(--cream); display:flex; align-items:center; justify-content:center; overflow:hidden;
          animation:shopIntroExit .9s cubic-bezier(.77,0,.175,1) 1s forwards; pointer-events:none;
        }
        .shop-intro__pattern { position:absolute; inset:0; opacity:.12; }
        .shop-intro__inner { position:relative; z-index:1; text-align:center; padding:32px; display:grid; gap:14px; }
        .shop-intro__eyebrow { font-size:11px; letter-spacing:.42em; text-transform:uppercase; color:rgba(247,246,244,.62); }
        .shop-intro__title { font-family:'Bebas Neue',sans-serif; font-size:clamp(72px,14vw,180px); letter-spacing:.12em; line-height:.82; }
        .shop-intro__copy { max-width:540px; margin:0 auto; font-size:14px; line-height:1.7; color:rgba(247,246,244,.76); }
        .shop-intro__bar { width:min(220px,60vw); height:1px; margin:8px auto 0; background:rgba(247,246,244,.2); overflow:hidden; }
        .shop-intro__bar::after { content:""; display:block; width:100%; height:100%; background:var(--gold); transform:translateX(-100%); animation:shopLoader 1.1s cubic-bezier(.22,1,.36,1) .2s forwards; }
        @keyframes shopLoader { to { transform:translateX(0); } }
        @keyframes shopIntroExit { to { opacity:0; visibility:hidden; } }

        /* ──── HERO ──── */
        .hero {
          position:relative; height:100svh; min-height:600px;
          overflow:hidden; background:var(--ink); cursor:none;
        }
        .h-slide {
          position:absolute; inset:0;
          display:flex; align-items:center; justify-content:center;
        }
        .h-slide.enter { animation:hEnter .85s cubic-bezier(.77,0,.175,1) both; }
        .h-slide.leave { animation:hLeave .85s cubic-bezier(.77,0,.175,1) both; pointer-events:none; }
        @keyframes hEnter { from{opacity:0;transform:translateX(calc(var(--d)*56px))} to{opacity:1;transform:none} }
        @keyframes hLeave { from{opacity:1;transform:none} to{opacity:0;transform:translateX(calc(var(--d)*-56px))} }

        .h-bg-txt {
          position:absolute; inset:0; z-index:1;
          display:flex; align-items:center; justify-content:center; pointer-events:none;
        }
        .h-bg-txt span {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(72px,13vw,170px); letter-spacing:.03em;
          color:transparent; -webkit-text-stroke:1px rgba(247,246,244,0.1);
          white-space:nowrap; user-select:none;
          animation:bgPan 9s linear infinite;
        }
        @keyframes bgPan { 0%{transform:translateX(-2%)} 50%{transform:translateX(2%)} 100%{transform:translateX(-2%)} }

        .h-model {
          position:absolute; z-index:2; bottom:0; left:50%;
          transform:translateX(-50%); height:88%;
          display:flex; align-items:flex-end;
          animation:float 7s ease-in-out infinite;
        }
        @keyframes float { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-10px)} }
        .h-model svg { height:100%; width:auto; max-width:580px; }

        .h-fg-txt {
          position:absolute; inset:0; z-index:3;
          display:flex; align-items:center; justify-content:center; pointer-events:none;
        }
        .h-fg-txt span {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(72px,13vw,170px); letter-spacing:.03em;
          color:rgba(247,246,244,0.07); white-space:nowrap;
          clip-path:inset(0 0 44% 0);
        }

        .h-bar {
          position:absolute; bottom:0; left:0; right:0; z-index:10;
          padding:28px 48px 36px;
          background:linear-gradient(to top, rgba(8,8,7,.75), transparent);
          display:flex; align-items:flex-end; justify-content:space-between;
        }
        .h-tag  { font-size:9px; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); margin-bottom:6px; }
        .h-name { font-family:'Bebas Neue',sans-serif; font-size:clamp(26px,3.8vw,50px); letter-spacing:.05em; color:var(--cream); line-height:1; }
        .h-price{ font-family:'Bebas Neue',sans-serif; font-size:clamp(20px,2.8vw,36px); color:var(--gold); letter-spacing:.04em; margin-top:2px; }
        .h-desc { font-size:12px; color:rgba(247,246,244,.45); line-height:1.65; max-width:340px; margin-top:6px; }
        .h-cta  {
          font-size:10px; letter-spacing:.18em; text-transform:uppercase;
          color:var(--cream); padding:10px 22px; border:1px solid rgba(247,246,244,.28);
          text-decoration:none; transition:border-color .2s, background .2s;
        }
        .h-cta:hover { background:rgba(247,246,244,.07); border-color:var(--gold); }

        .h-arrow {
          position:absolute; top:50%; z-index:20; transform:translateY(-50%);
          width:44px; height:44px; border:1px solid rgba(247,246,244,.18); border-radius:50%;
          background:none; cursor:pointer; display:flex; align-items:center; justify-content:center;
          color:rgba(247,246,244,.5); transition:all .2s;
        }
        .h-arrow:hover { border-color:var(--gold); color:var(--cream); }
        .h-arrow.l { left:24px; } .h-arrow.r { right:24px; }
        .h-arrow svg { width:16px; height:16px; stroke:currentColor; stroke-width:1.8; fill:none; stroke-linecap:round; stroke-linejoin:round; }

        .h-dots {
          position:absolute; bottom:116px; left:50%; transform:translateX(-50%);
          display:flex; gap:7px; z-index:20;
        }
        .h-dot {
          width:5px; height:5px; border-radius:50%;
          background:rgba(247,246,244,.22); border:none; padding:0; cursor:pointer;
          transition:background .3s, transform .3s;
        }
        .h-dot.on { background:var(--gold); transform:scale(1.5); }

        .h-counter {
          position:absolute; top:24px; right:44px; z-index:20;
          font-family:'Bebas Neue',sans-serif; font-size:12px;
          letter-spacing:.1em; color:rgba(247,246,244,.28);
        }
        .h-counter strong { color:rgba(247,246,244,.65); }

        /* ──── AURA SECTION ──── */
        .aa-section {
          position:relative; overflow:hidden;
          display:grid; grid-template-columns:1fr 1fr;
          min-height:680px;
          background:var(--ink);
          border-top:3px solid transparent;
          border-image:repeating-linear-gradient(
            90deg,#c8502a 0,#c8502a 20px,#d4a843 20px,#d4a843 40px,
            #1a3a5c 40px,#1a3a5c 60px,#2d6a4f 60px,#2d6a4f 80px
          ) 1;
        }
        .aa-left {
          padding:72px 64px;
          display:flex; flex-direction:column; justify-content:center;
          border-right:1px solid rgba(247,246,244,.07);
          position:relative; z-index:1;
        }
        .aa-eyebrow {
          font-size:9px; letter-spacing:.28em; text-transform:uppercase;
          color:var(--gold); margin-bottom:18px;
        }
        .aa-heading { font-family:'Bebas Neue',sans-serif; line-height:.88; margin-bottom:26px; }
        .aa-h1 { display:block; font-size:clamp(56px,7.5vw,108px); color:var(--cream); }
        .aa-h2 { display:block; font-size:clamp(56px,7.5vw,108px); color:transparent; -webkit-text-stroke:2px rgba(247,246,244,.18); }
        .aa-copy {
          font-size:14px; color:rgba(247,246,244,.42); line-height:1.8;
          max-width:380px; margin-bottom:34px;
        }
        .aa-chips { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:44px; }
        .aa-chip {
          font-size:10px; letter-spacing:.12em; text-transform:uppercase;
          padding:8px 14px; border:1px solid rgba(247,246,244,.12);
          background:none; color:rgba(247,246,244,.42);
          cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s;
        }
        .aa-chip:hover { border-color:var(--gold); color:var(--cream); background:rgba(212,168,67,.07); }
        .aa-kente {
          height:3px; width:100px;
          background:repeating-linear-gradient(90deg,#c8502a 0,#c8502a 16px,#d4a843 16px,#d4a843 32px,#1a3a5c 32px,#1a3a5c 48px);
          background-size:48px 100%;
        }

        /* chat panel */
        .aa-chat {
          display:flex; flex-direction:column;
          background:rgba(247,246,244,.022);
          position:relative; z-index:1;
          min-height:0;
        }
        .aa-chat-hd {
          padding:20px 28px; flex-shrink:0;
          border-bottom:1px solid rgba(247,246,244,.07);
          display:flex; align-items:center; gap:12px;
        }
        .aa-avatar {
          width:38px; height:38px; border-radius:50%; flex-shrink:0;
          background:linear-gradient(135deg,#d4a843,#c8502a);
          display:flex; align-items:center; justify-content:center;
        }
        .aa-chat-name { font-family:'Bebas Neue',sans-serif; font-size:15px; letter-spacing:.14em; color:#f7f6f4; line-height:1; }
        .aa-chat-sub  { font-size:9px; letter-spacing:.1em; text-transform:uppercase; color:rgba(212,168,67,.6); margin-top:2px; }
        .aa-online    { margin-left:auto; display:flex; align-items:center; gap:6px; }
        .aa-dot       { width:6px; height:6px; border-radius:50%; background:var(--forest); box-shadow:0 0 5px var(--forest); }
        .aa-online span { font-size:9px; letter-spacing:.07em; color:rgba(247,246,244,.25); }

        .aa-msgs {
          flex:1; overflow-y:auto; padding:22px 28px;
          display:flex; flex-direction:column; gap:14px;
          scrollbar-width:none; min-height:0;
        }
        .aa-msg { display:flex; flex-direction:column; gap:7px; }
        .aa-ai   { align-items:flex-start; }
        .aa-user { align-items:flex-end; }

        .aa-bubble {
          padding:11px 14px; font-size:13px; line-height:1.72;
          font-family:'DM Sans',sans-serif;
          max-width:90%; white-space:pre-wrap;
        }
        .aa-ai .aa-bubble {
          background:rgba(247,246,244,.055);
          border-left:2px solid rgba(212,168,67,.3);
          color:#f7f6f4;
        }
        .aa-user .aa-bubble {
          background:rgba(212,168,67,.1);
          border-right:2px solid rgba(212,168,67,.25);
          color:rgba(247,246,244,.82);
        }

        .aa-cards { display:flex; flex-direction:column; gap:5px; width:100%; max-width:330px; }
        .aa-card  { display:flex; align-items:stretch; border:1px solid rgba(212,168,67,.14); background:rgba(247,246,244,.03); overflow:hidden; }
        .aa-card-link {
          flex:1; display:flex; align-items:center; gap:10px;
          padding:9px 11px; text-decoration:none; transition:background .17s;
        }
        .aa-card-link:hover { background:rgba(212,168,67,.07); }
        .aa-card-img  { width:42px; height:42px; flex-shrink:0; display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .aa-card-name { font-family:'Bebas Neue',sans-serif; font-size:13px; letter-spacing:.06em; color:#f7f6f4; line-height:1.1; }
        .aa-card-price{ font-size:11px; color:rgba(212,168,67,.75); margin-top:2px; font-family:'DM Sans',sans-serif; }
        .aa-card-btn  {
          width:42px; flex-shrink:0; border:none;
          border-left:1px solid rgba(212,168,67,.1);
          background:transparent; cursor:pointer;
          display:flex; align-items:center; justify-content:center; transition:background .17s;
        }
        .aa-card-btn:hover { background:rgba(212,168,67,.1); }
        .aa-card-btn.done  { background:rgba(212,168,67,.12); }

        .aa-input-row {
          padding:14px 20px; flex-shrink:0;
          border-top:1px solid rgba(247,246,244,.07);
          display:flex; gap:8px; align-items:center;
        }
        .aa-input {
          flex:1; background:rgba(247,246,244,.05);
          border:1px solid rgba(212,168,67,.15);
          color:#f7f6f4; font-size:13px; padding:11px 14px;
          font-family:'DM Sans',sans-serif; outline:none; transition:border-color .2s;
        }
        .aa-input:focus { border-color:rgba(212,168,67,.5); }
        .aa-input::placeholder { color:rgba(247,246,244,.22); }
        .aa-send {
          width:42px; height:42px; flex-shrink:0; border:none;
          background:rgba(247,246,244,.06); color:rgba(247,246,244,.3);
          cursor:not-allowed; display:flex; align-items:center; justify-content:center; transition:all .2s;
        }
        .aa-send.on { background:linear-gradient(135deg,#d4a843,#c8502a); color:#0b0b0a; cursor:pointer; }
        .aa-send.on:hover { filter:brightness(1.08); }

        @keyframes shopDot { 0%,80%,100%{transform:scale(.5);opacity:.3} 40%{transform:scale(1.05);opacity:1} }

        /* ──── PRODUCTS ──── */
        .products-section { padding:80px 48px 120px; max-width:1320px; margin:0 auto; }
        .sec-head {
          display:flex; align-items:flex-end; justify-content:space-between;
          margin-bottom:48px; gap:24px; flex-wrap:wrap;
        }
        .sec-title { font-family:'Bebas Neue',sans-serif; font-size:46px; letter-spacing:.08em; color:var(--ink); line-height:1; }
        .sec-sub   { font-family:'Caveat',cursive; font-size:15px; color:rgba(11,11,10,.4); margin-top:3px; }
        .search-wrap  { position:relative; min-width:min(300px,100%); }
        .search-input {
          width:100%; border:1px solid var(--dim); background:#fff;
          height:38px; padding:0 34px 0 12px;
          font-size:11px; letter-spacing:.07em; text-transform:uppercase;
          color:rgba(11,11,10,.7); outline:none;
        }
        .search-input:focus { border-color:var(--ink); }
        .search-clear {
          position:absolute; right:2px; top:2px; width:34px; height:34px;
          border:none; background:transparent; color:rgba(11,11,10,.4); font-size:17px; cursor:pointer;
        }
        .pills { display:flex; gap:7px; flex-wrap:wrap; margin-top:8px; }
        .pill  {
          font-size:9px; letter-spacing:.18em; text-transform:uppercase;
          padding:7px 14px; border:1px solid var(--dim);
          background:none; cursor:pointer; color:rgba(11,11,10,.45);
          transition:all .18s; font-family:'DM Sans',sans-serif;
        }
        .pill.on, .pill:hover { background:var(--ink); color:var(--cream); border-color:var(--ink); }

        .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:2px; }

        .card {
          position:relative; background:var(--ink);
          aspect-ratio:3/4; overflow:hidden;
          display:block; text-decoration:none;
        }
        .card-vis {
          position:absolute; inset:0;
          display:flex; align-items:center; justify-content:center;
          transition:transform .55s cubic-bezier(.4,0,.2,1);
        }
        .card:hover .card-vis { transform:scale(1.04); }
        .card-pat  { position:absolute; inset:0; opacity:.07; pointer-events:none; }
        .card-grad { position:absolute; inset:0; background:linear-gradient(to top,rgba(8,8,7,.88) 0%,rgba(8,8,7,.08) 52%,transparent 100%); z-index:2; }
        .card-info { position:absolute; bottom:0; left:0; right:0; padding:22px 20px; z-index:3; }
        .card-tag  { font-size:8px; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); margin-bottom:4px; }
        .card-name { font-family:'Bebas Neue',sans-serif; font-size:21px; letter-spacing:.06em; color:var(--cream); line-height:1; margin-bottom:5px; }
        .card-price{ font-family:'Bebas Neue',sans-serif; font-size:17px; color:var(--gold); }
        .card-add  {
          position:absolute; top:14px; right:14px; z-index:4;
          background:var(--ink); color:var(--cream);
          border:1px solid rgba(247,246,244,.35);
          cursor:pointer; font-size:10px; letter-spacing:.16em; text-transform:uppercase;
          font-family:'DM Sans',sans-serif; padding:8px 13px;
          opacity:0; transform:translateY(-6px);
          transition:opacity .25s, transform .25s, background .18s;
          pointer-events:none;
        }
        .card:hover .card-add { opacity:1; transform:translateY(0); pointer-events:all; }
        .card-add.done { background:var(--gold); color:var(--ink); border-color:var(--gold); opacity:1; transform:translateY(0); pointer-events:all; }

        .card.glow { outline:2px solid rgba(212,168,67,.8); animation:cardGlow 2.5s ease-in-out infinite; }
        @keyframes cardGlow { 0%,100%{box-shadow:0 0 0 0 rgba(212,168,67,0)} 50%{box-shadow:0 0 22px 5px rgba(212,168,67,.22)} }

        @media(max-width:920px) {
          .aa-section { grid-template-columns:1fr; }
          .aa-left { padding:52px 28px; border-right:none; border-bottom:1px solid rgba(247,246,244,.07); }
          .aa-chat { min-height:480px; }
          .h-bar { padding:20px 20px 28px; }
          .h-arrow { display:none; }
          .products-section { padding:52px 20px 80px; }
          .sec-head { flex-direction:column; align-items:flex-start; }
        }
      `}</style>

      {introVisible && (
        <div className="shop-intro" aria-hidden>
          <div className="shop-intro__pattern">
            <AnkaraPattern id="shop-intro" opacity={1} color="#d4a843"/>
          </div>
          <div className="shop-intro__inner">
            <div className="shop-intro__eyebrow">Ankara Aura</div>
            <div className="shop-intro__title">Shop</div>
            <p className="shop-intro__copy">
              Step into the full shopping experience with its own pace, styling tools, and a storefront built for discovery.
            </p>
            <div className="shop-intro__bar"/>
          </div>
        </div>
      )}

      <div className="shop-main">
      {/* ══════ HERO ══════ */}
      <section
        className="hero"
        onMouseEnter={() => { if (timerRef.current) clearInterval(timerRef.current); }}
        onMouseLeave={startAuto}
      >
        <AnkaraPattern id="hero-p" opacity={0.08}/>

        {prevIdx !== null && (
          <div
            className="h-slide leave"
            style={{ ["--d" as string]: direction } as CSSProperties}
            key={`l-${prevIdx}`}
          >
            <div className="h-bg-txt"><span>{HERO_PRODUCTS[prevIdx].name.toUpperCase()}</span></div>
            <div className="h-model"><ProductVisual product={HERO_PRODUCTS[prevIdx]} size={480}/></div>
            <div className="h-fg-txt"><span>{HERO_PRODUCTS[prevIdx].name.toUpperCase()}</span></div>
          </div>
        )}

        <div
          className={`h-slide${animating ? " enter" : ""}`}
          style={{ ["--d" as string]: direction } as CSSProperties}
          key={`e-${activeIdx}`}
        >
          <div className="h-bg-txt"><span>{active.name.toUpperCase()}</span></div>
          <div className="h-model"><ProductVisual product={active} size={480}/></div>
          <div className="h-fg-txt"><span>{active.name.toUpperCase()}</span></div>
        </div>

        <div className="h-counter">
          <strong>{String(activeIdx + 1).padStart(2, "0")}</strong>{" / "}{String(HERO_PRODUCTS.length).padStart(2, "0")}
        </div>
        <button className="h-arrow l" onClick={prev} aria-label="Previous">
          <svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg>
        </button>
        <button className="h-arrow r" onClick={next} aria-label="Next">
          <svg viewBox="0 0 24 24"><polyline points="9,6 15,12 9,18"/></svg>
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
        <div className="h-bar">
          <div>
            <div className="h-tag">{active.tags[0]}</div>
            <div className="h-name">{active.name}</div>
            <div className="h-price">GH₵ {active.price.toLocaleString()}</div>
            <div className="h-desc">{active.desc}</div>
          </div>
          <Link href={`/shop/${active.slug}`} className="h-cta">View Piece →</Link>
        </div>
      </section>

      {/* ══════ AURA AI ══════ */}
      <AuraSection onHighlight={setHighlighted}/>

      {/* ══════ PRODUCTS ══════ */}
      <section className="products-section">
        <div className="sec-head">
          <div>
            <div className="sec-title">All Pieces</div>
            <div className="sec-sub">{filtered.length} pieces available</div>
          </div>
          <div>
            <div className="search-wrap">
              <input
                className="search-input"
                type="search"
                placeholder="Search pieces"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button className="search-clear" onClick={() => setQuery("")} aria-label="Clear">×</button>
              )}
            </div>
            <div className="pills">
              {tags.map(t => (
                <button key={t} className={`pill${filter === t ? " on" : ""}`} onClick={() => setFilter(t)}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 && (
          <p style={{ color:"rgba(11,11,10,.4)", fontSize:11, letterSpacing:".1em", textTransform:"uppercase", padding:"24px 0" }}>
            No pieces match.
          </p>
        )}

        <div className="grid">
          {filtered.map(product => (
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
              <div className="card-vis"><ProductVisual product={product} size={270}/></div>
              <div className="card-grad"/>
              <div className="card-info">
                <div className="card-tag">{product.tags[0]}</div>
                <div className="card-name">{product.name}</div>
                <div className="card-price">GH₵ {product.price.toLocaleString()}</div>
              </div>
              <div
                className={`card-add${addedSlug === product.slug ? " done" : ""}`}
                onClick={e => {
                  e.preventDefault();
                  addToCart({ slug:product.slug, name:product.name, price:product.price, size:"M", qty:1 });
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
    </div>
  );
}
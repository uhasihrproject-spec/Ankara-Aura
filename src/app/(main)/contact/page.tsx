"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────────────────────────
   HOOKS & SHARED COMPONENTS
───────────────────────────────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, on };
}

function AnkaraPattern({ id = "ap", opacity = 0.07, color = "#0b0b0a" }: {
  id?: string; opacity?: number; color?: string;
}) {
  return (
    <svg
      aria-hidden
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity, pointerEvents:"none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={id} width="64" height="64" patternUnits="userSpaceOnUse">
          <rect x=".5" y=".5" width="63" height="63" fill="none" stroke={color} strokeWidth=".5"/>
          <polygon points="32,2 62,32 32,62 2,32" fill="none" stroke={color} strokeWidth=".8"/>
          <polygon points="32,18 46,32 32,46 18,32" fill="none" stroke={color} strokeWidth=".5"/>
          <circle cx="32" cy="32" r="1.8" fill={color} opacity=".15"/>
          <polygon points="0,0 13,0 0,13" fill={color} opacity=".08"/>
          <polygon points="64,64 51,64 64,51" fill={color} opacity=".08"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`}/>
    </svg>
  );
}

function KenteBar({ h = 3 }: { h?: number }) {
  return (
    <div style={{
      height: h, flexShrink: 0,
      background: "repeating-linear-gradient(90deg,#c8502a 0,#c8502a 20px,#d4a843 20px,#d4a843 40px,#1a3a5c 40px,#1a3a5c 60px,#2d6a4f 60px,#2d6a4f 80px,#0b0b0a 80px,#0b0b0a 100px)",
      backgroundSize: "100px 100%",
    }}/>
  );
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const INQUIRY_TYPES = [
  { value:"custom",    label:"Custom Order",        desc:"Design a bespoke piece — silhouette, fabric, every detail tailored entirely to you." },
  { value:"collab",    label:"Brand Collaboration",  desc:"Strategic partnerships, co-branded projects, or creative collaborations." },
  { value:"wholesale", label:"Wholesale",            desc:"Stocking Ankara Aura in your store. We work with carefully selected retail partners." },
  { value:"press",     label:"Press & Media",        desc:"Editorial features, photography, or media coverage." },
  { value:"general",   label:"General",              desc:"Anything else — we read everything and respond with intent." },
];

interface Founder {
  name: string;
  initials: string;
  title: string;
  note: string;
  email: string;
  whatsapp: string;
  instagram: string;
  color: string;
}

const FOUNDERS: Founder[] = [
  {
    name: "Eldwin Asante", initials: "EA",
    title: "Founder · Creative Director",
    note: "Brand vision, creative direction, and strategic conversations.",
    email: "eldwin@ankaraaura.com",
    whatsapp: "+233551234567",
    instagram: "eldwin.aa",
    color: "#c8502a",
  },
  {
    name: "Kelvin Baidoo", initials: "KB",
    title: "Co-Founder · Operations",
    note: "Logistics, wholesale inquiries, and operational partnerships.",
    email: "kelvin@ankaraaura.com",
    whatsapp: "+233502345678",
    instagram: "kelvin.aa",
    color: "#1a3a5c",
  },
  {
    name: "Jame Reynolds", initials: "JR",
    title: "Co-Founder · Brand Strategy",
    note: "Press, media features, and global brand positioning.",
    email: "jame@ankaraaura.com",
    whatsapp: "+233243456789",
    instagram: "jame.aa",
    color: "#2d6a4f",
  },
];

/* ─────────────────────────────────────────
   FOUNDER FLIP CARD
───────────────────────────────────────── */
function FounderCard({ f, delay, visible }: { f: Founder; delay: number; visible: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const [copied,  setCopied]  = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {});
  };

  return (
    <div
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}s, transform .8s cubic-bezier(.16,1,.3,1) ${delay}s`,
        perspective: "1100px",
        height: 360,
        cursor: "pointer",
      }}
      onClick={() => setFlipped(v => !v)}
    >
      {/* flip container */}
      <div style={{
        position: "relative", width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform .65s cubic-bezier(.16,1,.3,1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>

        {/* ──── FRONT ──── */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          background: "#0b0b0a",
          borderTop: `2px solid ${f.color}`,
          padding: "36px 32px",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          <AnkaraPattern id={`ff-${f.initials}`} opacity={0.045} color="#f7f6f4"/>

          {/* tap hint */}
          <div style={{
            position: "absolute", bottom: 18, right: 20,
            fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase",
            color: "rgba(247,246,244,0.2)", fontFamily: "'DM Sans',sans-serif",
            display: "flex", alignItems: "center", gap: 5,
            zIndex: 2,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(247,246,244,0.22)" strokeWidth="2" strokeLinecap="round">
              <path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
            Tap to reveal
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* giant initials */}
            <div style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 62, letterSpacing: ".1em",
              color: "transparent", WebkitTextStroke: `1px ${f.color}`,
              lineHeight: 1, marginBottom: 20,
            }}>
              {f.initials}
            </div>

            {/* name */}
            <div style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 23, letterSpacing: ".05em",
              color: "#f7f6f4", marginBottom: 5,
            }}>
              {f.name}
            </div>

            {/* title */}
            <div style={{
              fontFamily: "'Caveat',cursive", fontSize: 14, color: f.color, marginBottom: 20,
            }}>
              {f.title}
            </div>

            {/* rule */}
            <div style={{ width: 36, height: 1.5, background: f.color, marginBottom: 18 }}/>

            {/* note */}
            <div style={{
              fontSize: 12, color: "rgba(247,246,244,0.35)", lineHeight: 1.8,
              fontFamily: "'DM Sans',sans-serif",
            }}>
              {f.note}
            </div>
          </div>
        </div>

        {/* ──── BACK ──── */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: `linear-gradient(150deg, ${f.color}20 0%, #0b0b0a 50%)`,
          borderTop: `2px solid ${f.color}`,
          padding: "28px 28px 24px",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          <AnkaraPattern id={`fb-${f.initials}`} opacity={0.04} color={f.color}/>

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
            {/* back header */}
            <div style={{ marginBottom: 22 }}>
              <div style={{
                fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: ".2em",
                color: f.color, marginBottom: 6,
              }}>
                DIRECT CONTACT
              </div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 19, letterSpacing: ".05em", color: "#f7f6f4", lineHeight: 1 }}>
                {f.name}
              </div>
              <div style={{ fontFamily: "'Caveat',cursive", fontSize: 13, color: f.color, marginTop: 3 }}>
                {f.title}
              </div>
            </div>

            {/* contact rows */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>

              {/* email */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "13px 0",
                  borderBottom: "1px solid rgba(247,246,244,0.07)",
                  cursor: "pointer",
                }}
                onClick={e => { e.stopPropagation(); copy(f.email, "email"); }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(247,246,244,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="1.8" strokeLinecap="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(247,246,244,0.28)", marginBottom: 2, fontFamily: "'DM Sans',sans-serif" }}>Email</div>
                  <div style={{ fontSize: 12, color: "#f7f6f4", fontFamily: "'DM Sans',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.email}
                  </div>
                </div>
                <div style={{
                  fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase",
                  color: copied === "email" ? "#2d6a4f" : "rgba(247,246,244,0.22)",
                  flexShrink: 0, fontFamily: "'DM Sans',sans-serif",
                  transition: "color .2s",
                }}>
                  {copied === "email" ? "✓ Copied" : "Copy"}
                </div>
              </div>

              {/* whatsapp */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "13px 0",
                  borderBottom: "1px solid rgba(247,246,244,0.07)",
                  cursor: "pointer",
                }}
                onClick={e => { e.stopPropagation(); window.open(`https://wa.me/${f.whatsapp}`, "_blank"); }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(247,246,244,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={f.color}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(247,246,244,0.28)", marginBottom: 2, fontFamily: "'DM Sans',sans-serif" }}>WhatsApp</div>
                  <div style={{ fontSize: 12, color: "#f7f6f4", fontFamily: "'DM Sans',sans-serif" }}>+{f.whatsapp.replace(/\D/g,"").slice(0,3)} {f.whatsapp.replace(/\D/g,"").slice(3,5)} {f.whatsapp.replace(/\D/g,"").slice(5,8)} {f.whatsapp.replace(/\D/g,"").slice(8)}</div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(247,246,244,0.22)" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </div>

              {/* instagram */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "13px 0",
                  cursor: "pointer",
                }}
                onClick={e => { e.stopPropagation(); window.open(`https://instagram.com/${f.instagram}`, "_blank"); }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(247,246,244,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="1.8" strokeLinecap="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill={f.color} stroke="none"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(247,246,244,0.28)", marginBottom: 2, fontFamily: "'DM Sans',sans-serif" }}>Instagram</div>
                  <div style={{ fontSize: 12, color: "#f7f6f4", fontFamily: "'DM Sans',sans-serif" }}>@{f.instagram}</div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(247,246,244,0.22)" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </div>
            </div>

            {/* flip back hint */}
            <div style={{
              textAlign: "center", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase",
              color: "rgba(247,246,244,0.15)", fontFamily: "'DM Sans',sans-serif", marginTop: 10,
            }}>
              Tap to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function ContactPage() {
  const formR  = useReveal(0.08);
  const infoR  = useReveal(0.1);
  const foundR = useReveal(0.08);

  const [heroOn, setHeroOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroOn(true), 80); return () => clearTimeout(t); }, []);

  const [type,        setType]        = useState(INQUIRY_TYPES[0]);
  const [dropOpen,    setDropOpen]    = useState(false);
  const [form,        setForm]        = useState({ name:"", email:"", phone:"", message:"" });
  const [submitted,   setSubmitted]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        :root {
          --ink:#0b0b0a; --cream:#f7f6f4; --kente:#c8502a;
          --gold:#d4a843; --forest:#2d6a4f; --indigo:#1a3a5c;
          --dim:rgba(11,11,10,0.09);
        }
        body { background:var(--cream); color:var(--ink); font-family:'DM Sans',sans-serif; overflow-x:hidden; }
        .pw { max-width:1200px; margin:0 auto; padding:0 48px; }
        @media(max-width:768px) { .pw { padding:0 22px; } }

        /* reveal */
        .rv  { opacity:0; transform:translateY(38px); transition:opacity .95s cubic-bezier(.16,1,.3,1), transform .95s cubic-bezier(.16,1,.3,1); }
        .rv.on { opacity:1; transform:none; }
        .ch  { opacity:0; transform:translateY(22px); transition:opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
        .rv.on .ch { opacity:1; transform:none; }
        .ch:nth-child(1){transition-delay:.05s} .ch:nth-child(2){transition-delay:.13s}
        .ch:nth-child(3){transition-delay:.21s} .ch:nth-child(4){transition-delay:.29s}
        .ch:nth-child(5){transition-delay:.37s} .ch:nth-child(6){transition-delay:.45s}
        .hw   { overflow:hidden; }
        .hl   { display:block; transform:translateY(110%); transition:transform 1.1s cubic-bezier(.16,1,.3,1); }
        .hl.on{ transform:translateY(0); }
        .d1{transition-delay:.08s} .d2{transition-delay:.19s} .d3{transition-delay:.31s}

        @keyframes fup { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }

        /* ──── HERO ──── */
        .ct-hero {
          min-height:88svh; display:flex; flex-direction:column; justify-content:center;
          background:var(--cream); border-bottom:1px solid var(--dim);
          position:relative; overflow:hidden;
        }
        .ct-inner { position:relative; z-index:2; padding:0 48px; max-width:1200px; margin:0 auto; }
        @media(max-width:768px) { .ct-inner { padding:0 22px; } }

        .ct-eyebrow {
          font-family:'Caveat',cursive; font-size:15px; color:var(--kente);
          margin-bottom:28px; letter-spacing:.06em;
          opacity:0; animation:fup .9s cubic-bezier(.16,1,.3,1) .12s forwards;
        }
        .ct-h1 {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(60px,10.5vw,158px); line-height:.86; letter-spacing:.01em;
        }
        .solid  { color:var(--ink); }
        .stroke { -webkit-text-stroke:2px var(--ink); color:transparent; }
        .ct-sub {
          font-family:'Caveat',cursive; font-size:clamp(16px,2vw,22px);
          color:rgba(11,11,10,.42); max-width:500px;
          margin-top:34px; line-height:1.65;
          opacity:0; animation:fup .9s cubic-bezier(.16,1,.3,1) .65s forwards;
        }
        .ct-strip {
          display:flex; gap:44px; margin-top:50px; flex-wrap:wrap;
          opacity:0; animation:fup .9s cubic-bezier(.16,1,.3,1) .85s forwards;
          border-top:1px solid var(--dim); padding-top:30px;
        }
        .ct-si { display:flex; flex-direction:column; gap:4px; }
        .ct-sl { font-size:9px; letter-spacing:.22em; text-transform:uppercase; color:rgba(11,11,10,.28); }
        .ct-sv { font-family:'Caveat',cursive; font-size:17px; color:var(--ink); }
        .ct-sv a { color:var(--kente); text-decoration:none; }
        .ct-sv a:hover { opacity:.7; }
        .ct-ghost {
          position:absolute; pointer-events:none; z-index:1;
          font-family:'Bebas Neue',sans-serif; color:transparent;
          -webkit-text-stroke:1px rgba(11,11,10,.03);
          font-size:clamp(80px,16vw,220px); right:-3%; bottom:-4%;
          animation:gdrift 20s ease-in-out infinite alternate;
        }
        @keyframes gdrift { from{transform:translateX(0)} to{transform:translateX(2%)} }

        /* ──── MAIN GRID ──── */
        .ct-main {
          display:grid; grid-template-columns:1fr 380px;
          background:var(--cream); border-bottom:1px solid var(--dim);
          min-height:100vh;
        }
        .ct-form {
          padding:80px 64px 100px;
          border-right:1px solid var(--dim);
        }
        .ct-form-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(30px,4vw,52px); letter-spacing:.04em; margin-bottom:7px; }
        .ct-form-sub   { font-family:'Caveat',cursive; font-size:15px; color:rgba(11,11,10,.38); margin-bottom:50px; }

        /* dropdown */
        .drop-label { font-size:9px; letter-spacing:.22em; text-transform:uppercase; color:rgba(11,11,10,.28); margin-bottom:11px; }
        .drop-btn {
          width:100%; display:flex; align-items:center; justify-content:space-between;
          border:none; border-bottom:2px solid var(--ink); background:none; cursor:pointer;
          padding:13px 0; text-align:left;
          font-family:'Bebas Neue',sans-serif; font-size:21px; letter-spacing:.06em; color:var(--ink);
          transition:border-color .2s;
        }
        .drop-btn:hover { border-color:var(--kente); }
        .drop-arrow { width:13px; height:13px; stroke:currentColor; stroke-width:1.5; fill:none; transition:transform .28s; }
        .drop-arrow.open { transform:rotate(180deg); }
        .drop-list {
          border:1px solid var(--dim); border-top:none;
          max-height:0; overflow:hidden;
          transition:max-height .38s cubic-bezier(.4,0,.2,1);
        }
        .drop-list.open { max-height:360px; }
        .drop-opt {
          display:block; width:100%; border:none; background:none; cursor:pointer;
          text-align:left; padding:15px 18px;
          border-bottom:1px solid var(--dim); transition:background .18s;
        }
        .drop-opt:last-child { border-bottom:none; }
        .drop-opt:hover, .drop-opt.sel { background:rgba(200,80,42,.04); }
        .drop-opt-name { font-family:'Bebas Neue',sans-serif; font-size:14px; letter-spacing:.08em; color:var(--ink); display:block; margin-bottom:3px; }
        .drop-opt-desc { font-size:11px; color:rgba(11,11,10,.38); line-height:1.6; }
        .ct-inq-desc { padding:15px 0 26px; font-family:'Caveat',cursive; font-size:15px; color:rgba(11,11,10,.38); line-height:1.65; border-bottom:1px solid var(--dim); margin-bottom:34px; }

        /* fields */
        .fields { display:flex; flex-direction:column; }
        .field  { display:flex; flex-direction:column; gap:5px; border-bottom:1px solid var(--dim); padding:17px 0; position:relative; }
        .field-label { font-size:9px; letter-spacing:.22em; text-transform:uppercase; color:rgba(11,11,10,.28); }
        .field-input, .field-ta {
          border:none; background:transparent; outline:none;
          font-family:'Bebas Neue',sans-serif; font-size:19px; letter-spacing:.04em; color:var(--ink); padding:5px 0; width:100%;
        }
        .field-input::placeholder, .field-ta::placeholder { color:rgba(11,11,10,.14); }
        .field-ta { resize:none; min-height:88px; font-size:17px; line-height:1.6; }
        .field-bar { position:absolute; bottom:0; left:0; right:0; height:1px; background:var(--kente); transform:scaleX(0); transform-origin:left; transition:transform .32s cubic-bezier(.77,0,.175,1); }
        .field:focus-within .field-bar { transform:scaleX(1); }
        .field:focus-within .field-label { color:var(--kente); }

        /* submit */
        .submit-row { margin-top:40px; display:flex; align-items:center; gap:18px; flex-wrap:wrap; }
        .submit-btn {
          padding:15px 42px; background:var(--ink); color:var(--cream);
          font-family:'Bebas Neue',sans-serif; font-size:12px; letter-spacing:.22em; text-transform:uppercase;
          border:1.5px solid var(--ink); cursor:pointer; position:relative; overflow:hidden;
          transition:transform .2s, box-shadow .2s;
        }
        .submit-btn::before { content:''; position:absolute; inset:0; background:var(--kente); transform:scaleX(0); transform-origin:left; transition:transform .38s cubic-bezier(.77,0,.175,1); }
        .submit-btn:hover::before { transform:scaleX(1); }
        .submit-btn:hover { transform:translateY(-2px); box-shadow:0 8px 26px rgba(200,80,42,.22); }
        .submit-btn span { position:relative; z-index:1; }
        .submit-btn:disabled { opacity:.5; cursor:wait; }
        .submit-note { font-family:'Caveat',cursive; font-size:14px; color:rgba(11,11,10,.28); }

        /* success */
        .success { padding:56px 0; display:flex; flex-direction:column; gap:14px; animation:fup .6s cubic-bezier(.16,1,.3,1) forwards; }
        .success-check { width:46px; height:46px; border-radius:50%; background:var(--forest); display:flex; align-items:center; justify-content:center; animation:popIn .5s cubic-bezier(.16,1,.3,1) forwards; }
        @keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        .success-title { font-family:'Bebas Neue',sans-serif; font-size:34px; letter-spacing:.06em; }
        .success-body  { font-family:'Caveat',cursive; font-size:16px; color:rgba(11,11,10,.45); line-height:1.65; max-width:380px; }

        /* sidebar */
        .ct-side { padding:80px 44px 80px 52px; display:flex; flex-direction:column; background:rgba(11,11,10,.015); }
        .ct-si-block { padding:34px 0; border-bottom:1px solid var(--dim); }
        .ct-si-block:first-child { padding-top:0; }
        .ct-si-lbl { font-size:9px; letter-spacing:.24em; text-transform:uppercase; color:rgba(11,11,10,.26); margin-bottom:11px; }
        .ct-si-val { font-family:'Bebas Neue',sans-serif; font-size:clamp(15px,2vw,21px); letter-spacing:.04em; line-height:1.2; }
        .ct-si-sub { font-family:'Caveat',cursive; font-size:13px; color:rgba(11,11,10,.35); margin-top:5px; }
        .ct-si-val a { color:var(--kente); text-decoration:none; }
        .bar-track { height:2px; background:var(--dim); margin-top:12px; overflow:hidden; }
        .bar-fill  { height:100%; background:var(--forest); width:82%; animation:barIn 1.8s cubic-bezier(.16,1,.3,1) .5s both; }
        @keyframes barIn { from{width:0} }

        @media(max-width:900px) {
          .ct-main { grid-template-columns:1fr; }
          .ct-form { padding:56px 22px 72px; border-right:none; border-bottom:1px solid var(--dim); }
          .ct-side { padding:48px 22px; }
        }

        /* ──── FOUNDERS ──── */
        .found-s {
          background:var(--ink); padding:120px 0;
          border-bottom:1px solid rgba(247,246,244,.05);
          position:relative; overflow:hidden;
        }
        .found-lbl   { font-size:9px; letter-spacing:.28em; text-transform:uppercase; color:var(--gold); margin-bottom:18px; }
        .found-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(34px,5vw,70px); color:var(--cream); line-height:.9; margin-bottom:16px; }
        .found-title .sk { -webkit-text-stroke:1px rgba(247,246,244,.18); color:transparent; display:block; }
        .found-hint  { font-family:'Caveat',cursive; font-size:15px; color:rgba(247,246,244,.28); margin-bottom:44px; display:flex; align-items:center; gap:7px; }
        .found-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; }
        @media(max-width:860px) {
          .found-s   { padding:80px 0; }
          .found-grid{ grid-template-columns:1fr; }
          .found-hint{ margin-bottom:32px; }
        }
      `}</style>

      <KenteBar h={4}/>

      {/* ══════ HERO ══════ */}
      <section className="ct-hero">
        <AnkaraPattern id="ct-hp" opacity={0.055}/>
        <div className="ct-ghost">CONNECT</div>
        <div className="ct-inner">
          <p className="ct-eyebrow">Ankara Aura — Contact</p>
          <h1 className="ct-h1">
            <div className="hw"><span className={`hl solid${heroOn ? " on d1" : ""}`}>LET&apos;S CREATE</span></div>
            <div className="hw"><span className={`hl solid${heroOn ? " on d2" : ""}`}>WITH</span></div>
            <div className="hw"><span className={`hl stroke${heroOn ? " on d3" : ""}`}>PURPOSE.</span></div>
          </h1>
          <p className="ct-sub">
            For collaborations, custom designs, wholesale partnerships, press, or any conversation worth having — we&apos;re here.
          </p>
          <div className="ct-strip">
            {([
              { label:"Email",         value:<a href="mailto:ankaraauragh@gmail.com">ankaraauragh@gmail.com</a> },
              { label:"Location",      value:"Accra, Ghana" },
              { label:"Response Time", value:"Within 48 hours" },
            ] as const).map(i => (
              <div key={i.label} className="ct-si">
                <span className="ct-sl">{i.label}</span>
                <span className="ct-sv">{i.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FORM + SIDEBAR ══════ */}
      <div className="ct-main">

        {/* form */}
        <div
          ref={formR.ref as React.RefObject<HTMLDivElement>}
          className={`ct-form rv${formR.on ? " on" : ""}`}
        >
          <h2 className="ct-form-title ch">Send Your Inquiry</h2>
          <p className="ct-form-sub ch">Every message is read. Every reply is considered.</p>

          {/* dropdown */}
          <div className="ch">
            <p className="drop-label">Inquiry Type</p>
            <button className="drop-btn" onClick={() => setDropOpen(o => !o)}>
              {type.label}
              <svg className={`drop-arrow${dropOpen ? " open" : ""}`} viewBox="0 0 16 16">
                <polyline points="3,6 8,11 13,6"/>
              </svg>
            </button>
            <div className={`drop-list${dropOpen ? " open" : ""}`}>
              {INQUIRY_TYPES.map(t => (
                <button
                  key={t.value}
                  className={`drop-opt${type.value === t.value ? " sel" : ""}`}
                  onClick={() => { setType(t); setDropOpen(false); }}
                >
                  <span className="drop-opt-name">{t.label}</span>
                  <span className="drop-opt-desc">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="ct-inq-desc ch">{type.desc}</p>

          {submitted ? (
            <div className="success">
              <div className="success-check">
                <svg width="21" height="21" viewBox="0 0 22 22" fill="none">
                  <polyline points="4,11 9,16 18,6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="success-title">Inquiry received.</h3>
              <p className="success-body">
                We have your message. Someone from the Ankara Aura team will respond within 48 hours — you&apos;ll hear from a real person.
              </p>
            </div>
          ) : (
            <form className="fields" onSubmit={handleSubmit}>
              {([ 
                { k:"name",    label:"Full Name",        type:"text",  ph:"Your name"          },
                { k:"email",   label:"Email Address",    type:"email", ph:"your@email.com"     },
                { k:"phone",   label:"Phone (Optional)", type:"tel",   ph:"+233 00 000 0000"   },
              ] as const).map(f => (
                <div key={f.k} className="field ch">
                  <label className="field-label">{f.label}</label>
                  <input
                    className="field-input" type={f.type} placeholder={f.ph}
                    value={form[f.k]} onChange={set(f.k)} required={f.k !== "phone"}
                  />
                  <div className="field-bar"/>
                </div>
              ))}
              <div className="field ch">
                <label className="field-label">Your Message</label>
                <textarea
                  className="field-ta" placeholder="Tell us what you have in mind…"
                  value={form.message} onChange={set("message")} required rows={4}
                />
                <div className="field-bar"/>
              </div>
              <div className="submit-row ch">
                <button type="submit" className="submit-btn" disabled={submitting}>
                  <span>{submitting ? "Sending…" : "Send Inquiry"}</span>
                </button>
                <span className="submit-note">We respond in 48 hours.</span>
              </div>
            </form>
          )}
        </div>

        {/* sidebar */}
        <div
          ref={infoR.ref as React.RefObject<HTMLDivElement>}
          className={`ct-side rv${infoR.on ? " on" : ""}`}
        >
          {[
            { lbl:"Email",             val:<a href="mailto:ankaraauragh@gmail.com">ankaraauragh@gmail.com</a>, sub:"For all general and business inquiries." },
            { lbl:"Studio Location",   val:"Accra, Ghana",            sub:"West Africa · Serving globally." },
            { lbl:"Response Time",     val:"Within 48 hours",         sub:null, bar:true },
            { lbl:"Availability",      val:"Monday — Saturday",       sub:"8:00 AM — 6:00 PM WAT" },
            { lbl:"Custom Orders",     val:"Design Consultation",      sub:"Book via the Customize page, or reach us directly." },
          ].map((b, i) => (
            <div key={b.lbl} className="ct-si-block ch" style={{ transitionDelay:`${i * 0.09}s` }}>
              <p className="ct-si-lbl">{b.lbl}</p>
              <p className="ct-si-val">{b.val}</p>
              {b.sub && <p className="ct-si-sub">{b.sub}</p>}
              {b.bar && <div className="bar-track"><div className="bar-fill"/></div>}
            </div>
          ))}
        </div>
      </div>

      {/* ══════ FOUNDERS ══════ */}
      <section
        ref={foundR.ref}
        className={`found-s rv${foundR.on ? " on" : ""}`}
      >
        <AnkaraPattern id="ct-fp" opacity={0.04} color="#f7f6f4"/>
        <div className="pw" style={{ position:"relative", zIndex:1 }}>
          <p className="found-lbl ch">Direct Contact</p>
          <h2 className="found-title ch">
            THE TEAM<br/><span className="sk">BEHIND THE BRAND</span>
          </h2>
          <p className="found-hint ch">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(247,246,244,0.3)" strokeWidth="1.8" strokeLinecap="round">
              <path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
            Tap any card to reveal their personal contacts
          </p>
          <div className="found-grid">
            {FOUNDERS.map((f, i) => (
              <FounderCard key={f.name} f={f} delay={i * 0.13} visible={foundR.on}/>
            ))}
          </div>
        </div>
      </section>

      <KenteBar h={4}/>
    </>
  );
}
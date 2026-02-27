"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function AnkaraPattern({ id = "ap", opacity = 0.07, color = "#0b0b0a" }: { id?: string; opacity?: number; color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity,pointerEvents:"none" }} aria-hidden>
      <defs>
        <pattern id={id} width="64" height="64" patternUnits="userSpaceOnUse">
          <polygon points="32,2 62,32 32,62 2,32" fill="none" stroke={color} strokeWidth="0.9"/>
          <polygon points="32,18 46,32 32,46 18,32" fill="none" stroke={color} strokeWidth="0.6"/>
          <polygon points="0,0 18,0 0,18" fill={color} opacity="0.1"/>
          <polygon points="64,0 46,0 64,18" fill={color} opacity="0.1"/>
          <polygon points="0,64 18,64 0,46" fill={color} opacity="0.1"/>
          <polygon points="64,64 46,64 64,46" fill={color} opacity="0.1"/>
          <circle cx="32" cy="32" r="2" fill={color} opacity="0.15"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`}/>
    </svg>
  );
}

function KenteBar({ height = 3 }: { height?: number }) {
  return (
    <div style={{
      height, flexShrink: 0,
      background: `repeating-linear-gradient(90deg,#c8502a 0,#c8502a 20px,#d4a843 20px,#d4a843 40px,#1a3a5c 40px,#1a3a5c 60px,#2d6a4f 60px,#2d6a4f 80px,#0b0b0a 80px,#0b0b0a 100px)`,
      backgroundSize: "100px 100%",
    }} />
  );
}

/* ── Data ── */
const SILHOUETTES = [
  { id: "oversized-tee",  label: "Oversized Tee",   desc: "Street-ready, dropped shoulder, relaxed through body." },
  { id: "two-piece",      label: "Two-Piece Set",    desc: "Coordinated jacket and trouser. Structured authority." },
  { id: "dress",          label: "Structured Dress", desc: "Knee-length, defined waist, Ankara panelling." },
  { id: "blazer",         label: "Ankara Blazer",    desc: "Single-button, unlined for drape, bold lapel." },
  { id: "custom",         label: "Custom Silhouette",desc: "Describe your vision. We design from scratch." },
];

const FABRICS = [
  { id: "kente-red",    label: "Kente Red",      color: "#c8502a", pattern: "Ankara Wax · Deep Kente" },
  { id: "indigo-wax",   label: "Indigo Wax",     color: "#1a3a5c", pattern: "Ankara Wax · Midnight" },
  { id: "forest-ankara",label: "Forest Ankara",  color: "#2d6a4f", pattern: "Ankara Wax · Heritage Forest" },
  { id: "gold-print",   label: "Gold Print",     color: "#d4a843", pattern: "Ankara Wax · Royal Gold" },
  { id: "mono-black",   label: "Monochrome",     color: "#0b0b0a", pattern: "Heavyweight Cotton · Jet" },
  { id: "cream-linen",  label: "Natural Linen",  color: "#f0ebe0", pattern: "Linen · Cream Natural" },
];

const SLEEVES    = ["Long Sleeve", "Three-Quarter", "Short Sleeve", "Sleeveless"];
const FITS       = ["Tailored", "Relaxed", "Oversized", "Structured"];
const NECKLINES  = ["Crew Neck", "V-Neck", "Mandarin Collar", "Open Collar", "Mock Neck"];

// SVG product previews — fabric-coloured silhouettes
function GarmentPreview({ silhouette, fabric, sleeve, fit }: { silhouette: string; fabric: typeof FABRICS[0]; sleeve: string; fit: string }) {
  const c = fabric.color;
  const isLight = c === "#f0ebe0" || c === "#d4a843";
  const strokeC = isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.15)";
  const accentC = isLight ? "#c8502a" : "#d4a843";

  return (
    <svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 320, filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.22))" }}>
      <defs>
        <pattern id={`fab-${fabric.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <polygon points="12,1 23,12 12,23 1,12" fill="none" stroke={strokeC} strokeWidth="0.7"/>
          <circle cx="12" cy="12" r="1.5" fill={accentC} opacity="0.5"/>
        </pattern>
        <linearGradient id="garm-shade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.12)"/>
        </linearGradient>
        <clipPath id="body-clip">
          {silhouette === "dress"
            ? <path d="M75,80 L40,100 L30,140 L32,360 L268,360 L270,140 L260,100 L225,80 Z"/>
            : <path d="M75,80 L30,110 L24,200 L44,200 L50,250 L250,250 L256,200 L276,200 L270,110 L225,80 Z"/>
          }
        </clipPath>
      </defs>

      {/* shirt body */}
      {silhouette === "dress" ? (
        <path d="M75,80 L40,100 L30,140 L32,360 L268,360 L270,140 L260,100 L225,80 Z"
          fill={c} stroke={strokeC} strokeWidth="1"/>
      ) : (
        <>
          <path d="M75,80 L30,110 L24,200 L44,200 L50,250 L250,250 L256,200 L276,200 L270,110 L225,80 Z"
            fill={c} stroke={strokeC} strokeWidth="1"/>
          {/* sleeves */}
          {sleeve !== "Sleeveless" && (
            <>
              <path d={sleeve === "Long Sleeve"
                ? "M75,80 L30,110 L14,240 L38,248 L55,140 L75,100 Z"
                : sleeve === "Three-Quarter"
                ? "M75,80 L30,110 L20,195 L44,202 L55,130 L75,100 Z"
                : "M75,80 L30,110 L28,165 L52,172 L58,120 L75,100 Z"}
                fill={c} stroke={strokeC} strokeWidth="1"/>
              <path d={sleeve === "Long Sleeve"
                ? "M225,80 L270,110 L286,240 L262,248 L245,140 L225,100 Z"
                : sleeve === "Three-Quarter"
                ? "M225,80 L270,110 L280,195 L256,202 L245,130 L225,100 Z"
                : "M225,80 L270,110 L272,165 L248,172 L242,120 L225,100 Z"}
                fill={c} stroke={strokeC} strokeWidth="1"/>
            </>
          )}
        </>
      )}

      {/* overlay fabric pattern */}
      <g clipPath="url(#body-clip)">
        <rect x="0" y="0" width="300" height="380" fill={`url(#fab-${fabric.id})`} opacity="0.6"/>
        <rect x="0" y="0" width="300" height="380" fill="url(#garm-shade)"/>
      </g>

      {/* collar */}
      <path d="M130,80 Q150,60 170,80 L162,96 Q150,86 138,96 Z"
        fill={accentC} opacity="0.7"/>

      {/* centre seam */}
      <line x1="150" y1="96" x2="150" y2={silhouette === "dress" ? "360" : "250"}
        stroke={strokeC} strokeWidth="0.7" strokeDasharray="4,6"/>

      {/* fit visual — waist indicator */}
      {fit === "Tailored" && (
        <ellipse cx="150" cy="195" rx="75" ry="8" fill="none" stroke={accentC} strokeWidth="1.2" opacity="0.4"/>
      )}

      {/* ankle label */}
      <text x="150" y="370" textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif" fontSize="11" letterSpacing="3"
        fill={isLight ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.2)"}>
        {fabric.pattern.toUpperCase()}
      </text>
    </svg>
  );
}

export default function CustomizePage() {
  const [step, setStep]               = useState(0); // 0=silhouette, 1=fabric, 2=details
  const [silhouette, setSilhouette]   = useState(SILHOUETTES[0]);
  const [fabric, setFabric]           = useState(FABRICS[0]);
  const [sleeve, setSleeve]           = useState(SLEEVES[0]);
  const [fit, setFit]                 = useState(FITS[0]);
  const [neckline, setNeckline]       = useState(NECKLINES[0]);
  const [embroidery, setEmbroidery]   = useState("");
  const [measurements, setMeasurements] = useState({ height:"", chest:"", waist:"", hip:"", notes:"" });
  const [submitted, setSubmitted]     = useState(false);
  const [previewing, setPreviewing]   = useState(false);

  const howR    = useReveal(0.1);
  const measR   = useReveal(0.1);
  const summR   = useReveal(0.1);
  const closeR  = useReveal(0.15);

  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t); }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  }, []);

  const summary = [
    { label: "Silhouette",   val: silhouette.label },
    { label: "Fabric",       val: fabric.label },
    { label: "Pattern",      val: fabric.pattern },
    { label: "Sleeve",       val: sleeve },
    { label: "Fit",          val: fit },
    { label: "Neckline",     val: neckline },
    ...(embroidery ? [{ label: "Embroidery", val: `"${embroidery}"` }] : []),
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink:    #0b0b0a; --cream:  #f7f6f4; --kente:  #c8502a;
          --gold:   #d4a843; --indigo: #1a3a5c; --forest: #2d6a4f;
          --b:      rgba(11,11,10,0.09);
          --fd: 'Bebas Neue', sans-serif; --fb: 'DM Sans', sans-serif; --fa: 'Caveat', cursive;
        }
        body { background: var(--cream); color: var(--ink); font-family: var(--fb); overflow-x: hidden; }
        .pw { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
        @media(max-width:768px){ .pw{ padding: 0 22px; } }

        .rv { opacity:0; transform:translateY(40px); transition: opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1); }
        .rv.on { opacity:1; transform:none; }
        .child { opacity:0; transform:translateY(24px); clip-path:inset(0 0 100% 0);
          transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1), clip-path 0.85s cubic-bezier(0.16,1,0.3,1); }
        .rv.on .child { opacity:1; transform:none; clip-path:inset(0 0 0% 0); }
        .child:nth-child(1){transition-delay:0.04s} .child:nth-child(2){transition-delay:0.12s}
        .child:nth-child(3){transition-delay:0.20s} .child:nth-child(4){transition-delay:0.28s}
        .child:nth-child(5){transition-delay:0.36s} .child:nth-child(6){transition-delay:0.44s}
        .hw { overflow:hidden; }
        .hline { display:block; transform:translateY(110%); transition: transform 1.1s cubic-bezier(0.16,1,0.3,1); }
        .hline.on { transform:translateY(0); }
        .hline.d1{transition-delay:0.08s} .hline.d2{transition-delay:0.18s} .hline.d3{transition-delay:0.30s}

        /* ═══ HERO ═══ */
        .cx-hero {
          min-height: 88svh; display:flex; flex-direction:column;
          background:var(--cream); border-bottom:1px solid var(--b);
          position:relative; overflow:hidden;
        }
        .cx-hero-inner {
          position:relative; z-index:2; padding: 40px 48px 64px;
          max-width:1200px; margin:0 auto; flex:1;
          display:flex; flex-direction:column; justify-content:center;
        }
        .cx-hero-tag {
          font-family:var(--fa); font-size:15px; color:var(--kente);
          margin-bottom:28px; letter-spacing:0.06em;
          opacity:0; animation: fup 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s forwards;
        }
        @keyframes fup { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        .cx-hero-h1 {
          font-family:var(--fd);
          font-size: clamp(72px,12vw,172px);
          line-height:0.86; letter-spacing:0.01em;
        }
        .cx-hero-solid { color:var(--ink); }
        .cx-hero-stroke { -webkit-text-stroke:2px var(--ink); color:transparent; }
        .cx-hero-sub {
          font-family:var(--fa); font-size:clamp(17px,2.2vw,24px);
          color:rgba(11,11,10,0.44); max-width:480px;
          margin-top:32px; line-height:1.6;
          opacity:0; animation:fup 0.9s cubic-bezier(0.16,1,0.3,1) 0.65s forwards;
        }
        .cx-hero-steps {
          display:flex; gap:32px; margin-top:48px; align-items:center;
          opacity:0; animation:fup 0.9s cubic-bezier(0.16,1,0.3,1) 0.85s forwards;
          flex-wrap:wrap;
        }
        .cx-step-pill {
          display:flex; align-items:center; gap:10px;
          font-family:var(--fd); font-size:11px; letter-spacing:0.18em;
          color:rgba(11,11,10,0.4); text-transform:uppercase; cursor:pointer;
          border-bottom: 1px solid transparent;
          padding-bottom:3px;
          transition: color 0.2s, border-color 0.2s;
        }
        .cx-step-pill.active { color:var(--kente); border-color:var(--kente); }
        .cx-step-pill-n {
          font-family:var(--fa); font-size:12px; color:inherit;
        }
        .cx-step-sep { width:16px; height:1px; background:var(--b); }

        /* ghost */
        .cx-ghost {
          position:absolute; pointer-events:none; z-index:1;
          font-family:var(--fd); color:transparent; user-select:none;
          -webkit-text-stroke:1px rgba(11,11,10,0.035);
          font-size:clamp(100px,20vw,280px);
          right:-4%; bottom:-10%;
          animation: gdrift 20s ease-in-out infinite alternate;
        }
        @keyframes gdrift{from{transform:translateX(0)} to{transform:translateX(2%)}}

        /* ═══ HOW IT WORKS ═══ */
        .cx-how-s {
          padding:120px 0; border-bottom:1px solid var(--b);
          background:var(--ink); position:relative; overflow:hidden;
        }
        .cx-how-tag { font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:var(--kente); margin-bottom:20px; }
        .cx-how-title { font-family:var(--fd); font-size:clamp(44px,6vw,84px); color:var(--cream); line-height:0.9; letter-spacing:0.02em; margin-bottom:64px; }
        .cx-how-title .sk { -webkit-text-stroke:1px rgba(247,246,244,0.2); color:transparent; display:block; }
        .cx-how-steps { display:flex; flex-direction:column; }
        .cx-how-step {
          display:grid; grid-template-columns:72px 1fr 1.2fr;
          gap:40px; align-items:start;
          padding:40px 0; border-top:1px solid rgba(247,246,244,0.07);
          transition:padding-left 0.3s;
          cursor:default; position:relative; overflow:hidden;
        }
        .cx-how-step::after {
          content:''; position:absolute; left:0; top:0; width:0; height:1px;
          background:linear-gradient(90deg,var(--kente),var(--gold));
          transition: width 0.55s cubic-bezier(0.77,0,0.175,1);
        }
        .cx-how-step:hover::after { width:100%; }
        .cx-how-step:hover { padding-left:10px; }
        .cx-how-step-n { font-family:var(--fa); font-size:13px; color:var(--kente); margin-top:4px; }
        .cx-how-step-name { font-family:var(--fd); font-size:clamp(20px,2.5vw,36px); letter-spacing:0.05em; color:var(--cream); line-height:1; }
        .cx-how-step-opts { font-size:13px; color:rgba(247,246,244,0.38); line-height:1.85; }
        @media(max-width:768px){
          .cx-how-s { padding:80px 0; }
          .cx-how-step { grid-template-columns:48px 1fr; gap:16px; }
          .cx-how-step-opts { display:none; }
        }

        /* ═══ STUDIO (main interactive section) ═══ */
        .cx-studio {
          background:var(--cream); border-bottom:1px solid var(--b);
          position:relative;
        }
        .cx-studio-layout {
          display:grid; grid-template-columns:1fr 420px;
          min-height:100vh;
        }

        /* left: options panel */
        .cx-options {
          padding:64px 48px 80px;
          border-right:1px solid var(--b);
          overflow-y:auto;
        }
        .cx-options-title {
          font-family:var(--fd); font-size:clamp(28px,3.5vw,48px);
          letter-spacing:0.04em; margin-bottom:8px;
        }
        .cx-options-sub { font-family:var(--fa); font-size:15px; color:rgba(11,11,10,0.4); margin-bottom:48px; }

        .cx-section { margin-bottom:48px; }
        .cx-section-label {
          font-size:9px; letter-spacing:0.24em; text-transform:uppercase;
          color:rgba(11,11,10,0.35); margin-bottom:16px;
          display:flex; align-items:center; gap:12px;
        }
        .cx-section-label::after { content:''; flex:1; height:1px; background:var(--b); }

        /* silhouette buttons */
        .cx-sil-grid { display:flex; flex-direction:column; gap:1px; }
        .cx-sil-btn {
          display:flex; align-items:center; justify-content:space-between;
          padding:16px 0; border:none; background:none; cursor:pointer;
          border-bottom:1px solid var(--b); text-align:left; width:100%;
          transition:padding-left 0.2s;
          position:relative; overflow:hidden;
        }
        .cx-sil-btn::before {
          content:''; position:absolute; left:0; top:0; bottom:0; width:2px;
          background:var(--kente); transform:scaleY(0);
          transition:transform 0.3s cubic-bezier(0.77,0,0.175,1);
        }
        .cx-sil-btn.active::before { transform:scaleY(1); }
        .cx-sil-btn.active { padding-left:14px; }
        .cx-sil-btn:hover { padding-left:8px; }
        .cx-sil-name { font-family:var(--fd); font-size:18px; letter-spacing:0.06em; color:var(--ink); transition:color 0.2s; }
        .cx-sil-btn.active .cx-sil-name { color:var(--kente); }
        .cx-sil-desc { font-size:11px; color:rgba(11,11,10,0.38); font-family:var(--fa); }

        /* fabric grid */
        .cx-fab-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; }
        .cx-fab-btn {
          aspect-ratio:1; border:none; cursor:pointer;
          position:relative; overflow:hidden;
          transition:transform 0.25s;
          display:flex; flex-direction:column;
          align-items:center; justify-content:flex-end;
          padding-bottom:8px;
        }
        .cx-fab-btn:hover { transform:scale(0.97); }
        .cx-fab-btn.active::after {
          content:'✓'; position:absolute; top:8px; right:8px;
          width:22px; height:22px; border-radius:50%;
          background:var(--kente); color:white;
          font-family:var(--fd); font-size:12px;
          display:flex; align-items:center; justify-content:center;
        }
        .cx-fab-label {
          font-family:var(--fd); font-size:10px; letter-spacing:0.1em;
          position:relative; z-index:1;
          text-shadow:0 1px 4px rgba(0,0,0,0.4);
        }

        /* toggle buttons */
        .cx-toggle-row { display:flex; flex-wrap:wrap; gap:2px; }
        .cx-toggle {
          padding:10px 18px; border:1px solid var(--b);
          background:none; cursor:pointer;
          font-family:var(--fb); font-size:11px; letter-spacing:0.12em;
          color:rgba(11,11,10,0.5);
          transition:background 0.2s, color 0.2s, border-color 0.2s;
        }
        .cx-toggle.active { background:var(--ink); color:var(--cream); border-color:var(--ink); }
        .cx-toggle:hover:not(.active) { border-color:rgba(11,11,10,0.3); color:var(--ink); }

        /* embroidery input */
        .cx-emb-input {
          width:100%; border:none; border-bottom:1px solid var(--b);
          background:transparent; font-family:var(--fa); font-size:18px;
          color:var(--ink); padding:12px 0; outline:none; letter-spacing:0.04em;
          transition:border-color 0.2s;
        }
        .cx-emb-input:focus { border-bottom-color:var(--kente); }
        .cx-emb-input::placeholder { color:rgba(11,11,10,0.25); }

        /* right: preview panel */
        .cx-preview {
          position:sticky; top:64px;
          height:calc(100vh - 64px);
          display:flex; flex-direction:column;
          background:var(--ink); overflow:hidden;
        }
        .cx-preview-inner {
          flex:1; display:flex; align-items:center; justify-content:center;
          position:relative; padding:32px;
        }
        .cx-preview-garment {
          transition:all 0.5s cubic-bezier(0.4,0,0.2,1);
          animation:gFloat 6s ease-in-out infinite;
        }
        @keyframes gFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .cx-preview-label {
          position:absolute; top:16px; left:16px; z-index:3;
          background:rgba(247,246,244,0.08);
          padding:10px 14px;
          font-family:var(--fd); font-size:11px; letter-spacing:0.14em;
          color:rgba(247,246,244,0.5); backdrop-filter:blur(8px);
        }
        .cx-preview-fabric-tag {
          position:absolute; bottom:16px; left:16px; right:16px;
          font-family:var(--fa); font-size:13px; color:rgba(247,246,244,0.3);
          text-align:center;
        }

        @media(max-width:900px){
          .cx-studio-layout { grid-template-columns:1fr; }
          .cx-preview { position:relative; top:0; height:320px; }
          .cx-options { padding:40px 22px; }
        }

        /* ═══ MEASUREMENTS ═══ */
        .cx-meas-s {
          padding:120px 0; border-bottom:1px solid var(--b);
          background:var(--cream); position:relative; overflow:hidden;
        }
        .cx-meas-layout { display:grid; grid-template-columns:1fr 1fr; gap:80px; }
        .cx-meas-title { font-family:var(--fd); font-size:clamp(40px,5.5vw,80px); line-height:0.9; margin-bottom:32px; }
        .cx-meas-title .sk { -webkit-text-stroke:1.5px var(--ink); color:transparent; display:block; }
        .cx-meas-sub { font-family:var(--fa); font-size:16px; color:rgba(11,11,10,0.42); line-height:1.65; }
        .cx-meas-fields { display:flex; flex-direction:column; gap:0; }
        .cx-field {
          display:flex; flex-direction:column; gap:4px;
          border-bottom:1px solid var(--b); padding:20px 0;
        }
        .cx-field-label {
          font-size:9px; letter-spacing:0.22em; text-transform:uppercase;
          color:rgba(11,11,10,0.35);
        }
        .cx-field-input {
          border:none; background:transparent;
          font-family:var(--fd); font-size:22px; letter-spacing:0.06em;
          color:var(--ink); outline:none; padding:4px 0;
          width:100%;
          transition:color 0.2s;
        }
        .cx-field-input::placeholder { color:rgba(11,11,10,0.15); }
        .cx-field-input:focus + .cx-field-bar { transform:scaleX(1); }
        .cx-field-bar {
          height:1px; background:var(--kente);
          transform:scaleX(0); transform-origin:left;
          transition:transform 0.35s cubic-bezier(0.77,0,0.175,1);
          margin-top:-1px;
        }
        @media(max-width:768px){
          .cx-meas-s { padding:80px 0; }
          .cx-meas-layout { grid-template-columns:1fr; gap:40px; }
        }

        /* ═══ SUMMARY ═══ */
        .cx-sum-s {
          background:var(--ink); padding:100px 0;
          border-bottom:1px solid rgba(247,246,244,0.06);
          position:relative; overflow:hidden;
        }
        .cx-sum-label { font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:var(--kente); margin-bottom:20px; }
        .cx-sum-title { font-family:var(--fd); font-size:clamp(36px,5vw,72px); color:var(--cream); line-height:0.9; margin-bottom:56px; }
        .cx-sum-intro { font-family:var(--fa); font-size:16px; color:rgba(247,246,244,0.38); margin-bottom:32px; }
        .cx-sum-rows { display:flex; flex-direction:column; }
        .cx-sum-row {
          display:flex; align-items:baseline; justify-content:space-between;
          padding:16px 0; border-bottom:1px solid rgba(247,246,244,0.07);
          gap:24px;
        }
        .cx-sum-row-label { font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(247,246,244,0.28); }
        .cx-sum-row-val { font-family:var(--fd); font-size:20px; letter-spacing:0.06em; color:var(--cream); }

        .cx-consult-btn {
          display:inline-block; margin-top:48px;
          padding:18px 44px; background:var(--kente); color:white;
          font-family:var(--fd); font-size:13px; letter-spacing:0.22em; text-transform:uppercase;
          border:none; cursor:pointer;
          position:relative; overflow:hidden;
          text-decoration:none;
          transition:transform 0.2s, box-shadow 0.2s;
        }
        .cx-consult-btn::before {
          content:''; position:absolute; inset:0;
          background:var(--gold); transform:scaleX(0); transform-origin:left;
          transition:transform 0.4s cubic-bezier(0.77,0,0.175,1);
        }
        .cx-consult-btn:hover::before { transform:scaleX(1); }
        .cx-consult-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(200,80,42,0.3); }
        .cx-consult-btn span { position:relative; z-index:1; }

        .cx-wa-btn {
          display:inline-flex; align-items:center; gap:10px;
          margin-top:16px; margin-left:20px;
          font-family:var(--fa); font-size:16px;
          color:rgba(247,246,244,0.45); text-decoration:none;
          border-bottom:1px solid rgba(247,246,244,0.15); padding-bottom:2px;
          transition:color 0.2s, border-color 0.2s;
        }
        .cx-wa-btn:hover { color:var(--gold); border-color:var(--gold); }

        /* ═══ CLOSING ═══ */
        .cx-close-s {
          padding:120px 0; text-align:center;
          background:var(--cream); position:relative; overflow:hidden;
        }
        .cx-close-title {
          font-family:var(--fd);
          font-size:clamp(44px,8vw,120px);
          line-height:0.87;
        }
        .cx-close-solid { color:var(--ink); }
        .cx-close-stroke { -webkit-text-stroke:2px var(--ink); color:transparent; }
        .cx-close-sub { font-family:var(--fa); font-size:17px; color:rgba(11,11,10,0.35); margin-top:32px; }

        /* customize hero eyebrow */
        .cx-ey-bar {
          position:relative; z-index:3;
          display:flex; align-items:center; gap:14px;
          padding:20px 48px 0;
          opacity:0; animation:fup 0.8s cubic-bezier(0.16,1,0.3,1) 0.06s forwards;
          flex-shrink:0;
        }
        @media(max-width:768px){ .cx-ey-bar { padding:16px 20px 0; } }
        .cx-ey-text { font-family:var(--fa); font-size:14px; color:rgba(11,11,10,0.36); white-space:nowrap; }
        .cx-ey-rule { flex:1; height:1px; background:var(--b); min-width:20px; }
        .cx-ey-dot {
          width:5px; height:5px; border-radius:50%; background:var(--kente); flex-shrink:0;
          animation:cxDot 2.2s ease-in-out infinite;
        }
        @keyframes cxDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.5)} }

        /* ─── GLOBAL MOBILE ─── */
        @media(max-width:768px){
          .cx-hero { min-height:auto; padding:40px 0 56px; justify-content:flex-start; }
          .cx-hero-inner { padding:0 20px; }
          .cx-hero-h1 { font-size:clamp(52px,14vw,88px); }
          .cx-hero-sub { font-size:16px; max-width:100%; margin-top:22px; }
          .cx-hero-steps { margin-top:32px; gap:20px; }
          .cx-step-sep { display:none; }

          .cx-studio-layout { grid-template-columns:1fr; }
          .cx-preview { position:relative; top:0; height:280px; border-bottom:1px solid var(--b); }
          .cx-options { padding:32px 20px 48px; }
          .cx-opt-grid { grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); }

          .cx-meas-s { padding:64px 0; }
          .cx-meas-layout { grid-template-columns:1fr; gap:36px; }

          .cx-sum-s { padding:72px 0; }
          .cx-sum-title { font-size:clamp(32px,9vw,56px); margin-bottom:36px; }
          .cx-consult-btn { padding:15px 32px; font-size:11px; margin-top:36px; }
          .cx-wa-btn { margin-top:14px; margin-left:0; display:flex; }

          .cx-close-s { padding:72px 0; }
          .cx-close-title { font-size:clamp(40px,12vw,80px); }
        }
        @media(max-width:480px){
          .cx-hero-h1 { font-size:clamp(44px,13vw,76px); }
          .cx-opt-grid { grid-template-columns:1fr 1fr; }
          .cx-sum-row { flex-direction:column; gap:4px; }
        }
      `}</style>

      <KenteBar height={4} />

      {/* ═══ HERO ═══ */}
      <section className="cx-hero">
        <AnkaraPattern id="cx-hero-p" opacity={0.06} />
        <div className="cx-ghost">DESIGN</div>

        {/* eyebrow bar */}
        <div className="cx-ey-bar">
          <span className="cx-ey-text">Ankara Aura</span>
          <div className="cx-ey-rule"/>
          <div className="cx-ey-dot"/>
          <span className="cx-ey-text" style={{color:"var(--kente)"}}>Custom Studio</span>
        </div>

        <div className="cx-hero-inner">
          <p className="cx-hero-tag">Ankara Aura — Custom Studio</p>
          <h1 className="cx-hero-h1">
            <div className="hw"><span className={`hline cx-hero-solid${heroVisible?" on d1":""}`}>DESIGN</span></div>
            <div className="hw"><span className={`hline cx-hero-solid${heroVisible?" on d2":""}`}>YOUR</span></div>
            <div className="hw"><span className={`hline cx-hero-stroke${heroVisible?" on d3":""}`}>AURA.</span></div>
          </h1>
          <p className="cx-hero-sub">
            Craft something personal. Structured. Intentional. A garment built exactly the way you carry yourself.
          </p>
          <div className="cx-hero-steps">
            {["01 — Select Silhouette", "02 — Choose Fabric", "03 — Define Details"].map((s, i) => (
              <>
                {i > 0 && <div key={`sep-${i}`} className="cx-step-sep" />}
                <button key={s} className={`cx-step-pill${step === i ? " active" : ""}`} onClick={() => setStep(i)}>
                  <span className="cx-step-pill-n">{s}</span>
                </button>
              </>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={howR.ref as React.RefObject<HTMLElement>} className={`cx-how-s rv${howR.visible?" on":""}`}>
        <AnkaraPattern id="cx-how-p" opacity={0.04} color="#f7f6f4" />
        <div className="pw" style={{ position:"relative", zIndex:1 }}>
          <p className="cx-how-tag child">The Process</p>
          <h2 className="cx-how-title child">HOW IT<br/><span className="sk">WORKS</span></h2>
          <div className="cx-how-steps">
            {[
              { n:"01", name:"Select Base Style", opts:"Dress  ·  Shirt  ·  Two-piece  ·  Blazer  ·  Custom silhouette" },
              { n:"02", name:"Choose Fabric & Palette", opts:"Ankara wax prints  ·  Heavyweight cotton  ·  Natural linen  ·  Custom sourcing" },
              { n:"03", name:"Define the Details", opts:"Neckline  ·  Sleeve type  ·  Length & fit  ·  Embroidery text  ·  Accent colours" },
            ].map((s, i) => (
              <div key={s.n} className={`cx-how-step child`} style={{ transitionDelay:`${i*0.12}s` }}>
                <span className="cx-how-step-n">{s.n}</span>
                <span className="cx-how-step-name">{s.name}</span>
                <p className="cx-how-step-opts">{s.opts}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STUDIO — MAIN INTERACTIVE ═══ */}
      <div className="cx-studio">
        <div className="cx-studio-layout">

          {/* LEFT — options */}
          <div className="cx-options">
            <h2 className="cx-options-title">Configure Your Piece</h2>
            <p className="cx-options-sub">Every choice updates the preview in real time ✦</p>

            {/* Step 01 — Silhouette */}
            <div className="cx-section">
              <p className="cx-section-label">01 — Base Silhouette</p>
              <div className="cx-sil-grid">
                {SILHOUETTES.map(s => (
                  <button key={s.id} className={`cx-sil-btn${silhouette.id===s.id?" active":""}`}
                    onClick={() => setSilhouette(s)}>
                    <div>
                      <span className="cx-sil-name">{s.label}</span>
                      <span className="cx-sil-desc" style={{ display:"block", marginTop:3 }}>{s.desc}</span>
                    </div>
                    {silhouette.id === s.id && <span style={{ color:"var(--kente)", fontFamily:"var(--fd)", fontSize:11, letterSpacing:"0.1em" }}>SELECTED</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 02 — Fabric */}
            <div className="cx-section">
              <p className="cx-section-label">02 — Fabric & Palette</p>
              <div className="cx-fab-grid">
                {FABRICS.map(f => (
                  <button key={f.id} className={`cx-fab-btn${fabric.id===f.id?" active":""}`}
                    style={{ background: f.color }}
                    onClick={() => setFabric(f)}>
                    <span className="cx-fab-label" style={{ color: f.color==='#f0ebe0'||f.color==='#d4a843' ? '#0b0b0a' : '#f7f6f4' }}>
                      {f.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 03 — Details */}
            <div className="cx-section">
              <p className="cx-section-label">03a — Sleeve Length</p>
              <div className="cx-toggle-row">
                {SLEEVES.map(s => (
                  <button key={s} className={`cx-toggle${sleeve===s?" active":""}`} onClick={() => setSleeve(s)}>{s}</button>
                ))}
              </div>
            </div>
            <div className="cx-section">
              <p className="cx-section-label">03b — Fit</p>
              <div className="cx-toggle-row">
                {FITS.map(f => (
                  <button key={f} className={`cx-toggle${fit===f?" active":""}`} onClick={() => setFit(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div className="cx-section">
              <p className="cx-section-label">03c — Neckline</p>
              <div className="cx-toggle-row">
                {NECKLINES.map(n => (
                  <button key={n} className={`cx-toggle${neckline===n?" active":""}`} onClick={() => setNeckline(n)}>{n}</button>
                ))}
              </div>
            </div>
            <div className="cx-section">
              <p className="cx-section-label">Embroidery Text (Optional)</p>
              <div>
                <input className="cx-emb-input" type="text" placeholder="e.g. your initials, a word, a symbol..."
                  value={embroidery} onChange={e => setEmbroidery(e.target.value)} maxLength={28} />
                <div className="cx-field-bar" />
              </div>
              {embroidery && <p style={{ fontFamily:"var(--fa)", fontSize:13, color:"rgba(11,11,10,0.38)", marginTop:8 }}>
                "{embroidery}" will be embroidered at chest or cuff.
              </p>}
            </div>
          </div>

          {/* RIGHT — live preview */}
          <div className="cx-preview">
            <AnkaraPattern id="cx-prev-p" opacity={0.04} color="#f7f6f4" />
            <div className="cx-preview-inner">
              <div className="cx-preview-label">LIVE PREVIEW — {silhouette.label.toUpperCase()}</div>
              <div className="cx-preview-garment">
                <GarmentPreview silhouette={silhouette.id} fabric={fabric} sleeve={sleeve} fit={fit} />
              </div>
              {embroidery && (
                <div style={{
                  position:"absolute", bottom:48,
                  fontFamily:"'Caveat', cursive", fontSize:16,
                  color:"rgba(247,246,244,0.4)",
                  letterSpacing:"0.04em", textAlign:"center", width:"100%",
                }}>
                  Embroidery: <em>"{embroidery}"</em>
                </div>
              )}
              <div className="cx-preview-fabric-tag">{fabric.pattern} · {fit} Fit</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MEASUREMENTS ═══ */}
      <section ref={measR.ref as React.RefObject<HTMLElement>} className={`cx-meas-s rv${measR.visible?" on":""}`}>
        <AnkaraPattern id="cx-meas-p" opacity={0.05} />
        <div className="pw">
          <div className="cx-meas-layout">
            <div>
              <h2 className={`cx-meas-title child`}>
                YOUR<br/><span className="sk">MEASUREMENTS</span>
              </h2>
              <p className="cx-meas-sub child">
                Precision is not optional. Every measurement is used to cut your piece exactly to your body — not to a size chart someone else decided.
              </p>
              <p className="cx-meas-sub child" style={{ marginTop:20, fontSize:13, color:"rgba(11,11,10,0.3)" }}>
                All measurements in centimetres. You can also upload a reference image below.
              </p>
            </div>
            <div className="cx-meas-fields">
              {(["height","chest","waist","hip"] as const).map(f => (
                <div key={f} className="cx-field child">
                  <label className="cx-field-label">{f.charAt(0).toUpperCase() + f.slice(1)} (cm)</label>
                  <input className="cx-field-input" type="number" placeholder="—"
                    value={measurements[f]}
                    onChange={e => setMeasurements(m => ({ ...m, [f]: e.target.value }))} />
                  <div className="cx-field-bar" />
                </div>
              ))}
              <div className="cx-field child">
                <label className="cx-field-label">Additional Notes</label>
                <input className="cx-field-input" type="text" placeholder="any fitting preferences..."
                  value={measurements.notes}
                  onChange={e => setMeasurements(m => ({ ...m, notes: e.target.value }))} />
                <div className="cx-field-bar" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SUMMARY + CTA ═══ */}
      <section ref={summR.ref as React.RefObject<HTMLElement>} className={`cx-sum-s rv${summR.visible?" on":""}`}>
        <AnkaraPattern id="cx-sum-p" opacity={0.04} color="#f7f6f4" />
        <div className="pw" style={{ position:"relative", zIndex:1 }}>
          <div style={{ maxWidth:680 }}>
            <p className="cx-sum-label child">Your Design Summary</p>
            <h2 className="cx-sum-title child">YOU ARE<br/>DESIGNING:</h2>
            <div className="cx-sum-rows">
              {summary.map((r, i) => (
                <div key={r.label} className={`cx-sum-row child`} style={{ transitionDelay:`${i*0.08}s` }}>
                  <span className="cx-sum-row-label">{r.label}</span>
                  <span className="cx-sum-row-val">{r.val}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:48, display:"flex", alignItems:"center", flexWrap:"wrap", gap:0 }}>
              <Link href="/contact?inquiry=custom-order" className="cx-consult-btn">
                <span>Request Design Consultation →</span>
              </Link>
              <a href="https://wa.me/233000000000?text=Hi, I'd like to discuss a custom Ankara Aura piece."
                target="_blank" rel="noopener noreferrer" className="cx-wa-btn">
                or chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CLOSING ═══ */}
      <section ref={closeR.ref as React.RefObject<HTMLElement>} className={`cx-close-s rv${closeR.visible?" on":""}`}>
        <AnkaraPattern id="cx-close-p" opacity={0.06} />
        <div className="pw" style={{ position:"relative", zIndex:1 }}>
          <div className="hw child"><span className={`hline cx-close-solid${closeR.visible?" on d1":""}`}>CRAFTED FOR YOU.</span></div>
          <div className="hw child"><span className={`hline cx-close-stroke${closeR.visible?" on d2":""}`}>BUILT WITH CULTURE.</span></div>
          <p className="cx-close-sub child">The piece you imagine. The precision it deserves.</p>
        </div>
      </section>

      <KenteBar height={4} />
    </>
  );
}
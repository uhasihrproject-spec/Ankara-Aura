"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ── Intersection reveal hook ── */
function useReveal(threshold = 0.12) {
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

/* ── Ankara SVG pattern ── */
function AnkaraPattern({ id = "ap", opacity = 0.07, color = "#0b0b0a" }: { id?: string; opacity?: number; color?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, pointerEvents: "none" }}
      aria-hidden
    >
      <defs>
        <pattern id={id} x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
          <rect x="0.5" y="0.5" width="71" height="71" fill="none" stroke={color} strokeWidth="0.7" />
          <polygon points="36,3 69,36 36,69 3,36" fill="none" stroke={color} strokeWidth="1.1" />
          <polygon points="36,20 52,36 36,52 20,36" fill="none" stroke={color} strokeWidth="0.7" />
          <polygon points="0,0 20,0 0,20" fill={color} opacity="0.12" />
          <polygon points="72,0 52,0 72,20" fill={color} opacity="0.12" />
          <polygon points="0,72 20,72 0,52" fill={color} opacity="0.12" />
          <polygon points="72,72 52,72 72,52" fill={color} opacity="0.12" />
          <circle cx="36" cy="36" r="2.5" fill={color} opacity="0.18" />
          <circle cx="36" cy="3"  r="1.5" fill={color} opacity="0.15" />
          <circle cx="69" cy="36" r="1.5" fill={color} opacity="0.15" />
          <circle cx="36" cy="69" r="1.5" fill={color} opacity="0.15" />
          <circle cx="3"  cy="36" r="1.5" fill={color} opacity="0.15" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ── Kente stripe bar ── */
function KenteBar({ height = 3 }: { height?: number }) {
  return (
    <div style={{
      height,
      background: `repeating-linear-gradient(90deg,
        #c8502a 0, #c8502a 20px,
        #d4a843 20px, #d4a843 40px,
        #1a3a5c 40px, #1a3a5c 60px,
        #2d6a4f 60px, #2d6a4f 80px,
        #0b0b0a 80px, #0b0b0a 100px)`,
      backgroundSize: "100px 100%",
      flexShrink: 0,
    }} />
  );
}

const PHILOSOPHY = [
  { title: "Culture is Power", body: "Every thread carries history. We don't borrow from culture — we are born from it. Ankara Aura is not inspired by Africa. It is African, structured for the world." },
  { title: "Simplicity is Luxury", body: "We resist noise. The most powerful statement is restraint. A single Ankara detail on clean black cotton speaks louder than a thousand patterns fighting for attention." },
  { title: "Details Define Class", body: "The lining. The stitch. The way a sleeve breaks at the wrist. These are not afterthoughts. At Ankara Aura, craft lives in the millimetres most brands ignore." },
  { title: "Identity is Global", body: "Our roots are Ghanaian. Our vision is planetary. We are not a 'African brand for African people' — we are a world-class brand that happens to be African. The distinction matters." },
];

const PROCESS = [
  { num: "01", name: "Design Sketch", desc: "Every piece begins on paper. No digital shortcut replaces the hand — the weight of the pencil decides the weight of the garment." },
  { num: "02", name: "Fabric Selection", desc: "We source directly. Ankara wax prints chosen for colour depth, weave integrity, and cultural resonance. No compromise at the source." },
  { num: "03", name: "Precision Finishing", desc: "Seams pressed. Hems deliberate. Each piece inspected before it moves. The standard is what we'd wear ourselves — which is the only standard that matters." },
  { num: "04", name: "The Unboxing", desc: "The package is part of the garment. Magnetic box. Tissue wrap. Handwritten note. Because the first touch sets the tone for everything that follows." },
];

const FOUNDERS = [
  {
    name: "Eldwin Asante",
    title: "Founder & Creative Director",
    bio: "Eldwin built Ankara Aura from a conviction — that African design, properly executed, belongs in every room that matters. His obsession with branding, detail, and cultural authenticity drives every decision the brand makes.",
  },
  {
    name: "Kelvin Baidoo",
    title: "Co-Founder & Operations Director",
    bio: "Kelvin ensures that the vision meets reality. From supply chain to fulfilment, he builds the systems that allow Ankara Aura to operate with the precision of a global brand.",
  },
  {
    name: "Jame Reynolds",
    title: "Co-Founder & Brand Strategist",
    bio: "Jame translates the brand's soul into strategy. His global perspective and deep understanding of luxury positioning shape how Ankara Aura speaks to the world.",
  },
];

export default function AboutPage() {
  const originR   = useReveal(0.08);
  const auraR     = useReveal(0.1);
  const philoR    = useReveal(0.07);
  const processR  = useReveal(0.07);
  const visionR   = useReveal(0.1);
  const founderR  = useReveal(0.08);
  const closeR    = useReveal(0.15);

  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink:    #0b0b0a;
          --cream:  #f7f6f4;
          --kente:  #c8502a;
          --gold:   #d4a843;
          --indigo: #1a3a5c;
          --forest: #2d6a4f;
          --b:      rgba(11,11,10,0.09);
          --fd: 'Bebas Neue', sans-serif;
          --fb: 'DM Sans', sans-serif;
          --fa: 'Caveat', cursive;
        }
        body { background: var(--cream); color: var(--ink); font-family: var(--fb); overflow-x: hidden; }
        .pw { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
        @media(max-width:768px){ .pw{ padding: 0 22px; } }

        /* ── reveal system ── */
        .rv {
          opacity: 0; transform: translateY(44px);
          transition: opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1);
        }
        .rv.on { opacity: 1; transform: none; }
        .rv-l { opacity:0; transform: translateX(-36px);
          transition: opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1); }
        .rv-l.on { opacity:1; transform: none; }
        .rv-r { opacity:0; transform: translateX(36px);
          transition: opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1); }
        .rv-r.on { opacity:1; transform: none; }

        .child { opacity:0; transform:translateY(28px); clip-path: inset(0 0 100% 0);
          transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1), clip-path 0.85s cubic-bezier(0.16,1,0.3,1); }
        .rv.on .child, .rv-l.on .child, .rv-r.on .child { opacity:1; transform:none; clip-path: inset(0 0 0% 0); }
        .child:nth-child(1){transition-delay:0.05s}
        .child:nth-child(2){transition-delay:0.14s}
        .child:nth-child(3){transition-delay:0.23s}
        .child:nth-child(4){transition-delay:0.32s}
        .child:nth-child(5){transition-delay:0.41s}
        .child:nth-child(6){transition-delay:0.50s}

        /* hero clip reveals */
        .hw { overflow: hidden; }
        .hline {
          display: block;
          transform: translateY(108%);
          transition: transform 1.1s cubic-bezier(0.16,1,0.3,1);
        }
        .hline.on { transform: translateY(0); }
        .hline.d1 { transition-delay: 0.08s; }
        .hline.d2 { transition-delay: 0.18s; }
        .hline.d3 { transition-delay: 0.28s; }

        /* ═══ 01 — HERO ═══ */
        .ab-hero {
          position: relative; overflow: hidden;
          min-height: 100svh;
          display: flex; flex-direction: column; justify-content: center;
          background: var(--cream);
          border-bottom: 1px solid var(--b);
        }
        .ab-hero-inner {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto; padding: 0 48px;
        }
        .ab-hero-eyebrow {
          font-family: var(--fa); font-size: 15px; color: var(--kente);
          letter-spacing: 0.06em; margin-bottom: 32px;
          opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s forwards;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

        .ab-hero-h1 {
          font-family: var(--fd);
          font-size: clamp(62px, 10.5vw, 158px);
          line-height: 0.87; letter-spacing: 0.01em;
          margin-bottom: 0;
        }
        .ab-hero-h1 .solid  { color: var(--ink); }
        .ab-hero-h1 .stroke {
          -webkit-text-stroke: 2px var(--ink);
          color: transparent;
        }
        .ab-hero-sub {
          font-family: var(--fa); font-size: clamp(18px, 2.5vw, 26px);
          color: rgba(11,11,10,0.46); line-height: 1.55;
          max-width: 560px; margin-top: 36px;
          opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.6s forwards;
        }
        .ab-hero-scroll {
          position: absolute; bottom: 40px; left: 48px;
          display: flex; align-items: center; gap: 12px;
          font-family: var(--fa); font-size: 13px; color: rgba(11,11,10,0.3);
          opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 1s forwards;
        }
        .ab-hero-scroll-line {
          width: 40px; height: 1px; background: rgba(11,11,10,0.2);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%,100%{transform:scaleX(1);opacity:0.5}
          50%{transform:scaleX(1.4);opacity:1}
        }

        /* ghost watermark */
        .ab-ghost {
          position: absolute; pointer-events: none; user-select: none; z-index: 1;
          font-family: var(--fd); white-space: nowrap;
          color: transparent; letter-spacing: 0.04em;
        }
        .ab-ghost-1 {
          font-size: clamp(90px,18vw,260px);
          -webkit-text-stroke: 1px rgba(11,11,10,0.04);
          top: 10%; right: -4%;
          animation: ghostDrift 18s ease-in-out infinite alternate;
        }
        .ab-ghost-2 {
          font-size: clamp(60px,10vw,140px);
          -webkit-text-stroke: 1px rgba(11,11,10,0.03);
          bottom: 8%; left: -2%;
          animation: ghostDrift 24s ease-in-out infinite alternate-reverse;
        }
        @keyframes ghostDrift { from{transform:translateX(0)} to{transform:translateX(2%)} }

        /* ═══ 02 — ORIGIN ═══ */
        .ab-origin {
          padding: 140px 0;
          border-bottom: 1px solid var(--b);
          position: relative; overflow: hidden;
        }
        .ab-origin-layout {
          display: grid; grid-template-columns: 1fr 1.4fr;
          gap: 100px; align-items: start;
        }
        .ab-origin-left { position: sticky; top: 100px; }
        .ab-origin-tag {
          font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--kente); margin-bottom: 24px;
        }
        .ab-origin-title {
          font-family: var(--fd);
          font-size: clamp(48px, 7vw, 96px);
          line-height: 0.9; letter-spacing: 0.02em;
        }
        .ab-origin-title .sk {
          -webkit-text-stroke: 1.5px var(--ink);
          color: transparent; display: block;
        }
        .ab-origin-accent {
          width: 32px; height: 2px;
          background: var(--kente); margin-top: 32px;
        }

        .ab-origin-right { display: flex; flex-direction: column; gap: 0; }
        .ab-origin-block {
          padding: 36px 0;
          border-bottom: 1px solid var(--b);
        }
        .ab-origin-block:first-child { padding-top: 0; }
        .ab-origin-lead {
          font-family: var(--fd);
          font-size: clamp(18px, 2.5vw, 28px);
          letter-spacing: 0.04em; color: var(--ink);
          margin-bottom: 14px; line-height: 1.1;
        }
        .ab-origin-body {
          font-size: 15px; line-height: 1.95;
          color: rgba(11,11,10,0.58); font-weight: 300;
        }
        .ab-origin-body strong { color: var(--ink); font-weight: 500; }

        @media(max-width:900px){
          .ab-origin { padding: 80px 0; }
          .ab-origin-layout { grid-template-columns: 1fr; gap: 48px; }
          .ab-origin-left { position: static; }
        }

        /* ═══ 03 — AURA MEANING ═══ */
        .ab-aura-s {
          background: var(--ink);
          position: relative; overflow: hidden;
          border-bottom: 1px solid rgba(247,246,244,0.06);
        }
        .ab-aura-layout {
          display: grid; grid-template-columns: 1fr 1fr;
          min-height: 560px;
        }
        .ab-aura-left {
          border-right: 1px solid rgba(247,246,244,0.07);
          display: flex; align-items: center; justify-content: center;
          padding: 80px 64px;
          position: relative;
        }
        .ab-aura-word {
          font-family: var(--fd);
          font-size: clamp(64px, 11vw, 160px);
          letter-spacing: 0.3em;
          -webkit-text-stroke: 1.5px rgba(247,246,244,0.2);
          color: transparent;
          line-height: 1; text-align: center;
          animation: auraGlow 4s ease-in-out infinite alternate;
        }
        @keyframes auraGlow {
          from { -webkit-text-stroke-color: rgba(247,246,244,0.15); }
          to   { -webkit-text-stroke-color: rgba(200,80,42,0.55); }
        }
        .ab-aura-word-solid {
          position: absolute;
          font-family: var(--fd);
          font-size: clamp(64px, 11vw, 160px);
          letter-spacing: 0.3em;
          color: var(--cream); opacity: 0.04;
          line-height: 1; text-align: center;
          pointer-events: none;
        }
        .ab-aura-right {
          padding: 80px 64px;
          display: flex; flex-direction: column; justify-content: center; gap: 28px;
        }
        .ab-aura-tag {
          font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--kente); margin-bottom: 4px;
        }
        .ab-aura-def {
          font-family: var(--fd);
          font-size: clamp(22px, 3vw, 38px);
          letter-spacing: 0.04em; color: var(--cream);
          line-height: 1.15;
        }
        .ab-aura-def .hi { color: var(--gold); }
        .ab-aura-body {
          font-size: 15px; line-height: 1.9;
          color: rgba(247,246,244,0.45); font-weight: 300;
          max-width: 420px;
        }
        .ab-aura-pillars { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
        .ab-aura-pill {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--fd); font-size: 12px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(247,246,244,0.3);
        }
        .ab-aura-pill::before {
          content: ''; width: 24px; height: 1px;
          background: var(--kente); flex-shrink: 0;
        }
        @media(max-width:768px){
          .ab-aura-layout { grid-template-columns: 1fr; }
          .ab-aura-left { border-right: none; border-bottom: 1px solid rgba(247,246,244,0.07); padding: 60px 22px; }
          .ab-aura-right { padding: 48px 22px; }
        }

        /* ═══ 04 — PHILOSOPHY ═══ */
        .ab-philo-s {
          padding: 140px 0;
          border-bottom: 1px solid var(--b);
          position: relative; overflow: hidden;
        }
        .ab-philo-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 80px; gap: 24px;
        }
        .ab-philo-title {
          font-family: var(--fd);
          font-size: clamp(52px, 8vw, 120px);
          line-height: 0.88; letter-spacing: 0.02em;
        }
        .ab-philo-title .sk {
          -webkit-text-stroke: 1.5px var(--ink);
          color: transparent; display: block;
        }
        .ab-philo-intro {
          font-family: var(--fa); font-size: 17px;
          color: rgba(11,11,10,0.4); max-width: 280px;
          line-height: 1.65; text-align: right;
          padding-bottom: 8px;
        }
        .ab-philo-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1px; background: var(--b);
        }
        .ab-philo-item {
          background: var(--cream);
          padding: 52px 48px;
          position: relative; overflow: hidden;
          transition: background 0.4s;
          cursor: default;
        }
        .ab-philo-item::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 0; background: rgba(200,80,42,0.04);
          transition: height 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .ab-philo-item:hover::before { height: 100%; }
        .ab-philo-item::after {
          content: ''; position: absolute; top: 0; left: 0; width: 0; height: 2px;
          background: var(--kente);
          transition: width 0.55s cubic-bezier(0.77,0,0.175,1);
        }
        .ab-philo-item:hover::after { width: 100%; }
        .ab-philo-num {
          font-family: var(--fa); font-size: 12px; color: var(--kente);
          margin-bottom: 20px; display: block;
        }
        .ab-philo-name {
          font-family: var(--fd);
          font-size: clamp(22px, 2.8vw, 38px);
          letter-spacing: 0.04em; color: var(--ink);
          margin-bottom: 18px; line-height: 1.05;
        }
        .ab-philo-body {
          font-size: 13px; line-height: 1.9;
          color: rgba(11,11,10,0.52); font-weight: 300;
        }
        @media(max-width:900px){
          .ab-philo-s { padding: 80px 0; }
          .ab-philo-head { flex-direction: column; }
          .ab-philo-intro { text-align: left; }
          .ab-philo-grid { grid-template-columns: 1fr; }
          .ab-philo-item { padding: 36px 22px; }
        }

        /* ═══ 05 — PROCESS ═══ */
        .ab-process-s {
          background: var(--ink);
          padding: 140px 0;
          border-bottom: 1px solid rgba(247,246,244,0.06);
          position: relative; overflow: hidden;
        }
        .ab-process-head { margin-bottom: 80px; }
        .ab-process-tag {
          font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--kente); margin-bottom: 18px;
        }
        .ab-process-title {
          font-family: var(--fd);
          font-size: clamp(48px, 7.5vw, 112px);
          line-height: 0.88; letter-spacing: 0.02em; color: var(--cream);
        }
        .ab-process-title .sk {
          -webkit-text-stroke: 1.5px rgba(247,246,244,0.22);
          color: transparent; display: block;
        }
        .ab-process-rows { display: flex; flex-direction: column; }
        .ab-process-row {
          display: grid; grid-template-columns: 80px 1fr 1.4fr;
          gap: 48px; align-items: start;
          padding: 44px 0;
          border-top: 1px solid rgba(247,246,244,0.07);
          position: relative; overflow: hidden;
          cursor: default;
          transition: padding-left 0.35s;
        }
        .ab-process-row::after {
          content: ''; position: absolute; left: 0; top: 0; width: 0; height: 1px;
          background: linear-gradient(90deg, var(--kente), var(--gold));
          transition: width 0.6s cubic-bezier(0.77,0,0.175,1);
        }
        .ab-process-row:hover::after { width: 100%; }
        .ab-process-row:hover { padding-left: 12px; }
        .ab-process-row:hover .ab-process-num { color: var(--gold); }
        .ab-process-num {
          font-family: var(--fa); font-size: 13px; color: var(--kente);
          margin-top: 6px; transition: color 0.3s;
        }
        .ab-process-name {
          font-family: var(--fd);
          font-size: clamp(22px, 2.8vw, 40px);
          letter-spacing: 0.05em; color: var(--cream);
          line-height: 1;
        }
        .ab-process-body {
          font-size: 13px; line-height: 1.9;
          color: rgba(247,246,244,0.38); font-weight: 300;
          padding-top: 6px;
        }
        @media(max-width:768px){
          .ab-process-s { padding: 80px 0; }
          .ab-process-row { grid-template-columns: 48px 1fr; gap: 16px; }
          .ab-process-body { display: none; }
        }

        /* ═══ 06 — VISION ═══ */
        .ab-vision-s {
          padding: 160px 0;
          border-bottom: 1px solid var(--b);
          position: relative; overflow: hidden;
          background: var(--cream);
        }
        .ab-vision-inner { position: relative; z-index: 1; }
        .ab-vision-label {
          font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--kente); margin-bottom: 48px;
        }
        .ab-vision-statement {
          font-family: var(--fd);
          font-size: clamp(52px, 9vw, 138px);
          line-height: 0.87; letter-spacing: 0.01em;
          margin-bottom: 64px;
        }
        .ab-vision-statement .sk {
          -webkit-text-stroke: 2px var(--ink);
          color: transparent; display: block;
        }
        .ab-vision-statement .hl { color: var(--kente); }
        .ab-vision-cols {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; border-top: 1px solid var(--b); padding-top: 64px;
        }
        .ab-vision-col-head {
          font-family: var(--fd); font-size: clamp(18px, 2.2vw, 28px);
          letter-spacing: 0.06em; margin-bottom: 16px;
        }
        .ab-vision-col-body {
          font-size: 14px; line-height: 1.95;
          color: rgba(11,11,10,0.55); font-weight: 300;
        }
        .ab-vision-col-body strong { color: var(--ink); font-weight: 500; }
        .ab-vision-wm {
          position: absolute; pointer-events: none;
          font-family: var(--fd);
          font-size: clamp(90px, 18vw, 280px);
          color: transparent;
          -webkit-text-stroke: 1px rgba(11,11,10,0.03);
          right: -4%; bottom: -10%;
          user-select: none; white-space: nowrap;
        }
        @media(max-width:768px){
          .ab-vision-s { padding: 80px 0; }
          .ab-vision-cols { grid-template-columns: 1fr; gap: 40px; }
        }

        /* ═══ 07 — FOUNDERS ═══ */
        .ab-founders-s {
          background: var(--ink);
          padding: 140px 0;
          border-bottom: 1px solid rgba(247,246,244,0.06);
          position: relative; overflow: hidden;
        }
        .ab-founders-head { margin-bottom: 80px; }
        .ab-founders-tag {
          font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--kente); margin-bottom: 20px;
        }
        .ab-founders-title {
          font-family: var(--fd);
          font-size: clamp(44px, 6.5vw, 96px);
          line-height: 0.9; letter-spacing: 0.02em; color: var(--cream);
        }
        .ab-founders-title .sk {
          -webkit-text-stroke: 1px rgba(247,246,244,0.2);
          color: transparent; display: block;
        }
        .ab-founders-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: rgba(247,246,244,0.05);
        }
        .ab-founder-card {
          background: var(--ink);
          padding: 48px 40px;
          display: flex; flex-direction: column; gap: 0;
          position: relative; overflow: hidden;
          transition: background 0.4s;
        }
        .ab-founder-card::after {
          content: ''; position: absolute; top: 0; left: 0; width: 0; height: 2px;
          background: linear-gradient(90deg, var(--kente), var(--gold));
          transition: width 0.55s cubic-bezier(0.77,0,0.175,1);
        }
        .ab-founder-card:hover::after { width: 100%; }
        .ab-founder-card:hover { background: rgba(247,246,244,0.02); }
        .ab-founder-initials {
          font-family: var(--fd);
          font-size: 48px; letter-spacing: 0.08em;
          -webkit-text-stroke: 1px rgba(247,246,244,0.12);
          color: transparent;
          margin-bottom: 28px; line-height: 1;
        }
        .ab-founder-name {
          font-family: var(--fd); font-size: 24px;
          letter-spacing: 0.06em; color: var(--cream);
          margin-bottom: 6px; line-height: 1;
        }
        .ab-founder-title {
          font-family: var(--fa); font-size: 13px;
          color: var(--kente); margin-bottom: 24px;
        }
        .ab-founder-bio {
          font-size: 12px; line-height: 1.9;
          color: rgba(247,246,244,0.36); font-weight: 300;
        }
        @media(max-width:900px){
          .ab-founders-s { padding: 80px 0; }
          .ab-founders-grid { grid-template-columns: 1fr; }
          .ab-founder-card { padding: 36px 22px; }
        }

        /* ═══ 08 — CLOSING ═══ */
        .ab-close-s {
          padding: 160px 0;
          background: var(--cream);
          text-align: center;
          position: relative; overflow: hidden;
        }
        .ab-close-inner { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; padding: 0 48px; }
        .ab-close-label {
          font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(11,11,10,0.3); margin-bottom: 48px;
        }
        .ab-close-statement {
          font-family: var(--fd);
          font-size: clamp(52px, 9.5vw, 148px);
          line-height: 0.87; letter-spacing: 0.01em;
        }
        .ab-close-statement .solid { color: var(--ink); }
        .ab-close-statement .stroke {
          -webkit-text-stroke: 2px var(--ink);
          color: transparent;
        }
        .ab-close-sub {
          font-family: var(--fa); font-size: 18px;
          color: rgba(11,11,10,0.35); margin-top: 40px; line-height: 1.6;
        }
        .ab-close-wm {
          position: absolute; pointer-events: none; z-index: 0;
          font-family: var(--fd);
          font-size: clamp(80px, 16vw, 220px);
          color: transparent;
          -webkit-text-stroke: 1px rgba(11,11,10,0.03);
          top: 50%; left: 50%; transform: translate(-50%,-50%);
          white-space: nowrap; user-select: none;
        }
        @media(max-width:768px){
          .ab-close-s { padding: 100px 0; }
          .ab-close-inner { padding: 0 22px; }
        }
      `}</style>

      {/* ══ KENTE TOP BAR ══ */}
      <KenteBar height={4} />

      {/* ══════════════════════════════════════════
          01 — HERO STATEMENT
      ══════════════════════════════════════════ */}
      <section className="ab-hero">
        <AnkaraPattern id="ab-hero-p" opacity={0.07} />
        <div className="ab-ghost ab-ghost-1">AURA</div>
        <div className="ab-ghost ab-ghost-2">ANKARA</div>

        <div className="ab-hero-inner">
          <p className="ab-hero-eyebrow">Ankara Aura — Our Story</p>

          <h1 className="ab-hero-h1">
            <div className="hw">
              <span className={`hline solid${heroVisible ? " on d1" : ""}`}>WE DON'T</span>
            </div>
            <div className="hw">
              <span className={`hline solid${heroVisible ? " on d2" : ""}`}>MAKE CLOTHES.</span>
            </div>
            <div className="hw">
              <span className={`hline stroke${heroVisible ? " on d3" : ""}`}>WE BUILD PRESENCE.</span>
            </div>
          </h1>

          <p className="ab-hero-sub">
            Where African identity meets modern precision. Where pattern carries philosophy. Where every stitch is a statement that refuses to be ignored.
          </p>
        </div>

        <div className="ab-hero-scroll">
          <div className="ab-hero-scroll-line" />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          02 — ORIGIN
      ══════════════════════════════════════════ */}
      <section
        ref={originR.ref as React.RefObject<HTMLElement>}
        className={`ab-origin rv${originR.visible ? " on" : ""}`}
      >
        <div className="pw">
          <div className="ab-origin-layout">
            <div className={`ab-origin-left rv-l${originR.visible ? " on" : ""}`}>
              <p className="ab-origin-tag child">The Origin</p>
              <h2 className="ab-origin-title child">
                WHERE<br />
                <span className="sk">IT ALL</span><br />
                BEGAN
              </h2>
              <div className="ab-origin-accent child" />
            </div>

            <div className={`ab-origin-right rv-r${originR.visible ? " on" : ""}`}>
              {[
                {
                  lead: "Born from conviction.",
                  body: <>
                    Ankara Aura was not built because there was a market gap. It was built because there was a <strong>belief</strong> — that African identity, when given precision and intention, belongs on the global stage alongside any name in fashion.
                  </>,
                },
                {
                  lead: "Obsessed with detail.",
                  body: <>
                    This brand began with a question: <em>why does African design get reduced to colour and pattern, when it contains centuries of geometry, symbolism, and structural intelligence?</em> The answer became a brand. Every piece Ankara Aura produces is an answer to that question.
                  </>,
                },
                {
                  lead: "Not fast fashion. Never.",
                  body: <>
                    We don't produce to fill shelves. We produce to <strong>make a point</strong>. Limited runs. Deliberate design. Quality that outlasts the season. Ankara Aura is for the person who understands that what they wear communicates something about who they are — before they speak a single word.
                  </>,
                },
                {
                  lead: "A vision without borders.",
                  body: <>
                    The brand was founded in Accra. The ambition is everywhere. Ankara Aura is built to scale — not because growth is the goal, but because the message deserves the widest possible stage. <strong>Culture this powerful should not be a local secret.</strong>
                  </>,
                },
              ].map((b, i) => (
                <div key={i} className="ab-origin-block child">
                  <p className="ab-origin-lead">{b.lead}</p>
                  <p className="ab-origin-body">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          03 — THE MEANING OF AURA
      ══════════════════════════════════════════ */}
      <section
        ref={auraR.ref as React.RefObject<HTMLElement>}
        className={`ab-aura-s rv${auraR.visible ? " on" : ""}`}
      >
        <KenteBar height={3} />
        <div className="ab-aura-layout">
          <div className="ab-aura-left">
            <AnkaraPattern id="ab-aura-p" opacity={0.04} color="#f7f6f4" />
            <span className="ab-aura-word-solid">AURA</span>
            <span className="ab-aura-word">A U R A</span>
          </div>
          <div className={`ab-aura-right rv-r${auraR.visible ? " on" : ""}`}>
            <p className="ab-aura-tag child">The Meaning</p>
            <h2 className="ab-aura-def child">
              Presence without noise.<br />
              <span className="hi">Energy without shouting.</span><br />
              Confidence without explanation.
            </h2>
            <p className="ab-aura-body child">
              The Ankara pattern is not decoration. It is communication — a visual language developed over centuries to carry meaning, identity, and status. We take that language and translate it into garments built for the modern world. The result is something that cannot be ignored, without trying to be loud.
            </p>
            <div className="ab-aura-pillars child">
              {["Rooted in African tradition","Structured for modern life","Built to carry presence","Designed for the global stage"].map(t => (
                <span key={t} className="ab-aura-pill">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <KenteBar height={3} />
      </section>

      {/* ══════════════════════════════════════════
          04 — PHILOSOPHY
      ══════════════════════════════════════════ */}
      <section
        ref={philoR.ref as React.RefObject<HTMLElement>}
        className={`ab-philo-s rv${philoR.visible ? " on" : ""}`}
      >
        <div className="pw">
          <div className="ab-philo-head">
            <h2 className={`ab-philo-title child`}>
              OUR<br />
              <span className="sk">PHILOSOPHY</span>
            </h2>
            <p className="ab-philo-intro child">
              Four principles. Every decision we make passes through all of them.
            </p>
          </div>
          <div className="ab-philo-grid">
            {PHILOSOPHY.map((p, i) => (
              <div key={p.title} className={`ab-philo-item child`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className="ab-philo-num">0{i + 1}</span>
                <h3 className="ab-philo-name">{p.title}</h3>
                <p className="ab-philo-body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          05 — CRAFT & PROCESS
      ══════════════════════════════════════════ */}
      <section
        ref={processR.ref as React.RefObject<HTMLElement>}
        className={`ab-process-s rv${processR.visible ? " on" : ""}`}
      >
        <AnkaraPattern id="ab-proc-p" opacity={0.04} color="#f7f6f4" />
        <div className="pw" style={{ position: "relative", zIndex: 1 }}>
          <div className="ab-process-head">
            <p className="ab-process-tag child">Craft & Process</p>
            <h2 className="ab-process-title child">
              HOW IT<br />
              <span className="sk">IS MADE</span>
            </h2>
          </div>
          <div className="ab-process-rows">
            {PROCESS.map((p, i) => (
              <div key={p.num} className={`ab-process-row child`} style={{ transitionDelay: `${i * 0.12}s` }}>
                <span className="ab-process-num">{p.num}</span>
                <span className="ab-process-name">{p.name}</span>
                <p className="ab-process-body">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          06 — THE VISION
      ══════════════════════════════════════════ */}
      <section
        ref={visionR.ref as React.RefObject<HTMLElement>}
        className={`ab-vision-s rv${visionR.visible ? " on" : ""}`}
      >
        <div className="ab-vision-wm">LEGACY</div>
        <div className="pw ab-vision-inner">
          <p className="ab-vision-label child">The Vision</p>
          <h2 className="ab-vision-statement child">
            THIS IS NOT<br />A DROP.
            <span className="sk">IT IS A</span>
            <span className="hl">FOUNDATION.</span>
          </h2>
          <div className="ab-vision-cols">
            {[
              {
                head: "Elevating African Design",
                body: <>Ankara Aura is not building a clothing brand. It is building <strong>proof</strong> — that African design, when given the resources, discipline, and platform it deserves, can compete with and surpass any global fashion house. Every piece we release advances that argument.</>,
              },
              {
                head: "Building for Legacy",
                body: <>We are not here for a season. We are here to construct a cultural institution — a brand that exists in thirty years with the same values it was built on. <strong>The name, the pattern, the standard</strong> — these are not trends. They are infrastructure.</>,
              },
            ].map(c => (
              <div key={c.head} className="child">
                <h3 className="ab-vision-col-head">{c.head}</h3>
                <p className="ab-vision-col-body">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          07 — FOUNDERS
      ══════════════════════════════════════════ */}
      <section
        ref={founderR.ref as React.RefObject<HTMLElement>}
        className={`ab-founders-s rv${founderR.visible ? " on" : ""}`}
      >
        <div className="pw" style={{ position: "relative", zIndex: 1 }}>
          <div className="ab-founders-head">
            <p className="ab-founders-tag child">The People</p>
            <h2 className="ab-founders-title child">
              THE ONES<br />
              <span className="sk">WHO BUILT IT</span>
            </h2>
          </div>
          <div className="ab-founders-grid">
            {FOUNDERS.map((f, i) => (
              <div key={f.name} className={`ab-founder-card child`} style={{ transitionDelay: `${i * 0.14}s` }}>
                <span className="ab-founder-initials">
                  {f.name.split(" ").map(n => n[0]).join("")}
                </span>
                <h3 className="ab-founder-name">{f.name}</h3>
                <p className="ab-founder-title">{f.title}</p>
                <p className="ab-founder-bio">{f.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          08 — CLOSING STATEMENT
      ══════════════════════════════════════════ */}
      <section
        ref={closeR.ref as React.RefObject<HTMLElement>}
        className={`ab-close-s rv${closeR.visible ? " on" : ""}`}
      >
        <AnkaraPattern id="ab-close-p" opacity={0.06} />
        <div className="ab-close-wm">AURA</div>
        <div className="ab-close-inner">
          <p className="ab-close-label child">Ankara Aura</p>
          <div className="ab-close-statement">
            <div className="hw child"><span className="hline on d1 solid">WEAR CULTURE.</span></div>
            <div className="hw child"><span className="hline on d2 stroke">CARRY PRESENCE.</span></div>
          </div>
          <p className="ab-close-sub child">
            Crafted in Accra. Built for the world.
          </p>
        </div>
      </section>

      <KenteBar height={4} />
    </>
  );
}
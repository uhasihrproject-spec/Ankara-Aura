"use client";

import { useState, useEffect, useRef } from "react";
import type { MouseEventHandler, CSSProperties } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

/* ─── data ─── */
const links = [
  { href: "/shop",      label: "Shop" },
  { href: "/customize", label: "Customize" },
  { href: "/about",     label: "About" },
  { href: "/contact",   label: "Contact" },
];

/* ─── SplitLink — each nav word splits on hover ─── */
function SplitLink({ href, label, onClick }: { href: string; label: string; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  return (
    <Link href={href} className="split-link" onClick={onClick}>
      <span className="split-top">{label}</span>
      <span className="split-bot">{label}</span>
    </Link>
  );
}

/* ─── main component ─── */
export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [cartPulse,  setCartPulse]  = useState(false);
  const [particles]  = useState(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 1.6,
    dur: 1 + Math.random() * 1.2,
    color: ["#d4a843", "#d4a843", "#1a3a5c", "#8b2635", "#2d6a4f"][i % 5],
    dx: (Math.random() - 0.5) * 70,
    dy: (Math.random() - 0.5) * 70,
  })));
  const [logoSpin,   setLogoSpin]   = useState(false);
  const cartPanelRef = useRef<HTMLDivElement | null>(null);

  // Use shared cart context
  const { items: cartItems, removeItem, updateQty, totalQty, totalPrice, wishlistCount } = useCart();

  /* scroll: mark scrolled */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* body lock */
  useEffect(() => {
    document.body.style.overflow = (menuOpen || cartOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, cartOpen]);

  /* close cart on outside click */
  useEffect(() => {
    if (!cartOpen) return;
    const h = (e: MouseEvent) => {
      if (cartPanelRef.current && e.target instanceof Node && !cartPanelRef.current.contains(e.target)) setCartOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [cartOpen]);

  const triggerPulse = () => {
    setCartPulse(true);
    setTimeout(() => setCartPulse(false), 600);
  };

  const handleLogoHover = () => {
    setLogoSpin(true);
    setTimeout(() => setLogoSpin(false), 700);
  };

  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');

      :root {
        --ink:     #0b0b0a;
        --cream:   #f7f6f4;
        --kente:   #d4a843;
        --gold:    #d4a843;
        --indigo:  #1a3a5c;
        --forest:  #2d6a4f;
        --crimson: #8b2635;
        --border:  rgba(8,8,7,0.10);
        --nav-h:   62px;
      }

      /* ════════════ NAV SHELL ════════════ */
      .nav-shell {
        position: sticky;
        top: 0;
        z-index: 200;
        font-family: 'DM Sans', sans-serif;
      }

      .nav {
        background: rgba(247,246,244,0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid var(--border);
        transition: box-shadow 0.3s, height 0.4s cubic-bezier(0.4,0,0.2,1);
        height: var(--nav-h);
        overflow: hidden;
      }
      .nav.scrolled { box-shadow: 0 2px 40px rgba(8,8,7,0.08); }

      .nav-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 36px;
        height: var(--nav-h);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 32px;
      }

      /* ════════════ LOGO ════════════ */
      .nav-logo {
        display: flex; align-items: center; gap: 12px;
        text-decoration: none; flex-shrink: 0;
        position: relative;
      }

      /* Adinkra-inspired rotating ring */
      .logo-mark {
        position: relative;
        width: 38px; height: 38px;
        flex-shrink: 0;
      }
      .logo-mark-inner {
        position: absolute; inset: 0;
        background: var(--ink);
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        z-index: 2;
        overflow: hidden;
      }
      .logo-mark-inner::before {
        content: '';
        position: absolute; inset: -1px;
        background: linear-gradient(135deg, var(--kente), var(--gold), var(--indigo), var(--kente));
        z-index: -1;
        border-radius: 9px;
        animation: gradRotate 4s linear infinite;
      }
      @keyframes gradRotate {
        0%   { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
      .logo-mark-letters {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 15px; letter-spacing: 0.05em;
        color: #f7f6f4; position: relative; z-index: 3;
      }
      /* rotating adinkra ring */
      .logo-ring {
        position: absolute; inset: -5px;
        border-radius: 12px;
        border: 1.5px dashed rgba(200,80,42,0.35);
        z-index: 1;
        transition: transform 0.7s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s;
      }
      .nav-logo:hover .logo-ring,
      .logo-ring.spinning {
        transform: rotate(90deg);
        border-color: var(--kente);
        border-style: solid;
      }
      /* geometric corner dots */
      .logo-ring::before,
      .logo-ring::after {
        content: '';
        position: absolute;
        width: 4px; height: 4px;
        background: var(--kente);
        border-radius: 50%;
      }
      .logo-ring::before { top: -2px; left: -2px; }
      .logo-ring::after  { bottom: -2px; right: -2px; }

      .logo-text-wrap { display: flex; flex-direction: column; gap: 0; }
      .logo-wordmark {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 21px; letter-spacing: 0.12em;
        color: var(--ink); line-height: 1;
        position: relative;
        display: inline-block;
      }
      /* wordmark animated underline — kente wipe */
      .logo-wordmark::after {
        content: '';
        position: absolute;
        bottom: -1px; left: 0;
        height: 2px; width: 0;
        background: linear-gradient(90deg, var(--kente), var(--gold));
        transition: width 0.4s cubic-bezier(0.77,0,0.175,1);
      }
      .nav-logo:hover .logo-wordmark::after { width: 100%; }
      .logo-sub {
        font-family: 'Caveat', cursive;
        font-size: 11px; color: rgba(8,8,7,0.38);
        letter-spacing: 0.04em; line-height: 1; margin-top: 1px;
      }

      /* ════════════ SPLIT-TEXT LINKS ════════════ */
      .nav-links {
        display: flex; align-items: center; gap: 40px;
        list-style: none; margin: 0; padding: 0;
      }
      .split-link {
        position: relative;
        display: block;
        height: 1.1em;
        overflow: hidden;
        text-decoration: none;
        font-size: 11px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .split-top,
      .split-bot {
        display: block;
        line-height: 1.1em;
        transition: transform 0.38s cubic-bezier(0.77,0,0.175,1);
      }
      .split-top { color: rgba(8,8,7,0.6); }
      .split-bot {
        position: absolute;
        top: 0; left: 0;
        color: var(--kente);
        transform: translateY(110%);
        font-weight: 400;
      }
      .split-link:hover .split-top { transform: translateY(-110%); }
      .split-link:hover .split-bot  { transform: translateY(0); }

      /* active indicator dot */
      .nav-link-item { position: relative; }
      .nav-link-item.active::after {
        content: '';
        position: absolute;
        bottom: -6px; left: 50%;
        transform: translateX(-50%);
        width: 3px; height: 3px;
        border-radius: 50%;
        background: var(--kente);
      }

      /* ════════════ RIGHT SIDE ════════════ */
      .nav-right {
        display: flex; align-items: center; gap: 14px;
      }

      /* ── Shop Now button (original) ── */
      .nav-shop-btn {
        font-size: 11px; letter-spacing: 0.16em;
        text-transform: uppercase;
        background: var(--ink); color: var(--cream);
        padding: 9px 20px; text-decoration: none;
        border: 1px solid var(--ink);
        transition: background 0.2s, color 0.2s, transform 0.18s;
        white-space: nowrap;
      }
      .nav-shop-btn:hover {
        background: transparent; color: var(--ink);
        transform: translateY(-1px);
      }

      /* ════════════ CART BUTTON ════════════ */
      .wish-btn {
        position: relative;
        width: 40px;
        height: 40px;
        border: 1px solid var(--border);
        background: #fff;
        color: var(--ink);
        cursor: pointer;
        font-size: 18px;
      }
      .wish-badge {
        position: absolute;
        top: -6px;
        right: -6px;
        min-width: 18px;
        height: 18px;
        border-radius: 999px;
        background: var(--kente);
        color: #111;
        font-size: 10px;
        display: grid;
        place-items: center;
        font-family: 'Bebas Neue', sans-serif;
      }

      .cart-btn {
        position: relative;
        width: 44px; height: 44px;
        border: none; background: none;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        -webkit-tap-highlight-color: transparent;
        outline: none;
        flex-shrink: 0;
      }
      .cart-orb {
        position: relative;
        width: 40px; height: 40px;
        border-radius: 50%;
        border: 1.5px solid rgba(8,8,7,0.18);
        background: var(--cream);
        display: flex; align-items: center; justify-content: center;
        transition:
          border-color 0.3s,
          box-shadow 0.3s,
          transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
          background 0.3s;
        overflow: visible;
      }
      .cart-btn:hover .cart-orb {
        border-color: var(--kente);
        background: var(--ink);
        transform: scale(1.12);
        box-shadow: 0 0 0 7px rgba(200,80,42,0.11), 0 4px 20px rgba(200,80,42,0.2);
      }
      .cart-btn.is-open .cart-orb {
        border-color: var(--kente);
        background: var(--kente);
        transform: scale(1.08);
        box-shadow: 0 4px 24px rgba(200,80,42,0.35);
      }
      .cart-btn.pulse .cart-orb {
        animation: cartPop 0.55s cubic-bezier(0.34,1.56,0.64,1);
      }
      @keyframes cartPop {
        0%  { transform: scale(1); }
        40% { transform: scale(1.32); }
        70% { transform: scale(0.95); }
        100%{ transform: scale(1); }
      }
      .cart-icon {
        width: 17px; height: 17px;
        stroke: var(--ink); fill: none;
        stroke-width: 1.6;
        stroke-linecap: round; stroke-linejoin: round;
        transition: stroke 0.3s, transform 0.3s;
        position: relative; z-index: 2;
      }
      .cart-btn:hover .cart-icon,
      .cart-btn.is-open .cart-icon { stroke: #f7f6f4; }
      .cart-btn:hover .cart-icon   { transform: rotate(-10deg) scale(1.05); }

      .cart-badge {
        position: absolute;
        top: -2px; right: -2px;
        min-width: 17px; height: 17px;
        border-radius: 99px;
        background: var(--kente);
        border: 2px solid var(--cream);
        display: flex; align-items: center; justify-content: center;
        font-family: 'DM Sans', sans-serif;
        font-size: 9px; font-weight: 600;
        color: white; letter-spacing: 0; padding: 0 3px;
        transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s;
        z-index: 3;
      }
      .cart-btn:hover .cart-badge  { background: var(--gold); transform: scale(1.22) translateY(-2px); }
      .cart-btn.is-open .cart-badge { background: white; color: var(--kente); }

      /* particle threads */
      .cart-threads {
        position: absolute; inset: 0;
        border-radius: 50%;
        pointer-events: none; z-index: 1;
      }
      .cart-thread {
        position: absolute;
        border-radius: 50%;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
      }
      .cart-btn:hover .cart-thread {
        animation: threadBurst var(--dur) var(--delay) infinite ease-out;
      }
      @keyframes threadBurst {
        0%  { opacity: 0;   transform: translate(-50%,-50%) scale(0) rotate(0deg); }
        15% { opacity: 1; }
        100%{ opacity: 0;   transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1) rotate(200deg); }
      }

      /* cart tooltip */
      .cart-tooltip {
        position: absolute;
        bottom: -38px; left: 50%;
        transform: translateX(-50%) translateY(6px);
        white-space: nowrap;
        background: var(--ink);
        color: var(--cream);
        font-family: 'Caveat', cursive;
        font-size: 13px;
        padding: 4px 10px;
        border-radius: 4px;
        opacity: 0; pointer-events: none;
        transition: opacity 0.2s, transform 0.2s;
        z-index: 10;
      }
      .cart-tooltip::before {
        content: '';
        position: absolute;
        top: -5px; left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-bottom-color: var(--ink);
      }
      .cart-btn:hover .cart-tooltip { opacity: 1; transform: translateX(-50%) translateY(0); }

      /* ════════════ HAMBURGER ════════════ */
      .nav-burger {
        display: none;
        flex-direction: column; justify-content: center; gap: 5px;
        width: 40px; height: 40px;
        cursor: pointer; background: none; border: none; padding: 6px;
        -webkit-tap-highlight-color: transparent;
        position: relative;
      }
      .nav-burger-ring {
        position: absolute; inset: 0;
        border-radius: 50%;
        border: 1.5px solid transparent;
        transition: border-color 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
      }
      .nav-burger.is-open .nav-burger-ring {
        border-color: var(--kente);
        transform: rotate(45deg) scale(1.1);
      }
      .nav-burger span {
        display: block; height: 1.5px; background: var(--ink);
        border-radius: 2px;
        transition: transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.2s, width 0.32s;
        transform-origin: center;
      }
      .nav-burger span:nth-child(2) { width: 24px; }
      .nav-burger span:nth-child(3) { width: 16px; }
      .nav-burger span:nth-child(4) { width: 20px; }
      .nav-burger.is-open span:nth-child(2) { transform: translateY(6.5px) rotate(45deg); width: 22px; }
      .nav-burger.is-open span:nth-child(3) { opacity: 0; transform: scaleX(0); }
      .nav-burger.is-open span:nth-child(4) { transform: translateY(-6.5px) rotate(-45deg); width: 22px; }

      /* ════════════ MOBILE DRAWER ════════════ */
      .nav-drawer {
        position: fixed; inset: 0; z-index: 299;
        display: flex; flex-direction: column;
        background: var(--ink);
        transform: translateX(100%);
        transition: transform 0.5s cubic-bezier(0.77,0,0.175,1);
        overflow: hidden;
      }
      .nav-drawer.is-open { transform: translateX(0); }

      /* SVG Ankara geometric background */
      .drawer-bg {
        position: absolute; inset: 0;
        opacity: 0.06;
        pointer-events: none;
        overflow: hidden;
      }

      /* colored top stripe */
      .drawer-stripe {
        position: absolute; top: 0; left: 0; right: 0;
        height: 4px;
        background: repeating-linear-gradient(
          90deg,
          var(--kente) 0,  var(--kente)  20px,
          var(--gold)  20px, var(--gold)  40px,
          #f7f6f4     40px, #f7f6f4     60px,
          var(--indigo)60px, var(--indigo)80px
        );
      }

      .drawer-content {
        position: relative; z-index: 2;
        display: flex; flex-direction: column;
        height: 100%;
        padding: 72px 36px 44px;
      }

      .drawer-close {
        position: absolute; top: 20px; right: 20px;
        width: 40px; height: 40px;
        border: 1.5px solid rgba(247,246,244,0.2);
        border-radius: 50%; background: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: border-color 0.2s, background 0.2s, transform 0.3s;
        z-index: 3;
      }
      .drawer-close:hover { border-color: var(--kente); background: var(--kente); transform: rotate(90deg); }
      .drawer-close svg { width: 14px; height: 14px; stroke: rgba(247,246,244,0.8); stroke-width: 1.8; stroke-linecap: round; fill: none; }
      .drawer-close:hover svg { stroke: white; }

      .drawer-links {
        display: flex; flex-direction: column;
        list-style: none; margin: 0; padding: 0; flex: 1;
        gap: 0;
      }
      .drawer-links li {
        border-bottom: 1px solid rgba(247,246,244,0.07);
        overflow: hidden;
      }
      .drawer-links li a {
        display: flex; align-items: center;
        justify-content: space-between;
        font-family: 'Bebas Neue', sans-serif;
        font-size: clamp(38px, 9vw, 54px);
        letter-spacing: 0.05em;
        color: rgba(247,246,244,0.85);
        text-decoration: none;
        padding: 16px 0;
        line-height: 1;
        transition: color 0.25s, letter-spacing 0.25s, padding-left 0.25s;
        position: relative;
      }
      .drawer-links li a .link-num {
        font-family: 'Caveat', cursive;
        font-size: 13px;
        color: rgba(247,246,244,0.25);
        margin-top: auto;
        padding-bottom: 6px;
        transition: color 0.25s;
      }
      .drawer-links li a:hover {
        color: var(--kente);
        letter-spacing: 0.1em;
        padding-left: 10px;
      }
      .drawer-links li a:hover .link-num { color: var(--gold); }

      .drawer-footer {
        display: flex; flex-direction: column; gap: 8px;
        padding-top: 28px;
      }
      .drawer-footer-email {
        font-family: 'Caveat', cursive;
        font-size: 16px; color: rgba(247,246,244,0.35);
      }
      .drawer-footer-copy {
        font-family: 'DM Sans', sans-serif;
        font-size: 10px; letter-spacing: 0.16em;
        text-transform: uppercase;
        color: rgba(247,246,244,0.2);
      }

      /* ════════════ CART PANEL ════════════ */
      .cart-overlay {
        position: fixed; inset: 0; z-index: 290;
        background: rgba(8,8,7,0);
        pointer-events: none;
        transition: background 0.4s;
      }
      .cart-overlay.is-open {
        background: rgba(8,8,7,0.32);
        pointer-events: all;
        backdrop-filter: blur(3px);
      }
      .cart-panel {
        position: fixed;
        top: 0; right: 0; bottom: 0;
        width: min(420px, 100vw);
        z-index: 300;
        background: var(--cream);
        display: flex; flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.52s cubic-bezier(0.77,0,0.175,1);
        box-shadow: -8px 0 60px rgba(8,8,7,0.14);
        overflow: hidden;
      }
      .cart-panel.is-open { transform: translateX(0); }

      .cart-panel-stripe {
        height: 5px; flex-shrink: 0;
        background: repeating-linear-gradient(
          90deg,
          var(--kente)  0,  var(--kente)  20px,
          var(--gold)   20px, var(--gold)  40px,
          var(--ink)    40px, var(--ink)   60px,
          var(--indigo) 60px, var(--indigo) 80px
        );
      }
      .cart-panel-head {
        display: flex; align-items: flex-end;
        justify-content: space-between;
        padding: 22px 28px 18px;
        border-bottom: 1px solid var(--border);
        flex-shrink: 0;
      }
      .cart-panel-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 30px; letter-spacing: 0.08em;
        color: var(--ink); line-height: 1;
      }
      .cart-panel-sub {
        font-family: 'Caveat', cursive;
        font-size: 14px; color: rgba(8,8,7,0.38); margin-top: 2px;
      }
      .cart-close {
        width: 36px; height: 36px;
        border: 1.5px solid var(--border);
        border-radius: 50%; background: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: border-color 0.2s, background 0.2s, transform 0.25s;
        flex-shrink: 0;
      }
      .cart-close:hover { border-color: var(--kente); background: var(--kente); transform: rotate(90deg); }
      .cart-close svg { width: 13px; height: 13px; stroke: var(--ink); stroke-width: 1.8; stroke-linecap: round; fill: none; transition: stroke 0.2s; }
      .cart-close:hover svg { stroke: white; }

      .cart-items { flex: 1; overflow-y: auto; padding: 4px 0; }
      .cart-items::-webkit-scrollbar { width: 2px; }
      .cart-items::-webkit-scrollbar-thumb { background: rgba(8,8,7,0.12); border-radius: 99px; }

      .cart-item {
        display: flex; gap: 14px; align-items: flex-start;
        padding: 18px 28px;
        border-bottom: 1px solid var(--border);
        position: relative;
        transition: background 0.2s;
        animation: slideInItem 0.38s cubic-bezier(0.34,1.2,0.64,1) both;
      }
      @keyframes slideInItem {
        from { opacity: 0; transform: translateX(28px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      .cart-item:hover { background: rgba(8,8,7,0.025); }
      .cart-item-swatch {
        width: 52px; height: 64px;
        border-radius: 4px;
        flex-shrink: 0; position: relative; overflow: hidden;
      }
      .cart-item-swatch::after {
        content: ''; position: absolute; inset: 0;
        background: repeating-linear-gradient(
          135deg,
          rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 3px,
          transparent 3px, transparent 8px
        );
      }
      .cart-item-info { flex: 1; min-width: 0; }
      .cart-item-name {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 17px; letter-spacing: 0.06em;
        color: var(--ink); line-height: 1.1;
      }
      .cart-item-variant {
        font-family: 'Caveat', cursive;
        font-size: 13px; color: rgba(8,8,7,0.45); margin-top: 2px;
      }
      .cart-item-bottom {
        display: flex; align-items: center;
        justify-content: space-between; margin-top: 10px;
      }
      .cart-item-qty { display: flex; align-items: center; gap: 9px; }
      .qty-btn {
        width: 22px; height: 22px;
        border: 1px solid var(--border); border-radius: 50%;
        background: none; cursor: pointer; font-size: 14px;
        display: flex; align-items: center; justify-content: center;
        color: var(--ink); transition: border-color 0.2s, background 0.2s, color 0.2s;
      }
      .qty-btn:hover { border-color: var(--kente); background: var(--kente); color: white; }
      .qty-num {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 16px; letter-spacing: 0.05em;
        min-width: 14px; text-align: center;
      }
      .cart-item-price {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 17px; letter-spacing: 0.05em; color: var(--kente);
      }
      .cart-item-remove {
        position: absolute; top: 14px; right: 22px;
        width: 20px; height: 20px;
        background: none; border: none; cursor: pointer;
        opacity: 0; transition: opacity 0.2s, transform 0.2s;
        display: flex; align-items: center; justify-content: center;
      }
      .cart-item-remove svg { width: 11px; height: 11px; stroke: rgba(8,8,7,0.35); stroke-width: 1.8; stroke-linecap: round; fill: none; }
      .cart-item-remove:hover svg { stroke: var(--crimson); }
      .cart-item-remove:hover { transform: scale(1.3); }
      .cart-item:hover .cart-item-remove { opacity: 1; }

      .cart-empty {
        flex: 1; display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 12px; padding: 48px 28px; text-align: center;
      }
      .cart-empty-icon {
        width: 56px; height: 56px;
        border: 1.5px dashed rgba(8,8,7,0.18); border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
      }
      .cart-empty-icon svg { width: 22px; height: 22px; stroke: rgba(8,8,7,0.22); stroke-width: 1.4; fill: none; }
      .cart-empty-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 20px; letter-spacing: 0.08em; color: rgba(8,8,7,0.28);
      }
      .cart-empty-sub {
        font-family: 'Caveat', cursive;
        font-size: 14px; color: rgba(8,8,7,0.28);
      }

      .cart-footer { flex-shrink: 0; border-top: 1px solid var(--border); padding: 18px 28px 26px; }
      .cart-subtotal {
        display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px;
      }
      .cart-subtotal-label {
        font-size: 10px; letter-spacing: 0.18em;
        text-transform: uppercase; color: rgba(8,8,7,0.45);
      }
      .cart-subtotal-val {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 26px; letter-spacing: 0.06em; color: var(--ink);
      }
      .cart-checkout-btn {
        display: block; width: 100%;
        padding: 15px; text-align: center;
        background: var(--ink); color: var(--cream);
        font-size: 10px; letter-spacing: 0.22em;
        text-transform: uppercase; text-decoration: none;
        border: 1.5px solid var(--ink);
        transition: transform 0.18s, box-shadow 0.2s;
        position: relative; overflow: hidden; cursor: pointer;
      }
      .cart-checkout-btn::before {
        content: ''; position: absolute; inset: 0;
        background: var(--kente);
        transform: scaleX(0); transform-origin: left;
        transition: transform 0.4s cubic-bezier(0.77,0,0.175,1);
      }
      .cart-checkout-btn:hover::before { transform: scaleX(1); }
      .cart-checkout-btn span { position: relative; z-index: 1; }
      .cart-checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,80,42,0.25); }
      .cart-continue {
        display: block; text-align: center; margin-top: 10px;
        font-family: 'Caveat', cursive; font-size: 14px;
        color: rgba(8,8,7,0.38); text-decoration: none; transition: color 0.2s;
      }
      .cart-continue:hover { color: var(--kente); }

      /* ════════════ RESPONSIVE ════════════ */
      @media (max-width: 768px) {
        .nav-links, .nav-shop-btn-wrap { display: none; }
        .nav-burger { display: flex; }
        .nav-inner  { padding: 0 20px; }
      }
      @media (min-width: 769px) {
        .nav-drawer { display: none !important; }
      }
    `}</style>

    {/* ── CART OVERLAY ── */}
    <div className={`cart-overlay${cartOpen ? " is-open" : ""}`} onClick={() => setCartOpen(false)} />

    {/* ── CART PANEL ── */}
    <div ref={cartPanelRef} className={`cart-panel${cartOpen ? " is-open" : ""}`}>
      <div className="cart-panel-stripe" />
      <div className="cart-panel-head">
        <div>
          <div className="cart-panel-title">YOUR CART</div>
          <div className="cart-panel-sub">
            {totalQty > 0 ? `${totalQty} piece${totalQty !== 1 ? "s" : ""} of the aura` : "nothing here yet"}
          </div>
        </div>
        <button className="cart-close" onClick={() => setCartOpen(false)} aria-label="Close cart">
          <svg viewBox="0 0 14 14"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg>
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div className="cart-empty-title">Bag is empty</div>
          <div className="cart-empty-sub">Your pieces are waiting in the shop →</div>
        </div>
      ) : (
        <div className="cart-items">
          {cartItems.map((item, i) => (
            <div key={`${item.slug}-${item.size}`} className="cart-item" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="cart-item-swatch" style={{ background: item.color || "#d4a843" }} />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-variant">{item.size ? `Size ${item.size}` : (item.variant || "")}</div>
                <div className="cart-item-bottom">
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => updateQty(item.slug, item.size, item.qty - 1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => { updateQty(item.slug, item.size, item.qty + 1); triggerPulse(); }}>+</button>
                  </div>
                  <div className="cart-item-price">GH₵ {(item.price * item.qty).toLocaleString()}</div>
                </div>
              </div>
              <button className="cart-item-remove" onClick={() => removeItem(item.slug, item.size)}>
                <svg viewBox="0 0 12 12"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="cart-footer">
          <div className="cart-subtotal">
            <span className="cart-subtotal-label">Subtotal</span>
            <span className="cart-subtotal-val">GH₵ {totalPrice.toLocaleString()}</span>
          </div>
          <Link href="/checkout" className="cart-checkout-btn">
            <span>Checkout — Secure Your Pieces</span>
          </Link>
          <a href="#" className="cart-continue" onClick={e => { e.preventDefault(); setCartOpen(false); }}>← continue shopping</a>
        </div>
      )}
    </div>

    {/* ── NAV SHELL ── */}
    <div className="nav-shell">
      <header
        className={`nav${scrolled ? " scrolled" : ""}`}
      >
        <div className="nav-inner">

          {/* LOGO */}
          <Link href="/" className="nav-logo" onMouseEnter={handleLogoHover}>
            <div className="logo-mark">
              <div className={`logo-ring${logoSpin ? " spinning" : ""}`} />
              <div className="logo-mark-inner">
                <span className="logo-mark-letters">AA</span>
              </div>
            </div>
            <div className="logo-text-wrap">
              <span className="logo-wordmark">ANKARA AURA</span>
              <span className="logo-sub">street luxury</span>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <nav aria-label="Main navigation">
            <ul className="nav-links">
              {links.map((l) => (
                <li key={l.href} className="nav-link-item">
                  <SplitLink href={l.href} label={l.label} />
                </li>
              ))}
            </ul>
          </nav>

          {/* RIGHT */}
          <div className="nav-right">
            <span className="nav-shop-btn-wrap">
              <Link href="/shop" className="nav-shop-btn">Shop Now</Link>
            </span>

            <button className="wish-btn" aria-label={`Wishlist, ${wishlistCount} items`}>
              ♡
              {wishlistCount > 0 && <div className="wish-badge">{wishlistCount}</div>}
            </button>

            {/* CART */}
            <button
              className={`cart-btn${cartOpen ? " is-open" : ""}${cartPulse ? " pulse" : ""}`}
              onClick={() => setCartOpen(o => !o)}
              aria-label={`Cart, ${totalQty} items`}
            >
              <div className="cart-orb">
                <div className="cart-threads">
                  {particles.map(p => (
                    <div key={p.id} className="cart-thread" style={{
                      left: `${p.x}%`, top: `${p.y}%`,
                      width: p.size, height: p.size,
                      background: p.color,
                      ["--delay" as string]: `${p.delay}s`,
                      ["--dur" as string]: `${p.dur}s`,
                      ["--dx" as string]: `${p.dx}px`,
                      ["--dy" as string]: `${p.dy}px`,
                    } as CSSProperties} />
                  ))}
                </div>
                <svg className="cart-icon" viewBox="0 0 24 24">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              {totalQty > 0 && <div className="cart-badge">{totalQty > 9 ? "9+" : totalQty}</div>}
              <div className="cart-tooltip">{totalQty > 0 ? `${totalQty} in bag` : "your bag"}</div>
            </button>

            {/* HAMBURGER */}
            <button
              className={`nav-burger${menuOpen ? " is-open" : ""}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <div className="nav-burger-ring" />
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>
    </div>

    {/* ── MOBILE DRAWER ── */}
    <nav className={`nav-drawer${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
      <div className="drawer-stripe" />

      {/* Ankara geometric SVG background */}
      <div className="drawer-bg" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ankara" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              {/* diamond */}
              <polygon points="40,4 76,40 40,76 4,40" fill="none" stroke="#d4a843" strokeWidth="1.2"/>
              {/* inner diamond */}
              <polygon points="40,18 62,40 40,62 18,40" fill="none" stroke="#d4a843" strokeWidth="0.8"/>
              {/* corner dots */}
              <circle cx="4"  cy="4"  r="2.5" fill="#d4a843"/>
              <circle cx="76" cy="4"  r="2.5" fill="#d4a843"/>
              <circle cx="4"  cy="76" r="2.5" fill="#1a3a5c"/>
              <circle cx="76" cy="76" r="2.5" fill="#2d6a4f"/>
              {/* center cross */}
              <line x1="40" y1="30" x2="40" y2="50" stroke="#f7f6f4" strokeWidth="0.6"/>
              <line x1="30" y1="40" x2="50" y2="40" stroke="#f7f6f4" strokeWidth="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ankara)"/>
        </svg>
      </div>

      <div className="drawer-content">
        <button className="drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <svg viewBox="0 0 14 14"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg>
        </button>

        <ul className="drawer-links">
          {links.map((l, i) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setMenuOpen(false)}>
                {l.label}
                <span className="link-num">0{i + 1}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="drawer-footer">
          <div className="drawer-footer-email">ankaraauragh@gmail.com</div>
          <div className="drawer-footer-copy">© {new Date().getFullYear()} Ankara Aura · Street Luxury</div>
        </div>
      </div>
    </nav>
  </>
  );
}
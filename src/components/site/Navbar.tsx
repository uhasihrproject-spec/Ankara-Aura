"use client";

import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/shop",      label: "Shop" },
  { href: "/customize", label: "Customize" },
  { href: "/about",     label: "About" },
  { href: "/contact",   label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [cartOpen,  setCartOpen]  = useState(false);
  const [wishOpen,  setWishOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [logoSpin,  setLogoSpin]  = useState(false);
  const [cartPulse, setCartPulse] = useState(false);

  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 1.6, dur: 1 + Math.random() * 1.2,
      color: ["#d4a843","#d4a843","#1a3a5c","#8b2635","#2d6a4f"][i % 5],
      dx: (Math.random() - 0.5) * 70, dy: (Math.random() - 0.5) * 70,
    }))
  );

  const cartRef = useRef<HTMLDivElement>(null);
  const wishRef = useRef<HTMLDivElement>(null);
  const { items, removeItem, updateQty, totalQty, totalPrice,
          wishlist, wishlistCount, removeFromWishlist, addToCart } = useCart();

  // FIXED: shadow only on scroll — no broken pattern-mode
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false); setCartOpen(false); setWishOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = (menuOpen || cartOpen || wishOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, cartOpen, wishOpen]);

  useEffect(() => {
    if (!cartOpen && !wishOpen) return;
    const fn = (e: MouseEvent) => {
      if (e.target instanceof Node) {
        if (cartOpen && cartRef.current && !cartRef.current.contains(e.target)) setCartOpen(false);
        if (wishOpen && wishRef.current && !wishRef.current.contains(e.target)) setWishOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [cartOpen, wishOpen]);

  const pulse = () => { setCartPulse(true); setTimeout(() => setCartPulse(false), 600); };
  const isActive = (href: string) => href === "/shop"
    ? pathname === href || pathname.startsWith(href + "/")
    : pathname === href || pathname.startsWith(href);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ink:#0b0b0a; --cream:#f7f6f4; --gold:#d4a843;
          --indigo:#1a3a5c; --forest:#2d6a4f; --crimson:#8b2635;
          --b:rgba(8,8,7,0.09); --nav-h:62px;
        }

        /* ─── SHELL ─── */
        .ns { position:sticky; top:0; z-index:200; }
        .nv {
          background:rgba(247,246,244,0.96);
          backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
          border-bottom:1px solid var(--b);
          height:var(--nav-h);
          transition:box-shadow .3s, border-color .3s, background .3s;
        }
        .nv.sc {
          background:rgba(247,246,244,1);
          box-shadow:0 1px 0 rgba(8,8,7,0.08), 0 4px 32px rgba(8,8,7,0.07);
          border-bottom-color:rgba(8,8,7,0.13);
        }
        .ni {
          max-width:1200px; margin:0 auto; padding:0 36px;
          height:var(--nav-h); display:flex; align-items:center;
          justify-content:space-between; gap:28px;
        }

        /* ─── LOGO ─── */
        .nl { display:flex; align-items:center; gap:11px; text-decoration:none; flex-shrink:0; }
        .lm { position:relative; width:36px; height:36px; flex-shrink:0; }
        .lmi {
          position:absolute; inset:0; background:var(--ink); border-radius:7px;
          display:flex; align-items:center; justify-content:center; z-index:2;
        }
        .lmi::before {
          content:''; position:absolute; inset:-1px;
          background:linear-gradient(135deg,var(--gold),#c8502a,var(--indigo),var(--gold));
          z-index:-1; border-radius:8px;
          animation:gRot 5s linear infinite;
        }
        @keyframes gRot{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}
        .lml { font-family:'Bebas Neue',sans-serif; font-size:14px; letter-spacing:.06em; color:#f7f6f4; position:relative; z-index:3; }
        .lr {
          position:absolute; inset:-5px; border-radius:11px;
          border:1.5px dashed rgba(200,80,42,.28); z-index:1;
          transition:transform .65s cubic-bezier(.34,1.56,.64,1), border-color .3s, border-style .3s;
        }
        .lr::before,.lr::after { content:''; position:absolute; width:3px; height:3px; background:var(--gold); border-radius:50%; }
        .lr::before { top:-1.5px; left:-1.5px; } .lr::after { bottom:-1.5px; right:-1.5px; }
        .nl:hover .lr, .lr.sp { transform:rotate(90deg); border-color:var(--gold); border-style:solid; }
        .lw { display:flex; flex-direction:column; }
        .lw1 {
          font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:.13em;
          color:var(--ink); line-height:1; position:relative; display:inline-block;
        }
        .lw1::after {
          content:''; position:absolute; bottom:-1px; left:0; height:2px; width:0;
          background:linear-gradient(90deg,var(--gold),#c8502a);
          transition:width .4s cubic-bezier(.77,0,.175,1);
        }
        .nl:hover .lw1::after { width:100%; }
        .lw2 { font-family:'Caveat',cursive; font-size:10.5px; color:rgba(8,8,7,.36); letter-spacing:.04em; }

        /* ─── NAV LINKS ─── */
        .nav-ul { display:flex; align-items:center; gap:38px; list-style:none; margin:0; padding:0; }
        .nav-a {
          position:relative; display:block; height:1.15em;
          overflow:hidden; text-decoration:none;
          font-size:10.5px; letter-spacing:.2em; text-transform:uppercase;
        }
        .nt,.nb {
          display:block; line-height:1.15em;
          transition:transform .36s cubic-bezier(.77,0,.175,1);
        }
        .nt { color:rgba(8,8,7,.48); }
        .nb { position:absolute; top:0; left:0; color:var(--gold); transform:translateY(110%); }
        .nav-a:hover .nt { transform:translateY(-110%); }
        .nav-a:hover .nb  { transform:translateY(0); }
        /* Active state */
        .nav-a.on .nt { color:var(--ink); font-weight:500; transform:translateY(-110%); }
        .nav-a.on .nb  { transform:translateY(0); }
        .nav-a.on::after {
          content:''; position:absolute; bottom:-6px; left:50%;
          transform:translateX(-50%);
          width:3px; height:3px; border-radius:50%; background:var(--gold);
        }

        /* ─── RIGHT CONTROLS ─── */
        .nr { display:flex; align-items:center; gap:10px; }
        .nb-cta {
          font-size:10.5px; letter-spacing:.17em; text-transform:uppercase;
          background:var(--ink); color:var(--cream);
          padding:8px 18px; text-decoration:none;
          border:1px solid var(--ink);
          transition:background .2s, color .2s, transform .18s;
          white-space:nowrap; flex-shrink:0;
        }
        .nb-cta:hover { background:transparent; color:var(--ink); transform:translateY(-1px); }

        /* Heart button */
        .hb {
          position:relative; width:38px; height:38px; border-radius:50%;
          border:1.5px solid var(--b); background:var(--cream);
          cursor:pointer; display:flex; align-items:center; justify-content:center;
          outline:none;
          transition:border-color .3s, background .3s, transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
        }
        .hb svg { width:15px; height:15px; stroke:rgba(8,8,7,.5); fill:none; stroke-width:1.7; stroke-linecap:round; transition:stroke .2s, fill .2s, transform .25s; }
        .hb:hover { border-color:var(--crimson); transform:scale(1.12); box-shadow:0 0 0 6px rgba(139,38,53,.07); }
        .hb:hover svg { stroke:var(--crimson); fill:rgba(139,38,53,.1); transform:scale(1.1); }
        .hb.op { border-color:var(--crimson); background:var(--crimson); box-shadow:0 4px 18px rgba(139,38,53,.3); }
        .hb.op svg { stroke:white; fill:rgba(255,255,255,.3); }
        .hbadge {
          position:absolute; top:-4px; right:-4px;
          min-width:16px; height:16px; border-radius:99px;
          background:var(--crimson); border:2px solid var(--cream);
          display:flex; align-items:center; justify-content:center;
          font-size:8.5px; font-weight:600; color:white; padding:0 2px;
          font-family:'DM Sans',sans-serif;
          transition:transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .hb:hover .hbadge { transform:scale(1.18) translateY(-2px); }
        .hb.op .hbadge { background:white; color:var(--crimson); }

        /* Cart button */
        .cb {
          position:relative; width:42px; height:42px;
          border:none; background:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          -webkit-tap-highlight-color:transparent; outline:none; flex-shrink:0;
        }
        .co {
          position:relative; width:38px; height:38px; border-radius:50%;
          border:1.5px solid rgba(8,8,7,.16); background:var(--cream);
          display:flex; align-items:center; justify-content:center;
          transition:border-color .3s, box-shadow .3s, transform .35s cubic-bezier(.34,1.56,.64,1), background .3s;
        }
        .cb:hover .co { border-color:var(--gold); background:var(--ink); transform:scale(1.12); box-shadow:0 0 0 6px rgba(212,168,67,.09), 0 4px 18px rgba(212,168,67,.18); }
        .cb.op .co { border-color:var(--gold); background:var(--gold); transform:scale(1.08); box-shadow:0 4px 22px rgba(212,168,67,.3); }
        .cb.pu .co { animation:cPop .5s cubic-bezier(.34,1.56,.64,1); }
        @keyframes cPop{0%{transform:scale(1)}40%{transform:scale(1.3)}70%{transform:scale(.96)}100%{transform:scale(1)}}
        .ci { width:16px; height:16px; stroke:var(--ink); fill:none; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; transition:stroke .3s, transform .3s; position:relative; z-index:2; }
        .cb:hover .ci,.cb.op .ci { stroke:#f7f6f4; }
        .cb:hover .ci { transform:rotate(-8deg) scale(1.05); }
        .cbadge {
          position:absolute; top:-3px; right:-3px;
          min-width:16px; height:16px; border-radius:99px;
          background:var(--gold); border:2px solid var(--cream);
          display:flex; align-items:center; justify-content:center;
          font-size:8.5px; font-weight:600; color:white; padding:0 2px;
          font-family:'DM Sans',sans-serif;
          transition:transform .3s cubic-bezier(.34,1.56,.64,1), background .3s; z-index:3;
        }
        .cb:hover .cbadge { transform:scale(1.2) translateY(-2px); }
        .cb.op .cbadge { background:white; color:var(--gold); }
        .ct { display:flex; align-items:center; gap:5px; }
        .ct-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; opacity:0; transform:translate(-50%,-50%) scale(0); }
        .cb:hover .ct-dot { animation:tBurst var(--dur,1.2s) var(--delay,0s) infinite ease-out; }
        @keyframes tBurst{0%{opacity:0;transform:translate(-50%,-50%) scale(0)}15%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--dx,0px)),calc(-50% + var(--dy,0px))) scale(1)}}
        .ctt {
          position:absolute; bottom:-36px; left:50%;
          transform:translateX(-50%) translateY(5px);
          white-space:nowrap; background:var(--ink); color:var(--cream);
          font-family:'Caveat',cursive; font-size:12px; padding:4px 9px; border-radius:3px;
          opacity:0; pointer-events:none; transition:opacity .2s, transform .2s; z-index:10;
        }
        .ctt::before { content:''; position:absolute; top:-4px; left:50%; transform:translateX(-50%); border:4px solid transparent; border-bottom-color:var(--ink); }
        .cb:hover .ctt { opacity:1; transform:translateX(-50%) translateY(0); }

        /* Hamburger */
        .hbg { display:none; flex-direction:column; justify-content:center; gap:5px; width:38px; height:38px; cursor:pointer; background:none; border:none; padding:6px; position:relative; -webkit-tap-highlight-color:transparent; }
        .hbg-r { position:absolute; inset:0; border-radius:50%; border:1.5px solid transparent; transition:border-color .3s, transform .38s cubic-bezier(.34,1.56,.64,1); }
        .hbg.op .hbg-r { border-color:var(--gold); transform:rotate(45deg) scale(1.08); }
        .hbg span { display:block; height:1.5px; background:var(--ink); border-radius:2px; transition:transform .3s cubic-bezier(.4,0,.2,1), opacity .2s, width .3s; transform-origin:center; }
        .hbg span:nth-child(2){width:22px}.hbg span:nth-child(3){width:17px}.hbg span:nth-child(4){width:20px}
        .hbg.op span:nth-child(2){transform:translateY(6.5px) rotate(45deg);width:21px}
        .hbg.op span:nth-child(3){opacity:0;transform:scaleX(0)}
        .hbg.op span:nth-child(4){transform:translateY(-6.5px) rotate(-45deg);width:21px}

        /* ─── OVERLAY ─── */
        .ov { position:fixed; inset:0; z-index:290; background:rgba(8,8,7,0); pointer-events:none; transition:background .35s; }
        .ov.op { background:rgba(8,8,7,.46); pointer-events:all; backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); }

        /* ─── PANEL BASE ─── */
        .pnl {
          position:fixed; top:0; right:0; bottom:0; width:min(400px,100vw);
          display:flex; flex-direction:column;
          transform:translateX(100%);
          transition:transform .5s cubic-bezier(.77,0,.175,1);
          box-shadow:-6px 0 50px rgba(8,8,7,.12); overflow:hidden;
        }
        .pnl.op { transform:translateX(0); }
        .p-stripe { height:5px; flex-shrink:0; }
        .p-head { display:flex; align-items:flex-end; justify-content:space-between; padding:20px 26px 16px; border-bottom:1px solid var(--b); flex-shrink:0; }
        .p-title { font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:.08em; color:var(--ink); line-height:1; }
        .p-sub { font-family:'Caveat',cursive; font-size:13px; color:rgba(8,8,7,.35); margin-top:2px; }
        .p-x { width:34px; height:34px; border:1.5px solid var(--b); border-radius:50%; background:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:border-color .2s, background .2s, transform .22s; flex-shrink:0; }
        .p-x svg { width:12px; height:12px; stroke:var(--ink); stroke-width:1.8; stroke-linecap:round; fill:none; transition:stroke .2s; }
        .p-x:hover svg { stroke:white; }

        /* ─── CART PANEL ─── */
        .cpnl { background:var(--cream); z-index:300; }
        .cpnl .p-stripe { background:repeating-linear-gradient(90deg,var(--gold) 0,var(--gold) 20px,#c8502a 20px,#c8502a 40px,var(--ink) 40px,var(--ink) 60px,var(--indigo) 60px,var(--indigo) 80px); }
        .cpnl .p-x:hover { border-color:var(--gold); background:var(--gold); }
        .c-list { flex:1; overflow-y:auto; }
        .c-list::-webkit-scrollbar { width:2px; }
        .c-list::-webkit-scrollbar-thumb { background:rgba(8,8,7,.1); border-radius:99px; }
        .c-row { display:flex; gap:13px; align-items:flex-start; padding:16px 26px; border-bottom:1px solid var(--b); position:relative; transition:background .2s; animation:sIn .35s cubic-bezier(.34,1.2,.64,1) both; }
        @keyframes sIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}
        .c-row:hover { background:rgba(8,8,7,.02); }
        .c-swatch { width:48px; height:60px; border-radius:4px; flex-shrink:0; position:relative; overflow:hidden; }
        .c-swatch::after { content:''; position:absolute; inset:0; background:repeating-linear-gradient(135deg,rgba(255,255,255,.08) 0,rgba(255,255,255,.08) 3px,transparent 3px,transparent 8px); }
        .c-info { flex:1; min-width:0; }
        .c-name { font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:.06em; color:var(--ink); line-height:1.1; }
        .c-var { font-family:'Caveat',cursive; font-size:12px; color:rgba(8,8,7,.4); margin-top:2px; }
        .c-bot { display:flex; align-items:center; justify-content:space-between; margin-top:9px; }
        .c-qty { display:flex; align-items:center; gap:8px; }
        .qb { width:21px; height:21px; border:1px solid var(--b); border-radius:50%; background:none; cursor:pointer; font-size:13px; display:flex; align-items:center; justify-content:center; color:var(--ink); transition:border-color .2s, background .2s, color .2s; }
        .qb:hover { border-color:var(--gold); background:var(--gold); color:white; }
        .qn { font-family:'Bebas Neue',sans-serif; font-size:15px; min-width:13px; text-align:center; }
        .c-price { font-family:'Bebas Neue',sans-serif; font-size:16px; color:var(--gold); }
        .c-rm { position:absolute; top:13px; right:20px; width:18px; height:18px; background:none; border:none; cursor:pointer; opacity:0; transition:opacity .2s, transform .2s; display:flex; align-items:center; justify-content:center; }
        .c-rm svg { width:10px; height:10px; stroke:rgba(8,8,7,.3); stroke-width:1.8; stroke-linecap:round; fill:none; }
        .c-rm:hover svg { stroke:var(--crimson); }
        .c-rm:hover { transform:scale(1.3); }
        .c-row:hover .c-rm { opacity:1; }
        .c-empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:40px 24px; text-align:center; }
        .c-empty-ring { width:52px; height:52px; border:1.5px dashed rgba(8,8,7,.14); border-radius:50%; display:flex; align-items:center; justify-content:center; }
        .c-empty-ring svg { width:20px; height:20px; stroke:rgba(8,8,7,.18); stroke-width:1.4; fill:none; }
        .c-empty-t { font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:.08em; color:rgba(8,8,7,.24); }
        .c-empty-s { font-family:'Caveat',cursive; font-size:13px; color:rgba(8,8,7,.24); }
        .c-foot { flex-shrink:0; border-top:1px solid var(--b); padding:16px 26px 22px; }
        .c-total { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:14px; }
        .c-total-l { font-size:9px; letter-spacing:.2em; text-transform:uppercase; color:rgba(8,8,7,.4); }
        .c-total-v { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:.06em; color:var(--ink); }
        .c-go { display:block; width:100%; padding:14px; text-align:center; background:var(--ink); color:var(--cream); font-size:9.5px; letter-spacing:.22em; text-transform:uppercase; text-decoration:none; border:1.5px solid var(--ink); transition:transform .18s, box-shadow .2s; position:relative; overflow:hidden; cursor:pointer; }
        .c-go::before { content:''; position:absolute; inset:0; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform .38s cubic-bezier(.77,0,.175,1); }
        .c-go:hover::before { transform:scaleX(1); }
        .c-go span { position:relative; z-index:1; }
        .c-go:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(212,168,67,.22); }
        .c-more { display:block; text-align:center; margin-top:9px; font-family:'Caveat',cursive; font-size:13px; color:rgba(8,8,7,.34); text-decoration:none; transition:color .2s; cursor:pointer; border:none; background:none; width:100%; }
        .c-more:hover { color:var(--gold); }

        /* ─── WISHLIST PANEL ─── */
        .wpnl { background:var(--cream); z-index:301; }
        .wpnl .p-stripe { background:repeating-linear-gradient(90deg,var(--crimson) 0,var(--crimson) 20px,rgba(139,38,53,.45) 20px,rgba(139,38,53,.45) 40px,var(--ink) 40px,var(--ink) 60px,rgba(139,38,53,.18) 60px,rgba(139,38,53,.18) 80px); }
        .wpnl .p-x:hover { border-color:var(--crimson); background:var(--crimson); }
        .w-list { flex:1; overflow-y:auto; }
        .w-list::-webkit-scrollbar { width:2px; }
        .w-list::-webkit-scrollbar-thumb { background:rgba(8,8,7,.1); border-radius:99px; }
        .w-row { display:flex; gap:13px; align-items:flex-start; padding:16px 26px; border-bottom:1px solid var(--b); position:relative; transition:background .2s; animation:sIn .35s cubic-bezier(.34,1.2,.64,1) both; }
        .w-row:hover { background:rgba(8,8,7,.02); }
        .w-swatch { width:48px; height:60px; border-radius:4px; flex-shrink:0; position:relative; overflow:hidden; display:flex; align-items:flex-start; justify-content:flex-end; padding:4px; }
        .w-swatch::after { content:''; position:absolute; inset:0; background:repeating-linear-gradient(135deg,rgba(255,255,255,.08) 0,rgba(255,255,255,.08) 3px,transparent 3px,transparent 8px); }
        .w-hico { position:relative; z-index:2; width:12px; height:12px; }
        .w-hico svg { width:100%; height:100%; stroke:rgba(255,255,255,.65); fill:rgba(255,255,255,.3); stroke-width:1.5; }
        .w-info { flex:1; min-width:0; }
        .w-name { font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:.06em; color:var(--ink); line-height:1.1; }
        .w-tag { font-family:'Caveat',cursive; font-size:12px; color:rgba(8,8,7,.38); margin-top:2px; }
        .w-price { font-family:'Bebas Neue',sans-serif; font-size:16px; color:var(--crimson); margin-top:5px; }
        .w-acts { display:flex; gap:6px; margin-top:8px; }
        .w-view { font-size:8.5px; letter-spacing:.16em; text-transform:uppercase; padding:6px 11px; border:1px solid var(--b); background:none; color:var(--ink); text-decoration:none; transition:background .18s, border-color .18s, color .18s; display:inline-block; }
        .w-view:hover { background:var(--ink); color:var(--cream); border-color:var(--ink); }
        .w-rm { font-size:8.5px; letter-spacing:.16em; text-transform:uppercase; padding:6px 11px; border:1px solid var(--b); background:none; color:rgba(8,8,7,.38); cursor:pointer; transition:border-color .18s, color .18s, background .18s; }
        .w-rm:hover { border-color:var(--crimson); color:var(--crimson); background:rgba(139,38,53,.04); }
        .w-empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:40px 24px; text-align:center; }
        .w-empty-ring { width:52px; height:52px; border:1.5px dashed rgba(8,8,7,.14); border-radius:50%; display:flex; align-items:center; justify-content:center; }
        .w-empty-ring svg { width:20px; height:20px; stroke:rgba(8,8,7,.18); stroke-width:1.4; fill:none; }
        .w-empty-t { font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:.08em; color:rgba(8,8,7,.24); }
        .w-empty-s { font-family:'Caveat',cursive; font-size:13px; color:rgba(8,8,7,.24); max-width:180px; }
        .w-foot { flex-shrink:0; border-top:1px solid var(--b); padding:16px 26px 22px; }
        .w-go { display:block; width:100%; padding:14px; text-align:center; background:var(--ink); color:var(--cream); font-size:9.5px; letter-spacing:.22em; text-transform:uppercase; text-decoration:none; border:1.5px solid var(--ink); transition:transform .18s, box-shadow .2s; position:relative; overflow:hidden; }
        .w-go::before { content:''; position:absolute; inset:0; background:var(--crimson); transform:scaleX(0); transform-origin:left; transition:transform .38s cubic-bezier(.77,0,.175,1); }
        .w-go:hover::before { transform:scaleX(1); }
        .w-go span { position:relative; z-index:1; }
        .w-go:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(139,38,53,.2); }
        .w-more { display:block; text-align:center; margin-top:9px; font-family:'Caveat',cursive; font-size:13px; color:rgba(8,8,7,.34); background:none; border:none; cursor:pointer; width:100%; transition:color .2s; }
        .w-more:hover { color:var(--crimson); }

        /* ─── MOBILE DRAWER ─── */
        .drw { position:fixed; inset:0; z-index:299; background:var(--ink); transform:translateX(100%); transition:transform .48s cubic-bezier(.77,0,.175,1); overflow:hidden; display:flex; flex-direction:column; }
        .drw.op { transform:translateX(0); }
        .drw-bg { position:absolute; inset:0; opacity:.055; pointer-events:none; }
        .drw-top { position:absolute; top:0; left:0; right:0; height:4px; background:repeating-linear-gradient(90deg,var(--gold) 0,var(--gold) 18px,#c8502a 18px,#c8502a 36px,#f7f6f4 36px,#f7f6f4 54px,var(--indigo) 54px,var(--indigo) 72px); }
        .drw-c { position:relative; z-index:2; display:flex; flex-direction:column; height:100%; padding:68px 32px 40px; }
        .drw-x { position:absolute; top:18px; right:18px; width:38px; height:38px; border:1.5px solid rgba(247,246,244,.18); border-radius:50%; background:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:border-color .2s, background .2s, transform .28s; z-index:3; }
        .drw-x:hover { border-color:var(--gold); background:var(--gold); transform:rotate(90deg); }
        .drw-x svg { width:13px; height:13px; stroke:rgba(247,246,244,.7); stroke-width:1.8; stroke-linecap:round; fill:none; }
        .drw-links { display:flex; flex-direction:column; list-style:none; margin:0; padding:0; flex:1; }
        .drw-links li { border-bottom:1px solid rgba(247,246,244,.07); overflow:hidden; }
        .drw-links li a { display:flex; align-items:center; justify-content:space-between; font-family:'Bebas Neue',sans-serif; font-size:clamp(36px,9vw,52px); letter-spacing:.05em; color:rgba(247,246,244,.7); text-decoration:none; padding:14px 0; line-height:1; transition:color .22s, letter-spacing .22s, padding-left .22s; }
        .drw-links li a span { font-family:'Caveat',cursive; font-size:12px; color:rgba(247,246,244,.18); transition:color .22s; }
        .drw-links li a:hover,.drw-links li a.on { color:var(--gold); letter-spacing:.09em; padding-left:10px; }
        .drw-links li a:hover span,.drw-links li a.on span { color:var(--gold); opacity:.7; }
        .drw-foot { padding-top:24px; display:flex; flex-direction:column; gap:6px; }
        .drw-email { font-family:'Caveat',cursive; font-size:15px; color:rgba(247,246,244,.3); }
        .drw-copy { font-family:'DM Sans',sans-serif; font-size:9.5px; letter-spacing:.16em; text-transform:uppercase; color:rgba(247,246,244,.18); }

        /* ─── RESPONSIVE ─── */
        @media(max-width:768px){
          .nav-ul,.nb-cta-w{display:none;}
          .hbg{display:flex;}
          .ni{padding:0 18px;}
        }
        @media(min-width:769px){.drw{display:none!important;}}
      `}</style>

      {/* Overlay */}
      <div
        className={`ov${cartOpen || wishOpen ? " op" : ""}`}
        onClick={() => { setCartOpen(false); setWishOpen(false); }}
      />

      {/* ── CART PANEL ── */}
      <div ref={cartRef} className={`pnl cpnl${cartOpen ? " op" : ""}`}>
        <div className="p-stripe" />
        <div className="p-head">
          <div>
            <div className="p-title">YOUR CART</div>
            <div className="p-sub">{totalQty > 0 ? `${totalQty} piece${totalQty !== 1 ? "s" : ""} of the aura` : "nothing here yet"}</div>
          </div>
          <button className="p-x" onClick={() => setCartOpen(false)}>
            <svg viewBox="0 0 14 14"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="c-empty">
            <div className="c-empty-ring"><svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></div>
            <div className="c-empty-t">Bag is empty</div>
            <div className="c-empty-s">Your pieces are waiting →</div>
          </div>
        ) : (
          <div className="c-list">
            {items.map((item, i) => (
              <div key={`${item.slug}-${item.size}`} className="c-row" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="c-swatch" style={{ background: item.color || "#d4a843" }} />
                <div className="c-info">
                  <div className="c-name">{item.name}</div>
                  <div className="c-var">{item.size ? `Size ${item.size}` : item.variant || ""}</div>
                  <div className="c-bot">
                    <div className="c-qty">
                      <button className="qb" onClick={() => updateQty(item.slug, item.size, item.qty - 1)}>−</button>
                      <span className="qn">{item.qty}</span>
                      <button className="qb" onClick={() => { updateQty(item.slug, item.size, item.qty + 1); pulse(); }}>+</button>
                    </div>
                    <div className="c-price">GH₵ {(item.price * item.qty).toLocaleString()}</div>
                  </div>
                </div>
                <button className="c-rm" onClick={() => removeItem(item.slug, item.size)}>
                  <svg viewBox="0 0 12 12"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="c-foot">
            <div className="c-total">
              <span className="c-total-l">Subtotal</span>
              <span className="c-total-v">GH₵ {totalPrice.toLocaleString()}</span>
            </div>
            <Link href="/checkout" className="c-go"><span>Checkout — Secure Your Pieces</span></Link>
            <button className="c-more" onClick={() => setCartOpen(false)}>← continue shopping</button>
          </div>
        )}
      </div>

      {/* ── WISHLIST PANEL ── */}
      <div ref={wishRef} className={`pnl wpnl${wishOpen ? " op" : ""}`}>
        <div className="p-stripe" />
        <div className="p-head">
          <div>
            <div className="p-title">SAVED PIECES</div>
            <div className="p-sub">{wishlistCount > 0 ? `${wishlistCount} piece${wishlistCount !== 1 ? "s" : ""} you love` : "nothing saved yet"}</div>
          </div>
          <button className="p-x" onClick={() => setWishOpen(false)}>
            <svg viewBox="0 0 14 14"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg>
          </button>
        </div>

        {wishlist.length === 0 ? (
          <div className="w-empty">
            <div className="w-empty-ring"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>
            <div className="w-empty-t">Nothing saved yet</div>
            <div className="w-empty-s">Heart pieces you love while browsing the shop</div>
          </div>
        ) : (
          <div className="w-list">
            {wishlist.map((item, i) => (
              <div key={item.slug} className="w-row" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="w-swatch" style={{ background: item.color || "#c8502a" }}>
                  <div className="w-hico"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>
                </div>
                <div className="w-info">
                  <div className="w-name">{item.name}</div>
                  <div className="w-tag">Saved piece</div>
                  <div className="w-price">GH₵ {item.price.toLocaleString()}</div>
                  <div className="w-acts">
                    <Link href={`/shop/${item.slug}`} className="w-view" onClick={() => setWishOpen(false)}>View →</Link>
                    <button className="w-rm" onClick={() => removeFromWishlist(item.slug)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlist.length > 0 && (
          <div className="w-foot">
            <Link href="/shop" className="w-go" onClick={() => setWishOpen(false)}><span>Discover More Pieces</span></Link>
            <button className="w-more" onClick={() => setWishOpen(false)}>← continue browsing</button>
          </div>
        )}
      </div>

      {/* ── NAV ── */}
      <div className="ns">
        <header className={`nv${scrolled ? " sc" : ""}`}>
          <div className="ni">

            {/* Logo */}
            <Link href="/" className="nl" onMouseEnter={() => { setLogoSpin(true); setTimeout(() => setLogoSpin(false), 650); }}>
              <div className="lm">
                <div className={`lr${logoSpin ? " sp" : ""}`} />
                <div className="lmi"><span className="lml">AA</span></div>
              </div>
              <div className="lw">
                <span className="lw1">ANKARA AURA</span>
                <span className="lw2">street luxury</span>
              </div>
            </Link>

            {/* Desktop links */}
            <nav aria-label="Main">
              <ul className="nav-ul">
                {NAV_LINKS.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className={`nav-a${isActive(l.href) ? " on" : ""}`}>
                      <span className="nt">{l.label}</span>
                      <span className="nb">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right */}
            <div className="nr">
              <span className="nb-cta-w">
                <Link href="/shop" className="nb-cta">Shop Now</Link>
              </span>

              {/* Wishlist */}
              <button className={`hb${wishOpen ? " op" : ""}`} onClick={() => { setWishOpen(o => !o); setCartOpen(false); }} aria-label="Wishlist">
                <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                {wishlistCount > 0 && <div className="hbadge">{wishlistCount > 9 ? "9+" : wishlistCount}</div>}
              </button>

              {/* Cart */}
              <button className={`cb${cartOpen ? " op" : ""}${cartPulse ? " pu" : ""}`} onClick={() => { setCartOpen(o => !o); setWishOpen(false); }} aria-label="Cart">
                <div className="co">
                  <div className="ct">
                    {particles.map(p => (
                      <div key={p.id} className="ct-dot" style={{
                        position:"absolute", left:`${p.x}%`, top:`${p.y}%`,
                        width:p.size, height:p.size, background:p.color, borderRadius:"50%",
                        ["--delay" as string]:`${p.delay}s`, ["--dur" as string]:`${p.dur}s`,
                        ["--dx" as string]:`${p.dx}px`, ["--dy" as string]:`${p.dy}px`,
                      } as CSSProperties} />
                    ))}
                  </div>
                  <svg className="ci" viewBox="0 0 24 24">
                    <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                </div>
                {totalQty > 0 && <div className="cbadge">{totalQty > 9 ? "9+" : totalQty}</div>}
                <div className="ctt">{totalQty > 0 ? `${totalQty} in bag` : "your bag"}</div>
              </button>

              {/* Hamburger */}
              <button className={`hbg${menuOpen ? " op" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
                <div className="hbg-r" />
                <span /><span /><span />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <nav className={`drw${menuOpen ? " op" : ""}`} aria-hidden={!menuOpen}>
        <div className="drw-top" />
        <div className="drw-bg" aria-hidden>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="drw-p" width="72" height="72" patternUnits="userSpaceOnUse">
                <polygon points="36,3 69,36 36,69 3,36" fill="none" stroke="#d4a843" strokeWidth="1"/>
                <polygon points="36,16 56,36 36,56 16,36" fill="none" stroke="#d4a843" strokeWidth=".6"/>
                <circle cx="3" cy="3" r="2" fill="#d4a843"/>
                <circle cx="69" cy="3" r="2" fill="#d4a843"/>
                <circle cx="3" cy="69" r="2" fill="#1a3a5c"/>
                <circle cx="69" cy="69" r="2" fill="#2d6a4f"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#drw-p)"/>
          </svg>
        </div>
        <div className="drw-c">
          <button className="drw-x" onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 14 14"><line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/></svg>
          </button>
          <ul className="drw-links">
            {NAV_LINKS.map((l, i) => (
              <li key={l.href}>
                <Link href={l.href} className={isActive(l.href) ? "on" : ""} onClick={() => setMenuOpen(false)}>
                  {l.label}
                  <span>0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="drw-foot">
            <div className="drw-email">ankaraauragh@gmail.com</div>
            <div className="drw-copy">© {new Date().getFullYear()} Ankara Aura · Street Luxury</div>
          </div>
        </div>
      </nav>
    </>
  );
}
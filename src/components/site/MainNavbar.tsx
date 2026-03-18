"use client";

import { useEffect, useState } from "react";
import BrandLogo from "@/components/site/BrandLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MAIN_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/shop", label: "Shop" },
  { href: "/customize", label: "Customize" },
  { href: "/contact", label: "Contact" },
];

export default function MainNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        :root { --ink:#0b0b0a; --cream:#f7f6f4; --gold:#d4a843; --clay:#c8502a; --indigo:#1a3a5c; --line:rgba(11,11,10,.1); --nav-h:72px; }
        .aa-brand { display:inline-flex; align-items:center; gap:12px; text-decoration:none; color:inherit; }
        .aa-brand__mark { position:relative; width:38px; height:38px; flex-shrink:0; }
        .aa-brand__core { position:absolute; inset:0; border-radius:8px; display:grid; place-items:center; background:var(--ink); color:var(--cream); font:400 14px 'Bebas Neue',sans-serif; letter-spacing:.08em; z-index:2; }
        .aa-brand__core::before { content:''; position:absolute; inset:-1px; border-radius:9px; z-index:-1; background:linear-gradient(135deg,var(--gold),var(--clay),var(--indigo),var(--gold)); }
        .aa-brand__ring { position:absolute; inset:-5px; border-radius:12px; border:1.5px dashed rgba(200,80,42,.28); transition:transform .55s cubic-bezier(.34,1.56,.64,1), border-color .2s ease; }
        .aa-brand:hover .aa-brand__ring { transform:rotate(90deg); border-color:var(--gold); }
        .aa-brand__wordmark { display:flex; flex-direction:column; }
        .aa-brand__wordmark strong { font:400 21px 'Bebas Neue',sans-serif; letter-spacing:.12em; line-height:1; }
        .aa-brand__wordmark span { font:500 10px 'DM Sans',sans-serif; letter-spacing:.18em; text-transform:uppercase; color:rgba(11,11,10,.42); }
        .aa-brand--light { color:var(--cream); }
        .aa-brand--light .aa-brand__wordmark span { color:rgba(247,246,244,.55); }
        .main-nav-wrap { position:sticky; top:0; z-index:150; }
        .main-nav { min-height:var(--nav-h); border-bottom:1px solid transparent; background:rgba(247,246,244,.85); backdrop-filter:blur(18px); transition:background .25s ease, border-color .25s ease, box-shadow .25s ease; }
        .main-nav--scrolled { background:rgba(247,246,244,.96); border-color:var(--line); box-shadow:0 14px 32px rgba(11,11,10,.06); }
        .main-nav__inner { width:min(1220px, calc(100% - 32px)); margin:0 auto; min-height:var(--nav-h); display:flex; align-items:center; justify-content:space-between; gap:24px; }
        .main-nav__links, .main-nav__actions { display:flex; align-items:center; gap:22px; }
        .main-nav__links a, .main-nav__drawer a { position:relative; text-decoration:none; color:rgba(11,11,10,.54); font:500 10px 'DM Sans',sans-serif; letter-spacing:.18em; text-transform:uppercase; }
        .main-nav__links a::after, .main-nav__drawer a::after { content:''; position:absolute; left:0; bottom:-8px; width:100%; height:1px; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform .2s ease; }
        .main-nav__links a:hover, .main-nav__links a.is-active, .main-nav__drawer a:hover, .main-nav__drawer a.is-active { color:var(--ink); }
        .main-nav__links a:hover::after, .main-nav__links a.is-active::after, .main-nav__drawer a:hover::after, .main-nav__drawer a.is-active::after { transform:scaleX(1); }
        .main-nav__label { font:500 10px 'DM Sans',sans-serif; letter-spacing:.18em; text-transform:uppercase; color:rgba(11,11,10,.35); }
        .main-nav__cta { display:inline-flex; align-items:center; justify-content:center; min-height:40px; padding:0 18px; text-decoration:none; border:1px solid var(--ink); background:var(--ink); color:var(--cream); font:500 10px 'DM Sans',sans-serif; letter-spacing:.18em; text-transform:uppercase; transition:transform .2s ease, background .2s ease, color .2s ease; }
        .main-nav__cta:hover { transform:translateY(-1px); background:transparent; color:var(--ink); }
        .main-nav__toggle { display:none; width:42px; height:42px; border-radius:50%; border:1px solid var(--line); background:transparent; }
        .main-nav__toggle span { display:block; width:18px; height:1.5px; margin:4px auto; background:var(--ink); transition:transform .2s ease, opacity .2s ease; }
        .main-nav__toggle.is-open span:nth-child(1) { transform:translateY(5.5px) rotate(45deg); }
        .main-nav__toggle.is-open span:nth-child(2) { opacity:0; }
        .main-nav__toggle.is-open span:nth-child(3) { transform:translateY(-5.5px) rotate(-45deg); }
        .main-nav__drawer { position:fixed; inset:calc(var(--nav-h) + 12px) 16px auto; padding:22px; border:1px solid var(--line); background:rgba(247,246,244,.98); box-shadow:0 30px 70px rgba(11,11,10,.14); opacity:0; pointer-events:none; transform:translateY(-10px); transition:opacity .22s ease, transform .22s ease; }
        .main-nav__drawer.is-open { opacity:1; pointer-events:auto; transform:translateY(0); }
        .main-nav__drawer nav { display:grid; gap:14px; }
        .main-nav__drawer p { margin:16px 0; color:rgba(11,11,10,.56); line-height:1.6; font-size:14px; }
        @media (max-width: 980px) {
          .main-nav__links, .main-nav__actions { display:none; }
          .main-nav__toggle { display:inline-block; }
        }
        @media (min-width: 981px) { .main-nav__drawer { display:none; } }
      `}</style>
      <header className="main-nav-wrap">
        <div className={`main-nav${scrolled ? " main-nav--scrolled" : ""}`}>
          <div className="main-nav__inner">
            <BrandLogo subtitle="Placeholder logo mark" />
            <nav className="main-nav__links" aria-label="Homepage navigation">
              {MAIN_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={isActive(link.href) ? "is-active" : undefined}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="main-nav__actions">
              <span className="main-nav__label">Clean brand experience</span>
              <Link href="/shop" className="main-nav__cta">Enter shop</Link>
            </div>
            <button type="button" className={`main-nav__toggle${menuOpen ? " is-open" : ""}`} aria-label="Toggle menu" onClick={() => setMenuOpen((value) => !value)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>
      <div className={`main-nav__drawer${menuOpen ? " is-open" : ""}`}>
        <nav>
          {MAIN_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={isActive(link.href) ? "is-active" : undefined} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <p>The homepage stays minimal and premium, while the full shopping experience lives separately inside the shop.</p>
        <Link href="/shop" className="main-nav__cta" onClick={() => setMenuOpen(false)}>Enter shop</Link>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MAIN_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/customize", label: "Customize" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MainNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  const isActive = (href: string) => href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ink:#0b0b0a; --cream:#f7f6f4; --gold:#d4a843; --indigo:#1a3a5c; --clay:#c8502a;
          --border:rgba(8,8,7,0.09); --nav-h:62px;
        }
        .main-shell { position:sticky; top:0; z-index:200; }
        .main-nav {
          height:var(--nav-h); border-bottom:1px solid var(--border); background:rgba(247,246,244,.96);
          backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
          transition:box-shadow .3s, border-color .3s, background .3s;
        }
        .main-nav.sc {
          background:rgba(247,246,244,1);
          box-shadow:0 1px 0 rgba(8,8,7,0.08), 0 4px 32px rgba(8,8,7,0.07);
          border-bottom-color:rgba(8,8,7,0.13);
        }
        .main-inner {
          max-width:1200px; margin:0 auto; padding:0 36px; height:var(--nav-h); display:flex; align-items:center; justify-content:space-between; gap:28px;
        }
        .main-logo { display:flex; align-items:center; gap:11px; text-decoration:none; flex-shrink:0; }
        .main-mark { position:relative; width:36px; height:36px; flex-shrink:0; }
        .main-mark__inner {
          position:absolute; inset:0; background:var(--ink); border-radius:7px; display:flex; align-items:center; justify-content:center; z-index:2;
        }
        .main-mark__inner::before {
          content:''; position:absolute; inset:-1px; border-radius:8px; z-index:-1;
          background:linear-gradient(135deg,var(--gold),var(--clay),var(--indigo),var(--gold));
        }
        .main-mark__text { font-family:'Bebas Neue',sans-serif; font-size:14px; letter-spacing:.06em; color:var(--cream); }
        .main-mark__ring {
          position:absolute; inset:-5px; border-radius:11px; border:1.5px dashed rgba(200,80,42,.28); z-index:1;
          transition:transform .65s cubic-bezier(.34,1.56,.64,1), border-color .3s, border-style .3s;
        }
        .main-mark__ring::before, .main-mark__ring::after {
          content:''; position:absolute; width:3px; height:3px; border-radius:50%; background:var(--gold);
        }
        .main-mark__ring::before { top:-1.5px; left:-1.5px; }
        .main-mark__ring::after { bottom:-1.5px; right:-1.5px; }
        .main-logo:hover .main-mark__ring { transform:rotate(90deg); border-color:var(--gold); border-style:solid; }
        .main-word { display:flex; flex-direction:column; }
        .main-word strong {
          font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:.13em; color:var(--ink); line-height:1;
        }
        .main-word span { font-family:'Caveat',cursive; font-size:10.5px; color:rgba(8,8,7,.36); letter-spacing:.04em; }
        .main-links { display:flex; align-items:center; gap:32px; }
        .main-links a, .main-menu a {
          position:relative; color:rgba(8,8,7,.48); text-decoration:none; text-transform:uppercase; letter-spacing:.18em; font-size:10.5px;
          padding:10px 0; transition:color .2s ease;
        }
        .main-links a::after, .main-menu a::after {
          content:''; position:absolute; left:0; bottom:6px; width:100%; height:1px; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform .22s ease;
        }
        .main-links a:hover, .main-menu a:hover, .main-links a.on, .main-menu a.on { color:var(--ink); }
        .main-links a:hover::after, .main-menu a:hover::after, .main-links a.on::after, .main-menu a.on::after { transform:scaleX(1); }
        .main-actions { display:flex; align-items:center; gap:10px; }
        .main-note { color:rgba(8,8,7,.4); font-size:10px; letter-spacing:.15em; text-transform:uppercase; }
        .main-cta {
          font-size:10.5px; letter-spacing:.17em; text-transform:uppercase; background:var(--ink); color:var(--cream);
          padding:8px 18px; text-decoration:none; border:1px solid var(--ink); transition:background .2s, color .2s, transform .18s;
        }
        .main-cta:hover { background:transparent; color:var(--ink); transform:translateY(-1px); }
        .main-toggle {
          display:none; width:40px; height:40px; border-radius:50%; border:1px solid rgba(8,8,7,.12); background:var(--cream); cursor:pointer;
        }
        .main-toggle span { display:block; width:16px; height:1.5px; background:var(--ink); margin:4px auto; transition:transform .22s ease, opacity .22s ease; }
        .main-toggle.open span:nth-child(1) { transform:translateY(5.5px) rotate(45deg); }
        .main-toggle.open span:nth-child(2) { opacity:0; }
        .main-toggle.open span:nth-child(3) { transform:translateY(-5.5px) rotate(-45deg); }
        .main-drawer {
          position:fixed; inset:var(--nav-h) 16px auto; padding:22px; border-radius:26px; background:rgba(247,246,244,.98); border:1px solid rgba(8,8,7,.1);
          box-shadow:0 24px 80px rgba(11,11,10,.12); opacity:0; pointer-events:none; transform:translateY(-12px); transition:opacity .22s ease, transform .22s ease;
        }
        .main-drawer.open { opacity:1; pointer-events:auto; transform:translateY(0); }
        .main-menu { display:grid; gap:10px; margin-bottom:16px; }
        .main-drawer p { color:rgba(8,8,7,.54); font-size:14px; line-height:1.6; margin-bottom:16px; }
        @media (max-width: 980px) {
          .main-links, .main-actions { display:none; }
          .main-toggle { display:inline-block; }
          .main-inner { padding:0 20px; }
        }
        @media (min-width: 981px) {
          .main-drawer { display:none; }
        }
      `}</style>

      <header className="main-shell">
        <div className={`main-nav${scrolled ? " sc" : ""}`}>
          <div className="main-inner">
            <Link href="/" className="main-logo" aria-label="Ankara Aura home">
              <span className="main-mark" aria-hidden>
                <span className="main-mark__inner"><span className="main-mark__text">AA</span></span>
                <span className="main-mark__ring" />
              </span>
              <span className="main-word">
                <strong>Ankara Aura</strong>
                <span>logo svg can drop in here later</span>
              </span>
            </Link>

            <nav className="main-links" aria-label="Main navigation">
              {MAIN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive(link.href) ? "on" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="main-actions">
              <span className="main-note">Editorial site</span>
              <Link href="/shop" className="main-cta">Enter Shop</Link>
            </div>

            <button
              type="button"
              className={`main-toggle${menuOpen ? " open" : ""}`}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`main-drawer${menuOpen ? " open" : ""}`}>
        <nav className="main-menu" aria-label="Mobile navigation">
          {MAIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? "on" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p>
          The main site keeps the story clean. Step into the shop when you want the full browse, wishlist, cart, and customization flow.
        </p>
        <Link href="/shop" className="main-cta" onClick={() => setMenuOpen(false)}>Enter Shop</Link>
      </div>
    </>
  );
}

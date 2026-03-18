"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MAIN_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MainNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --mn-cream:#f7f6f4;
          --mn-ink:#0b0b0a;
          --mn-gold:#d4a843;
          --mn-border:rgba(11,11,10,.12);
        }

        .main-nav {
          position: sticky;
          top: 0;
          z-index: 70;
          backdrop-filter: blur(18px);
          background: rgba(247,246,244,.82);
          border-bottom: 1px solid transparent;
          transition: border-color .25s ease, background .25s ease, box-shadow .25s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .main-nav.is-scrolled {
          border-color: var(--mn-border);
          box-shadow: 0 14px 40px rgba(11,11,10,.06);
        }
        .main-nav__inner {
          width: min(1240px, calc(100% - 32px));
          margin: 0 auto;
          min-height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .main-nav__brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--mn-ink);
          text-decoration: none;
        }
        .main-nav__seal {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          border: 1px solid rgba(11,11,10,.14);
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 30% 30%, rgba(212,168,67,.32), transparent 55%),
            linear-gradient(135deg, rgba(255,255,255,.98), rgba(247,246,244,.88));
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: .08em;
          font-size: 18px;
        }
        .main-nav__wordmark {
          display: flex;
          flex-direction: column;
          line-height: .9;
        }
        .main-nav__wordmark strong {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 25px;
          letter-spacing: .12em;
          font-weight: 400;
        }
        .main-nav__wordmark span {
          font-size: 10px;
          letter-spacing: .28em;
          text-transform: uppercase;
          color: rgba(11,11,10,.48);
        }
        .main-nav__links,
        .main-nav__actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .main-nav__links a,
        .main-nav__menu-links a {
          position: relative;
          color: rgba(11,11,10,.64);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: .18em;
          font-size: 11px;
          padding: 10px 2px;
          transition: color .2s ease;
        }
        .main-nav__links a::after,
        .main-nav__menu-links a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 2px;
          width: 100%;
          height: 1px;
          background: var(--mn-gold);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .22s ease;
        }
        .main-nav__links a:hover,
        .main-nav__menu-links a:hover,
        .main-nav__links a.is-active,
        .main-nav__menu-links a.is-active {
          color: var(--mn-ink);
        }
        .main-nav__links a:hover::after,
        .main-nav__menu-links a:hover::after,
        .main-nav__links a.is-active::after,
        .main-nav__menu-links a.is-active::after {
          transform: scaleX(1);
        }
        .main-nav__note {
          color: rgba(11,11,10,.46);
          font-size: 11px;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .main-nav__cta,
        .main-nav__menu-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 18px;
          border-radius: 999px;
          background: var(--mn-ink);
          color: var(--mn-cream);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: .16em;
          font-size: 10px;
          border: 1px solid var(--mn-ink);
          transition: transform .2s ease, background .2s ease, color .2s ease;
        }
        .main-nav__cta:hover,
        .main-nav__menu-cta:hover {
          transform: translateY(-1px);
          background: transparent;
          color: var(--mn-ink);
        }
        .main-nav__menu-btn {
          display: none;
          width: 46px;
          height: 46px;
          border-radius: 999px;
          border: 1px solid var(--mn-border);
          background: rgba(255,255,255,.7);
          cursor: pointer;
          color: var(--mn-ink);
        }
        .main-nav__menu-btn span {
          display: block;
          width: 18px;
          height: 1.5px;
          margin: 4px auto;
          background: currentColor;
          transition: transform .22s ease, opacity .22s ease;
        }
        .main-nav__menu-btn.is-open span:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
        .main-nav__menu-btn.is-open span:nth-child(2) { opacity: 0; }
        .main-nav__menu-btn.is-open span:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }
        .main-nav__menu {
          position: fixed;
          inset: 78px 16px auto;
          padding: 22px;
          border-radius: 28px;
          border: 1px solid var(--mn-border);
          background: rgba(247,246,244,.98);
          box-shadow: 0 24px 80px rgba(11,11,10,.12);
          opacity: 0;
          pointer-events: none;
          transform: translateY(-12px);
          transition: opacity .22s ease, transform .22s ease;
        }
        .main-nav__menu.is-open {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
        .main-nav__menu-links {
          display: grid;
          gap: 8px;
          margin-bottom: 18px;
        }
        .main-nav__menu-links a {
          font-size: 13px;
          padding: 10px 0;
        }
        .main-nav__menu-meta {
          margin-bottom: 18px;
          color: rgba(11,11,10,.55);
          font-size: 14px;
          line-height: 1.5;
        }
        @media (max-width: 900px) {
          .main-nav__links,
          .main-nav__actions {
            display: none;
          }
          .main-nav__menu-btn {
            display: inline-block;
          }
        }
        @media (min-width: 901px) {
          .main-nav__menu {
            display: none;
          }
        }
      `}</style>

      <header className={`main-nav${scrolled ? " is-scrolled" : ""}`}>
        <div className="main-nav__inner">
          <Link href="/" className="main-nav__brand" aria-label="Ankara Aura home">
            <span className="main-nav__seal" aria-hidden>AA</span>
            <span className="main-nav__wordmark">
              <strong>Ankara Aura</strong>
              <span>Accra · Ghana</span>
            </span>
          </Link>

          <nav className="main-nav__links" aria-label="Primary">
            {MAIN_LINKS.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href} className={active ? "is-active" : undefined} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="main-nav__actions">
            <span className="main-nav__note">Editorial home experience</span>
            <Link href="/shop" className="main-nav__cta">Enter Shop</Link>
          </div>

          <button
            type="button"
            className={`main-nav__menu-btn${menuOpen ? " is-open" : ""}`}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`main-nav__menu${menuOpen ? " is-open" : ""}`}>
        <nav className="main-nav__menu-links" aria-label="Mobile navigation">
          {MAIN_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={active ? "is-active" : undefined} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <p className="main-nav__menu-meta">
          Browse the main Ankara Aura story first, then jump into the full shopping experience when you&apos;re ready.
        </p>
        <Link href="/shop" className="main-nav__menu-cta" onClick={() => setMenuOpen(false)}>Enter Shop</Link>
      </div>
    </>
  );
}

import { link } from "fs";
import Link from "next/link";

/* ── Ankara tile — same as hero for visual consistency ── */
function AnkaraPattern({ id = "fp", opacity = 0.06 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
          <rect x="0.5" y="0.5" width="63" height="63" fill="none" stroke="#000" strokeWidth="0.8" />
          <polygon points="32,2 62,32 32,62 2,32" fill="none" stroke="#000" strokeWidth="1" />
          <polygon points="0,0 20,0 0,20" fill="#000" opacity="0.13" />
          <polygon points="64,0 44,0 64,20" fill="#000" opacity="0.13" />
          <polygon points="0,64 20,64 0,44" fill="#000" opacity="0.13" />
          <polygon points="64,64 44,64 64,44" fill="#000" opacity="0.13" />
          <line x1="32" y1="2" x2="32" y2="62" stroke="#000" strokeWidth="0.5" opacity="0.25" />
          <line x1="2" y1="32" x2="62" y2="32" stroke="#000" strokeWidth="0.5" opacity="0.25" />
          <polygon points="32,18 46,32 32,46 18,32" fill="none" stroke="#000" strokeWidth="0.8" />
          <circle cx="32" cy="32" r="3" fill="#000" opacity="0.18" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

const footerLinks = [
  { href: "/shop",      label: "Shop" },
  { href: "/customize", label: "Customize" },
  { href: "/about",     label: "About" },
  { href: "/contact",   label: "Contact" },
];

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400&display=swap');

        .footer {
          position: relative;
          overflow: hidden;
          background: #0b0b0a;
          color: #f7f6f4;
          font-family: 'DM Sans', sans-serif;
          border-top: 1px solid rgba(8,8,7,0.15);
        }
        .footer-bg { pointer-events: none; }

        /* ── top big brand mark ── */
        .footer-brand {
          position: relative;
          z-index: 2;
          border-bottom: 1px solid rgba(247,246,244,0.08);
          padding: 52px 32px 48px;
          max-width: 1160px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: end;
        }
        .footer-wordmark {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 8vw, 96px);
          line-height: 0.88;
          letter-spacing: -0.01em;
          -webkit-text-stroke: 1.5px rgba(247,246,244,0.7);
          color: transparent;
        }
        .footer-tagline {
          font-family: 'Caveat', cursive;
          font-size: clamp(18px, 2.5vw, 26px);
          color: rgba(247,246,244,0.5);
          margin-top: 12px;
        }
        .footer-right-top {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: flex-end;
        }
        .footer-email-label {
          font-family: 'Caveat', cursive;
          font-size: 13px;
          color: rgba(247,246,244,0.35);
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .footer-email {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 0.1em;
          color: rgba(247,246,244,0.85);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-email:hover { color: #f7f6f4; }

        /* ── nav row ── */
        .footer-nav {
          position: relative;
          z-index: 2;
          max-width: 1160px;
          margin: 0 auto;
          padding: 32px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          border-bottom: 1px solid rgba(247,246,244,0.08);
        }
        .footer-nav-links {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
          list-style: none;
          margin: 0; padding: 0;
        }
        .footer-nav-links a {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(247,246,244,0.45);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-nav-links a:hover { color: #f7f6f4; }
        .footer-social {
          display: flex;
          gap: 16px;
        }
        .footer-social a {
          width: 34px; height: 34px;
          border: 1px solid rgba(247,246,244,0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          text-decoration: none;
          color: rgba(247,246,244,0.5);
          transition: border-color 0.2s, color 0.2s, transform 0.18s;
        }
        .footer-social a:hover { border-color: rgba(247,246,244,0.6); color: #f7f6f4; transform: translateY(-2px); }

        /* ── bottom bar ── */
        .footer-bottom {
          position: relative;
          z-index: 2;
          max-width: 1160px;
          margin: 0 auto;
          padding: 20px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-copy {
          font-family: 'Caveat', cursive;
          font-size: 14px;
          color: rgba(247,246,244,0.3);
        }
        .footer-made {
          font-family: 'Caveat', cursive;
          font-size: 14px;
          color: rgba(247,246,244,0.25);
        }

        @media (max-width: 768px) {
          .footer-brand { grid-template-columns: 1fr; gap: 24px; padding: 40px 20px 36px; }
          .footer-right-top { align-items: flex-start; }
          .footer-nav { padding: 24px 20px; }
          .footer-bottom { padding: 16px 20px; }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-bg">
          <AnkaraPattern id="fp-main" opacity={0.06} />
        </div>

        {/* brand row */}
        <div className="footer-brand">
          <div>
            <div className="footer-wordmark">ANKARA<br />AURA</div>
            <div className="footer-tagline">street luxury, cultural texture.</div>
          </div>
          <div className="footer-right-top">
            <div>
              <p className="footer-email-label">reach us →</p>
              <a href="mailto:ankaraauragh@gmail.com" className="footer-email">
                ANKARAAURAGH@GMAIL.COM
              </a>
            </div>
            <Link
              href="/shop"
              style={{
                display: "inline-block",
                background: "#f7f6f4",
                color: "#0b0b0a",
                padding: "11px 28px",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid #f7f6f4",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* nav + social */}
        <div className="footer-nav">
          <ul className="footer-nav-links">
            {footerLinks.map(l => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">✦</a>
            <a href="https://twitter.com"   target="_blank" rel="noopener noreferrer" aria-label="Twitter">𝕏</a>
            <a href="https://tiktok.com"    target="_blank" rel="noopener noreferrer" aria-label="TikTok">◈</a>
          </div>
        </div>

        {/* bottom */}
        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} Ankara Aura. All rights reserved.</span>
          <span className="footer-made">Made by PremStudio., Ghana 🇬🇭</span>
        </div>
      </footer>
    </>
  );
}
"use client";

import { useEffect, useState } from "react";
import AuraButton from "@/components/ui/AuraButton";

/** Animated Ankara SVG — tiles rotate & pulse via CSS */
function AnkaraPatternAnimated({
  id = "ap",
  opacity = 0.1,
  animate = true,
}: {
  id?: string;
  opacity?: number;
  animate?: boolean;
}) {
  return (
    <>
      {animate && (
        <style>{`
          @keyframes ankara-spin-${id} {
            0%   { transform-origin: 32px 32px; transform: rotate(0deg); }
            100% { transform-origin: 32px 32px; transform: rotate(360deg); }
          }
          @keyframes ankara-pulse-${id} {
            0%,100% { opacity: 0.55; }
            50%      { opacity: 1; }
          }
          #${id}-inner-diamond { animation: ankara-spin-${id} 18s linear infinite; }
          #${id}-center-dot { animation: ankara-pulse-${id} 3s ease-in-out infinite; }
          #${id}-outer-diamond { animation: ankara-spin-${id} 30s linear infinite reverse; }
        `}</style>
      )}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}
        aria-hidden="true"
      >
        <defs>
          <pattern id={id} x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
            <rect x="0.5" y="0.5" width="63" height="63" fill="none" stroke="#000" strokeWidth="0.8" />
            <g id={`${id}-outer-diamond`}>
              <polygon points="32,2 62,32 32,62 2,32" fill="none" stroke="#000" strokeWidth="1" />
            </g>

            <polygon points="0,0 20,0 0,20" fill="#000" opacity="0.13" />
            <polygon points="64,0 44,0 64,20" fill="#000" opacity="0.13" />
            <polygon points="0,64 20,64 0,44" fill="#000" opacity="0.13" />
            <polygon points="64,64 44,64 64,44" fill="#000" opacity="0.13" />

            <line x1="32" y1="2" x2="32" y2="62" stroke="#000" strokeWidth="0.5" opacity="0.2" />
            <line x1="2" y1="32" x2="62" y2="32" stroke="#000" strokeWidth="0.5" opacity="0.2" />

            <g id={`${id}-inner-diamond`}>
              <polygon points="32,18 46,32 32,46 18,32" fill="none" stroke="#000" strokeWidth="0.9" />
            </g>

            <circle cx="32" cy="2" r="1.5" fill="#000" opacity="0.2" />
            <circle cx="62" cy="32" r="1.5" fill="#000" opacity="0.2" />
            <circle cx="32" cy="62" r="1.5" fill="#000" opacity="0.2" />
            <circle cx="2" cy="32" r="1.5" fill="#000" opacity="0.2" />

            <circle id={`${id}-center-dot`} cx="32" cy="32" r="3" fill="#000" opacity="0.18" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </>
  );
}

export default function Hero() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(t);
  }, []);
  const on = (d: number) => (show ? `on d${d}` : "");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400&display=swap');

        :root {
          --bg:   #ffffff;
          --ink:  #0b0b0a;
          --mid:  rgba(11,11,10,0.44);
          --rule: rgba(11,11,10,0.1);
          --hw:   'Caveat', cursive;
        }

        .h { position: relative; background: var(--bg); color: var(--ink); overflow: hidden; border-bottom: 1px solid var(--rule); font-family: 'DM Sans', sans-serif; }
        .h-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }

        .ghost {
          position: absolute; pointer-events: none; user-select: none; z-index: 1;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(120px,17vw,220px);
          line-height: 0.86; letter-spacing: -0.02em;
          -webkit-text-stroke: 1.2px rgba(11,11,10,0.08);
          color: transparent; white-space: nowrap;
        }

        .tw { overflow:hidden; border-bottom:1px solid var(--rule); padding:10px 0; position:relative; z-index:3; }
        @keyframes tick { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .tr { display:flex; width:max-content; animation:tick 26s linear infinite; }
        .ti { font-family:var(--hw); font-size:15px; color:var(--ink); opacity:0.38; padding:0 28px; white-space:nowrap; }
        .td { display:inline-block; width:4px; height:4px; background:var(--ink); border-radius:50%; vertical-align:middle; margin:0 6px; opacity:0.25; }

        .hi { position:relative; z-index:2; max-width:1160px; margin:0 auto; padding:0 32px; }

        .ew { display:flex; align-items:center; padding:28px 0 0; }
        .ew-text { font-family:var(--hw); font-size:16px; color:var(--mid); }
        .ew-rule { flex:1; height:1px; background:var(--rule); margin:0 16px; }

        .hg { display: grid; grid-template-columns: 1fr 1fr; min-height: 580px; margin-top: 32px; border: 1px solid var(--rule); }
        .hl { padding: 52px 48px 52px 0; border-right: 1px solid var(--rule); display: flex; flex-direction: column; justify-content: space-between; gap: 30px; }

        .hd-fill, .hd-stroke {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(96px, 13vw, 174px);
          line-height: 0.85;
          letter-spacing: -0.01em;
          display: block;
        }
        .hd-fill { color: var(--ink); }
        .hd-stroke { -webkit-text-stroke: 2.5px var(--ink); color: transparent; }

        .hd-sub {
          font-family: var(--hw);
          font-size: clamp(20px, 2.8vw, 30px);
          color: var(--mid);
          font-weight: 500;
          display: block;
          margin-top: 14px;
          line-height: 1.3;
        }

        .hbody { font-family: var(--hw); font-size: 19px; line-height: 1.65; color: var(--mid); max-width: 340px; font-weight: 500; }
        .cr { display:flex; align-items:center; gap:18px; flex-wrap:wrap; }

        .hright { position: relative; overflow: hidden; background: #ffffff; display: flex; flex-direction: column; justify-content: flex-end; }

        .hr-label {
          position:absolute; top:24px; left:24px; z-index:4;
          background:var(--ink); color:#fff; padding:14px 18px;
        }
        .hr-label-sub { margin:0; font-family:var(--hw); font-size:13px; opacity:0.55; }
        .hr-label-main { margin:5px 0 0; font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:0.04em; line-height:1.1; }

        .hr-ph { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:2; }
        .hr-ph-inner { display:flex; flex-direction:column; align-items:center; gap:10px; }
        .hr-ph-big {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(56px,8vw,100px);
          -webkit-text-stroke:1.5px rgba(0,0,0,0.1);
          color:transparent; line-height:0.9; text-align:center;
          letter-spacing:-0.02em;
        }
        .hr-ph-hw { font-family:var(--hw); font-size:16px; color:rgba(0,0,0,0.22); }

        .hr-strip {
          position:relative; z-index:4;
          border-top:1px solid var(--rule);
          background:#fff;
          padding:18px 24px;
          display:flex; align-items:center; justify-content:space-between;
          gap: 14px;
        }
        .strip-lbl { font-family:var(--hw); font-size:15px; color:var(--mid); margin-bottom:3px; }
        .strip-price { font-family:'Bebas Neue',sans-serif; font-size:30px; line-height:1; letter-spacing:0.02em; }

        .hstats {
          display:grid; grid-template-columns:repeat(4,1fr);
          border-left:1px solid var(--rule);
          border-right:1px solid var(--rule);
          border-bottom:1px solid var(--rule);
          margin-bottom:40px;
        }
        .hstat { padding:20px 24px; border-right:1px solid var(--rule); }
        .hstat:last-child { border-right:none; }
        .hstat-n { font-family:'Bebas Neue',sans-serif; font-size:36px; line-height:1; }
        .hstat-l { font-family:var(--hw); font-size:15px; color:var(--mid); margin-top:2px; }

        @keyframes up  { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rin { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fin { from{opacity:0} to{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }

        .a  { opacity:0; } .a.on  { animation:up  0.9s cubic-bezier(0.16,1,0.3,1) forwards; }
        .ar { opacity:0; } .ar.on { animation:rin 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }
        .af { opacity:0; } .af.on { animation:fin 1s ease forwards; }
        .d1{animation-delay:.06s} .d2{animation-delay:.16s} .d3{animation-delay:.27s}
        .d4{animation-delay:.38s} .d5{animation-delay:.50s} .d6{animation-delay:.62s} .d7{animation-delay:.74s}
        .floater { animation:float 7s ease-in-out infinite; }

        @media (max-width: 900px) {
          .hg { grid-template-columns: 1fr; }
          .hl { border-right: none; border-bottom: 1px solid var(--rule); padding: 40px 0; }
          .hright { min-height: 400px; }
          .hstats { grid-template-columns: repeat(2,1fr); }
          .ghost { display: none; }
        }
        @media (max-width: 600px) {
          .hi { padding: 0 20px; }
          .tw { display: none; }
        }
      `}</style>

      <section className="h">
        <div className="h-bg">
          <AnkaraPatternAnimated id="ap-main" opacity={0.1} animate />
        </div>

        <div className="ghost" style={{ top: "-14px", left: "-6px" }}>ANKARA</div>
        <div className="ghost" style={{ top: "152px", left: "-6px" }}>AURA</div>

        <div className="tw">
          <div className="tr">
            {[...Array(2)].map((_, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center" }}>
                {["Ankara Aura", "Street Luxury", "Premium Fabric", "Cultural Texture", "New Collection", "Accra, Ghana"].map((t) => (
                  <span key={t} className="ti">{t}<span className="td" /></span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <div className="hi">
          <div className={`ew af ${on(1)}`}>
            <span className="ew-text">Ankara Aura</span>
            <div className="ew-rule" />
            <span className="ew-text">SS 2025</span>
          </div>

          <div className="hg">
            <div className="hl">
              <div className={`a ${on(2)}`}>
                <span className="hd-fill">STREET</span>
                <span className="hd-stroke">LUXURY</span>
                <span className="hd-sub">where culture meets couture ✦</span>
              </div>

              <p className={`hbody a ${on(4)}`}>
                Black &amp; white at the core — Ankara colour, restrained. Every piece carries the texture of tradition, crafted for the modern street.
              </p>

              <div className={`cr a ${on(5)}`}>
                <AuraButton href="/shop" variant="fill">Shop Now</AuraButton>
                <AuraButton href="/customize" variant="ghost">Customize it →</AuraButton>
              </div>
            </div>

            <div className="hright">
              <div className={`hr-label ar ${on(3)}`}>
                <p className="hr-label-sub">Street Luxury</p>
                <p className="hr-label-main">ANKARA<br />AURA</p>
              </div>

              <div className="hr-ph floater">
                <div className="hr-ph-inner">
                  <div className="hr-ph-big">MODEL<br />HERE</div>
                  <span className="hr-ph-hw">your image goes here ✦</span>
                </div>
              </div>

              <div className={`hr-strip af ${on(6)}`}>
                <div>
                  <p className="strip-lbl">Ankara Oversized Tee</p>
                  <p className="strip-price">GHS 120</p>
                </div>

                <AuraButton
                  href="/shop"
                  variant="fill"
                  style={{ padding: "11px 22px", fontSize: "10px" }}
                >
                  Add to bag
                </AuraButton>
              </div>
            </div>
          </div>

          <div className={`hstats a ${on(7)}`}>
            {[["200+","Pieces crafted"],["4.9★","Avg rating"],["48h","Delivery"],["100%","Ankara DNA"]].map(([n,l]) => (
              <div key={n} className="hstat">
                <div className="hstat-n">{n}</div>
                <div className="hstat-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
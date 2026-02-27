"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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
          <rect x="0.5" y="0.5" width="63" height="63" fill="none" stroke={color} strokeWidth="0.6"/>
          <polygon points="32,2 62,32 32,62 2,32" fill="none" stroke={color} strokeWidth="0.9"/>
          <polygon points="32,18 46,32 32,46 18,32" fill="none" stroke={color} strokeWidth="0.6"/>
          <polygon points="0,0 16,0 0,16" fill={color} opacity="0.1"/>
          <polygon points="64,0 48,0 64,16" fill={color} opacity="0.1"/>
          <polygon points="0,64 16,64 0,48" fill={color} opacity="0.1"/>
          <polygon points="64,64 48,64 64,48" fill={color} opacity="0.1"/>
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
      height, flexShrink:0,
      background:`repeating-linear-gradient(90deg,#c8502a 0,#c8502a 20px,#d4a843 20px,#d4a843 40px,#1a3a5c 40px,#1a3a5c 60px,#2d6a4f 60px,#2d6a4f 80px,#0b0b0a 80px,#0b0b0a 100px)`,
      backgroundSize:"100px 100%",
    }}/>
  );
}

const INQUIRY_TYPES = [
  { value:"custom-order",      label:"Custom Order",           desc:"Design a bespoke piece tailored entirely to you. We'll discuss silhouette, fabric, and every detail." },
  { value:"collaboration",     label:"Brand Collaboration",    desc:"Strategic partnerships, creative collaborations, or co-branded projects. Let's explore what's possible." },
  { value:"wholesale",         label:"Wholesale Inquiry",      desc:"Stocking Ankara Aura in your store or platform. We work with carefully selected retail partners." },
  { value:"press",             label:"Press & Media",          desc:"Editorial features, photography, or media coverage. Contact our press team directly." },
  { value:"general",           label:"General Inquiry",        desc:"Anything else — we read everything and respond with intent." },
];

const FOUNDERS = [
  { name:"Eldwin Asante",  title:"Founder & Creative Director", note:"For brand vision, creative direction, and strategic conversations." },
  { name:"Kelvin Baidoo",  title:"Co-Founder · Operations",    note:"For logistics, wholesale, and operational partnerships." },
  { name:"Jame Reynolds",  title:"Co-Founder · Brand Strategy", note:"For press, media, and global brand positioning." },
];

export default function ContactPage() {
  const formR     = useReveal(0.08);
  const infoR     = useReveal(0.1);
  const foundR    = useReveal(0.1);

  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t); }, []);

  const [inquiryType, setInquiryType] = useState(INQUIRY_TYPES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", phone:"", message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink:#0b0b0a; --cream:#f7f6f4; --kente:#c8502a;
          --gold:#d4a843; --indigo:#1a3a5c; --forest:#2d6a4f;
          --b:rgba(11,11,10,0.09);
          --fd:'Bebas Neue',sans-serif; --fb:'DM Sans',sans-serif; --fa:'Caveat',cursive;
        }
        body { background:var(--cream); color:var(--ink); font-family:var(--fb); overflow-x:hidden; }
        .pw { max-width:1200px; margin:0 auto; padding:0 48px; }
        @media(max-width:768px){ .pw{ padding:0 22px; } }

        .rv { opacity:0; transform:translateY(40px); transition: opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1); }
        .rv.on { opacity:1; transform:none; }
        .child { opacity:0; transform:translateY(24px); clip-path:inset(0 0 100% 0);
          transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1), clip-path 0.85s cubic-bezier(0.16,1,0.3,1); }
        .rv.on .child { opacity:1; transform:none; clip-path:inset(0 0 0% 0); }
        .child:nth-child(1){transition-delay:0.04s} .child:nth-child(2){transition-delay:0.12s}
        .child:nth-child(3){transition-delay:0.20s} .child:nth-child(4){transition-delay:0.28s}
        .child:nth-child(5){transition-delay:0.36s} .child:nth-child(6){transition-delay:0.44s}
        .hw { overflow:hidden; }
        .hline { display:block; transform:translateY(110%); transition:transform 1.1s cubic-bezier(0.16,1,0.3,1); }
        .hline.on { transform:translateY(0); }
        .hline.d1{transition-delay:0.08s} .hline.d2{transition-delay:0.18s} .hline.d3{transition-delay:0.30s}

        /* ═══ HERO ═══ */
        .ct-hero {
          min-height:88svh; display:flex; flex-direction:column; justify-content:center;
          background:var(--cream); border-bottom:1px solid var(--b);
          position:relative; overflow:hidden;
        }
        .ct-hero-inner { position:relative; z-index:2; padding:0 48px; max-width:1200px; margin:0 auto; }
        .ct-hero-eyebrow {
          font-family:var(--fa); font-size:15px; color:var(--kente);
          margin-bottom:28px; letter-spacing:0.06em;
          opacity:0; animation:fup 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s forwards;
        }
        @keyframes fup { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        .ct-hero-h1 {
          font-family:var(--fd);
          font-size:clamp(64px,11vw,164px);
          line-height:0.86; letter-spacing:0.01em;
        }
        .ct-hero-solid { color:var(--ink); }
        .ct-hero-stroke { -webkit-text-stroke:2px var(--ink); color:transparent; }
        .ct-hero-sub {
          font-family:var(--fa); font-size:clamp(17px,2.2vw,24px);
          color:rgba(11,11,10,0.44); max-width:520px;
          margin-top:36px; line-height:1.6;
          opacity:0; animation:fup 0.9s cubic-bezier(0.16,1,0.3,1) 0.65s forwards;
        }
        .ct-info-strip {
          display:flex; gap:48px; margin-top:52px; flex-wrap:wrap;
          opacity:0; animation:fup 0.9s cubic-bezier(0.16,1,0.3,1) 0.85s forwards;
          border-top:1px solid var(--b); padding-top:32px;
        }
        .ct-info-item { display:flex; flex-direction:column; gap:4px; }
        .ct-info-label { font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(11,11,10,0.3); }
        .ct-info-val { font-family:var(--fa); font-size:17px; color:var(--ink); }
        .ct-info-val a { color:var(--kente); text-decoration:none; transition:opacity 0.2s; }
        .ct-info-val a:hover { opacity:0.7; }

        /* ghost */
        .ct-ghost {
          position:absolute; pointer-events:none; z-index:1;
          font-family:var(--fd); color:transparent; user-select:none;
          -webkit-text-stroke:1px rgba(11,11,10,0.03);
          font-size:clamp(80px,16vw,220px);
          right:-4%; bottom:-5%;
          animation:gdrift 22s ease-in-out infinite alternate;
        }
        @keyframes gdrift{from{transform:translateX(0)} to{transform:translateX(2%)}}

        /* ═══ MAIN FORM + INFO LAYOUT ═══ */
        .ct-main {
          display:grid; grid-template-columns:1fr 400px;
          background:var(--cream); border-bottom:1px solid var(--b);
          min-height:100vh;
        }

        /* LEFT: form */
        .ct-form-panel {
          padding:80px 64px 100px;
          border-right:1px solid var(--b);
        }
        .ct-form-title { font-family:var(--fd); font-size:clamp(32px,4vw,56px); letter-spacing:0.04em; margin-bottom:8px; }
        .ct-form-sub { font-family:var(--fa); font-size:15px; color:rgba(11,11,10,0.4); margin-bottom:52px; }

        /* Inquiry type dropdown */
        .ct-dropdown-label { font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(11,11,10,0.3); margin-bottom:12px; }
        .ct-dropdown-btn {
          width:100%; display:flex; align-items:center; justify-content:space-between;
          border:none; border-bottom:2px solid var(--ink); background:none; cursor:pointer;
          padding:14px 0; text-align:left;
          font-family:var(--fd); font-size:22px; letter-spacing:0.06em; color:var(--ink);
          transition:border-color 0.2s;
        }
        .ct-dropdown-btn:hover { border-color:var(--kente); }
        .ct-dropdown-arrow {
          width:14px; height:14px; transition:transform 0.3s;
          stroke:currentColor; stroke-width:1.5; fill:none;
        }
        .ct-dropdown-arrow.open { transform:rotate(180deg); }
        .ct-dropdown-list {
          border:1px solid var(--b); border-top:none;
          max-height:0; overflow:hidden;
          transition:max-height 0.4s cubic-bezier(0.4,0,0.2,1);
          margin-bottom:0;
        }
        .ct-dropdown-list.open { max-height:400px; margin-bottom:0; }
        .ct-dropdown-option {
          display:block; width:100%; border:none; background:none; cursor:pointer;
          text-align:left; padding:16px 20px;
          border-bottom:1px solid var(--b); transition:background 0.2s;
          position:relative; overflow:hidden;
        }
        .ct-dropdown-option::before {
          content:''; position:absolute; left:0; top:0; bottom:0; width:0;
          background:var(--kente); opacity:0.06;
          transition:width 0.3s;
        }
        .ct-dropdown-option:hover::before { width:100%; }
        .ct-dropdown-option:last-child { border-bottom:none; }
        .ct-dropdown-option.active { background:rgba(200,80,42,0.04); }
        .ct-opt-name { font-family:var(--fd); font-size:15px; letter-spacing:0.08em; color:var(--ink); display:block; margin-bottom:3px; }
        .ct-opt-desc { font-size:11px; color:rgba(11,11,10,0.4); line-height:1.6; }

        /* inquiry desc */
        .ct-inq-desc {
          padding:16px 0 28px;
          font-family:var(--fa); font-size:15px; color:rgba(11,11,10,0.4); line-height:1.65;
          border-bottom:1px solid var(--b); margin-bottom:36px;
        }

        /* form fields */
        .ct-fields { display:flex; flex-direction:column; }
        .ct-field {
          display:flex; flex-direction:column; gap:5px;
          border-bottom:1px solid var(--b); padding:18px 0;
          position:relative;
        }
        .ct-field-label { font-size:9px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(11,11,10,0.3); }
        .ct-field-input, .ct-field-textarea {
          border:none; background:transparent; outline:none;
          font-family:var(--fd); font-size:20px; letter-spacing:0.04em;
          color:var(--ink); padding:6px 0; width:100%;
        }
        .ct-field-input::placeholder, .ct-field-textarea::placeholder { color:rgba(11,11,10,0.15); }
        .ct-field-textarea { resize:none; min-height:96px; font-size:18px; line-height:1.6; }
        .ct-field-bar {
          position:absolute; bottom:0; left:0; right:0; height:1px;
          background:var(--kente); transform:scaleX(0); transform-origin:left;
          transition:transform 0.35s cubic-bezier(0.77,0,0.175,1);
        }
        .ct-field:focus-within .ct-field-bar { transform:scaleX(1); }
        .ct-field:focus-within .ct-field-label { color:var(--kente); }

        /* submit */
        .ct-submit-row { margin-top:44px; display:flex; align-items:center; gap:20px; flex-wrap:wrap; }
        .ct-submit-btn {
          padding:16px 44px; background:var(--ink); color:var(--cream);
          font-family:var(--fd); font-size:13px; letter-spacing:0.22em; text-transform:uppercase;
          border:1.5px solid var(--ink); cursor:pointer;
          position:relative; overflow:hidden;
          transition:transform 0.2s, box-shadow 0.2s;
        }
        .ct-submit-btn::before {
          content:''; position:absolute; inset:0; background:var(--kente);
          transform:scaleX(0); transform-origin:left;
          transition:transform 0.4s cubic-bezier(0.77,0,0.175,1);
        }
        .ct-submit-btn:hover::before { transform:scaleX(1); }
        .ct-submit-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(200,80,42,0.25); }
        .ct-submit-btn span { position:relative; z-index:1; }
        .ct-submit-btn:disabled { opacity:0.5; cursor:wait; }
        .ct-submit-note { font-family:var(--fa); font-size:14px; color:rgba(11,11,10,0.3); }

        /* success */
        .ct-success {
          padding:60px 0;
          display:flex; flex-direction:column; gap:16px;
          animation:fup 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .ct-success-check {
          width:48px; height:48px; border-radius:50%;
          background:var(--forest); display:flex; align-items:center; justify-content:center;
          animation:popIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes popIn {
          from{transform:scale(0);opacity:0}
          to{transform:scale(1);opacity:1}
        }
        .ct-success-title { font-family:var(--fd); font-size:36px; letter-spacing:0.06em; }
        .ct-success-body { font-family:var(--fa); font-size:17px; color:rgba(11,11,10,0.5); line-height:1.65; max-width:400px; }

        /* RIGHT: info sidebar */
        .ct-info-panel {
          padding:80px 48px 80px 56px;
          display:flex; flex-direction:column; gap:0;
          background:rgba(11,11,10,0.015);
        }
        .ct-info-block { padding:36px 0; border-bottom:1px solid var(--b); }
        .ct-info-block:first-child { padding-top:0; }
        .ct-info-block-label { font-size:9px; letter-spacing:0.24em; text-transform:uppercase; color:rgba(11,11,10,0.28); margin-bottom:12px; }
        .ct-info-block-val { font-family:var(--fd); font-size:clamp(16px,2.2vw,22px); letter-spacing:0.04em; line-height:1.2; }
        .ct-info-block-sub { font-family:var(--fa); font-size:14px; color:rgba(11,11,10,0.38); margin-top:6px; }
        .ct-info-block-val a { color:var(--kente); text-decoration:none; }

        /* response time visual */
        .ct-response-bar {
          height:2px; background:var(--b); margin-top:12px; overflow:hidden;
        }
        .ct-response-bar-fill {
          height:100%; background:var(--forest); width:82%;
          animation:barFill 1.8s cubic-bezier(0.16,1,0.3,1) 0.5s both;
        }
        @keyframes barFill { from{width:0} }

        @media(max-width:900px){
          .ct-main { grid-template-columns:1fr; }
          .ct-form-panel { padding:56px 22px 72px; border-right:none; border-bottom:1px solid var(--b); }
          .ct-info-panel { padding:48px 22px; }
        }

        /* ═══ FOUNDERS ═══ */
        .ct-found-s {
          background:var(--ink); padding:120px 0;
          border-bottom:1px solid rgba(247,246,244,0.06);
          position:relative; overflow:hidden;
        }
        .ct-found-label { font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:var(--kente); margin-bottom:20px; }
        .ct-found-title { font-family:var(--fd); font-size:clamp(36px,5vw,72px); color:var(--cream); line-height:0.9; margin-bottom:64px; }
        .ct-found-title .sk { -webkit-text-stroke:1px rgba(247,246,244,0.2); color:transparent; display:block; }
        .ct-found-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(247,246,244,0.05); }
        .ct-found-card {
          background:var(--ink); padding:40px 36px;
          position:relative; overflow:hidden;
          display:flex; flex-direction:column; gap:0;
          transition:background 0.3s;
        }
        .ct-found-card::after {
          content:''; position:absolute; top:0; left:0; width:0; height:2px;
          background:linear-gradient(90deg,var(--kente),var(--gold));
          transition:width 0.55s cubic-bezier(0.77,0,0.175,1);
        }
        .ct-found-card:hover::after { width:100%; }
        .ct-found-card:hover { background:rgba(247,246,244,0.02); }
        .ct-found-initials {
          font-family:var(--fd); font-size:44px; letter-spacing:0.1em;
          -webkit-text-stroke:1px rgba(247,246,244,0.1); color:transparent;
          margin-bottom:24px;
        }
        .ct-found-name { font-family:var(--fd); font-size:22px; letter-spacing:0.06em; color:var(--cream); margin-bottom:4px; }
        .ct-found-title-txt { font-family:var(--fa); font-size:13px; color:var(--kente); margin-bottom:16px; }
        .ct-found-note { font-size:12px; color:rgba(247,246,244,0.3); line-height:1.8; font-weight:300; }
        @media(max-width:768px){
          .ct-found-s { padding:80px 0; }
          .ct-found-grid { grid-template-columns:1fr; }
          .ct-found-card { padding:32px 22px; }
        }
      `}</style>

      <KenteBar height={4} />

      {/* ═══ HERO ═══ */}
      <section className="ct-hero">
        <AnkaraPattern id="ct-hero-p" opacity={0.06} />
        <div className="ct-ghost">CONNECT</div>
        <div className="ct-hero-inner">
          <p className="ct-hero-eyebrow">Ankara Aura — Contact</p>
          <h1 className="ct-hero-h1">
            <div className="hw"><span className={`hline ct-hero-solid${heroVisible?" on d1":""}`}>LET'S CREATE</span></div>
            <div className="hw"><span className={`hline ct-hero-solid${heroVisible?" on d2":""}`}>WITH</span></div>
            <div className="hw"><span className={`hline ct-hero-stroke${heroVisible?" on d3":""}`}>PURPOSE.</span></div>
          </h1>
          <p className="ct-hero-sub">
            For collaborations, custom designs, wholesale partnerships, press, or any conversation worth having — we're here.
          </p>
          <div className="ct-info-strip">
            {[
              { label:"Email",         val:<><a href="mailto:ankaraauragh@gmail.com">ankaraauragh@gmail.com</a></> },
              { label:"Location",      val:<>Accra, Ghana</> },
              { label:"Response Time", val:<>Within 48 hours</> },
            ].map(i => (
              <div key={i.label} className="ct-info-item">
                <span className="ct-info-label">{i.label}</span>
                <span className="ct-info-val">{i.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MAIN: FORM + SIDEBAR ═══ */}
      <div className="ct-main">

        {/* FORM */}
        <div
          ref={formR.ref as React.RefObject<HTMLDivElement>}
          className={`ct-form-panel rv${formR.visible?" on":""}`}
        >
          <h2 className="ct-form-title child">Send Your Inquiry</h2>
          <p className="ct-form-sub child">Every message is read. Every reply is considered.</p>

          {/* Inquiry type dropdown */}
          <div className="child">
            <p className="ct-dropdown-label">Inquiry Type</p>
            <button className="ct-dropdown-btn" onClick={() => setDropdownOpen(o => !o)}>
              {inquiryType.label}
              <svg className={`ct-dropdown-arrow${dropdownOpen?" open":""}`} viewBox="0 0 16 16">
                <polyline points="3,6 8,11 13,6"/>
              </svg>
            </button>
            <div className={`ct-dropdown-list${dropdownOpen?" open":""}`}>
              {INQUIRY_TYPES.map(t => (
                <button key={t.value}
                  className={`ct-dropdown-option${inquiryType.value===t.value?" active":""}`}
                  onClick={() => { setInquiryType(t); setDropdownOpen(false); }}>
                  <span className="ct-opt-name">{t.label}</span>
                  <span className="ct-opt-desc">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="ct-inq-desc child">{inquiryType.desc}</p>

          {submitted ? (
            <div className="ct-success">
              <div className="ct-success-check">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <polyline points="4,11 9,16 18,6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="ct-success-title">Inquiry received.</h3>
              <p className="ct-success-body">
                We have your message. Someone from the Ankara Aura team will respond within 48 hours. We don't do automated replies — you'll hear from a person.
              </p>
            </div>
          ) : (
            <form className="ct-fields" onSubmit={handleSubmit}>
              {[
                { key:"name",    label:"Full Name",     type:"text",  placeholder:"Your name" },
                { key:"email",   label:"Email Address", type:"email", placeholder:"your@email.com" },
                { key:"phone",   label:"Phone (Optional)", type:"tel", placeholder:"+233 00 000 0000" },
              ].map(f => (
                <div key={f.key} className="ct-field child">
                  <label className="ct-field-label">{f.label}</label>
                  <input className="ct-field-input" type={f.type} placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={set(f.key as keyof typeof form)}
                    required={f.key !== "phone"} />
                  <div className="ct-field-bar" />
                </div>
              ))}
              <div className="ct-field child">
                <label className="ct-field-label">Your Message</label>
                <textarea className="ct-field-textarea" placeholder="Tell us what you have in mind..."
                  value={form.message} onChange={set("message")} required rows={4} />
                <div className="ct-field-bar" />
              </div>
              <div className="ct-submit-row child">
                <button type="submit" className="ct-submit-btn" disabled={submitting}>
                  <span>{submitting ? "Sending..." : "Send Inquiry"}</span>
                </button>
                <span className="ct-submit-note">We respond in 48 hours.</span>
              </div>
            </form>
          )}
        </div>

        {/* SIDEBAR */}
        <div
          ref={infoR.ref as React.RefObject<HTMLDivElement>}
          className={`ct-info-panel rv${infoR.visible?" on":""}`}
        >
          {[
            {
              label:"Email",
              val:<a href="mailto:ankaraauragh@gmail.com">ankaraauragh@gmail.com</a>,
              sub:"For all general and business inquiries.",
            },
            {
              label:"Studio Location",
              val:<>Accra, Ghana</>,
              sub:"West Africa · Serving globally.",
            },
            {
              label:"Response Time",
              val:<>Within 48 hours</>,
              sub:null,
              bar:true,
            },
            {
              label:"Availability",
              val:<>Monday — Saturday</>,
              sub:"8:00 AM — 6:00 PM WAT",
            },
            {
              label:"For Custom Orders",
              val:<>Design Consultation</>,
              sub:"Book via the Customize page — or reach us directly.",
            },
          ].map((b, i) => (
            <div key={b.label} className={`ct-info-block child`} style={{ transitionDelay:`${i*0.09}s` }}>
              <p className="ct-info-block-label">{b.label}</p>
              <p className="ct-info-block-val">{b.val}</p>
              {b.sub && <p className="ct-info-block-sub">{b.sub}</p>}
              {b.bar && <div className="ct-response-bar"><div className="ct-response-bar-fill" /></div>}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ FOUNDERS DIRECT CONTACT ═══ */}
      <section
        ref={foundR.ref as React.RefObject<HTMLElement>}
        className={`ct-found-s rv${foundR.visible?" on":""}`}
      >
        <AnkaraPattern id="ct-found-p" opacity={0.04} color="#f7f6f4" />
        <div className="pw" style={{ position:"relative", zIndex:1 }}>
          <p className="ct-found-label child">Direct Contact</p>
          <h2 className="ct-found-title child">
            THE TEAM<br/><span className="sk">BEHIND THE BRAND</span>
          </h2>
          <div className="ct-found-grid">
            {FOUNDERS.map((f, i) => (
              <div key={f.name} className={`ct-found-card child`} style={{ transitionDelay:`${i*0.13}s` }}>
                <span className="ct-found-initials">{f.name.split(" ").map(n=>n[0]).join("")}</span>
                <h3 className="ct-found-name">{f.name}</h3>
                <p className="ct-found-title-txt">{f.title}</p>
                <p className="ct-found-note">{f.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <KenteBar height={4} />
    </>
  );
}
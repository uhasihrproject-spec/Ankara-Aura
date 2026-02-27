export default function AboutPage() {
  return (
    <div className="about-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ink:#0b0b0a;
          --cream:#f7f6f4;
          --gold:#d4a843;
          --line:rgba(8,8,7,0.12);
        }

        .about-page { background: var(--cream); color: var(--ink); font-family:'DM Sans', sans-serif; }
        .sec { position: relative; overflow: hidden; border-bottom: 1px solid var(--line); }
        .w { max-width: 1240px; margin: 0 auto; padding: 0 30px; }

        .wm {
          position:absolute; pointer-events:none; user-select:none;
          font-family:'Bebas Neue', sans-serif;
          font-size: clamp(120px, 16vw, 260px);
          line-height:0.85;
          -webkit-text-stroke:1px rgba(8,8,7,0.09);
          color:transparent;
          z-index:0;
          letter-spacing:0.01em;
          white-space:nowrap;
        }

        .hero { min-height: 82vh; display:flex; align-items:center; }
        .hero::before {
          content:"";
          position:absolute; inset:0;
          background:
            radial-gradient(circle at 20% 18%, rgba(212,168,67,0.16), transparent 42%),
            repeating-linear-gradient(45deg, rgba(8,8,7,0.045) 0 2px, transparent 2px 34px);
          opacity:0.6;
        }
        .hero-inner { position:relative; z-index:2; padding: 84px 0; }
        .eyebrow { font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(8,8,7,0.52); }
        .statement {
          margin-top: 18px;
          font-family:'Bebas Neue', sans-serif;
          font-size: clamp(78px, 13.5vw, 190px);
          line-height:0.84;
          letter-spacing:0.02em;
        }
        .hook {
          margin-top: 20px;
          max-width: 740px;
          font-family:'Caveat', cursive;
          font-size: clamp(20px, 2.4vw, 34px);
          line-height:1.45;
          color:rgba(8,8,7,0.62);
        }

        .origin { padding: 100px 0; }
        .origin-grid { position:relative; z-index:2; display:grid; grid-template-columns: 1.1fr 1fr; gap: 50px; align-items:start; }
        .sec-title {
          font-family:'Bebas Neue', sans-serif;
          font-size: clamp(58px, 9vw, 128px);
          line-height:0.86;
          letter-spacing:0.02em;
        }
        .origin-copy p { font-size:16px; line-height:1.95; color:rgba(8,8,7,0.84); margin: 0 0 14px; }
        .origin-copy strong { color: var(--ink); font-weight: 500; }

        .aura { padding: 96px 0; background: #fff; }
        .aura-layout { position:relative; z-index:2; display:grid; grid-template-columns: 0.85fr 1.15fr; gap: 44px; align-items:center; }
        .aura-word {
          font-family:'Bebas Neue', sans-serif;
          font-size: clamp(70px, 12vw, 170px);
          line-height:0.8;
          letter-spacing: 0.38em;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(8,8,7,0.84);
        }
        .aura-text { font-size: 18px; line-height: 1.95; max-width: 640px; color: rgba(8,8,7,0.84); }

        .philo { padding: 96px 0; }
        .philo-head { position:relative; z-index:2; margin-bottom: 28px; }
        .philo-grid { position:relative; z-index:2; display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); border:1px solid var(--line); }
        .phi-item { padding: 28px 24px; border-right:1px solid var(--line); min-height: 220px; }
        .phi-item:last-child { border-right:none; }
        .phi-k { font-family:'Bebas Neue', sans-serif; font-size: 34px; letter-spacing:0.05em; line-height:0.95; margin-bottom:10px; }
        .phi-p { font-size:14px; line-height:1.85; color: rgba(8,8,7,0.72); }

        .craft { padding: 96px 0; background:#fff; }
        .craft-grid { position:relative; z-index:2; display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:0; border-top:1px solid var(--line); border-bottom:1px solid var(--line); }
        .craft-item { padding: 30px 18px 26px; border-right:1px solid var(--line); }
        .craft-item:last-child { border-right:none; }
        .craft-num { font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:0.14em; color:var(--gold); }
        .craft-name { margin-top: 8px; font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:0.04em; }
        .craft-desc { margin-top:8px; font-size:13px; line-height:1.8; color:rgba(8,8,7,0.72); }

        .vision { padding: 110px 0; }
        .vision-core { position:relative; z-index:2; max-width: 880px; }
        .vision-lead { font-family:'Bebas Neue',sans-serif; font-size: clamp(52px, 8.5vw, 126px); line-height:0.86; letter-spacing:0.02em; }
        .vision-body { margin-top:18px; font-size:17px; line-height:1.95; color:rgba(8,8,7,0.84); }

        .founder { padding: 90px 0; background:#fff; }
        .founder-wrap { position:relative; z-index:2; display:grid; grid-template-columns: 1fr 1.3fr; gap: 42px; align-items:start; }
        .founder-tag { font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(8,8,7,0.5); }
        .founder-name { margin-top:4px; font-family:'Bebas Neue', sans-serif; font-size: clamp(44px, 6vw, 86px); letter-spacing:0.04em; line-height:0.9; }
        .founder-story p { font-size:15px; line-height:1.9; color:rgba(8,8,7,0.82); margin:0 0 12px; }

        .closing { padding: 120px 0 140px; text-align:center; }
        .closing-text { position:relative; z-index:2; font-family:'Bebas Neue', sans-serif; font-size: clamp(54px, 9.2vw, 146px); line-height:0.84; letter-spacing:0.03em; }
        .closing-sub { position:relative; z-index:2; margin-top:16px; font-family:'Caveat',cursive; font-size: clamp(20px, 2.2vw, 32px); color:rgba(8,8,7,0.54); }

        @media (max-width: 980px) {
          .origin-grid, .aura-layout, .founder-wrap { grid-template-columns: 1fr; }
          .philo-grid, .craft-grid { grid-template-columns: 1fr 1fr; }
          .phi-item:nth-child(2), .craft-item:nth-child(2) { border-right: none; }
          .phi-item:nth-child(-n+2), .craft-item:nth-child(-n+2) { border-bottom:1px solid var(--line); }
        }
        @media (max-width: 640px) {
          .w { padding: 0 20px; }
          .philo-grid, .craft-grid { grid-template-columns: 1fr; }
          .phi-item, .craft-item { border-right:none !important; border-bottom:1px solid var(--line); }
          .phi-item:last-child, .craft-item:last-child { border-bottom:none; }
          .hero { min-height: 72vh; }
        }
      `}</style>

      <section className="sec hero">
        <div className="wm" style={{ top: "-12px", left: "-6px" }}>ANKARA</div>
        <div className="wm" style={{ top: "120px", left: "-6px" }}>AURA</div>
        <div className="w hero-inner">
          <p className="eyebrow">About Ankara Aura</p>
          <h1 className="statement">We don’t make clothes.<br />We build presence.</h1>
          <p className="hook">
            Rooted in African identity and shaped by modern restraint, Ankara Aura is where culture becomes
            confidence — quiet, intentional, unforgettable.
          </p>
        </div>
      </section>

      <section className="sec origin">
        <div className="wm" style={{ top: "-8px", right: "-10px" }}>ORIGIN</div>
        <div className="w origin-grid">
          <h2 className="sec-title">Ankara Aura was born from the belief that African identity deserves a global stage.</h2>
          <div className="origin-copy">
            <p>
              The brand began with an obsession: <strong>every detail must carry meaning</strong>. From typography to
              textile placement, from silhouette to finish, each decision is deliberate. Nothing accidental. Nothing noisy.
            </p>
            <p>
              From student ambition to founder execution, <strong>Eldwin Asante</strong> shaped Ankara Aura with one
              mission — to build a house where African design is not reduced to trend, but elevated to standard.
            </p>
            <p>
              Together with co-founders <strong>James Raynolds</strong> and <strong>Kelvin Baidoo</strong>, the vision became
              bigger than garments. This is anti-fast fashion. This is precision, culture, and long-term value.
            </p>
          </div>
        </div>
      </section>

      <section className="sec aura">
        <div className="w aura-layout">
          <div className="aura-word">A U R A</div>
          <p className="aura-text">
            Aura is presence without noise. Energy without shouting. Confidence without explanation. In African patterns,
            every motif carries history. In modern structure, every line carries discipline. Ankara Aura lives between both —
            cultural depth and contemporary clarity.
          </p>
        </div>
      </section>

      <section className="sec philo">
        <div className="w">
          <div className="philo-head">
            <h2 className="sec-title" style={{ fontSize: "clamp(56px, 8.2vw, 118px)" }}>Our Philosophy</h2>
          </div>
          <div className="philo-grid">
            <article className="phi-item">
              <h3 className="phi-k">Culture is Power</h3>
              <p className="phi-p">We design from identity first. Every piece carries heritage with authority, not nostalgia.</p>
            </article>
            <article className="phi-item">
              <h3 className="phi-k">Simplicity is Luxury</h3>
              <p className="phi-p">Restraint is our signature. Clean forms, controlled palettes, and intentional contrast.</p>
            </article>
            <article className="phi-item">
              <h3 className="phi-k">Details Define Class</h3>
              <p className="phi-p">Construction, finishing, and presentation are treated as one complete language.</p>
            </article>
            <article className="phi-item">
              <h3 className="phi-k">Identity is Global</h3>
              <p className="phi-p">African design is not local potential. It is global excellence, ready for any stage.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="sec craft">
        <div className="w">
          <h2 className="sec-title" style={{ fontSize: "clamp(56px, 8.2vw, 118px)", marginBottom: "20px" }}>Craft & Process</h2>
          <div className="craft-grid">
            <article className="craft-item">
              <div className="craft-num">01</div>
              <h3 className="craft-name">Design Sketch</h3>
              <p className="craft-desc">Concepts are developed through editorial silhouette studies before final line work.</p>
            </article>
            <article className="craft-item">
              <div className="craft-num">02</div>
              <h3 className="craft-name">Fabric Selection</h3>
              <p className="craft-desc">Pattern scale, texture, and color weight are selected to preserve cultural intent.</p>
            </article>
            <article className="craft-item">
              <div className="craft-num">03</div>
              <h3 className="craft-name">Precision Finishing</h3>
              <p className="craft-desc">Cuts, seams, and trims are tuned for structure, comfort, and visual confidence.</p>
            </article>
            <article className="craft-item">
              <div className="craft-num">04</div>
              <h3 className="craft-name">Packaging Experience</h3>
              <p className="craft-desc">Every delivery is presented as ceremony — refined, collectible, and unmistakably premium.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="sec vision">
        <div className="wm" style={{ bottom: "-24px", right: "-6px" }}>VISION</div>
        <div className="w">
          <div className="vision-core">
            <h2 className="vision-lead">This is not a drop.<br />It is a foundation.</h2>
            <p className="vision-body">
              We are building beyond collections. Ankara Aura is designed for legacy: elevating African design globally,
              creating scalable systems around fashion, and shaping a long-term cultural brand that outlives trends.
              The work is bigger than product. It is architecture for identity, commerce, and impact.
            </p>
          </div>
        </div>
      </section>

      <section className="sec founder">
        <div className="w founder-wrap">
          <div>
            <div className="founder-tag">Founder & Creative Director</div>
            <h3 className="founder-name">Eldwin Asante</h3>
          </div>
          <div className="founder-story">
            <p>
              Eldwin leads Ankara Aura with disciplined creative direction — balancing cultural authenticity with modern
              luxury language.
            </p>
            <p>
              Alongside co-founders James Raynolds and Kelvin Baidoo, he is shaping a brand model where African design,
              premium craft, and global relevance grow together.
            </p>
          </div>
        </div>
      </section>

      <section className="sec closing">
        <div className="w">
          <h2 className="closing-text">Wear Culture.<br />Carry Presence.</h2>
          <p className="closing-sub">Ankara Aura</p>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ background: "#f7f6f4", color: "#0b0b0a", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        .about-wrap { max-width: 1160px; margin: 0 auto; padding: 0 28px 90px; }
        .about-hero { border: 1px solid rgba(8,8,7,0.1); margin-top: 24px; position: relative; overflow: hidden; }
        .about-hero::before { content: ""; position: absolute; inset: 0; background: repeating-linear-gradient(45deg, rgba(212,168,67,0.08) 0 12px, transparent 12px 24px); pointer-events: none; }
        .about-hero-inner { position: relative; z-index: 1; padding: 64px 54px; }
        .eyebrow { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(8,8,7,0.48); }
        .title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(68px, 11vw, 148px); line-height: 0.85; letter-spacing: 0.02em; }
        .subtitle { margin-top: 14px; max-width: 680px; font-size: clamp(18px, 2.1vw, 28px); line-height: 1.5; font-family: 'Caveat', cursive; color: rgba(8,8,7,0.62); }
        .story { margin-top: 36px; border: 1px solid rgba(8,8,7,0.1); background: #fff; padding: 40px; display: grid; gap: 18px; }
        .story p { font-size: 16px; line-height: 1.9; color: rgba(8,8,7,0.84); }
        .founders { margin-top: 26px; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; }
        .card { border: 1px solid rgba(8,8,7,0.1); background: #fff; padding: 18px; }
        .role { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(8,8,7,0.48); }
        .name { margin-top: 6px; font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 0.05em; }
        .cta-row { margin-top: 28px; display: flex; gap: 10px; flex-wrap: wrap; }
        .btn { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; background: #0b0b0a; color: #f7f6f4; padding: 10px 20px; text-decoration: none; border: 1px solid #0b0b0a; transition: background 0.2s, color 0.2s, transform 0.18s; }
        .btn:hover { background: transparent; color: #0b0b0a; transform: translateY(-1px); }
        .btn.alt { background: #d4a843; color: #0b0b0a; border-color: #d4a843; }
        @media (max-width: 900px) {
          .about-hero-inner { padding: 42px 24px; }
          .story { padding: 24px; }
          .founders { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="about-wrap">
        <div className="about-hero">
          <div className="about-hero-inner">
            <div className="eyebrow">Ankara Aura · Our Story</div>
            <h1 className="title">Built from Home. Worn Worldwide.</h1>
            <p className="subtitle">
              Ankara Aura began with one dream: to make every person wearing African-inspired fashion feel seen,
              powerful, and deeply connected to where they come from.
            </p>
          </div>
        </div>

        <div className="story">
          <p>
            What started as sketches and late-night fabric conversations became a movement of intention. We saw
            patterns that carried memory, color that carried spirit, and tailoring that carried dignity. We wanted to
            build a brand where heritage wasn&apos;t costume — it was confidence.
          </p>
          <p>
            Founded by <strong>Eldwin Asante</strong>, and built with co-founders <strong>James Raynolds</strong> and
            <strong> Kelvin Baidoo</strong>, Ankara Aura is rooted in craft, community, and purpose. We believe fashion
            should not just look good in a mirror, but feel right in your story.
          </p>
          <p>
            Every collection we release is designed to stand between timeless and modern: black and white foundations,
            bold cultural accents, and silhouettes that carry presence. From Accra to everywhere, we create pieces that
            let people wear identity with quiet pride.
          </p>
        </div>

        <div className="founders">
          <article className="card">
            <div className="role">Founder</div>
            <div className="name">Eldwin Asante</div>
          </article>
          <article className="card">
            <div className="role">Co-Founder</div>
            <div className="name">James Raynolds</div>
          </article>
          <article className="card">
            <div className="role">Co-Founder</div>
            <div className="name">Kelvin Baidoo</div>
          </article>
        </div>

        <div className="cta-row">
          <Link href="/shop" className="btn">Shop Now</Link>
          <Link href="/customize" className="btn alt">Customize a Piece</Link>
        </div>
      </section>
    </div>
  );
}

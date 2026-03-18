"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AnkaraPattern from "@/components/site/AnkaraPattern";
import ProductVisual from "@/components/shop/ProductVisual";
import { getFeaturedProducts } from "@/lib/products";

export default function HomeLanding() {
  const featured = useMemo(() => getFeaturedProducts().slice(0, 3), []);
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroVisible(false), 1300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        :root { --ink:#0b0b0a; --cream:#f7f6f4; --gold:#d4a843; --clay:#c8502a; --indigo:#1a3a5c; --forest:#2d6a4f; --line:rgba(11,11,10,.1); }
        .home-page { background:linear-gradient(180deg, #faf8f4 0%, #fff 30%, #f6f2ea 100%); color:var(--ink); font-family:'DM Sans',sans-serif; }
        .home-intro { position:fixed; inset:0; z-index:220; display:flex; align-items:center; justify-content:center; background:radial-gradient(circle at top, rgba(212,168,67,.22), transparent 35%), var(--ink); color:var(--cream); animation:homeIntroOut .8s cubic-bezier(.22,1,.36,1) 0.8s forwards; }
        .home-intro__inner { position:relative; display:grid; gap:12px; text-align:center; padding:32px; }
        .home-intro__title { font:400 clamp(78px, 14vw, 190px) 'Bebas Neue',sans-serif; letter-spacing:.14em; line-height:.8; }
        .home-intro__sub { font-size:12px; letter-spacing:.36em; text-transform:uppercase; color:rgba(247,246,244,.62); }
        .home-intro__line { width:min(220px, 60vw); height:1px; background:rgba(247,246,244,.18); overflow:hidden; margin:0 auto; }
        .home-intro__line::after { content:''; display:block; width:100%; height:100%; background:var(--gold); transform:translateX(-100%); animation:homeLoader 1s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes homeLoader { to { transform:translateX(0); } }
        @keyframes homeIntroOut { to { opacity:0; visibility:hidden; } }
        .home-hero { position:relative; min-height:calc(100svh - 72px); overflow:hidden; }
        .home-hero__grid { width:min(1240px, calc(100% - 40px)); margin:0 auto; padding:88px 0 72px; min-height:calc(100svh - 72px); display:grid; grid-template-columns:1.1fr .9fr; align-items:center; gap:30px; }
        .home-hero__copy { position:relative; z-index:2; }
        .home-hero__eyebrow { display:inline-flex; align-items:center; gap:12px; margin-bottom:18px; font-size:11px; letter-spacing:.28em; text-transform:uppercase; color:rgba(11,11,10,.5); }
        .home-hero__eyebrow::before { content:''; width:42px; height:1px; background:rgba(212,168,67,.6); }
        .home-hero h1 { font:400 clamp(62px, 9vw, 126px) 'Bebas Neue',sans-serif; line-height:.86; letter-spacing:.12em; margin:0; }
        .home-hero p { margin-top:18px; max-width:540px; color:rgba(11,11,10,.62); line-height:1.8; font-size:15px; }
        .home-hero__actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:28px; }
        .home-btn, .home-btn--ghost { min-height:46px; padding:0 22px; display:inline-flex; align-items:center; justify-content:center; text-decoration:none; font-size:10px; letter-spacing:.18em; text-transform:uppercase; transition:transform .2s ease, background .2s ease, color .2s ease, border-color .2s ease; }
        .home-btn { background:var(--ink); color:var(--cream); border:1px solid var(--ink); }
        .home-btn--ghost { background:transparent; color:var(--ink); border:1px solid rgba(11,11,10,.14); }
        .home-btn:hover, .home-btn--ghost:hover { transform:translateY(-2px); }
        .home-btn--ghost:hover { border-color:var(--gold); color:var(--gold); }
        .home-hero__visual { position:relative; min-height:560px; display:flex; align-items:center; justify-content:center; }
        .home-hero__card { position:absolute; border:1px solid rgba(11,11,10,.08); background:rgba(255,255,255,.66); backdrop-filter:blur(14px); box-shadow:0 26px 80px rgba(11,11,10,.08); }
        .home-hero__card--main { width:min(430px, 80vw); aspect-ratio:4/5; display:grid; place-items:center; background:linear-gradient(180deg, rgba(11,11,10,.04), rgba(212,168,67,.06)); }
        .home-hero__card--small { width:180px; padding:18px; bottom:26px; left:0; }
        .home-hero__card--small strong { display:block; font:400 28px 'Bebas Neue',sans-serif; letter-spacing:.08em; }
        .home-hero__card--small span { color:rgba(11,11,10,.5); font-size:11px; letter-spacing:.18em; text-transform:uppercase; }
        .home-hero__card--note { top:24px; right:0; max-width:220px; padding:18px; }
        .home-hero__card--note p { margin:0; color:rgba(11,11,10,.6); line-height:1.7; font-size:13px; }
        .home-section { width:min(1240px, calc(100% - 40px)); margin:0 auto; padding:86px 0; }
        .home-section__head { display:flex; justify-content:space-between; align-items:end; gap:24px; margin-bottom:30px; }
        .home-section__eyebrow { font-size:11px; letter-spacing:.24em; text-transform:uppercase; color:rgba(11,11,10,.45); }
        .home-section__title { font:400 clamp(38px, 5vw, 62px) 'Bebas Neue',sans-serif; letter-spacing:.12em; line-height:.9; }
        .home-section__copy { max-width:460px; color:rgba(11,11,10,.6); line-height:1.8; font-size:14px; }
        .home-about { display:grid; grid-template-columns:1.1fr .9fr; gap:24px; }
        .home-panel { position:relative; border:1px solid var(--line); background:rgba(255,255,255,.68); padding:32px; overflow:hidden; }
        .home-panel p { position:relative; z-index:1; color:rgba(11,11,10,.62); line-height:1.85; }
        .home-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:22px; position:relative; z-index:1; }
        .home-stat { border:1px solid rgba(11,11,10,.08); background:rgba(247,246,244,.85); padding:16px; }
        .home-stat strong { display:block; font:400 28px 'Bebas Neue',sans-serif; letter-spacing:.08em; }
        .home-stat span { color:rgba(11,11,10,.48); font-size:10px; letter-spacing:.18em; text-transform:uppercase; }
        .home-highlight { display:grid; align-content:space-between; background:linear-gradient(180deg, rgba(212,168,67,.14), rgba(255,255,255,.8)); }
        .home-highlight blockquote { font:400 clamp(28px, 4vw, 44px) 'Bebas Neue',sans-serif; letter-spacing:.08em; line-height:1; margin:0; }
        .home-highlight small { display:block; margin-top:14px; color:rgba(11,11,10,.48); font-size:11px; letter-spacing:.18em; text-transform:uppercase; }
        .home-featured { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .home-card { position:relative; min-height:420px; overflow:hidden; border:1px solid rgba(11,11,10,.08); background:linear-gradient(180deg, #111 0%, #090909 100%); text-decoration:none; }
        .home-card__pattern { position:absolute; inset:0; opacity:.08; }
        .home-card__visual { height:72%; display:grid; place-items:center; transition:transform .35s ease; }
        .home-card:hover .home-card__visual { transform:scale(1.04); }
        .home-card__meta { position:absolute; left:0; right:0; bottom:0; padding:22px; background:linear-gradient(to top, rgba(8,8,7,.94), rgba(8,8,7,.2)); }
        .home-card__tag { color:var(--gold); font-size:9px; letter-spacing:.22em; text-transform:uppercase; }
        .home-card__name { margin-top:6px; color:var(--cream); font:400 28px 'Bebas Neue',sans-serif; letter-spacing:.08em; line-height:.92; }
        .home-card__price { margin-top:8px; color:var(--gold); font:400 20px 'Bebas Neue',sans-serif; letter-spacing:.06em; }
        .home-cta { position:relative; overflow:hidden; border:1px solid var(--line); background:var(--ink); color:var(--cream); }
        .home-cta__inner { width:min(1240px, calc(100% - 40px)); margin:0 auto; padding:78px 0; display:grid; grid-template-columns:1fr auto; gap:24px; align-items:center; position:relative; z-index:1; }
        .home-cta h2 { font:400 clamp(40px, 6vw, 82px) 'Bebas Neue',sans-serif; letter-spacing:.12em; line-height:.9; margin:0; }
        .home-cta p { margin-top:14px; max-width:520px; color:rgba(247,246,244,.72); line-height:1.8; }
        @media (max-width: 980px) {
          .home-hero__grid, .home-about, .home-featured, .home-cta__inner { grid-template-columns:1fr; }
          .home-hero__visual { min-height:460px; }
          .home-section__head { flex-direction:column; align-items:flex-start; }
          .home-stats { grid-template-columns:1fr; }
        }
      `}</style>
      <div className="home-page">
        {introVisible ? (
          <div className="home-intro" aria-hidden>
            <div className="home-intro__inner">
              <div className="home-intro__sub">Ankara Aura</div>
              <div className="home-intro__title">AA</div>
              <div className="home-intro__line" />
            </div>
          </div>
        ) : null}

        <section className="home-hero">
          <AnkaraPattern id="home-hero-pattern" opacity={0.06} />
          <div className="home-hero__grid">
            <div className="home-hero__copy">
              <div className="home-hero__eyebrow">Premium African streetwear</div>
              <h1>Quiet luxury with an Ankara soul.</h1>
              <p>
                Ankara Aura blends sharp monochrome styling with subtle pattern language, creating pieces that feel editorial on the homepage and fully functional in the shop.
              </p>
              <div className="home-hero__actions">
                <Link href="/shop" className="home-btn">Enter shop</Link>
                <Link href="/about" className="home-btn--ghost">About the brand</Link>
              </div>
            </div>
            <div className="home-hero__visual">
              <div className="home-hero__card home-hero__card--main"><ProductVisual product={featured[0]} size={380} /></div>
              <div className="home-hero__card home-hero__card--small"><strong>Curated</strong><span>Homepage only previews the drop</span></div>
              <div className="home-hero__card home-hero__card--note"><p>The full catalog, collections, wishlist, and cart all live in the dedicated shop route — not on the landing page.</p></div>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section__head">
            <div>
              <div className="home-section__eyebrow">About the brand</div>
              <div className="home-section__title">Made for a stronger silhouette.</div>
            </div>
            <p className="home-section__copy">The landing page stays clean: a refined first impression, a clear brand story, and a small preview of featured pieces before you transition into the shop.</p>
          </div>
          <div className="home-about">
            <div className="home-panel">
              <AnkaraPattern id="home-about-pattern" opacity={0.05} />
              <p>
                Ankara Aura is about restraint with identity. The clothes are modern, elevated, and wearable, while the Ankara references stay subtle — in the rhythm, the texture, and the small details that make the brand recognisable.
              </p>
              <div className="home-stats">
                <div className="home-stat"><strong>03</strong><span>Homepage sections that matter</span></div>
                <div className="home-stat"><strong>01</strong><span>Dedicated shop experience</span></div>
                <div className="home-stat"><strong>100%</strong><span>Brand-first presentation</span></div>
              </div>
            </div>
            <div className="home-panel home-highlight">
              <div>
                <div className="home-section__eyebrow">Brand note</div>
                <blockquote>“Minimal first impression. Full shopping depth when you need it.”</blockquote>
                <small>Ankara Aura direction</small>
              </div>
              <Link href="/customize" className="home-btn--ghost">Go to customize</Link>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section__head">
            <div>
              <div className="home-section__eyebrow">Featured products</div>
              <div className="home-section__title">A preview of the drop.</div>
            </div>
            <p className="home-section__copy">Only selected pieces appear here. The full browsing experience, filters, and collection controls live inside the shop page.</p>
          </div>
          <div className="home-featured">
            {featured.map((product) => (
              <Link key={product.slug} href={`/shop/${product.slug}`} className="home-card">
                <div className="home-card__pattern"><AnkaraPattern id={`featured-${product.slug}`} opacity={1} /></div>
                <div className="home-card__visual"><ProductVisual product={product} size={280} /></div>
                <div className="home-card__meta">
                  <div className="home-card__tag">{product.tags[0]}</div>
                  <div className="home-card__name">{product.name}</div>
                  <div className="home-card__price">GH₵ {product.price.toLocaleString()}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-cta">
          <AnkaraPattern id="home-cta-pattern" opacity={0.08} />
          <div className="home-cta__inner">
            <div>
              <h2>Step into the full shop experience.</h2>
              <p>Browse collections, filter by category and price, save pieces to your wishlist, and move into customization without cluttering the homepage.</p>
            </div>
            <Link href="/shop" className="home-btn">Shop Ankara Aura</Link>
          </div>
        </section>
      </div>
    </>
  );
}

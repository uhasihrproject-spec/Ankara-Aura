"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AnkaraPattern from "@/components/site/AnkaraPattern";
import ProductVisual from "@/components/shop/ProductVisual";
import { COLLECTIONS, PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

const PRICE_FILTERS = [
  { label: "All prices", value: "all" },
  { label: "Under GH₵ 150", value: "under-150" },
  { label: "GH₵ 150 – 250", value: "150-250" },
  { label: "Above GH₵ 250", value: "above-250" },
] as const;

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categories = useMemo(() => ["All", ...Array.from(new Set(PRODUCTS.flatMap((product) => product.tags)))], []);
  const initialCollection = searchParams.get("collection") ?? "all";
  const initialCategory = searchParams.get("category") ?? "All";
  const [collection, setCollection] = useState(COLLECTIONS.some((item) => item.slug === initialCollection) ? initialCollection : "all");
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : "All");
  const [priceFilter, setPriceFilter] = useState<(typeof PRICE_FILTERS)[number]["value"]>("all");
  const [query, setQuery] = useState("");
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useCart();

  const filtered = PRODUCTS.filter((product) => {
    const collectionOk = collection === "all" || product.collection === collection;
    const categoryOk = category === "All" || product.tags.includes(category);
    const priceOk = priceFilter === "all"
      || (priceFilter === "under-150" && product.price < 150)
      || (priceFilter === "150-250" && product.price >= 150 && product.price <= 250)
      || (priceFilter === "above-250" && product.price > 250);
    const queryOk = !query.trim() || `${product.name} ${product.desc} ${product.tags.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase());
    return collectionOk && categoryOk && priceOk && queryOk;
  });

  const featured = PRODUCTS.filter((product) => product.featured).slice(0, 1)[0] ?? PRODUCTS[0];
  const activeCollection = collection === "all" ? undefined : COLLECTIONS.find((item) => item.slug === collection);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        :root { --ink:#0b0b0a; --cream:#f7f6f4; --gold:#d4a843; --clay:#c8502a; --line:rgba(11,11,10,.1); }
        .shop-page { background:linear-gradient(180deg,#fbf8f2 0%, #fff 36%, #f3efe8 100%); color:var(--ink); font-family:'DM Sans',sans-serif; }
        .shop-hero { position:relative; overflow:hidden; }
        .shop-hero__inner { width:min(1240px, calc(100% - 40px)); margin:0 auto; padding:80px 0 56px; display:grid; grid-template-columns:1.1fr .9fr; gap:30px; align-items:center; }
        .shop-hero__eyebrow { display:inline-flex; align-items:center; gap:12px; margin-bottom:18px; font-size:11px; letter-spacing:.28em; text-transform:uppercase; color:rgba(11,11,10,.5); }
        .shop-hero__eyebrow::before { content:''; width:42px; height:1px; background:rgba(212,168,67,.62); }
        .shop-hero h1 { font:400 clamp(54px, 8vw, 112px) 'Bebas Neue',sans-serif; letter-spacing:.12em; line-height:.86; margin:0; }
        .shop-hero p { margin-top:18px; max-width:540px; color:rgba(11,11,10,.62); line-height:1.8; font-size:15px; }
        .shop-hero__actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:26px; }
        .shop-btn, .shop-btn--ghost { min-height:44px; padding:0 20px; display:inline-flex; align-items:center; justify-content:center; text-decoration:none; font-size:10px; letter-spacing:.18em; text-transform:uppercase; border:1px solid var(--ink); transition:transform .2s ease, background .2s ease, color .2s ease, border-color .2s ease; }
        .shop-btn { background:var(--ink); color:var(--cream); }
        .shop-btn--ghost { background:transparent; color:var(--ink); border-color:rgba(11,11,10,.14); }
        .shop-btn:hover, .shop-btn--ghost:hover { transform:translateY(-2px); }
        .shop-btn--ghost:hover { border-color:var(--gold); color:var(--gold); }
        .shop-hero__visual { position:relative; min-height:520px; display:grid; place-items:center; }
        .shop-hero__card { width:min(420px, 84vw); aspect-ratio:4/5; border:1px solid rgba(11,11,10,.08); background:linear-gradient(180deg, rgba(11,11,10,.04), rgba(212,168,67,.06)); display:grid; place-items:center; box-shadow:0 30px 90px rgba(11,11,10,.08); }
        .shop-hero__note { position:absolute; right:0; bottom:22px; max-width:240px; border:1px solid rgba(11,11,10,.08); background:rgba(255,255,255,.7); padding:18px; }
        .shop-hero__note strong { display:block; font:400 30px 'Bebas Neue',sans-serif; letter-spacing:.08em; }
        .shop-hero__note span { color:rgba(11,11,10,.52); line-height:1.7; font-size:13px; }
        .shop-filters { width:min(1240px, calc(100% - 40px)); margin:0 auto; padding:0 0 30px; }
        .shop-filters__shell { display:grid; grid-template-columns:1.2fr 1fr 1fr 1fr; border:1px solid var(--line); background:rgba(255,255,255,.82); }
        .shop-filters__item { position:relative; border-right:1px solid var(--line); }
        .shop-filters__item:last-child { border-right:none; }
        .shop-filters__label { position:absolute; top:10px; left:16px; color:rgba(11,11,10,.38); font-size:9px; letter-spacing:.18em; text-transform:uppercase; }
        .shop-filters input, .shop-filters select { width:100%; height:74px; border:none; background:transparent; padding:28px 16px 10px; font:500 12px 'DM Sans',sans-serif; letter-spacing:.1em; text-transform:uppercase; outline:none; }
        .shop-curation { width:min(1240px, calc(100% - 40px)); margin:0 auto; display:flex; flex-wrap:wrap; gap:8px; padding-bottom:24px; }
        .shop-chip { border:1px solid rgba(11,11,10,.08); background:rgba(255,255,255,.78); padding:8px 12px; font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:rgba(11,11,10,.58); }
        .shop-grid-wrap { width:min(1240px, calc(100% - 40px)); margin:0 auto; padding:0 0 110px; }
        .shop-grid-head { display:flex; justify-content:space-between; align-items:end; gap:24px; margin-bottom:28px; }
        .shop-grid-head h2 { font:400 clamp(36px, 5vw, 62px) 'Bebas Neue',sans-serif; letter-spacing:.12em; line-height:.9; margin:0; }
        .shop-grid-head p { max-width:480px; color:rgba(11,11,10,.58); line-height:1.8; font-size:14px; }
        .shop-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(270px, 1fr)); gap:16px; }
        .shop-card { position:relative; overflow:hidden; min-height:430px; border:1px solid rgba(11,11,10,.08); background:linear-gradient(180deg,#111 0%, #090909 100%); text-decoration:none; }
        .shop-card__pattern { position:absolute; inset:0; opacity:.08; }
        .shop-card__visual { height:72%; display:grid; place-items:center; transition:transform .35s ease; }
        .shop-card:hover .shop-card__visual { transform:scale(1.05); }
        .shop-card__meta { position:absolute; left:0; right:0; bottom:0; padding:22px; background:linear-gradient(to top, rgba(8,8,7,.94), rgba(8,8,7,.16)); }
        .shop-card__eyebrow { color:var(--gold); font-size:9px; letter-spacing:.22em; text-transform:uppercase; }
        .shop-card__name { margin-top:6px; color:var(--cream); font:400 26px 'Bebas Neue',sans-serif; letter-spacing:.08em; line-height:.92; }
        .shop-card__price { margin-top:8px; color:var(--gold); font:400 20px 'Bebas Neue',sans-serif; letter-spacing:.06em; }
        .shop-card__actions { position:absolute; top:14px; right:14px; display:flex; gap:8px; opacity:0; transform:translateY(-8px); transition:opacity .24s ease, transform .24s ease; }
        .shop-card:hover .shop-card__actions { opacity:1; transform:translateY(0); }
        .shop-card__actions button { min-width:44px; height:38px; border:1px solid rgba(247,246,244,.28); background:rgba(247,246,244,.08); color:var(--cream); }
        .shop-card__actions button:hover { border-color:var(--gold); color:var(--gold); }
        .shop-empty { padding:24px 0; color:rgba(11,11,10,.46); font-size:11px; letter-spacing:.18em; text-transform:uppercase; }
        @media (max-width: 980px) {
          .shop-hero__inner, .shop-filters__shell { grid-template-columns:1fr; }
          .shop-filters__item { border-right:none; border-bottom:1px solid var(--line); }
          .shop-filters__item:last-child { border-bottom:none; }
          .shop-grid-head { flex-direction:column; align-items:flex-start; }
        }
      `}</style>
      <div className="shop-page">
        <section className="shop-hero">
          <AnkaraPattern id="shop-hero" opacity={0.06} />
          <div className="shop-hero__inner">
            <div>
              <div className="shop-hero__eyebrow">Dedicated shopping experience</div>
              <h1>The full Ankara Aura shop lives here.</h1>
              <p>
                Browse by collection, narrow by category or price, save pieces to your wishlist, and move into checkout or customization without crowding the homepage.
              </p>
              <div className="shop-hero__actions">
                <a href="#catalog" className="shop-btn">Shop now</a>
                <Link href="/customize" className="shop-btn--ghost">Go to customize</Link>
              </div>
            </div>
            <div className="shop-hero__visual">
              <div className="shop-hero__card"><ProductVisual product={featured} size={380} /></div>
              <div className="shop-hero__note"><strong>{activeCollection?.name ?? "All collections"}</strong><span>{activeCollection?.tagline ?? "Browse the full Ankara Aura offering from one clean storefront."}</span></div>
            </div>
          </div>
        </section>

        <section className="shop-filters">
          <div className="shop-filters__shell">
            <div className="shop-filters__item"><div className="shop-filters__label">Search</div><input type="search" placeholder="Search pieces" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
            <div className="shop-filters__item"><div className="shop-filters__label">Collection</div><select value={collection} onChange={(e) => setCollection(e.target.value)}><option value="all">All collections</option>{COLLECTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></div>
            <div className="shop-filters__item"><div className="shop-filters__label">Category</div><select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
            <div className="shop-filters__item"><div className="shop-filters__label">Price</div><select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value as (typeof PRICE_FILTERS)[number]["value"])}>{PRICE_FILTERS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
          </div>
        </section>

        <div className="shop-curation">
          <span className="shop-chip">{collection === "all" ? "All collections" : activeCollection?.name}</span>
          <span className="shop-chip">{category === "All" ? "All categories" : category}</span>
          <span className="shop-chip">{PRICE_FILTERS.find((item) => item.value === priceFilter)?.label}</span>
          {query ? <span className="shop-chip">Search: {query}</span> : null}
        </div>

        <section className="shop-grid-wrap" id="catalog">
          <div className="shop-grid-head">
            <div>
              <h2>Shop the catalog</h2>
              <p>{filtered.length} piece{filtered.length === 1 ? "" : "s"} selected across the current filters.</p>
            </div>
            <p>Collections stay tucked into dropdown navigation and filters stay practical, so the browsing experience feels premium rather than cluttered.</p>
          </div>
          {filtered.length === 0 ? <div className="shop-empty">No pieces match the current filters.</div> : null}
          <div className="shop-grid">
            {filtered.map((product) => {
              const saved = wishlist.some((item) => item.slug === product.slug);
              return (
                <Link key={product.slug} href={`/shop/${product.slug}`} className="shop-card">
                  <div className="shop-card__pattern"><AnkaraPattern id={`shop-card-${product.slug}`} opacity={1} /></div>
                  <div className="shop-card__visual"><ProductVisual product={product} size={280} /></div>
                  <div className="shop-card__actions">
                    <button
                      type="button"
                      aria-label="Add to wishlist"
                      onClick={(event) => {
                        event.preventDefault();
                        if (saved) removeFromWishlist(product.slug);
                        else addToWishlist({ slug: product.slug, name: product.name, price: product.price, image: product.images?.[0] });
                      }}
                    >♥</button>
                    <button
                      type="button"
                      aria-label="Add to cart"
                      onClick={(event) => {
                        event.preventDefault();
                        addToCart({ slug: product.slug, name: product.name, price: product.price, size: "M", qty: 1 });
                        setAddedSlug(product.slug);
                        window.setTimeout(() => setAddedSlug(null), 1500);
                      }}
                    >{addedSlug === product.slug ? "✓" : "+"}</button>
                  </div>
                  <div className="shop-card__meta">
                    <div className="shop-card__eyebrow">{product.collection?.replace(/-/g, " ") ?? product.tags[0]}</div>
                    <div className="shop-card__name">{product.name}</div>
                    <div className="shop-card__price">GH₵ {product.price.toLocaleString()}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

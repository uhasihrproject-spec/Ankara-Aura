"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BrandLogo from "@/components/site/BrandLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLLECTIONS, PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

function IconButton({ children, badge, onClick, active, label }: { children: React.ReactNode; badge?: number; onClick: () => void; active?: boolean; label: string; }) {
  return (
    <button type="button" className={`shop-icon-btn${active ? " is-active" : ""}`} aria-label={label} onClick={onClick}>
      {children}
      {typeof badge === "number" && badge > 0 ? <span className="shop-icon-btn__badge">{badge > 9 ? "9+" : badge}</span> : null}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const { items, totalPrice, totalQty, updateQty, removeItem, wishlist, wishlistCount, removeFromWishlist, addToCart } = useCart();

  const categories = useMemo(() => Array.from(new Set(PRODUCTS.flatMap((product) => product.tags))), []);

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

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (navRef.current && event.target instanceof Node && !navRef.current.contains(event.target)) {
        setCollectionsOpen(false);
        setCategoriesOpen(false);
        setCartOpen(false);
        setWishlistOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  const closePanels = () => {
    setCollectionsOpen(false);
    setCategoriesOpen(false);
    setCartOpen(false);
    setWishlistOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        :root { --ink:#0b0b0a; --cream:#f7f6f4; --gold:#d4a843; --clay:#c8502a; --forest:#2d6a4f; --indigo:#1a3a5c; --line:rgba(11,11,10,.1); --nav-h:78px; }
        .aa-brand { display:inline-flex; align-items:center; gap:12px; text-decoration:none; color:inherit; }
        .aa-brand__mark { position:relative; width:38px; height:38px; flex-shrink:0; }
        .aa-brand__core { position:absolute; inset:0; border-radius:8px; display:grid; place-items:center; background:var(--ink); color:var(--cream); font:400 14px 'Bebas Neue',sans-serif; letter-spacing:.08em; z-index:2; }
        .aa-brand__core::before { content:''; position:absolute; inset:-1px; border-radius:9px; z-index:-1; background:linear-gradient(135deg,var(--gold),var(--clay),var(--indigo),var(--gold)); }
        .aa-brand__ring { position:absolute; inset:-5px; border-radius:12px; border:1.5px dashed rgba(200,80,42,.28); transition:transform .55s cubic-bezier(.34,1.56,.64,1), border-color .2s ease; }
        .aa-brand:hover .aa-brand__ring { transform:rotate(90deg); border-color:var(--gold); }
        .aa-brand__wordmark { display:flex; flex-direction:column; }
        .aa-brand__wordmark strong { font:400 21px 'Bebas Neue',sans-serif; letter-spacing:.12em; line-height:1; }
        .aa-brand__wordmark span { font:500 10px 'DM Sans',sans-serif; letter-spacing:.18em; text-transform:uppercase; color:rgba(11,11,10,.42); }
        .shop-nav-wrap { position:sticky; top:0; z-index:180; }
        .shop-nav { border-bottom:1px solid transparent; background:rgba(247,246,244,.88); backdrop-filter:blur(18px); transition:background .24s ease, border-color .24s ease, box-shadow .24s ease; }
        .shop-nav.is-scrolled { background:rgba(247,246,244,.97); border-color:var(--line); box-shadow:0 16px 40px rgba(11,11,10,.06); }
        .shop-nav__inner { width:min(1280px, calc(100% - 32px)); min-height:var(--nav-h); margin:0 auto; display:flex; align-items:center; justify-content:space-between; gap:24px; position:relative; }
        .shop-nav__left, .shop-nav__right { display:flex; align-items:center; gap:12px; }
        .shop-nav__menu, .shop-nav__mobile-links { display:flex; align-items:center; gap:8px; }
        .shop-nav__link, .shop-nav__trigger { min-height:42px; padding:0 14px; border:1px solid transparent; background:transparent; color:rgba(11,11,10,.58); text-decoration:none; font:500 10px 'DM Sans',sans-serif; letter-spacing:.17em; text-transform:uppercase; display:inline-flex; align-items:center; gap:8px; }
        .shop-nav__link:hover, .shop-nav__link.is-active, .shop-nav__trigger:hover, .shop-nav__trigger.is-open { color:var(--ink); border-color:rgba(11,11,10,.08); background:rgba(255,255,255,.6); }
        .shop-nav__pill { display:inline-flex; align-items:center; justify-content:center; min-height:42px; padding:0 16px; border:1px solid var(--ink); background:var(--ink); color:var(--cream); text-decoration:none; font:500 10px 'DM Sans',sans-serif; letter-spacing:.18em; text-transform:uppercase; }
        .shop-nav__pill:hover { background:transparent; color:var(--ink); }
        .shop-nav__caret { font-size:12px; color:rgba(11,11,10,.38); }
        .shop-nav__dropdown, .shop-panel {
          position:absolute; top:calc(100% - 8px); border:1px solid var(--line); background:rgba(247,246,244,.98); box-shadow:0 30px 70px rgba(11,11,10,.12); min-width:260px; padding:14px; opacity:0; pointer-events:none; transform:translateY(-8px); transition:opacity .2s ease, transform .2s ease;
        }
        .shop-nav__dropdown.is-open, .shop-panel.is-open { opacity:1; pointer-events:auto; transform:translateY(0); }
        .shop-nav__dropdown { left:0; }
        .shop-nav__dropdown--categories { left:220px; }
        .shop-nav__dropdown a { display:flex; justify-content:space-between; gap:16px; padding:12px; text-decoration:none; color:var(--ink); border-bottom:1px solid rgba(11,11,10,.06); }
        .shop-nav__dropdown a:last-child { border-bottom:none; }
        .shop-nav__dropdown a span:first-child { font:400 22px 'Bebas Neue',sans-serif; letter-spacing:.08em; }
        .shop-nav__dropdown a span:last-child { font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:rgba(11,11,10,.45); align-self:center; }
        .shop-icon-btn { position:relative; width:42px; height:42px; border-radius:50%; border:1px solid rgba(11,11,10,.1); background:rgba(255,255,255,.6); display:grid; place-items:center; color:var(--ink); }
        .shop-icon-btn.is-active, .shop-icon-btn:hover { border-color:rgba(212,168,67,.45); box-shadow:0 0 0 6px rgba(212,168,67,.08); }
        .shop-icon-btn__badge { position:absolute; top:-3px; right:-3px; min-width:18px; height:18px; border-radius:999px; background:var(--gold); color:var(--ink); display:grid; place-items:center; font-size:9px; font-weight:700; }
        .shop-panel { right:0; width:min(360px, calc(100vw - 32px)); }
        .shop-panel__head { padding-bottom:12px; border-bottom:1px solid rgba(11,11,10,.08); margin-bottom:12px; }
        .shop-panel__title { font:400 26px 'Bebas Neue',sans-serif; letter-spacing:.08em; }
        .shop-panel__sub { color:rgba(11,11,10,.46); font-size:12px; }
        .shop-panel__list { display:grid; gap:10px; max-height:360px; overflow:auto; }
        .shop-panel__item { display:grid; grid-template-columns:1fr auto; gap:10px; padding:12px; border:1px solid rgba(11,11,10,.07); background:rgba(255,255,255,.72); }
        .shop-panel__item strong { display:block; font-size:13px; margin-bottom:4px; }
        .shop-panel__item p { font-size:11px; color:rgba(11,11,10,.5); }
        .shop-panel__qty { display:flex; align-items:center; gap:8px; margin-top:8px; }
        .shop-panel__qty button { width:24px; height:24px; border:1px solid rgba(11,11,10,.12); background:transparent; }
        .shop-panel__remove { margin-top:8px; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--clay); background:none; border:none; padding:0; }
        .shop-panel__footer { margin-top:12px; padding-top:12px; border-top:1px solid rgba(11,11,10,.08); display:flex; justify-content:space-between; align-items:center; gap:12px; }
        .shop-panel__footer a { text-decoration:none; }
        .shop-panel__empty { padding:14px; border:1px dashed rgba(11,11,10,.12); color:rgba(11,11,10,.52); font-size:13px; line-height:1.6; }
        .shop-nav__mobile-toggle { display:none; width:42px; height:42px; border-radius:50%; border:1px solid var(--line); background:transparent; }
        .shop-nav__mobile-toggle span { display:block; width:18px; height:1.5px; margin:4px auto; background:var(--ink); }
        .shop-nav__mobile { display:none; }
        @media (max-width: 1080px) {
          .shop-nav__menu { display:none; }
          .shop-nav__mobile-toggle { display:inline-block; }
          .shop-nav__mobile { display:block; position:fixed; inset:calc(var(--nav-h) + 10px) 16px auto; padding:18px; border:1px solid var(--line); background:rgba(247,246,244,.98); box-shadow:0 24px 70px rgba(11,11,10,.12); opacity:0; pointer-events:none; transform:translateY(-8px); transition:opacity .2s ease, transform .2s ease; }
          .shop-nav__mobile.is-open { opacity:1; pointer-events:auto; transform:translateY(0); }
          .shop-nav__mobile-links { flex-direction:column; align-items:stretch; }
          .shop-nav__mobile-links a { text-decoration:none; color:var(--ink); padding:10px 0; border-bottom:1px solid rgba(11,11,10,.08); font:500 12px 'DM Sans',sans-serif; letter-spacing:.12em; text-transform:uppercase; }
        }
      `}</style>
      <header className="shop-nav-wrap" ref={navRef}>
        <div className={`shop-nav${scrolled ? " is-scrolled" : ""}`}>
          <div className="shop-nav__inner">
            <div className="shop-nav__left">
              <BrandLogo subtitle="Placeholder logo mark" compact />
              <nav className="shop-nav__menu" aria-label="Shop navigation">
                <button type="button" className={`shop-nav__trigger${collectionsOpen ? " is-open" : ""}`} onClick={() => { setCollectionsOpen((v) => !v); setCategoriesOpen(false); setCartOpen(false); setWishlistOpen(false); }}>
                  Collections <span className="shop-nav__caret">⌄</span>
                </button>
                <button type="button" className={`shop-nav__trigger${categoriesOpen ? " is-open" : ""}`} onClick={() => { setCategoriesOpen((v) => !v); setCollectionsOpen(false); setCartOpen(false); setWishlistOpen(false); }}>
                  Categories <span className="shop-nav__caret">⌄</span>
                </button>
                <Link href="/shop" className={pathname === "/shop" ? "shop-nav__link is-active" : "shop-nav__link"} onClick={closePanels}>Shop</Link>
                <Link href="/customize" className={pathname.startsWith("/customize") ? "shop-nav__link is-active" : "shop-nav__link"} onClick={closePanels}>Customize</Link>
              </nav>
              <div className={`shop-nav__dropdown${collectionsOpen ? " is-open" : ""}`}>
                {COLLECTIONS.map((collection) => (
                  <Link key={collection.slug} href={`/shop?collection=${collection.slug}`} onClick={() => { setCollectionsOpen(false); setMenuOpen(false); }}>
                    <span>{collection.name}</span>
                    <span>{collection.tagline}</span>
                  </Link>
                ))}
              </div>
              <div className={`shop-nav__dropdown shop-nav__dropdown--categories${categoriesOpen ? " is-open" : ""}`}>
                {categories.map((category) => (
                  <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} onClick={() => { setCategoriesOpen(false); setMenuOpen(false); }}>
                    <span>{category}</span>
                    <span>Browse category</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="shop-nav__right">
              <Link href="/customize" className="shop-nav__pill" onClick={closePanels}>Customize</Link>
              <IconButton label="Wishlist" badge={wishlistCount} active={wishlistOpen} onClick={() => { setWishlistOpen((v) => !v); setCartOpen(false); setCollectionsOpen(false); setCategoriesOpen(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L4.22 13.45 12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>
              </IconButton>
              <IconButton label="Cart" badge={totalQty} active={cartOpen} onClick={() => { setCartOpen((v) => !v); setWishlistOpen(false); setCollectionsOpen(false); setCategoriesOpen(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="20" r="1"/><circle cx="20" cy="20" r="1"/><path d="M1 1h4l2.7 13.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L23 6H6"/></svg>
              </IconButton>
              <button type="button" className="shop-nav__mobile-toggle" aria-label="Open mobile shop menu" onClick={() => setMenuOpen((v) => !v)}>
                <span /><span /><span />
              </button>
            </div>

            <div className={`shop-panel${wishlistOpen ? " is-open" : ""}`}>
              <div className="shop-panel__head"><div className="shop-panel__title">Wishlist</div><div className="shop-panel__sub">Saved pieces you want to return to.</div></div>
              {wishlist.length === 0 ? <div className="shop-panel__empty">Your wishlist is empty for now. Save pieces while browsing the catalog.</div> : <div className="shop-panel__list">{wishlist.map((item) => <div key={item.slug} className="shop-panel__item"><div><strong>{item.name}</strong><p>GH₵ {item.price.toLocaleString()}</p><button type="button" className="shop-panel__remove" onClick={() => removeFromWishlist(item.slug)}>Remove</button></div><Link href={`/shop/${item.slug}`} className="shop-nav__pill" onClick={() => setWishlistOpen(false)}>View</Link></div>)}</div>}
            </div>

            <div className={`shop-panel${cartOpen ? " is-open" : ""}`}>
              <div className="shop-panel__head"><div className="shop-panel__title">Cart</div><div className="shop-panel__sub">{totalQty} item{totalQty === 1 ? "" : "s"} selected.</div></div>
              {items.length === 0 ? <div className="shop-panel__empty">Your cart is empty. Add a piece from the shop to start checkout.</div> : <><div className="shop-panel__list">{items.map((item) => <div key={`${item.slug}-${item.size}`} className="shop-panel__item"><div><strong>{item.name}</strong><p>Size {item.size} · GH₵ {item.price.toLocaleString()}</p><div className="shop-panel__qty"><button type="button" onClick={() => updateQty(item.slug, item.size, item.qty - 1)}>-</button><span>{item.qty}</span><button type="button" onClick={() => updateQty(item.slug, item.size, item.qty + 1)}>+</button></div><button type="button" className="shop-panel__remove" onClick={() => removeItem(item.slug, item.size)}>Remove</button></div><button type="button" className="shop-nav__pill" onClick={() => addToCart({ slug: item.slug, name: item.name, price: item.price, size: item.size, qty: 1 })}>+1</button></div>)}</div><div className="shop-panel__footer"><strong>Total: GH₵ {totalPrice.toLocaleString()}</strong><Link href="/checkout" className="shop-nav__pill" onClick={() => setCartOpen(false)}>Checkout</Link></div></>}
            </div>
          </div>
        </div>
      </header>
      <div className={`shop-nav__mobile${menuOpen ? " is-open" : ""}`}>
        <nav className="shop-nav__mobile-links">
          <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop home</Link>
          {COLLECTIONS.map((collection) => <Link key={collection.slug} href={`/shop?collection=${collection.slug}`} onClick={() => setMenuOpen(false)}>{collection.name}</Link>)}
          {categories.map((category) => <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} onClick={() => setMenuOpen(false)}>{category}</Link>)}
          <Link href="/customize" onClick={() => setMenuOpen(false)}>Customize</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>
      </div>
    </>
  );
}

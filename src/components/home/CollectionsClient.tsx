// src/components/home/CollectionsClient.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import AnkaraPatternColor from "@/components/site/AnkaraPatternColor";
import StrokeText from "@/components/ui/StrokeText";

type Product = {
  slug: string;
  name: string;
  price: number;
  desc: string;
  tags: string[];
  featured?: boolean;
  featuredOrder?: number;
  images?: string[];
};

function MarqueeImages({
  items,
}: {
  items: Array<{ href: string; src?: string; alt: string }>;
}) {
  const loop = useMemo(() => [...items, ...items], [items]);

  return (
    <div className="relative border border-black/10 bg-white overflow-hidden">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="marquee-track flex gap-4 py-4">
        {loop.map((it, i) => (
          <Link
            key={`${it.href}-${i}`}
            href={it.href}
            className="shrink-0 block border border-black/10 bg-black/[0.03] overflow-hidden"
            aria-label={it.alt}
          >
            <div className="relative w-[240px] sm:w-[320px] md:w-[420px] lg:w-[520px] aspect-[16/9]">
              {it.src ? (
                <Image
                  src={it.src}
                  alt={it.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 240px, (max-width: 768px) 320px, (max-width: 1024px) 420px, 520px"
                />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-[0.14] mix-blend-multiply">
                    <AnkaraPatternColor className="h-full w-full" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/90 via-white/35 to-white/10" />
                </>
              )}

              {/* tiny hover label */}
              <div className="absolute left-4 bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-200">
                <div className="text-[11px] tracking-[0.18em] uppercase bg-white/85 backdrop-blur border border-black/10 px-3 py-2 text-black/70">
                  {it.alt}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .marquee-track{
          width: max-content;
          will-change: transform;
          animation: marquee 26s linear infinite;
        }
        .marquee-track:hover{ animation-play-state: paused; }
        @keyframes marquee{
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce){
          .marquee-track{ animation: none; }
        }
      `}</style>
    </div>
  );
}

export default function CollectionsClient({ featured }: { featured: Product[] }) {
  const items = useMemo(() => {
    // ✅ auto-updates from products.ts images[0]
    const mapped = featured.map((p) => ({
      href: `/shop/${p.slug}`,
      src: p.images?.[0],
      alt: p.name,
    }));
    return mapped.length ? mapped : [{ href: "/shop", src: undefined, alt: "Ankara Aura" }];
  }, [featured]);

  return (
    <section className="relative overflow-hidden border-b border-black/10 bg-white">
      {/* ✅ WATERMARK BACKGROUND (ghost words + faint pattern) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -left-6 font-[Bebas_Neue] text-[110px] sm:text-[140px] md:text-[180px]
                        tracking-tight leading-none text-black/[0.06] select-none whitespace-nowrap">
          ANKARA
        </div>
        <div className="absolute top-24 sm:top-32 md:top-40 -left-6 font-[Bebas_Neue] text-[110px] sm:text-[140px] md:text-[180px]
                        tracking-tight leading-none text-black/[0.06] select-none whitespace-nowrap">
          AURA
        </div>

        <div className="absolute inset-0 opacity-[0.08] mix-blend-multiply">
          <AnkaraPatternColor className="h-full w-full" />
        </div>
      </div>

      <div className="relative z-[2] mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* top row */}
        <div className="flex items-center gap-4">
          <span className="font-[Caveat] text-[18px] text-black/55">Collections</span>
          <span className="h-px flex-1 bg-black/10" />
          <Link
            href="/shop"
            className="font-[Caveat] text-[18px] text-black/55 hover:text-black transition"
          >
            See all →
          </Link>
        </div>

        {/* flat block */}
        <div className="mt-6 border border-black/10 bg-white">
          <div className="p-6 sm:p-8 md:p-10">
            {/* ✅ BIG stroke heading that always shows */}
            <div className="font-[Bebas_Neue] leading-none">
              <div className="w-full text-[clamp(84px,11vw,170px)] leading-[0.78]">
                <StrokeText
                  text="COLLECTIONS"
                  strokeWidth={6}
                  strokeColor="#0b0b0a"
                  fillColor="transparent"
                  letterSpacingEm={0.01}
                />
              </div>
            </div>

            {/* ✅ responsive animated handwriting text */}
            <p className="mt-3 font-[Caveat] text-[clamp(18px,2.4vw,30px)] text-black/55 leading-[1.55] max-w-[58ch]">
              Black &amp; white at the core — Ankara colour, restrained. Tap any image to open the product.
            </p>

            {/* full-width carousel (no sharing space) */}
            <div className="mt-8">
              <MarqueeImages items={items} />
              <div className="mt-2 font-[Caveat] text-[16px] text-black/45 sm:hidden">
                swipe → (auto) | tap any image ✦
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
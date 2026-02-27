export type Product = {
  slug: string;
  name: string;
  price: number;
  desc: string;
  tags: string[];
  collection?: string;       // ✅ maps product to a Featured Collection
  featured?: boolean;        // ✅ easy toggle — shows in Featured Grid
  featuredOrder?: number;    // ✅ controls order in the grid
  images?: string[];         // ✅ first image = main, rest = hover/carousel
};

// ─── Collections ──────────────────────────────────────────────────────────────
// Used by the Featured Collections section to group products.
// Add new collections here and reference them via `collection` on products.
export const COLLECTIONS = [
  {
    slug: "ankara-core",
    name: "Ankara Core",
    tagline: "The everyday foundation. Rooted in pattern.",
    image: "/collections/ankara-core.jpg",
  },
  {
    slug: "monochrome-series",
    name: "Monochrome Series",
    tagline: "Restraint as a statement. Black. White. Nothing more.",
    image: "/collections/monochrome-series.jpg",
  },
  {
    slug: "limited-drop",
    name: "Limited Drop",
    tagline: "Made once. Worn forever. No restock.",
    image: "/collections/limited-drop.jpg",
  },
  {
    slug: "signature-cuts",
    name: "Signature Cuts",
    tagline: "Tailored geometry. Every seam deliberate.",
    image: "/collections/signature-cuts.jpg",
  },
] as const;

// ─── Products ─────────────────────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  {
    slug: "ankara-oversized-tee",
    name: "Ankara Oversized Tee",
    price: 120,
    desc: "Black/white base with restrained Ankara accents. Cut wide, sits deliberate.",
    tags: ["Tee", "Street"],
    collection: "ankara-core",
    featured: true,
    featuredOrder: 1,
    images: [
      "/products/ankara-oversized-tee-1.jpg",
      "/products/ankara-oversized-tee-2.jpg",
    ],
  },
  {
    slug: "kente-blazer",
    name: "Kente Blazer",
    price: 280,
    desc: "Single-button construction. Kente weave shoulder panels. Unlined for drape.",
    tags: ["Blazer", "Formal", "Statement"],
    collection: "signature-cuts",
    featured: true,
    featuredOrder: 2,
    images: [
      "/products/kente-blazer-1.jpg",
      "/products/kente-blazer-2.jpg",
    ],
  },
  {
    slug: "mono-cargo-pant",
    name: "Mono Cargo Pant",
    price: 165,
    desc: "Six-pocket utility cut in heavyweight cotton. Jet black. Architectural.",
    tags: ["Pants", "Street"],
    collection: "monochrome-series",
    featured: true,
    featuredOrder: 3,
    images: [
      "/products/mono-cargo-1.jpg",
      "/products/mono-cargo-2.jpg",
    ],
  },
  {
    slug: "adinkra-hoodie",
    name: "Adinkra Hoodie",
    price: 195,
    desc: "Limited embroidery run. Adinkra symbol chest placement. Heavyweight 400gsm.",
    tags: ["Hoodie", "Limited"],
    collection: "limited-drop",
    featured: true,
    featuredOrder: 4,
    images: [
      "/products/adinkra-hoodie-1.jpg",
      "/products/adinkra-hoodie-2.jpg",
    ],
  },
  {
    slug: "wax-print-tee",
    name: "Wax Print Tee",
    price: 95,
    desc: "Midnight indigo base. Full-front wax print transfer. Relaxed fit.",
    tags: ["Tee", "Street"],
    collection: "ankara-core",
    featured: false,
    images: [
      "/products/wax-print-tee-1.jpg",
    ],
  },
  {
    slug: "linen-short-set",
    name: "Linen Short Set",
    price: 210,
    desc: "Co-ord in natural linen. Ankara trim at hem and collar.",
    tags: ["Set", "Summer"],
    collection: "ankara-core",
    featured: false,
    images: [
      "/products/linen-short-set-1.jpg",
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns featured products sorted by featuredOrder */
export function getFeaturedProducts(): Product[] {
  return PRODUCTS
    .filter(p => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}

/** Returns all products in a given collection */
export function getByCollection(slug: string): Product[] {
  return PRODUCTS.filter(p => p.collection === slug);
}

/** Returns a single product by slug */
export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}
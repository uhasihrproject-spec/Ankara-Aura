export type Product = {
  slug: string;
  name: string;
  price: number;
  desc: string;
  tags: string[];

  featured?: boolean;        // ✅ easy toggle
  featuredOrder?: number;    // ✅ optional ordering
  images?: string[];         // ✅ auto-update carousel images
};

export const PRODUCTS: Product[] = [
  {
    slug: "ankara-oversized-tee",
    name: "Ankara Oversized Tee",
    price: 120,
    desc: "Black/white base with restrained Ankara accents.",
    tags: ["Tee", "Street"],
    featured: true,
    featuredOrder: 1,
    images: ["/products/ankara-oversized-tee-1.jpg", "/products/ankara-oversized-tee-2.jpg"],
  },
  // add more...
];
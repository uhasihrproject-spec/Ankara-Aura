import { PRODUCTS } from "@/lib/products";
import CollectionsClient from "@/components/home/CollectionsClient";
import type { Product } from "@/lib/products";

export default function Collections() {
  const featured = PRODUCTS
    .filter((p: Product) => p.featured)
    .sort((a: Product, b: Product) => (a.featuredOrder ?? 9999) - (b.featuredOrder ?? 9999));

  return <CollectionsClient featured={featured} />;
}

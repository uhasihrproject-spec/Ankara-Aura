import { getProducts } from "@/lib/products";
import CollectionsClient from "@/components/home/CollectionsClient";

export default async function Collections() {
  const products = await getProducts();

  const featured = products
    .filter((p: any) => p.featured)
    .sort((a: any, b: any) => (a.featuredOrder ?? 9999) - (b.featuredOrder ?? 9999));

  return <CollectionsClient featured={featured} />;
}
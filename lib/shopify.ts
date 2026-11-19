import type { Product, ProductCategory } from "@/lib/data";

const categoryOrder: ProductCategory[] = ["Belts", "Cases", "Rings"];
const tagNames = ["New", "Sale", "Pre-order"] as const;

const QUERY = `{
  products(first: 100) {
    nodes {
      handle
      title
      descriptionHtml
      productType
      tags
      images(first: 10) { nodes { url } }
      options { name values }
      variants(first: 1) { nodes { id price { amount } compareAtPrice { amount } } }
    }
  }
}`;

type ShopifyProduct = {
  handle: string;
  title: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  images: { nodes: { url: string }[] };
  options: { name: string; values: string[] }[];
  variants: {
    nodes: { id: string; price: { amount: string }; compareAtPrice: { amount: string } | null }[];
  };
};

function toProduct(s: ShopifyProduct): Product | null {
  const category = categoryOrder.find((c) => c === s.productType);
  const variant = s.variants.nodes[0];
  if (!category || !variant) return null;

  const price = Math.round(Number(variant.price.amount));
  const oldPrice = Math.round(Number(variant.compareAtPrice?.amount ?? price));
  // Description layout: first paragraph = image alt text, second paragraph = colour / material line.
  const [alt, detail] = [...s.descriptionHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  const sizes = s.options.find((o) => o.name !== "Title")?.values;

  return {
    slug: s.handle,
    variantId: variant.id,
    name: s.title,
    category,
    variant: detail?.replace(/\.$/, "") ?? "",
    price,
    oldPrice,
    tag: tagNames.find((t) => s.tags.includes(t)),
    sizes,
    images: s.images.nodes.map((i) => i.url),
    alt: alt ?? s.title,
  };
}

/** Server only. Reads products from the Shopify Storefront API (cached for 60 seconds). */
export async function getProducts(): Promise<Product[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  if (!domain || !token) throw new Error("Shopify env variables are missing");

  const res = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({ query: QUERY }),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Shopify request failed (${res.status})`);

  const json = await res.json();
  if (json.errors) throw new Error("Shopify returned an error");

  const products = (json.data.products.nodes as ShopifyProduct[])
    .map(toProduct)
    .filter((p): p is Product => p !== null);
  // Belts first, then cases, then rings.
  return products.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

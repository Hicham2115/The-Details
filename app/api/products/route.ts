import { getProducts } from "@/lib/shopify";

export async function GET() {
  try {
    return Response.json(await getProducts());
  } catch (error) {
    console.error("products route failed", error);
    return Response.json({ error: "Could not load products" }, { status: 502 });
  }
}

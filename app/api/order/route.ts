import { DELIVERY_FEE } from "@/lib/data";
import { orderSchema } from "@/lib/schemas";
import { getProducts } from "@/lib/shopify";
import { createShopifyOrder } from "@/lib/shopify-admin";

export async function POST(req: Request) {
  try {
    const body = orderSchema.safeParse(await req.json());
    if (!body.success) {
      return Response.json(
        { error: body.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    const { items, fullName, phone, address } = body.data;

    // Prices always come from Shopify on the server, never from the browser.
    const products = await getProducts();
    let subtotal = 0;
    const lines: { variantId: string; quantity: number }[] = [];
    for (const item of items) {
      const product = products.find((p) => p.slug === item.slug);
      if (!product)
        return Response.json(
          { error: "A product in your cart no longer exists" },
          { status: 400 },
        );
      subtotal += product.price * item.qty;
      lines.push({ variantId: product.variantId, quantity: item.qty });
    }

    const order = await createShopifyOrder({
      fullName,
      phone,
      address,
      lines,
      deliveryFee: DELIVERY_FEE,
    });

    return Response.json({ ok: true, total: subtotal + DELIVERY_FEE, order: order.name });
  } catch (error) {
    console.error("order route failed", error);
    return Response.json({ error: "Could not place your order. Please try again." }, { status: 500 });
  }
}

import { DELIVERY_FEE, getProduct } from "@/lib/data";
import { orderSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const body = orderSchema.safeParse(await req.json());
    if (!body.success) {
      return Response.json(
        { error: body.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    const { items } = body.data;

    // Prices always come from the server, never from the browser.
    let subtotal = 0;
    for (const item of items) {
      const product = getProduct(item.slug);
      if (!product)
        return Response.json(
          { error: "A product in your cart no longer exists" },
          { status: 400 },
        );
      subtotal += product.price * item.qty;
    }
    const delivery = DELIVERY_FEE;

    // TODO: deliver body.data (email, WhatsApp, database...). Nothing is stored yet.
    return Response.json({ ok: true, total: subtotal + delivery });
  } catch (error) {
    console.error("order route failed", error);
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

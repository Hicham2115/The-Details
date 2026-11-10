import { contactSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const body = contactSchema.safeParse(await req.json());
    if (!body.success) {
      return Response.json(
        { error: body.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    // TODO: deliver body.data (email service, WhatsApp, database...). Nothing is stored yet.
    return Response.json({ ok: true });
  } catch (error) {
    console.error("contact route failed", error);
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

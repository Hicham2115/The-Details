import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas";

const TO_EMAIL = "thedetailss.018@gmail.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;width:110px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a8a;vertical-align:top">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:15px;color:#f2f2f2">${value}</td>
  </tr>`;
}

function buildHtml(d: { name: string; email: string; topic: string; message: string }) {
  const email = escapeHtml(d.email);
  const message = d.message ? escapeHtml(d.message).replace(/\n/g, "<br>") : "<em style=\"color:#8a8a8a\">No message</em>";
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px 12px;background:#0b0b0b;font-family:Helvetica,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#141414;border:1px solid #2a2a2a;border-radius:16px">
      <tr><td style="padding:28px 28px 8px">
        <div style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#8a8a8a">The Details</div>
        <h1 style="margin:8px 0 0;font-size:24px;line-height:1.2;color:#ffffff">New contact message</h1>
      </td></tr>
      <tr><td style="padding:12px 28px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("Name", escapeHtml(d.name))}
          ${row("Email", `<a href="mailto:${email}" style="color:#ffffff">${email}</a>`)}
          ${row("Topic", escapeHtml(d.topic))}
        </table>
      </td></tr>
      <tr><td style="padding:8px 28px 28px">
        <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a8a;margin-bottom:8px">Message</div>
        <div style="padding:16px;background:#0b0b0b;border:1px solid #2a2a2a;border-radius:12px;font-size:15px;line-height:1.6;color:#f2f2f2">${message}</div>
      </td></tr>
    </table>
  </body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const body = contactSchema.safeParse(await req.json());
    if (!body.success) {
      return Response.json(
        { error: body.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return Response.json(
        { error: "Email is not set up yet" },
        { status: 500 },
      );
    }

    const { firstName, lastName, topic, email, message } =
      body.data;
    const name = `${firstName} ${lastName}`.trim();

    const { error } = await new Resend(apiKey).emails.send({
      from:
        process.env.CONTACT_FROM_EMAIL ?? "The Details <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `New message from ${name} (${topic})`,
      html: buildHtml({ name, email, topic, message }),
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Topic: ${topic}`,
        "",
        message || "(no message)",
      ].join("\n"),
    });
    if (error) {
      console.error("resend failed", error);
      return Response.json(
        { error: "Could not send your message" },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("contact route failed", error);
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

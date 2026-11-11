import { z } from "zod";

export const TOPICS = [
  "An order",
  "Sizing help",
  "A product",
  "Wholesale / collab",
  "Something else",
] as const;

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .email("Enter a valid email address");

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60, "Max 60 characters"),
  lastName: z.string().trim().max(60, "Max 60 characters"),
  topic: z.enum(TOPICS),
  email: emailSchema,
  newsletter: z.boolean(),
  message: z.string().trim().max(1000, "Max 1000 characters"),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const subscribeSchema = z.object({ email: emailSchema });
export type SubscribeInput = z.infer<typeof subscribeSchema>;

export const AREAS = ["Hay Hassani", "Maarif", "Médina", "Other area in Casablanca"] as const;

export const orderSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80, "Max 80 characters"),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s.-]/g, ""))
    .pipe(z.string().regex(/^(?:\+212|0)[5-7]\d{8}$/, "Enter a valid Moroccan phone number")),
  area: z.enum(AREAS),
  address: z.string().trim().min(5, "Enter your address").max(200, "Max 200 characters"),
  items: z
    .array(
      z.object({
        slug: z.string().min(1).max(80),
        option: z.string().max(40).nullable(),
        qty: z.number().int().min(1).max(10),
      }),
    )
    .min(1, "Your cart is empty")
    .max(30),
});
export type OrderInput = z.infer<typeof orderSchema>;

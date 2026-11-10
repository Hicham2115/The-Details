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

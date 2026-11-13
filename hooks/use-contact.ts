import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors";
import type { ContactInput } from "@/lib/schemas";

export function useContact() {
  return useMutation({
    mutationFn: async (data: ContactInput) =>
      (await api.post("/contact", data)).data,
    onSuccess: () => toast.success("Message sent. We'll get back to you soon."),
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

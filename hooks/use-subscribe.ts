import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors";
import type { SubscribeInput } from "@/lib/schemas";

export function useSubscribe() {
  return useMutation({
    mutationFn: async (data: SubscribeInput) => (await api.post("/subscribe", data)).data,
    onSuccess: () => toast.success("You're on the list. Welcome to The Details."),
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors";
import type { OrderInput } from "@/lib/schemas";

export function useOrder() {
  return useMutation({
    mutationFn: async (data: OrderInput) =>
      (await api.post<{ ok: true; total: number }>("/order", data)).data,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

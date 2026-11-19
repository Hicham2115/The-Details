import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Product } from "@/lib/data";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => (await api.get<Product[]>("/products")).data,
    staleTime: 60_000,
  });
}

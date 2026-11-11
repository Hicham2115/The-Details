import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesState = {
  slugs: string[];
  toggle: (slug: string) => boolean; // returns true if now a favorite
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const isFav = get().slugs.includes(slug);
        set({ slugs: isFav ? get().slugs.filter((s) => s !== slug) : [...get().slugs, slug] });
        return !isFav;
      },
    }),
    { name: "the-details-favorites", skipHydration: true },
  ),
);

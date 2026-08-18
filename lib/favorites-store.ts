"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FavoriteItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
};

type FavoritesState = {
  items: FavoriteItem[];
  toggle: (item: FavoriteItem) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.productId === item.productId);
          return {
            items: exists
              ? state.items.filter((i) => i.productId !== item.productId)
              : [...state.items, item],
          };
        }),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      has: (productId) => get().items.some((i) => i.productId === productId),
    }),
    { name: "tatanka-favorites" }
  )
);

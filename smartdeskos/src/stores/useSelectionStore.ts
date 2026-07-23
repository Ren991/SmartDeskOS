"use client";

import { create } from "zustand";

interface SelectionState {
  selectedId: string | null;

  select: (id: string) => void;

  clear: () => void;

  isSelected: (id: string) => boolean;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedId: null,

  select(id) {
    set({
      selectedId: id,
    });
  },

  clear() {
    set({
      selectedId: null,
    });
  },

  isSelected(id) {
    return get().selectedId === id;
  },
}));
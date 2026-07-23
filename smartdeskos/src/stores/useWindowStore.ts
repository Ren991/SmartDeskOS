import { create } from "zustand";
import type { WindowInstance } from "@/types/window";

interface WindowStore {
  windows: WindowInstance[];

  // Estado del Modal de Alerta estilo SO
  osAlert: string | null;
  showAlert: (message: string) => void;
  closeAlert: () => void;

  addWindow: (window: WindowInstance) => void;
  removeWindow: (id: string) => void;
  updateWindow: (id: string, data: Partial<WindowInstance>) => void;
  focusWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: [],

  // --- Manejo del Modal ---
  osAlert: null,
  showAlert: (message) => set({ osAlert: message }),
  closeAlert: () => set({ osAlert: null }),

  // --- Manejo de Ventanas ---
  addWindow: (window) =>
    set((state) => ({
      windows: [
        ...state.windows.map((w) => ({
          ...w,
          focused: false,
        })),
        {
          ...window,
          focused: true,
          zIndex: Date.now(),
        },
      ],
    })),

  removeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((window) => window.id !== id),
    })),

  updateWindow: (id, data) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id ? { ...window, ...data } : window
      ),
    })),

  focusWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((window) => ({
        ...window,
        focused: window.id === id,
        zIndex: window.id === id ? Date.now() : window.zIndex,
      })),
    })),

  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((window) => {
        if (window.id !== id) return window;

        if (window.maximized) {
          return {
            ...window,
            x: window.previous?.x ?? 100,
            y: window.previous?.y ?? 100,
            width: window.previous?.width ?? 500,
            height: window.previous?.height ?? 350,
            maximized: false,
          };
        }

        return {
          ...window,
          previous: {
            x: window.x,
            y: window.y,
            width: window.width,
            height: window.height,
          },
          maximized: true,
        };
      }),
    })),
}));
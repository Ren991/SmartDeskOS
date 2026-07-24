import type { WindowInstance } from "@/types/window";

const MULTI_INSTANCE_APPS = ["terminal"];

class WindowManager {
  private windows: WindowInstance[] = [];

  open(window: WindowInstance) {
    const allowMultiple = MULTI_INSTANCE_APPS.includes(window.appId);

    // 1. Si NO permite múltiples instancias y ya está abierta, solo le damos foco
    if (!allowMultiple) {
      const existing = this.windows.find((w) => w.appId === window.appId);
      if (existing) {
        this.focus(existing.id);
        return;
      }
    }

    // 2. Límite estricto de 5 ventanas
    if (this.windows.length >= 5) {
      alert("Límite alcanzado: No podés tener más de 5 aplicaciones abiertas a la vez.");
      return;
    }

    // 3. Quitamos el foco a las demás ventanas y abrimos la nueva
    this.windows = this.windows.map((w) => ({ ...w, focused: false }));
    this.windows.push({
      ...window,
      focused: true,
      zIndex: Date.now(),
    });
  }

  close(id: string) {
    this.windows = this.windows.filter((window) => window.id !== id);
  }

  getWindows() {
    return this.windows;
  }

  focus(id: string) {
    this.windows = this.windows.map((window) => ({
      ...window,
      focused: window.id === id,
      zIndex: window.id === id ? Date.now() : window.zIndex,
    }));
  }
}

export const windowManager = new WindowManager();
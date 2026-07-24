import { useWindowStore } from "@/stores/useWindowStore";
import { getAppById } from "@/app/apps/registry";
import { windowManager } from "@/core/window-manager";

const MULTI_INSTANCE_APPS = ["terminal"];

export interface LaunchParams {
  initialCommand?: string;
  file?: {
    name: string;
    content: string;
  };
}

// Agregamos el parámetro opcional params
export function launchApp(appId: string, params?: LaunchParams) {  const app = getAppById(appId);

  if (!app) {
    console.error("App no encontrada:", appId);
    return;
  }

  const { windows, addWindow, focusWindow } = useWindowStore.getState();

  const allowMultiple = MULTI_INSTANCE_APPS.includes(appId);

  if (!allowMultiple) {
    const existingWindow = windows.find((w) => w.appId === appId);
    if (existingWindow) {
      if (focusWindow) {
        focusWindow(existingWindow.id);
      }
      return;
    }
  }

  if (windows.length >= 5) {
    return;
  }
const currentWindows = windowManager.getWindows();
  const sameAppCount = windows.filter((w) => w.appId === appId).length;
  const windowTitle = sameAppCount > 0 ? `${app.name} (${sameAppCount + 1})` : app.name;

  addWindow({
    id: crypto.randomUUID(),
    appId: app.id,
    title: windowTitle,
    x: 120 + windows.length * 25,
    y: 80 + windows.length * 25,
    width: 500,
    height: 350,
    zIndex: Date.now(),
    minimized: false,
    maximized: false,
    focused: true,
    params: params, 
  });
}
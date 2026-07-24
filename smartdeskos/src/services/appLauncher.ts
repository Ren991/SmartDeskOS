import { useWindowStore } from "@/stores/useWindowStore";
import { getAppById } from "@/app/apps/registry";

export function launchApp(appId: string) {
  const app = getAppById(appId);

  if (!app) {
    console.error("App no encontrada:", appId);
    return;
  }

  // Obtenemos las ventanas actuales y las acciones del store sin re-renderizar
  const { windows, addWindow, focusWindow } = useWindowStore.getState();

  // 1. Si la app ya está abierta, la traemos al frente (foco) en lugar de duplicarla
  const existingWindow = windows.find((w) => w.appId === appId);
  if (existingWindow) {
    if (focusWindow) {
      focusWindow(existingWindow.id);
    }
    return;
  }

  // 2. Límite estricto de 5 ventanas abiertas al mismo tiempo
  if (windows.length >= 5) {
    // Podés cambiar este alert por un toast o notificación si preferís
    alert("Límite alcanzado: No podés tener más de 5 aplicaciones abiertas a la vez.");
    return;
  }

  // 3. Si pasa las verificaciones, creamos la ventana
  addWindow({
    id: crypto.randomUUID(),
    appId: app.id,
    title: app.name,
    x: 120 + windows.length * 20, // Desplazamiento sutil (cascade effect) para que no se encimen 100%
    y: 80 + windows.length * 20,
    width: 500,
    height: 350,
    zIndex: Date.now(),
    minimized: false,
    maximized: false,
    focused: true,
  });
}
"use client";

import { Folder, Notebook, Settings } from "lucide-react";
import { APP_REGISTRY } from "@/apps/registry";
import Wallpaper from "../system/Wallpaper";
import { useWindowStore } from "@/stores/useWindowStore";
import { launchApp } from "@/services/appLauncher";
import WindowContainer from "@/components/window/WindowContainer";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import { useLockStore } from "@/stores/useLockStore";
import LockScreen from "../desktop/LockSreen";

export default function Desktop() {
  const addWindow = useWindowStore((state) => state.addWindow);
  const locked = useLockStore((state) => state.locked);
  const unlock = useLockStore((state) => state.unlock);

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none">
      {/* Fondo de pantalla */}
      <Wallpaper />

      {/* Área de íconos del Escritorio */}
      <div className="relative z-10 p-4 h-[calc(100vh-48px)] flex flex-col flex-wrap gap-2 content-start items-start">
        {APP_REGISTRY.map((app) => (
          <DesktopIcon
            key={app.id}
            label={app.name}
            icon={<span className="text-3xl">{app.icon}</span>}
            onDoubleClick={() => {
              launchApp(app.id);
            }}
          />
        ))}
      </div>

      {/* Contenedor de Ventanas Flotantes */}
      <WindowContainer />

      {/* Barra de Tareas (Taskbar) */}
      <Taskbar />

      {/* Pantalla de Bloqueo */}
      {locked && <LockScreen onUnlock={unlock} />}
    </div>
  );
}
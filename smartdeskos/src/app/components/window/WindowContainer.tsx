"use client";

import { useWindowStore } from "@/stores/useWindowStore";
import Window from "./Window";
import { getAppById } from "@/app/apps/registry";

export default function WindowContainer() {
  const windows = useWindowStore((state) => state.windows);

  return (
    <>
      {windows.map((window) => {
        const app = getAppById(window.appId);

        if (!app) return null;

        const Component = app.component;

        return (
          <Window key={window.id} {...window}>
            {/* Le pasamos los params de la ventana como props al componente */}
            <Component initialCommand={window.params?.initialCommand} 
            file={window.params?.file} />
          </Window>
        );
      })}
    </>
  );
}
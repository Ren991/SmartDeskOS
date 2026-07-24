import type { AppDefinition } from "@/types/app";

import DemoApp from "./demo/DemoApp";
import ExplorerApp from "@/app/apps/explorer/ExplorerApp";
import TerminalApp from "./terminal/TerminalApp";
import Calculator from "./calculator/Calculator";
import SmartPad from "./smartPad/SmartPad";
import CodePlayground from "./codePlaygroun/CodePlayground";
import { Code2 } from "lucide-react";
import WeatherApp from "./WeatherApp/WeatherApp";
import MapApp from "./mapApp/MapApp";

export const APP_REGISTRY: AppDefinition[] = [
  {
    id: "demo",
    name: "Demo App",
    icon: "📝",
    component: DemoApp,
  },
  {
    id: "explorer",
    name: "File Explorer",
    icon: "📁",
    keywords: ["files", "folders", "explorer"],
    component: ExplorerApp,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "⌨️",
    keywords: ["terminal", "console", "cmd"],
    component: TerminalApp,
  },
  {
    id: "calculator",
    name: "Calculator",
    icon: "🧮",
    component: Calculator,
  },
  {
    id: "smartpad",
    name: "Smartpad",
    icon: "📝",
    component: SmartPad,
  },
   {
    id: "codeEditor",
    name: "Code Playground",
    icon: "💻",
    component: CodePlayground,
  },
   {
    id: "weather",
    name: "Weather",
    icon: "🌤️", // Emoji directo para el icono de la barra / menú
    component: WeatherApp
  },
  {
    id: "maps",
    name: "Maps",
    icon: "🗺️",
    component: MapApp,
  }

];

export function getAppById(id: string) {
  return APP_REGISTRY.find((app) => app.id === id);
}
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
import WorldClockApp from "./worldClockApp/WorldClockApp";
import MusicApp from "./musicApp/MusicApp";
import NewsReaderApp from "./newReaderApp/NewsReaderApp";

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
    icon: "🌤️", 
    component: WeatherApp
  },
  {
    id: "maps",
    name: "Maps",
    icon: "🗺️",
    component: MapApp,
  },
  {
    id:"clock",
    name:"World Clock",
    icon:"🌐",
    component: WorldClockApp
  },
   {
    id: "musicApp",
    name: "Music Player",
    icon: "🎵",
    component: MusicApp
  },
  {
    id:"newsApp",
    name:"News",
    icon:"📰",
    component: NewsReaderApp
  }

];

export function getAppById(id: string) {
  return APP_REGISTRY.find((app) => app.id === id);
}
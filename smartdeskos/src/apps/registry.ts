import type { AppDefinition }
    from "@/types/app";


import DemoApp
    from "./demo/DemoApp";
import ExplorerApp from "@/apps/explorer/ExplorerApp";
import TerminalApp from "./terminal/TerminalApp";



export const APP_REGISTRY:
    AppDefinition[] = [


        {

            id: "demo",

            name: "Demo App",

            icon: "📝",

            component: DemoApp

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
    icon: "💻",
    keywords: [
        "terminal",
        "console",
        "cmd"
    ],
    component: TerminalApp,
},


    ];



export function getAppById(
    id: string
) {

    return APP_REGISTRY.find(
        app => app.id === id
    );

}
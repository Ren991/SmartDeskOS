"use client";

import { create } from "zustand";
import { FileNode, fileSystem } from "@/core/filesystem";
import { launchApp } from "@/services/appLauncher"; // Importamos launchApp

interface ExplorerState {
  currentFolder: FileNode;
  path: FileNode[];
  openFolder: (id: string) => void;
  openFile: (file: FileNode) => void; // <-- Acción para abrir archivos
  goBack: () => void;
}

function findNode(node: FileNode, id: string): FileNode | null {
  if (node.id === id) return node;

  if (!node.children) return null;

  for (const child of node.children) {
    const result = findNode(child, id);
    if (result) return result;
  }

  return null;
}

export const useExplorerStore = create<ExplorerState>((set, get) => ({
  currentFolder: fileSystem,
  path: [fileSystem],

  openFolder(id) {
    const folder = findNode(fileSystem, id);

    if (!folder || folder.type !== "folder") return;

    set({
      currentFolder: folder,
      path: [...get().path, folder],
    });
  },

  openFile(file) {
    if (file.type !== "file") return;

    // Lanzamos SmartPad pasándole las props del archivo directamente en los params
    launchApp("smartpad", {
      file: {
        name: file.name,
        content: file.content || "",
      },
    });
  },

  goBack() {
    const path = [...get().path];

    if (path.length <= 1) return;

    path.pop();

    set({
      path,
      currentFolder: path[path.length - 1],
    });
  },
}));
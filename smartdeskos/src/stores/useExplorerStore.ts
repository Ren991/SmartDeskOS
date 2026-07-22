"use client";

import { create } from "zustand";
import { FileNode, fileSystem } from "@/core/filesystem";

interface ExplorerState {
  currentFolder: FileNode;

  path: FileNode[];

  openFolder: (id: string) => void;

  goBack: () => void;
}

function findFolder(node: FileNode, id: string): FileNode | null {
  if (node.id === id) return node;

  if (!node.children) return null;

  for (const child of node.children) {
    if (child.type !== "folder") continue;

    const result = findFolder(child, id);

    if (result) return result;
  }

  return null;
}

export const useExplorerStore = create<ExplorerState>((set, get) => ({
  currentFolder: fileSystem,

  path: [fileSystem],

  openFolder(id) {
    const folder = findFolder(fileSystem, id);

    if (!folder) return;

    set({
      currentFolder: folder,
      path: [...get().path, folder],
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
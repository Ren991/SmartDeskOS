"use client";

import { Folder, FileText, ArrowLeft } from "lucide-react";
import { useExplorerStore } from "@/stores/useExplorerStore";
import ExplorerHeader from "./ExploreHeader";
import ExplorerGrid from "./ExplorerGrid";
import ExplorerStatusBar from "./ExplorerStatusBar";
import { useSelectionStore } from "@/stores/useSelectionStore";
import type { FileNode } from "@/core/filesystem"; // 1. Importamos el tipo FileNode

export default function ExplorerApp() {
  const {
    currentFolder,
    path,
    openFolder,
    openFile, // 2. Extraemos openFile desde la store
    goBack,
  } = useExplorerStore();

  const handleItemDoubleClick = (item: FileNode) => {
    if (item.type === "folder") {
      openFolder(item.id);
    } else if (item.type === "file") {
      openFile(item); // Ahora sí existe openFile
    }
  };

  const clearSelection = useSelectionStore((state) => state.clear);

  return (
    <div
      className="
        flex
        h-full
        flex-col
        bg-white
        text-gray-800
      "
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          clearSelection();
        }
      }}
    >
      {/* Header */}
      <ExplorerHeader
        path={path}
        canGoBack={path.length > 1}
        onBack={goBack}
      />

      {/* Content */}
      <div
        className="
          flex-1
          overflow-y-auto
          overflow-x-hidden
        "
      >
        <ExplorerGrid
          items={currentFolder.children ?? []}
          onItemDoubleClick={handleItemDoubleClick} // 3. Pasamos el handler unificado a la grilla
        />
      </div>

      {/* Footer */}
      <ExplorerStatusBar
        totalItems={currentFolder.children?.length ?? 0}
      />
    </div>
  );
}
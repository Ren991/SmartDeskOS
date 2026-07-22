"use client";

import { Folder, FileText, ArrowLeft } from "lucide-react";
import { useExplorerStore } from "@/stores/useExplorerStore";
import ExplorerHeader from "./ExploreHeader";
import ExplorerGrid from "./ExplorerGrid";
import ExplorerStatusBar from "./ExplorerStatusBar";

export default function ExplorerApp() {
  const {
    currentFolder,
    path,
    openFolder,
    goBack,
  } = useExplorerStore();

  return (
    <div className="flex h-full flex-col bg-white text-gray-800">

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
    overflow-auto
  "
>
  <ExplorerGrid
    items={currentFolder.children ?? []}
    onOpenFolder={openFolder}
  />
</div>

      {/* Footer */}

     <ExplorerStatusBar
       totalItems={currentFolder.children?.length ?? 0}
    />

    </div>
  );
}
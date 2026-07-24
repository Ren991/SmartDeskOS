"use client";

import { Folder, FileText } from "lucide-react";
import { FileNode } from "@/core/filesystem/types";
import ExplorerItem from "./ExplorerItem";

interface ExplorerGridProps {
  items: FileNode[];
  onOpenFolder: (id: string) => void;
}

export default function ExplorerGrid({
  items,
  onOpenFolder,
}: ExplorerGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Esta carpeta está vacía.
      </div>
    );
  }

  return (
    <div
  className="
     grid
    grid-cols-[repeat(auto-fill,120px)]
    gap-5
    p-5
    w-full
  "
>

      {items.map((item) => (
  <ExplorerItem
    key={item.id}
    item={item}
    onOpenFolder={onOpenFolder}
  />
))}
    </div>
  );
}
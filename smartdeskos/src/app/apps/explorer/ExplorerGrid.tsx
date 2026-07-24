"use client";

import type { FileNode } from "@/core/filesystem";

interface ExplorerGridProps {
  items: FileNode[];
  onItemDoubleClick: (item: FileNode) => void; // Reemplazamos onOpenFolder por esto
}

export default function ExplorerGrid({
  items,
  onItemDoubleClick,
}: ExplorerGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {items.map((item) => (
        <div
          key={item.id}
          onDoubleClick={() => onItemDoubleClick(item)}
          className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer select-none transition-colors"
        >
          <span className="text-3xl mb-1">
            {item.type === "folder" ? "📁" : "📄"}
          </span>
          <span className="text-xs text-center truncate w-full font-medium">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}
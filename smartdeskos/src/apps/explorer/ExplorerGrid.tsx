"use client";

import { Folder, FileText } from "lucide-react";
import { FileNode } from "@/core/filesystem/types";

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
    grid-cols-[repeat(auto-fill,minmax(120px,120px))]
    gap-4
    p-5
    items-start
  "
>

      {items.map((item) => (
        <button
          key={item.id}
          onDoubleClick={() => {
            if (item.type === "folder") {
              onOpenFolder(item.id);
            }
          }}
          className="group flex flex-col items-center rounded-xl p-3 transition-all duration-150 hover:bg-sky-100 active:scale-95"
        >
          {item.type === "folder" ? (
            <Folder
              size={58}
              className="text-yellow-500 transition-transform group-hover:scale-105"
            />
          ) : (
            <FileText
              size={58}
              className="text-sky-500 transition-transform group-hover:scale-105"
            />
          )}

          <span className="mt-2 max-w-full break-words text-center text-sm">
            {item.name}
          </span>
        </button>
      ))}
    </div>
  );
}
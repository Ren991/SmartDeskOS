"use client";

import { Folder, FileText } from "lucide-react";
import { FileNode } from "@/core/filesystem/types";
import { useSelectionStore } from "@/stores/useSelectionStore";

interface ExplorerItemProps {
  item: FileNode;
  onOpenFolder: (id: string) => void;
}

export default function ExplorerItem({
  item,
  onOpenFolder,
}: ExplorerItemProps) {
  const selectedId = useSelectionStore((state) => state.selectedId);
  const select = useSelectionStore((state) => state.select);

  const selected = selectedId === item.id;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        select(item.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();

        if (item.type === "folder") {
          onOpenFolder(item.id);
        }
      }}
      className={`
        group
        flex
        flex-col
        items-center
        rounded-xl
        p-3
        transition-all
        duration-150
        active:scale-95
        select-none

        ${
          selected
            ? "bg-blue-500/20 ring-1 ring-blue-500"
            : "hover:bg-sky-100"
        }
      `}
    >
      {item.type === "folder" ? (
        <Folder
          size={54}
          className="
            text-yellow-500
            transition-transform
            group-hover:scale-105
          "
        />
      ) : (
        <FileText
          size={54}
          className="
            text-sky-500
            transition-transform
            group-hover:scale-105
          "
        />
      )}

      <span
        className={`
          mt-2
          max-w-full
          break-words
          text-center
          text-sm

          ${
            selected
              ? "font-medium text-blue-700"
              : ""
          }
        `}
      >
        {item.name}
      </span>
    </button>
  );
}
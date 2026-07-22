"use client";

import { ArrowLeft, ArrowRight, RotateCw, Search } from "lucide-react";
import { FileNode } from "@/core/filesystem/types";

interface ExplorerHeaderProps {
  path: FileNode[];
  canGoBack: boolean;
  onBack: () => void;
}

export default function ExplorerHeader({
  path,
  canGoBack,
  onBack,
}: ExplorerHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b bg-gray-50 px-4 py-3">

      {/* Navegación */}

      <div className="flex items-center gap-2">

        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="rounded-md border p-2 hover:bg-gray-100 disabled:opacity-40"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          disabled
          className="rounded-md border p-2 opacity-40"
        >
          <ArrowRight size={18} />
        </button>

        <button
          disabled
          className="rounded-md border p-2 opacity-40"
        >
          <RotateCw size={18} />
        </button>

      </div>

      {/* Breadcrumb */}

      <div className="flex-1 rounded-md border bg-white px-4 py-2 text-sm">

        {path.map(folder => folder.name).join(" > ")}

      </div>

      {/* Buscador (visual por ahora) */}

      <div className="flex w-72 items-center gap-2 rounded-md border bg-white px-3">

        <Search
          size={16}
          className="text-gray-400"
        />

        <input
          type="text"
          placeholder="Buscar..."
          className="w-full py-2 text-sm outline-none"
          disabled
        />

      </div>

    </header>
  );
}
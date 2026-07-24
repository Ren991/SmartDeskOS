"use client";

import { Grid2X2, List } from "lucide-react";

interface ExplorerStatusBarProps {
  totalItems: number;
}

export default function ExplorerStatusBar({
  totalItems,
}: ExplorerStatusBarProps) {

  return (
    <footer className="flex items-center justify-between border-t bg-gray-50 px-4 py-2 text-xs text-gray-500">

      {/* Información */}

      <span>
        {totalItems} elemento{totalItems !== 1 && "s"}
      </span>


      {/* Vista */}

      <div className="flex items-center gap-2">

        <button
          className="rounded-md p-1 hover:bg-gray-200"
          title="Vista cuadrícula"
        >
          <Grid2X2 size={16}/>
        </button>


        <button
          className="rounded-md p-1 opacity-40"
          title="Vista lista"
        >
          <List size={16}/>
        </button>

      </div>

    </footer>
  );
}
"use client";

import { launchApp } from "@/services/appLauncher";

interface Props {
  open: boolean;
  onClose?: () => void;
  onBlock: () => void;
}

export default function StartMenu({ open, onClose, onBlock }: Props) {
  if (!open) return null;

const handleOpenApps = () => {
  // Solo desde acá pasamos el initialCommand
  launchApp("terminal", { initialCommand: "/apps" });

  onClose?.();
};

  return (
    <div className="absolute bottom-14 left-4 w-72 rounded-xl bg-neutral-900/90 backdrop-blur-xl border border-white/10 p-5 text-white shadow-2xl z-[9999]">
      <h2 className="font-bold text-xl mb-4">SmartDeskOS</h2>

      <div className="space-y-2 text-sm">
        <button
          onClick={handleOpenApps}
          className="w-full text-left hover:bg-white/10 rounded p-2 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>📱</span> Apps
        </button>

        <div className="hover:bg-white/10 rounded p-2 cursor-pointer transition-colors">
          Settings
        </div>

        <button
          onClick={() => {
            onBlock();
            onClose?.();
          }}
          className="w-full text-left hover:bg-white/10 rounded p-2 transition-colors cursor-pointer"
        >
          Block
        </button>
      </div>
    </div>
  );
}
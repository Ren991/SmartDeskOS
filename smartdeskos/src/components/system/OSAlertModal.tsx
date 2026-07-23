"use client";

import { AlertTriangle, X } from "lucide-react";
import { useWindowStore } from "@/stores/useWindowStore";

export default function OSAlertModal() {
  const osAlert = useWindowStore((state) => state.osAlert);
  const closeAlert = useWindowStore((state) => state.closeAlert);

  if (!osAlert) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Ventana Modal */}
      <div className="w-[380px] bg-neutral-900/90 border border-white/15 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Barra de título del Modal */}
        <div className="h-9 px-3 bg-white/5 border-b border-white/10 flex items-center justify-between select-none">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <AlertTriangle size={14} className="text-amber-400" />
            <span>SmartDesk System</span>
          </div>
          <button
            onClick={closeAlert}
            className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={12} />
          </button>
        </div>

        {/* Cuerpo del Mensaje */}
        <div className="p-5 flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 shrink-0">
            <AlertTriangle size={22} />
          </div>
          <div className="flex-1 text-sm text-zinc-200 leading-relaxed pt-0.5">
            {osAlert}
          </div>
        </div>

        {/* Botones de acción estilo OS */}
        <div className="p-3 bg-black/20 border-t border-white/10 flex justify-end">
          <button
            onClick={closeAlert}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-medium rounded-md border border-white/10 transition-all shadow-sm"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}
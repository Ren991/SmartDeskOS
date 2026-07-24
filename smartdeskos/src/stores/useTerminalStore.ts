"use client";

import { create } from "zustand";
import { TerminalLine } from "@/app/apps/terminal/types";

interface TerminalState {
  lines: TerminalLine[];

  addLine: (line: TerminalLine) => void;

  clear: () => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  lines: [
    {
      id: crypto.randomUUID(),
      type: "output",
      text: "SmartDeskOS Terminal v1.0",
    },
    {
      id: crypto.randomUUID(),
      type: "output",
      text: "Type /help to list available commands.",
    },
  ],

  addLine(line) {
    set((state) => ({
      lines: [...state.lines, line],
    }));
  },

  clear() {
    set({
      lines: [],
    });
  },
}));
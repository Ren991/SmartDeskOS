"use client";

import { useState, useEffect, useRef } from "react";

import TerminalInput from "./TerminalInput";
import TerminalOutput from "./TerminalOutput";

import { executeCommand } from "@/core/terminal/execute";
import { launchApp } from "@/services/appLauncher";

import { TerminalLine } from "./types";

interface TerminalAppProps {
  initialCommand?: string; // Sin el = "/apps" por defecto
}

export default function TerminalApp({ initialCommand }: TerminalAppProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
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
  ]);

  const hasExecutedRef = useRef(false);

  const addLine = (line: TerminalLine) => {
    setLines((prev) => [...prev, line]);
  };

  function submit(command: string) {
    addLine({
      id: crypto.randomUUID(),
      type: "input",
      text: command,
    });

    const result = executeCommand(command, addLine);

    if (result) {
      if (result.text) {
        addLine({
          id: crypto.randomUUID(),
          type: result.type || "output",
          text: result.text,
        });
      }

      if (result.appId) {
        launchApp(result.appId);
      }
    }
  }

  // SOLO se dispara si vino un initialCommand explícito
  useEffect(() => {
    if (initialCommand && !hasExecutedRef.current) {
      hasExecutedRef.current = true;
      submit(initialCommand);
    }
  }, [initialCommand]);

  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden bg-neutral-900 text-white">
      <TerminalOutput lines={lines} />
      <TerminalInput onSubmit={submit} />
    </div>
  );
}
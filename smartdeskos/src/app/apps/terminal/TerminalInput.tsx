"use client";

import { KeyboardEvent, useState } from "react";

interface Props {
  onSubmit: (value: string) => void;
}

export default function TerminalInput({
  onSubmit,
}: Props) {
  const [value, setValue] = useState("");

  function handleKeyDown(
    e: KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key !== "Enter") return;

    const command = value.trim();

    if (!command) return;

    onSubmit(command);

    setValue("");
  }

  return (
    <div className="flex items-center border-t border-neutral-700 px-4 py-3 font-mono">

      <span className="mr-2 text-green-400">
        &gt;
      </span>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent outline-none text-white"
        autoFocus
      />
    </div>
  );
}
"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Minus,
  Plus
} from "lucide-react";

export default function SmartPad() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16);
  const [hasChanges, setHasChanges] = useState(false);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    setHasChanges(true);
  };

  const changeFontSize = (size: number) => {
    const next = Math.min(48, Math.max(8, size));
    setFontSize(next);
    execCommand("fontSize", "7");

    const fonts = editorRef.current?.querySelectorAll("font[size='7']");
    fonts?.forEach((element) => {
      element.removeAttribute("size");
      (element as HTMLElement).style.fontSize = `${next}px`;
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-neutral-900 text-white">
      <div className="flex items-center gap-1 p-3 border-b border-white/10 bg-black/20 flex-wrap">
        <button
          onClick={() => execCommand("bold")}
          className="toolbar-button"
        >
          <Bold size={18} />
        </button>

        <button
          onClick={() => execCommand("italic")}
          className="toolbar-button"
        >
          <Italic size={18} />
        </button>

        <button
          onClick={() => execCommand("underline")}
          className="toolbar-button"
        >
          <Underline size={18} />
        </button>

        <div className="w-px h-6 bg-white/10 mx-2" />

        <button
          onClick={() => changeFontSize(fontSize + 2)}
          className="toolbar-button"
        >
          <Plus size={18} />
        </button>

        <span className="text-sm px-2">{fontSize}</span>

        <button
          onClick={() => changeFontSize(fontSize - 2)}
          className="toolbar-button"
        >
          <Minus size={18} />
        </button>

        <div className="w-px h-6 bg-white/10 mx-2" />

        <button
          onClick={() => execCommand("justifyLeft")}
          className="toolbar-button"
        >
          <AlignLeft size={18} />
        </button>

        <button
          onClick={() => execCommand("justifyCenter")}
          className="toolbar-button"
        >
          <AlignCenter size={18} />
        </button>

        <button
          onClick={() => execCommand("justifyRight")}
          className="toolbar-button"
        >
          <AlignRight size={18} />
        </button>

        <div className="w-px h-6 bg-white/10 mx-2" />

        <button
          onClick={() => execCommand("insertUnorderedList")}
          className="toolbar-button"
        >
          <List size={18} />
        </button>

        <button
          onClick={() => execCommand("insertOrderedList")}
          className="toolbar-button"
        >
          <ListOrdered size={18} />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => setHasChanges(true)}
        className="flex-1 overflow-auto p-6 outline-none text-lg leading-relaxed"
        style={{
          fontSize: `${fontSize}px`
        }}
      >
        Start writing here...
      </div>

      <div className="h-8 px-4 flex items-center text-xs text-zinc-500 border-t border-white/10">
        {hasChanges ? "Unsaved changes" : "Ready"}
      </div>

      <style jsx>{`
        .toolbar-button {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .toolbar-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
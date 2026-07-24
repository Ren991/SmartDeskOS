"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Extension } from "@tiptap/core";
import { useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Minus,
  Plus,
  Undo,
  Redo,
  Sparkles,
  Type,
} from "lucide-react";

// Lista de las 7 tipografías disponibles
const FONT_FAMILIES = [
  { name: "Sans Serif", value: "ui-sans-serif, system-ui, sans-serif" },
  { name: "Serif", value: "ui-serif, Georgia, Cambria, serif" },
  { name: "Monospace", value: "ui-monospace, SFMono-Regular, monospace" },
  { name: "Roboto", value: "'Roboto', sans-serif" },
  { name: "Poppins", value: "'Poppins', sans-serif" },
  { name: "Playfair Display", value: "'Playfair Display', serif" },
  { name: "Fira Code", value: "'Fira Code', monospace" },
];

// Declaración de tipos alineada con TipTap
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

// Extensión personalizada de FontSize
const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

export default function SmartPad() {
  const [fontSize, setFontSize] = useState(16);
  const [selectedFont, setSelectedFont] = useState(FONT_FAMILIES[0].value);
  const [hasChanges, setHasChanges] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      TextStyle,
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "<p>Empieza a escribir acá y seleccioná cualquier texto...</p>",
    editorProps: {
      attributes: {
        // 'select-text' y 'cursor-text' aseguran la selección normal con el mouse
        class:
          "w-full h-full p-6 outline-none text-zinc-100 leading-relaxed focus:outline-none select-text cursor-text",
      },
    },
    onUpdate: () => {
      setHasChanges(true);
    },
  });

  // Sincronizar tamaño y fuente según la selección activa
  useEffect(() => {
    if (!editor) return;

    const handleSelectionChange = () => {
      // Sincronizar font size
      const currentSize = editor.getAttributes("textStyle").fontSize;
      if (currentSize) {
        const parsed = parseInt(String(currentSize), 10);
        if (!isNaN(parsed)) setFontSize(parsed);
      }

      // Sincronizar font family
      const currentFont = editor.getAttributes("textStyle").fontFamily;
      if (currentFont) {
        setSelectedFont(currentFont);
      }
    };

    editor.on("selectionUpdate", handleSelectionChange);
    return () => {
      editor.off("selectionUpdate", handleSelectionChange);
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-zinc-950 text-zinc-500 text-sm">
        Cargando editor...
      </div>
    );
  }

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.min(48, Math.max(8, fontSize + delta));
    setFontSize(newSize);
    editor.chain().focus().setFontSize(`${newSize}px`).run();
  };

  const handleFontFamilyChange = (fontValue: string) => {
    setSelectedFont(fontValue);
    editor.chain().focus().setFontFamily(fontValue).run();
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950 text-zinc-100 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Cargar Google Fonts de forma dinámica para las tipografías extras */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Poppins:wght@400;500&family=Roboto:wght@400;500&display=swap"
      />

      {/* Toolbar Superior */}
      <div className="flex items-center gap-1.5 p-2.5 border-b border-white/10 bg-zinc-900/60 backdrop-blur-md flex-wrap select-none">
        {/* Selector de Fuentes */}
        <div className="flex items-center gap-1.5 bg-zinc-800/60 rounded-lg px-2 py-1 border border-white/5">
          <Type size={15} className="text-zinc-400" />
          <select
            value={selectedFont}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="bg-transparent text-xs text-zinc-200 outline-none cursor-pointer pr-1"
          >
            {FONT_FAMILIES.map((font) => (
              <option
                key={font.name}
                value={font.value}
                className="bg-zinc-900 text-zinc-100"
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Formato de Texto */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbar-button ${editor.isActive("bold") ? "active" : ""}`}
          title="Negrita"
        >
          <Bold size={17} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbar-button ${editor.isActive("italic") ? "active" : ""}`}
          title="Cursiva"
        >
          <Italic size={17} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`toolbar-button ${editor.isActive("underline") ? "active" : ""}`}
          title="Subrayado"
        >
          <UnderlineIcon size={17} />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Tamaño de Fuente */}
        <div className="flex items-center bg-zinc-800/60 rounded-lg p-0.5 border border-white/5">
          <button
            onClick={() => handleFontSizeChange(-2)}
            className="toolbar-button h-7 w-7"
            title="Reducir tamaño"
          >
            <Minus size={14} />
          </button>

          <span className="text-xs font-mono w-9 text-center text-zinc-300">
            {fontSize}px
          </span>

          <button
            onClick={() => handleFontSizeChange(2)}
            className="toolbar-button h-7 w-7"
            title="Aumentar tamaño"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Alineación */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`toolbar-button ${
            editor.isActive({ textAlign: "left" }) ? "active" : ""
          }`}
          title="Alinear a la izquierda"
        >
          <AlignLeft size={17} />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`toolbar-button ${
            editor.isActive({ textAlign: "center" }) ? "active" : ""
          }`}
          title="Centrar"
        >
          <AlignCenter size={17} />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`toolbar-button ${
            editor.isActive({ textAlign: "right" }) ? "active" : ""
          }`}
          title="Alinear a la derecha"
        >
          <AlignRight size={17} />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Listas */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`toolbar-button ${
            editor.isActive("bulletList") ? "active" : ""
          }`}
          title="Lista con viñetas"
        >
          <List size={17} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`toolbar-button ${
            editor.isActive("orderedList") ? "active" : ""
          }`}
          title="Lista numerada"
        >
          <ListOrdered size={17} />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Deshacer / Rehacer */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="toolbar-button disabled:opacity-30 disabled:hover:bg-transparent"
          title="Deshacer"
        >
          <Undo size={17} />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="toolbar-button disabled:opacity-30 disabled:hover:bg-transparent"
          title="Rehacer"
        >
          <Redo size={17} />
        </button>
      </div>

      {/* Áreas del Editor (Garantizando el scroll y la selección limpia de texto) */}
      <div className="flex-1 overflow-y-auto bg-zinc-950/40 relative">
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* Status Bar */}
      <div className="h-9 px-4 flex items-center justify-between text-xs text-zinc-400 border-t border-white/10 bg-zinc-900/40 select-none">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              hasChanges ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
            }`}
          />
          <span>
            {hasChanges ? "Cambios sin guardar" : "Guardado en el navegador"}
          </span>
        </div>

        <div className="flex items-center gap-4 text-zinc-500">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <Sparkles size={12} /> TipTap Ready
          </span>
        </div>
      </div>
      <style jsx global>{`
        .toolbar-button {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          color: #a1a1aa;
          transition: all 0.15s ease;
        }

        .toolbar-button:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #f4f4f5;
        }

        .toolbar-button.active {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        .ProseMirror {
          user-select: text !important;
          -webkit-user-select: text !important;
          min-height: 100%;
        }

        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror p {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
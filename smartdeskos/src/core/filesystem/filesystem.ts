// @/core/filesystem.ts
import { FileNode } from "./types";

export const fileSystem: FileNode = {
  id: "root",
  name: "Home",
  type: "folder",
  children: [
    {
      id: "desktop",
      name: "Desktop",
      type: "folder",
      children: [
        {
          id: "welcome",
          name: "Welcome.txt",
          type: "file",
          content: "Bienvenido a SmartDeskOS!\n\nEste es un entorno de escritorio web construido con Next.js y React.",
        },
      ],
    },
    {
      id: "documents",
      name: "Documents",
      type: "folder",
      children: [
        {
          id: "smartdeskos",
          name: "SmartDeskOS",
          type: "folder",
          children: [
            {
              id: "roadmap",
              name: "Roadmap.md",
              type: "file",
              content: "# SmartDeskOS Roadmap\n\n- [x] Window Manager\n- [x] Multi-terminal support\n- [ ] Virtual FileSystem Integration\n- [ ] Drag and Drop UI",
            },
          ],
        },
      ],
    },
    {
      id: "downloads",
      name: "Downloads",
      type: "folder",
      children: [],
    },
    {
      id: "pictures",
      name: "Pictures",
      type: "folder",
      children: [],
    },
    {
      id: "music",
      name: "Music",
      type: "folder",
      children: [],
    },
    {
      id: "videos",
      name: "Videos",
      type: "folder",
      children: [],
    },
  ],
};
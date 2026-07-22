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
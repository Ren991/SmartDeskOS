export interface FileNode {
  id: string;
  name: string;
  type: "folder" | "file";
  content?: string;
  children?: FileNode[];
}
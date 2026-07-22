export type FileType = "file" | "folder";

export interface FileNode {
  id: string;

  name: string;

  type: FileType;

  parentId?: string;

  extension?: string;

  content?: string;

  createdAt: Date;

  updatedAt: Date;
}
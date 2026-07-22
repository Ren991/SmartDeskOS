import type { ComponentType, ReactNode } from "react";

export interface AppDefinition {
  id: string;
  name: string;
  description?: string;
  version: string;

  icon: ReactNode;

  component: ComponentType;

  category?: string;

  keywords?: string[];

  commands?: string[];

  singleton?: boolean;

  defaultWidth?: number;
  defaultHeight?: number;

  supportedExtensions?: string[];
}
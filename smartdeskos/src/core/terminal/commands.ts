export interface Command {
  name: string;
  description: string;
}

export const COMMANDS: Command[] = [
  {
    name: "/help",
    description: "Show available commands",
  },
  {
    name: "/apps",
    description: "List installed applications",
  },
  {
    name: "/open",
    description: "Open an application",
  },
  {
    name: "/clear",
    description: "Clear terminal",
  },
  {
    name: "/github",
    description: "Open GitHub profile",
  },
  {
    name: "/linkedin",
    description: "Open LinkedIn profile",
  },
  {
    name: "/portfolio",
    description: "Open portfolio",
  },
  {
    name: "/about",
    description: "About SmartDeskOS",
  },
  {
    name: "/version",
    description: "Show system version",
  },
];
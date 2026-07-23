export interface TerminalLine {
  id: string;
  type: "input" | "output" | "error";

  text: string;
}
"use client";

import { TerminalLine } from "./types";


interface Props {

  lines: TerminalLine[];

}


export default function TerminalOutput({
  lines,
}: Props) {


  return (

    <div
      className="
        flex-1
        min-h-0
        overflow-y-auto
        p-4
        font-mono
        text-sm
        whitespace-pre-wrap
      "
    >

      {
        lines.map(line => (

          <div
            key={line.id}
            className={
              line.type === "error"
              ?
              "text-red-400"
              :
              line.type === "input"
              ?
              "text-green-400"
              :
              "text-gray-200"
            }
          >

            {
              line.type === "input"
              ?
              `> ${line.text}`
              :
              line.text
            }

          </div>

        ))
      }


    </div>

  );

}
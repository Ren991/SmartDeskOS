"use client";

import { useEffect, useRef } from "react";
import { TerminalLine } from "./types";


interface Props {
  lines: TerminalLine[];
}


export default function TerminalOutput({
  lines,
}: Props) {


  const bottomRef = useRef<HTMLDivElement>(null);



  useEffect(()=>{

    bottomRef.current?.scrollIntoView({
      behavior:"smooth"
    });


  },[lines]);



  return (

    <div
      className="
        flex-1
        w-full
        min-h-0
        overflow-y-auto
        p-4
        font-mono
        text-sm
      "
    >

      {
        lines.map(line=>(

          <div
            key={line.id}
            className={
              line.type==="error"
              ?
              "text-red-400"
              :
              line.type==="input"
              ?
              "text-green-400"
              :
              "text-gray-200"
            }
          >

            {
              line.type==="input"
              ?
              `> ${line.text}`
              :
              line.text
            }

          </div>

        ))
      }


      {/* punto invisible para hacer scroll */}
      <div ref={bottomRef}/>


    </div>

  );

}
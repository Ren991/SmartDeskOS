"use client";

import { useState } from "react";

import TerminalInput from "./TerminalInput";
import TerminalOutput from "./TerminalOutput";

import { executeCommand } from "@/core/terminal/execute";
import { launchApp } from "@/services/appLauncher";

import { TerminalLine } from "./types";


export default function TerminalApp() {


  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: crypto.randomUUID(),
      type: "output",
      text: "SmartDeskOS Terminal v1.0",
    },
    {
      id: crypto.randomUUID(),
      type: "output",
      text: "Type /help to list available commands.",
    },
  ]);



  function submit(command:string){


    setLines(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type:"input",
        text:command
      }
    ]);



    const result =
      executeCommand(command);



    setLines(prev => [
      ...prev,
      {
        id:crypto.randomUUID(),
        type:result.type,
        text:result.text
      }
    ]);



    if(result.appId){

      launchApp(result.appId);

    }

  }



  return (

    <div
      className="
        flex
        h-full
        w-full
        min-h-0
        flex-col
        overflow-hidden
        bg-neutral-900
        text-white
      "
    >

      <TerminalOutput
        lines={lines}
      />


      <TerminalInput
        onSubmit={submit}
      />


    </div>

  );
}
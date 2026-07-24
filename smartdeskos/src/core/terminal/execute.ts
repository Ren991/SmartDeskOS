import { COMMANDS } from "./commands";
import { APP_REGISTRY } from "@/app/apps/registry";
import { LINK_REGISTRY } from "@/app/apps/terminal/links";
import { TerminalLine } from "@/app/apps/terminal/types";

export interface ExecuteResult {
  type: "output" | "error";
  text: string;
  action?: "clear";
  appId?: string;
}


export function executeCommand(
input: string, addLine: (line: TerminalLine) => void): ExecuteResult {


  const args =
    input.trim().split(" ");


  const command =
    args[0];


  switch(command){


    case "/help":

      return {

        type:"output",

        text:
          COMMANDS
          .map(
            (            cmd: { name: any; description: any; }) =>
            `${cmd.name} - ${cmd.description}`
          )
          .join("\n")

      };



    case "/apps":

      return {

        type:"output",

        text:
          APP_REGISTRY
          .map(
            (            app: { icon: any; name: any; }) =>
            `${app.icon} ${app.name}`
          )
          .join("\n")

      };



    case "/about":

      return {

        type:"output",

        text:
        "SmartDeskOS is a web desktop environment built with Next.js."

      };



    case "/version":

      return {

        type:"output",

        text:
        "SmartDeskOS v1.0.0"

      };



    case "/clear":

      return {

        type:"output",

        text:"",

        action:"clear"

      };



    case "/open": {


      const appId =
        args[1];


      if(!appId){

        return {

          type:"error",

          text:
          "Usage: /open <app>"

        };

      }


      const exists =
        APP_REGISTRY.some(
          (          app: { id: string; }) =>
          app.id === appId
        );


      if(!exists){

        return {

          type:"error",

          text:
          `Application "${appId}" not found`

        };

      }


      return {

        type:"output",

        text:
        `Opening ${appId}...`,

        appId

      };


    }

case "/github":
case "/linkedin":
case "/portfolio": {

  const link = LINK_REGISTRY[command];


  if(!link){

    return {
      type:"error",
      text:`Link "${command}" not configured`
    };

  }


  if(typeof window !== "undefined"){

    window.open(
      link.url,
      "_blank",
      "noopener,noreferrer"
    );

  }


  return {

    type:"output",

    text:
      `Opening ${link.name}...`

  };

}

    default:

      return {

        type:"error",

        text:
        `Command "${command}" not found.\nType /help.`

      };


  }


}
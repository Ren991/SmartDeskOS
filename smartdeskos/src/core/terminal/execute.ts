import { COMMANDS } from "./commands";
import { APP_REGISTRY } from "@/apps/registry";

export interface ExecuteResult {
  type: "output" | "error";
  text: string;
  action?: "clear";
  appId?: string;
}


export function executeCommand(
  input: string
): ExecuteResult {


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



    default:

      return {

        type:"error",

        text:
        `Command "${command}" not found.\nType /help.`

      };


  }


}
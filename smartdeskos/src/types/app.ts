import type { ComponentType } from "react";


export interface AppDefinition {

  id:string;

  name:string;

  icon:string ;

  keywords?:string[];

  component: ComponentType<any>;

}
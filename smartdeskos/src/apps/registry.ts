import type { AppDefinition }
from "@/types/app";


import DemoApp
from "./demo/DemoApp";



export const APP_REGISTRY:
AppDefinition[] = [


{

id:"demo",

name:"Demo App",

icon:"📝",

component:DemoApp

}


];



export function getAppById(
id:string
){

return APP_REGISTRY.find(
app=>app.id===id
);

}
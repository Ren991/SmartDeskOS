"use client";


import {
Folder,
Notebook,
Settings
}
from "lucide-react";


import Wallpaper
from "../system/Wallpaper";

import {useWindowStore}
from "@/stores/useWindowStore";

import {
launchApp
}
from "@/services/appLauncher";

import WindowContainer
from "@/components/window/WindowContainer";


import DesktopIcon
from "./DesktopIcon";


import Taskbar
from "./Taskbar";



export default function Desktop(){

const addWindow =
useWindowStore(
state=>state.addWindow
);


return (

<div
className="
relative
h-screen
w-screen
overflow-hidden
"
>


<Wallpaper/>


<div
className="
relative
z-10
p-5
flex
flex-col
gap-4
"
>


{/* <DesktopIcon

label="Explorer"

icon={
<Folder/>
}

/> */}

<DesktopIcon

label="Demo App"

icon={<Folder/>}


onDoubleClick={()=>{

launchApp("demo")

}}

/>



<DesktopIcon

label="Notes"

icon={
<Notebook/>
}

/>



<DesktopIcon

label="Settings"

icon={
<Settings/>
}

/>



</div>

<WindowContainer/>


<button

onClick={()=>{

addWindow({

id:
crypto.randomUUID(),

appId:"demo",

title:"Demo App",

x:100,

y:100,

width:500,

height:350,

zIndex:Date.now(),

minimized:false,

maximized:false,

focused:true

})

}}

className="
absolute
top-5
right-5
z-50
bg-white
text-black
px-4
py-2
rounded
"

>

Open Demo

</button>

<Taskbar/>


</div>


);


}
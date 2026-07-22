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




<Taskbar/>


</div>


);


}
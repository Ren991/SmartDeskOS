"use client";


import {
Folder,
Notebook,
Settings
}
from "lucide-react";


import Wallpaper
from "../system/Wallpaper";


import DesktopIcon
from "./DesktopIcon";


import Taskbar
from "./Taskbar";



export default function Desktop(){


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


<DesktopIcon

label="Explorer"

icon={
<Folder/>
}

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



<Taskbar/>


</div>


);


}
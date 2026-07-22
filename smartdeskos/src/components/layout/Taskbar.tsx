"use client";


import {
 useState
} from "react";


import {
 Grid
} from "lucide-react";

import OpenWindows
from "@/components/taskbar/OpenWindows";


import Clock
from "./Clock";


import StartMenu
from "./StartMenu";



export default function Taskbar(){


const [open,setOpen]=useState(false);



return (

<>


<StartMenu
open={open}
/>



<div
className="
absolute
bottom-0
left-0
right-0
h-14
bg-black/40
backdrop-blur-xl
border-t
border-white/10
flex
items-center
justify-between
px-4
"
>


<button

onClick={()=>setOpen(!open)}

className="
text-white
hover:bg-white/10
p-2
rounded-lg
transition
"

>

<Grid size={26}/>

</button>




{/* <div>

</div> */}

<OpenWindows/>



<Clock/>


</div>


</>

);

}
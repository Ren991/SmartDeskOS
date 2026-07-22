"use client";


import {
useWindowStore
}
from "@/stores/useWindowStore";



export default function OpenWindows(){


const windows =
useWindowStore(
state=>state.windows
);


const updateWindow =
useWindowStore(
state=>state.updateWindow
);



const focusWindow =
useWindowStore(
state=>state.focusWindow
);



return (

<div
className="
flex
items-center
gap-2
ml-4
"
>


{
windows.map(window=>(


<button

key={window.id}


onClick={()=>{


if(window.minimized){


updateWindow(

window.id,

{

minimized:false

}

);


}


focusWindow(window.id);


}}


className={`
px-3
py-1
rounded-lg
text-sm
text-white
transition

${
window.focused

?

"bg-white/20"

:

"bg-white/10"

}

`}


>

{window.title}


</button>


))

}



</div>

);


}
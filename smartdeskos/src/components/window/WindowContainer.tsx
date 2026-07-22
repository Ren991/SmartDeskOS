"use client";


import {
useWindowStore
}
from "@/stores/useWindowStore";


import Window
from "./Window";


import DemoApp
from "@/apps/demo/DemoApp";



export default function WindowContainer(){


const windows =
useWindowStore(
state=>state.windows
);



return (

<>

{
windows.map(window=>(


<Window

key={window.id}

{...window}

>

<DemoApp/>


</Window>


))

}


</>


);

}
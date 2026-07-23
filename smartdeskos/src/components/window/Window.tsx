"use client";


import { useEffect, useState } from "react";

import { Rnd } from "react-rnd";

import WindowHeader from "./WindowHeader";

import {
  useWindowStore
} from "@/stores/useWindowStore";


interface Props {

  id:string;

  title:string;

  children:React.ReactNode;

  x:number;

  y:number;

  width:number;

  height:number;

  zIndex:number;

  minimized:boolean;

  maximized:boolean;

}



export default function Window({

id,
title,
children,
x,
y,
width,
height,
zIndex,
minimized,
maximized

}:Props){



const updateWindow =
useWindowStore(
state=>state.updateWindow
);


const removeWindow =
useWindowStore(
state=>state.removeWindow
);


const focusWindow =
useWindowStore(
state=>state.focusWindow
);


const maximizeWindow =
useWindowStore(
state=>state.maximizeWindow
);



const [screen,setScreen]=
useState({

width:800,

height:600

});



useEffect(()=>{


setScreen({

width:window.innerWidth,

height:
window.innerHeight - 56

});


},[]);




if(minimized)
return null;



return (


<Rnd


position={

maximized

?

{
x:0,
y:0
}

:

{
x,
y
}

}



size={

maximized

?

{
width:screen.width,
height:screen.height
}

:

{
width,
height
}

}



style={{

zIndex

}}



onMouseDown={()=>focusWindow(id)}



onDragStop={(e,data)=>{


updateWindow(

id,

{

x:data.x,

y:data.y

}

)


}}




onResizeStop={(e,d,ref,delta,pos)=>{


updateWindow(

id,

{

width:ref.offsetWidth,

height:ref.offsetHeight,

x:pos.x,

y:pos.y

}

)


}}



>


<div

className="
flex
h-full
flex-col
bg-neutral-800
rounded-xl
overflow-hidden
border
border-white/10
shadow-2xl
"

>


<WindowHeader

title={title}


onMinimize={()=>{


updateWindow(

id,

{

minimized:true

}

);


}}



onMaximize={()=>{


maximizeWindow(id);


}}



onClose={()=>{


removeWindow(id);


}}



/>



<div

className="
flex
flex-1
min-h-0
overflow-hidden
p-0
text-white
w-full
"

>

{children}

</div>


</div>


</Rnd>


);


}
"use client";


import {
useWindowStore
}
from "@/stores/useWindowStore";


import Window
from "./Window";


import {
getAppById
}
from "@/apps/registry";



export default function WindowContainer(){


const windows =
useWindowStore(
state=>state.windows
);



return (

<>

{

windows.map(window=>{


const app =
getAppById(
window.appId
);



if(!app)
return null;



const Component =
app.component;



return (

<Window

key={window.id}

{...window}

>


<Component/>


</Window>


)


})


}


</>

);


}
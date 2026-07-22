"use client";


import { useEffect,useState } from "react";


export default function Clock(){

const [date,setDate]=useState(
 new Date()
);


useEffect(()=>{


const timer =
setInterval(()=>{

setDate(new Date());

},1000);



return ()=>clearInterval(timer);


},[]);



return (

<div
className="
text-white
text-sm
leading-tight
text-right
"
>


<div>

{
date.toLocaleTimeString(
"es-AR",
{
hour:"2-digit",
minute:"2-digit"
}
)
}

</div>


<div className="opacity-70">

{
date.toLocaleDateString(
"es-AR",
{
weekday:"short",
day:"2-digit",
month:"short"
}
)
}

</div>


</div>

);


}
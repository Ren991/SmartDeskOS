"use client";


import {
useEffect,
useState
} from "react";


export default function Clock(){


const [mounted,setMounted] = useState(false);


const [date,setDate] =
useState<Date | null>(null);



useEffect(()=>{


setMounted(true);

setDate(new Date());


const timer =
setInterval(()=>{

setDate(new Date());

},1000);



return ()=>clearInterval(timer);


},[]);



if(!mounted || !date){

return (

<div
className="
text-white
text-sm
"
>

--:--

</div>

);

}



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


<div
className="opacity-70"
>

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
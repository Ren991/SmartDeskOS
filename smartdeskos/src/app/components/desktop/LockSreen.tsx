"use client";

import {
  useEffect,
  useState
} from "react";


interface Props {

  onUnlock:()=>void;

}



export default function LockScreen({
  onUnlock
}:Props){


const [date,setDate]=useState(
  new Date()
);


const [visible,setVisible]=useState(false);



useEffect(()=>{


setTimeout(()=>{

  setVisible(true);

},50);



const timer=setInterval(()=>{

setDate(
 new Date()
);

},1000);



const handleKey=(e:KeyboardEvent)=>{


if(e.key==="Enter"){

unlock();

}


};



window.addEventListener(
"keydown",
handleKey
);



return()=>{

clearInterval(timer);


window.removeEventListener(
"keydown",
handleKey
);

};


},[]);





const unlock=()=>{


setVisible(false);


setTimeout(()=>{

onUnlock();

},500);


};




return (

<div

className={`
fixed
inset-0
z-[9999]
bg-cover
bg-center
transition-all
duration-500

${
visible
?
"opacity-100 scale-100"
:
"opacity-0 scale-105"
}

`}

style={{

backgroundImage:
"url('/wallpaper.jpg')"

}}

>



<div
className="
absolute
inset-0
bg-black/40
backdrop-blur-sm
"
/>




<div

className={`
relative
h-full
flex
flex-col
items-center
justify-center
text-white

transition-all
duration-700

${
visible
?
"opacity-100 translate-y-0"
:
"opacity-0 translate-y-5"
}

`}

>



<div
className="
text-8xl
font-semibold
"
>

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
className="
mt-4
text-2xl
capitalize
opacity-90
"
>

{
date.toLocaleDateString(
"es-AR",
{
weekday:"long",
day:"2-digit",
month:"long",
year:"numeric"
}
)
}

</div>




<div
className="
mt-12
text-sm
opacity-70
"
>

Press ENTER to continue

</div>



</div>



</div>

);


}
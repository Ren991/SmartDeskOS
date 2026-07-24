import type {ReactNode}
from "react";


interface Props{

label:string;

icon:ReactNode;

onDoubleClick?:()=>void;

}



export default function DesktopIcon({

label,

icon,

onDoubleClick

}:Props){



return (

<div

onDoubleClick={onDoubleClick}


className="
w-20
flex
flex-col
items-center
gap-2
cursor-pointer
rounded-lg
p-2
text-white
hover:bg-white/10
transition
"

>


<div
className="text-4xl"
>

{icon}

</div>


<span
className="text-sm text-center"
>

{label}

</span>


</div>

);


}
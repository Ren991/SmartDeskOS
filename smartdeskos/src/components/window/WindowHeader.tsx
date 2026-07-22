import {
Minus,
Square,
X
}
from "lucide-react";


interface Props {

title:string;

onMinimize:()=>void;

onMaximize:()=>void;

onClose:()=>void;

}



export default function WindowHeader({
title,
onMinimize,
onMaximize,
onClose
}:Props){


return (

<div
className="
h-10
bg-neutral-900
text-white
flex
items-center
justify-between
px-3
cursor-move
select-none
"
>


<span>

{title}

</span>


<div
className="
flex
gap-2
"
>


<button
onClick={onMinimize}
className="hover:bg-white/10 p-1 rounded"
>
<Minus size={16}/>
</button>


<button
onClick={onMaximize}
className="hover:bg-white/10 p-1 rounded"
>
<Square size={14}/>
</button>


<button
onClick={onClose}
className="hover:bg-red-500 p-1 rounded"
>
<X size={16}/>
</button>


</div>


</div>

);

}
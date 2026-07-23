"use client";

import { useEffect, useState } from "react";
import { Monitor, Smartphone, Sparkles } from "lucide-react";


interface Props {
  children: React.ReactNode;
}


export default function DesktopOnly({
  children
}: Props) {


const [isDesktop,setIsDesktop] = useState(true);



useEffect(()=>{


const checkScreen = () => {

setIsDesktop(
  window.innerWidth >= 724
);

};



checkScreen();


window.addEventListener(
"resize",
checkScreen
);



return()=>{

window.removeEventListener(
"resize",
checkScreen
);

};


},[]);





if(!isDesktop){


return (

<div
className="
fixed
inset-0
overflow-hidden
bg-zinc-950
flex
items-center
justify-center
p-6
"
>


<div
className="
absolute
inset-0
bg-gradient-to-br
from-cyan-500/20
via-blue-500/10
to-purple-500/20
"
/>



<div
className="
absolute
w-[500px]
h-[500px]
bg-cyan-400/20
blur-[120px]
rounded-full
top-[-150px]
left-[-150px]
"
/>



<div
className="
absolute
w-[400px]
h-[400px]
bg-purple-500/20
blur-[120px]
rounded-full
bottom-[-100px]
right-[-100px]
"
/>





<div
className="
relative
max-w-md
w-full
text-center
text-white
rounded-3xl
border
border-white/10
bg-white/5
backdrop-blur-2xl
shadow-2xl
p-8
animate-[fadeIn_0.6s_ease-out]
"
>



<div
className="
flex
justify-center
mb-8
"
>


<div
className="
relative
"
>


<div
className="
absolute
inset-0
bg-cyan-400/30
blur-2xl
rounded-full
"
/>



<div
className="
relative
w-28
h-28
rounded-3xl
bg-black/40
border
border-white/10
flex
items-center
justify-center
"
>


<Monitor
size={64}
className="
text-cyan-400
"
/>



<div
className="
absolute
bottom-3
right-3
bg-zinc-900
rounded-full
p-1
border
border-white/10
"
>


<Smartphone
size={28}
className="
text-red-400
"
/>


</div>


</div>


</div>


</div>






<div
className="
flex
items-center
justify-center
gap-2
text-cyan-400
text-sm
mb-3
"
>

<Sparkles size={16}/>

SMARTDESKOS EXPERIENCE

<Sparkles size={16}/>

</div>





<h1
className="
text-4xl
font-bold
mb-4
tracking-tight
"
>

Desktop Experience Required

</h1>





<p
className="
text-zinc-300
leading-relaxed
text-base
"
>

SmartDeskOS is designed to deliver a complete desktop operating system experience.

<br />
<br />

Please access this platform from a desktop computer or laptop to enjoy all features, applications and interactions.

</p>





<div
className="
mt-8
px-5
py-3
rounded-xl
bg-white/5
border
border-white/10
text-sm
text-zinc-400
"
>

🖥️ Best experienced on a screen wider than 724px

</div>




</div>



</div>

);


}



return <>{children}</>;


}
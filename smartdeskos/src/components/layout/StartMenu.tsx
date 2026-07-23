interface Props {

open:boolean;
onBlock:()=>void;

}



export default function StartMenu({
open, onBlock
}:Props){


if(!open)
return null;



return (

<div
className="
absolute
bottom-14
left-4
w-72
rounded-xl
bg-neutral-900/90
backdrop-blur-xl
border
border-white/10
p-5
text-white
shadow-2xl
z-[9999]
"
>


<h2
className="
font-bold
text-xl
mb-4
"
>

SmartDeskOS

</h2>


<div className="
space-y-2
text-sm
"
>


<div
className="
hover:bg-white/10
rounded
p-2
"
>
Apps
</div>


<div
className="
hover:bg-white/10
rounded
p-2
"
>
Settings
</div>


<button

onClick={onBlock}

className="
w-full
text-left
hover:bg-white/10
rounded
p-2
"

>

Block

</button>


</div>


</div>

);


}
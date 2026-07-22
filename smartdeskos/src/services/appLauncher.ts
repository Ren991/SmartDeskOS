import {
useWindowStore
}
from "@/stores/useWindowStore";


import {
getAppById
}
from "@/apps/registry";



export function launchApp(
appId:string
){


const app =
getAppById(appId);



if(!app){

console.error(
"App no encontrada:",
appId
);

return;

}



const addWindow =
useWindowStore.getState()
.addWindow;



addWindow({

id:
crypto.randomUUID(),

appId:

app.id,


title:

app.name,


x:120,

y:80,


width:500,

height:350,


zIndex:Date.now(),


minimized:false,


maximized:false,


focused:true

});


}
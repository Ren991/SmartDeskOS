import { create } from "zustand";

import type { WindowInstance } from "@/types/window";


interface WindowStore {

 windows: WindowInstance[];

 addWindow:
  (window:WindowInstance)=>void;

 removeWindow:
  (id:string)=>void;

}



export const useWindowStore =
create<WindowStore>((set)=>({

 windows:[],


 addWindow:(window)=>

 set(state=>({

  windows:[
    ...state.windows,
    window
  ]

 })),



 removeWindow:(id)=>

 set(state=>({

 windows:
  state.windows.filter(
    window=>window.id!==id
  )

 }))


}));
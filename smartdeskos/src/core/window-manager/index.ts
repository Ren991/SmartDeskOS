import type { WindowInstance } from "@/types/window";


class WindowManager {


 private windows: WindowInstance[] = [];


 open(window: WindowInstance){

    this.windows.push(window);

 }


 close(id:string){

    this.windows =
      this.windows.filter(
        window => window.id !== id
      );

 }


 getWindows(){

    return this.windows;

 }


 focus(id:string){

    this.windows =
      this.windows.map(window=>({

        ...window,

        focused:
          window.id === id,

        zIndex:
          window.id === id
            ? Date.now()
            : window.zIndex

      }));

 }


}


export const windowManager = new WindowManager();
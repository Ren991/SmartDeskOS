export interface WindowInstance {

  id: string;

  appId: string;

  title: string;


  x: number;

  y: number;


  width: number;

  height: number;


  previous?: {

    x:number;

    y:number;

    width:number;

    height:number;

  };


  zIndex:number;


  minimized:boolean;

  maximized:boolean;

  focused:boolean;

  params?: { initialCommand?: string };

}
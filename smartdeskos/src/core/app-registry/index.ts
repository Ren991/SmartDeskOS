import type { AppDefinition } from "@/types/app";


class AppRegistry {

  private apps: AppDefinition[] = [];


  register(app: AppDefinition) {

    const exists = this.apps.some(
      item => item.id === app.id
    );


    if(!exists){
      this.apps.push(app);
    }

  }


  getApps(){

    return this.apps;

  }


  getApp(id:string){

    return this.apps.find(
      app => app.id === id
    );

  }


  search(query:string){

    const value = query.toLowerCase();


    return this.apps.filter(app =>

      app.name
        .toLowerCase()
        .includes(value)

      ||

      app.keywords?.some((keyword: string | string[]) =>
        keyword.includes(value)
      )

    );

  }

}


export const appRegistry = new AppRegistry();
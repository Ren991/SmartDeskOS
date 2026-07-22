import type { FileNode } from "@/types/filesystem";


class FileSystem {


 private files: FileNode[] = [];


 createFile(file:FileNode){

    this.files.push(file);

 }


 deleteFile(id:string){

    this.files =
      this.files.filter(
        file=>file.id !== id
      );

 }


 getFiles(){

    return this.files;

 }


}


export const fileSystem = new FileSystem();
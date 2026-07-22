"use client";


import { ReactNode } from "react";


interface Props {

 children:ReactNode;

}


export default function AppProviders({
 children
}:Props){


 return (

    <>
      {children}
    </>

 );


}
"use client";

import { useEffect, useState } from "react";
import CalendarPopup from "./CalendarPopup";


export default function Clock() {


  const [mounted, setMounted] = useState(false);

  const [date, setDate] = useState<Date | null>(null);

  const [open, setOpen] = useState(false);



  useEffect(() => {

    setMounted(true);

    setDate(new Date());


    const timer = setInterval(() => {

      setDate(new Date());

    }, 1000);



    return () => clearInterval(timer);


  }, []);





/*   useEffect(() => {


    function handleOutsideClick(event: MouseEvent) {


      const target = event.target as HTMLElement;



      const clickInsideCalendar =
        target.closest(".calendar-container");



      const clickInsideClock =
        target.closest(".clock-button");




      if (
        !clickInsideCalendar &&
        !clickInsideClock
      ) {

        setOpen(false);

      }


    }



    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );



    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };


  }, []); */






  if (!mounted || !date) {

    return (

      <div className="text-white text-sm">
        --:--
      </div>

    );

  }







  return (

    <div className="relative">


      <button
        className="
        clock-button
        text-white
        text-sm
        leading-tight
        text-right
        px-3
        py-2
        rounded-lg
        hover:bg-white/10
        transition
        "
        onClick={() => setOpen(prev => !prev)}
      >


        <div className="font-medium">

          {
            date.toLocaleTimeString(
              "es-AR",
              {
                hour: "2-digit",
                minute: "2-digit"
              }
            )
          }

        </div>




        <div className="opacity-70">

          {
            date.toLocaleDateString(
              "es-AR",
              {
                weekday: "short",
                day: "2-digit",
                month: "short"
              }
            )
          }

        </div>


      </button>





      {
        open && (

          <CalendarPopup
            selectedDate={date}
          />

        )
      }



    </div>

  );


}
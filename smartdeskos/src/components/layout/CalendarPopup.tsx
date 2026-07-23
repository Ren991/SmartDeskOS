"use client";

import { useState } from "react";


interface Props {

  selectedDate: Date;

}



export default function CalendarPopup({
  selectedDate
}: Props) {



  const [currentMonth, setCurrentMonth] = useState(
    new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    )
  );




  const year = currentMonth.getFullYear();

  const month = currentMonth.getMonth();





  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();




  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();




  const days = Array.from(
    {
      length: daysInMonth
    },
    (_, index) => index + 1
  );






  const previousMonth = () => {


    setCurrentMonth(
      new Date(
        year,
        month - 1,
        1
      )
    );


  };






  const nextMonth = () => {

    setCurrentMonth(
      new Date(
        year,
        month + 1,
        1
      )
    );


  };







  const goToday = () => {


    const now = new Date();


    setCurrentMonth(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
    );


  };







  const monthName = currentMonth
    .toLocaleDateString(
      "es-AR",
      {
        month: "long",
        year: "numeric"
      }
    )
    .replace(
      /^\w/,
      char => char.toUpperCase()
    );







  return (

    <div
      className="
      calendar-container
      absolute
      bottom-14
      right-0
      w-80
      rounded-2xl
      bg-zinc-900/95
      border
      border-white/10
      shadow-2xl
      backdrop-blur-xl
      p-5
      text-white
      z-50
      "
    >





      <div className="
        text-center
        mb-5
      ">


        <div className="
          text-4xl
          font-semibold
        ">

          {
            selectedDate.toLocaleTimeString(
              "es-AR",
              {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              }
            )
          }

        </div>




        <div className="
          opacity-70
          capitalize
        ">

          {
            selectedDate.toLocaleDateString(
              "es-AR",
              {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
              }
            )
          }

        </div>


      </div>







      <div className="
        flex
        justify-between
        items-center
        mb-4
      ">


        <button
          onClick={previousMonth}
          className="
          w-8
          h-8
          rounded-lg
          hover:bg-white/10
          "
        >
          ←
        </button>




        <span className="
          text-sm
          font-semibold
        ">
          {monthName}
        </span>




        <button
          onClick={nextMonth}
          className="
          w-8
          h-8
          rounded-lg
          hover:bg-white/10
          
          "
        >
          →
        </button>


      </div>







      <button
        onClick={goToday}
        className="
        w-full
        mb-4
        py-2
        rounded-lg
        bg-white/5
        hover:bg-white/10
        text-xs
        "
      >
        Hoy
      </button>







      <div className="
        grid
        grid-cols-7
        text-xs
        opacity-60
        mb-2
        text-center
      ">


        {
          [
            "Do",
            "Lu",
            "Ma",
            "Mi",
            "Ju",
            "Vi",
            "Sa"
          ].map(day => (

            <div key={day}>
              {day}
            </div>

          ))
        }


      </div>







      <div className="
        grid
        grid-cols-7
        gap-1
        text-center
      ">


        {
          Array.from({
            length: firstDay
          }).map((_, index) => (

            <div key={index} />

          ))
        }






        {
          days.map(day => {


            const active =
              day === selectedDate.getDate()
              &&
              month === selectedDate.getMonth()
              &&
              year === selectedDate.getFullYear();



            return (

              <button
                key={day}
                className={`
                h-9
                rounded-lg
                text-sm
                transition
                ${
                  active
                  ?
                  "bg-blue-500 font-semibold"
                  :
                  "hover:bg-white/10"
                }
                `}
              >

                {day}

              </button>

            );


          })
        }


      </div>



    </div>

  );


}
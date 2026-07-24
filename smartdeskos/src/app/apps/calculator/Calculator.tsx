"use client";

import { useEffect, useState } from "react";
import { Delete, Divide, Minus, Plus, X } from "lucide-react";


const BUTTONS = [
  "AC", "±", "%", "⌫",
  "7", "8", "9", "÷",
  "4", "5", "6", "×",
  "1", "2", "3", "-",
  "0", ".", "=", "+"
];


export default function Calculator() {

  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [overwrite, setOverwrite] = useState(false);



  const formatNumber = (value: string) => {

    if (!value || value === "-") {
      return value;
    }

    const [integer, decimal] = value.split(".");

    const formatted =
      Number(integer).toLocaleString("es-AR");

    return decimal !== undefined
      ? `${formatted},${decimal}`
      : formatted;

  };





  const calculate = () => {

    try {

      const clean = expression
        .replaceAll("×", "*")
        .replaceAll("÷", "/");


      const result = Function(
        `"use strict"; return (${clean})`
      )();


      if (!Number.isFinite(result)) {
        setDisplay("Error");
        setExpression("");
        return;
      }


      const final =
        Number(
          result.toFixed(10)
        ).toString();


      setDisplay(final);
      setExpression(final);
      setOverwrite(true);


    } catch {

      setDisplay("Error");
      setExpression("");
      setOverwrite(true);

    }

  };





  const handleInput = (value: string) => {


    if (display === "Error") {

      setDisplay("0");
      setExpression("");
      setOverwrite(false);

    }



    if (value === "AC") {

      setDisplay("0");
      setExpression("");
      setOverwrite(false);
      return;

    }



    if (value === "⌫") {

      const next =
        display.length > 1
          ? display.slice(0, -1)
          : "0";


      setDisplay(next);
      setExpression(next);
      return;

    }



    if (value === "=") {

      calculate();
      return;

    }




    if (value === "±") {

      const next =
        display.startsWith("-")
          ? display.slice(1)
          : `-${display}`;


      setDisplay(next);
      setExpression(next);
      return;

    }





    if (value === "%") {

      const next =
        String(
          Number(display) / 100
        );


      setDisplay(next);
      setExpression(next);
      return;

    }




    const operators =
      ["+", "-", "×", "÷"];


    if (
      operators.includes(value)
    ) {

      setExpression(
        expression + value
      );

      setOverwrite(true);

      return;

    }




    if (overwrite) {

      setDisplay(value);
      setExpression(
        expression + value
      );

      setOverwrite(false);

      return;

    }



    const next =
      display === "0"
        ? value
        : display + value;


    setDisplay(next);

    setExpression(
      expression === "0"
        ? value
        : expression + value
    );


  };
    useEffect(() => {


    const handleKeyboard = (
      event: KeyboardEvent
    ) => {


      const key = event.key;



      if (
        key >= "0" &&
        key <= "9"
      ) {

        handleInput(key);
        return;

      }



      if (
        key === "."
      ) {

        handleInput(".");
        return;

      }



      if (
        key === "+"
      ) {

        handleInput("+");
        return;

      }



      if (
        key === "-"
      ) {

        handleInput("-");
        return;

      }



      if (
        key === "*"
      ) {

        handleInput("×");
        return;

      }



      if (
        key === "/"
      ) {

        handleInput("÷");
        return;

      }



      if (
        key === "Enter"
      ) {

        handleInput("=");

        return;

      }



      if (
        key === "Escape"
      ) {

        handleInput("AC");

        return;

      }



      if (
        key === "Backspace"
      ) {

        handleInput("⌫");

        return;

      }



      if (
        key === "%"
      ) {

        handleInput("%");

        return;

      }


    };



    window.addEventListener(
      "keydown",
      handleKeyboard
    );



    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyboard
      );

    };


  }, [
    display,
    expression,
    overwrite
  ]);







  const getButtonStyle = (
    button: string
  ) => {


    if (button === "=") {

      return `
      bg-blue-500
      hover:bg-blue-400
      text-white
      `;

    }



    if (
      [
        "+",
        "-",
        "×",
        "÷"
      ].includes(button)
    ) {

      return `
      bg-white/10
      hover:bg-white/20
      text-cyan-300
      `;

    }



    if (
      [
        "AC",
        "±",
        "%",
        "⌫"
      ].includes(button)
    ) {

      return `
      bg-zinc-700/60
      hover:bg-zinc-600/60
      text-zinc-200
      `;

    }



    return `
    bg-white/5
    hover:bg-white/10
    text-white
    `;


  };





  return (

    <div
      className="
      w-125
      h-70
      rounded-3xl
      bg-black/40
      backdrop-blur-xl
      border
      border-white/10
      shadow-2xl
      p-5
      text-white
      select-none
      "
    >



      <div
        className="
        mb-5
        rounded-2xl
        bg-black/30
        border
        border-white/10
        p-4
        min-h-28
        flex
        flex-col
        justify-end
        "
      >


        <div
          className="
          text-xs
          text-zinc-400
          min-h-5
          text-right
          overflow-hidden
          "
        >

          {expression}

        </div>




        <div
          className="
          text-4xl
          font-semibold
          text-right
          break-all
          "
        >

          {formatNumber(display)}

        </div>


      </div>
            <div
        className="
        grid
        grid-cols-4
        gap-3
        "
      >


        {
          BUTTONS.map((button) => (

            <button
              key={button}
              onClick={() => handleInput(button)}
              className={`
              h-14
              rounded-2xl
              text-lg
              font-medium
              transition-all
              duration-150
              active:scale-95
              ${getButtonStyle(button)}
              `}
            >

              {
                button === "⌫"
                ?
                <Delete size={22} className="mx-auto" />
                :
                button
              }

            </button>

          ))
        }


      </div>





      <div
        className="
        mt-4
        text-center
        text-xs
        text-zinc-500
        "
      >

        SmartDeskOS Calculator

      </div>



    </div>

  );

}
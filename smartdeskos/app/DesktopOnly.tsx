"use client";

import { useEffect, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export default function DesktopOnly({ children }: Props) {

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {

    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 724);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };

  }, []);

  if (!isDesktop) {

    return (

      <div className="
        fixed
        inset-0
        bg-zinc-950
        flex
        items-center
        justify-center
        p-6
      ">

        <div className="
          max-w-md
          text-center
          text-white
        ">

          <div className="
            flex
            justify-center
            mb-6
          ">

            <div className="
              relative
            ">

              <Monitor
                size={72}
                className="text-cyan-400"
              />

              <Smartphone
                size={36}
                className="
                  absolute
                  -bottom-2
                  -right-2
                  text-red-400
                "
              />

            </div>

          </div>

          <h1 className="
            text-3xl
            font-bold
            mb-4
          ">
            Desktop Required
          </h1>

          <p className="
            text-zinc-400
            leading-relaxed
          ">
            SmartDeskOS fue diseñado exclusivamente para computadoras
            de escritorio.

            <br />
            <br />

            Accedé desde una notebook o PC para disfrutar de la experiencia completa.
          </p>

        </div>

      </div>

    );

  }

  return <>{children}</>;

}
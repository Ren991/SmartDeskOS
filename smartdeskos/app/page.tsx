import Desktop
from "@/components/layout/Desktop";
import DesktopOnly from "./DesktopOnly";


export default function Home(){

return (

  <DesktopOnly>

      <Desktop />

    </DesktopOnly>
);

}
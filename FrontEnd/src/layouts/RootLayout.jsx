import { Outlet } from "react-router-dom";
import LenisController from "./LenisController";
import Nav from "../features/ui/components/nav/Nav";
import PageTransition from "../features/ui/utils/transitions/PageTransition";

export default function RootLayout(){
    return(
        <> 
         <LenisController />
         <Nav />
         <Outlet />
        </>
    )
}
import{createBrowserRouter} from "react-router";
import Login from "./features/Auth/pages/Login";
import Register from "./features/Auth/pages/Register";
import Home from "./features/interview/pages/Home";
import Protected from"./features/Auth/components/Protected";
export const router= createBrowserRouter([

    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/Home",
        element:
        <Protected>
            <Home/>
        </Protected>
    }
]);


import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";

import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import Landing from "./features/ui/pages/Landing";
import DashBoard from "./features/Auth/pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,  
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path:"dashboard",
        element:(
          <Protected>
            <DashBoard />
          </Protected>
        )
      },
      {
        path: "app",
        element: (
          <Protected>
            <Home />
          </Protected>
        ),
      },
      {
        path: "interview/:interviewId",
        element: (
          <Protected>
            <Interview />
          </Protected>
        ),
      },
    ],
  },
]);
import { useState } from "react";
import { RouterProvider } from "react-router";

import { router } from "./app.routes.jsx";

import { AuthProvider } from "./features/auth/auth.context.jsx";
import { InterviewProvider } from "./features/interview/interview.context.jsx";

import Notifications from "./features/ui/components/notifications/Notifications.jsx";

import { NotificationProvider } from "./features/ui/context/Notification.context.jsx";

import { AnimationProvider } from "./features/ui/context/Animation.context.jsx";

import Preloader from "./features/ui/utils/loaders/Preloader.jsx";

import useReloadOnResize from "./features/ui/hooks/ResizeHandler.js";

function App() {

  useReloadOnResize();

  const [preloadDone, setPreloadDone] =
  useState(false);

  return (
    <AnimationProvider>

      <NotificationProvider>

        <Notifications />

        {/* PRELOADER */}
        {!preloadDone && (
          <Preloader
            onComplete={() => {
              setPreloadDone(true);
            }}
          />
        )}


        {/* MAIN APP */}
        {preloadDone && (
          <>

          <AuthProvider>
            <InterviewProvider>
              <RouterProvider router={router} />
            </InterviewProvider>
          </AuthProvider>


          </>
        )}

      </NotificationProvider>

    </AnimationProvider>
  );
}

export default App;
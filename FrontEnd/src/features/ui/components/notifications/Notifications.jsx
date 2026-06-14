import React, { useRef } from "react";
import { IoClose } from "react-icons/io5";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useNotification } from "../../context/Notification.context";

import "./notify.scss";

const Notifications = () => {
  const { notifications, removeNotification } =
    useNotification();

  const scope = useRef();

  useGSAP(
    () => {

      const notifEls =
        gsap.utils.toArray(".notif");

      if (!notifEls.length) return;

      gsap.set(notifEls, {
        x: "50vw",
        opacity: 0,
        scale: 0.95,
      });

      gsap.to(notifEls, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1,0.75)",
        stagger: 0.08,
      });

    },
    {
      scope,
      dependencies: [notifications],
      revertOnUpdate: true,
    }
   );

  return (
    <div
      ref={scope}
      className="notif-container"
    >
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`notif ${n.type}`}
        >
          {/* lifetime progress */}
          <div className="notif-progress"></div>

          <div className="notif-header">
            <div className="notif-content">
              <h4 className="notif-title">
                {n.title || "SYSTEM UPDATE"}
              </h4>

              <p className="notif-message">
                {n.message}
              </p>
            </div>

            <div
              className="notif-close"
              onClick={() =>
                removeNotification(n.id)
              }
            >
              <IoClose size={18} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
import React, { useRef } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import { useLocation } from "react-router-dom";

import "./styles/pageTransition.scss";

gsap.registerPlugin(DrawSVGPlugin);

const PageTransition = ({ children }) => {
  const location = useLocation();

  const maskRef = useRef(null);
  const pathRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      /* SHOW OVERLAY */
      tl.set(maskRef.current, {
        opacity: 1,
        pointerEvents: "all",
      });

      /* INITIAL STATE */
      tl.set(pathRef.current, {
        drawSVG: "0%",
        strokeWidth: 220,
      });

      /* DRAW LINE */
      tl.to(pathRef.current, {
        drawSVG: "100%",
        duration: 0.7,
        ease: "power2.out",
      });

      /* EXPAND INTO WIPE */
      tl.to(
        pathRef.current,
        {
          strokeWidth: 1800,
          duration: 1.2,
          ease: "power4.inOut",
        },
        "-=0.15"
      );

      /* REVEAL PAGE */
      tl.to(pathRef.current, {
        strokeWidth: 0,
        duration: 1.1,
        ease: "power4.inOut",
      });

      /* HIDE OVERLAY */
      tl.set(maskRef.current, {
        opacity: 0,
        pointerEvents: "none",
      });

      return () => {
        tl.kill();
      };
    },
    { dependencies: [location] }
  );

  return (
    <div className="wrapper">
      <div ref={maskRef} className="mask">
        <svg
          className="transition-svg"
          viewBox="0 0 1316 664"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            ref={pathRef}
            d="M13.4746 291.27C13.4746 291.27 100.646 -18.6724 255.617 16.8418C410.588 52.356 61.0296 431.197 233.017 546.326C431.659 679.299 444.494 21.0125 652.73 100.784C860.967 180.556 468.663 430.709 617.216 546.326C765.769 661.944 819.097 48.2722 988.501 120.156C1174.21 198.957 809.424 543.841 988.501 636.726C1189.37 740.915 1301.67 149.213 1301.67 149.213"
          />
        </svg>
      </div>

      {children}
    </div>
  );
};

export default PageTransition;
import { useEffect, useRef } from "react";
import gsap from "gsap";

import "./styles/preloader.scss";
import { useTextReveal } from "../../hooks/useTextReveal";

const Preloader = ({ onComplete }) => {
  const loaderRef = useRef();

  const charRef = useTextReveal({trigger:"load", type:"chars", y:200, stagger:0.05, delay:1});
  
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      },
    });

    tl.to('.cube-box',{
        rotate:360,
        scale: 1,
        duration: 1,
        delay:1,
        ease:"power3.out",
    })

    tl.to(loaderRef.current, {
        yPercent: -100,
        duration: 1,
        delay: 2,
        ease: "power4.inOut",
      });
  }, []);

  return (
    <div ref={loaderRef} className="preloader">
      <h1 className="loader-text">
        <div className="cube-box"></div>
        <span ref={charRef} className="char">JOB</span>
        <span>SYTE</span>
      </h1>
    </div>
  );
};

export default Preloader;
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function useOpacityReveal({
  trigger = "load",
  start = "top 85%",
  end = "top 30%",
  opacity = 0,
  y = 80,
  duration = 1,
  ease = "power3.out",
}) {
  const ref = useRef();

  useGSAP(
    () => {
      if (!ref.current) return;

      const anim = gsap.fromTo(
        ref.current,
        {
          opacity,
          y,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          ease,
        }
      );

      if (trigger === "scroll") {
        ScrollTrigger.create({
          trigger: ref.current,
          start,
          end,
          animation: anim,
          toggleActions: "play none none reverse",
        });
      }
    },
    { scope: ref }
  );

  return ref;
}
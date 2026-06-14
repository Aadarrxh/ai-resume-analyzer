import { useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useAnimationFlow } from "../context/Animation.context";

gsap.registerPlugin(SplitText, ScrollTrigger);

export function useTextReveal({
  trigger = "load",
  type = "chars",
  start = "top 80%",
  y = 100,
  stagger = 0.03,
  duration = 1,
  delay = 0,
}) {
  const ref = useRef();
  const canAnimate = useAnimationFlow();

  useGSAP(
    () => {
      if(!canAnimate)return;

      const el = ref.current?.querySelector("span") || ref.current;

      let split;
      let targets;

      const run = () => {
        split = new SplitText(el, {
          type,
          charsClass: "char",
          wordsClass: "word",
          linesClass: "line",
          mask:["lines"]
        });

        targets =
          type === "chars"
            ? split.chars
            : type === "words"
            ? split.words
            : split.lines;

        if (!targets || targets.length === 0) return;

        const anim = gsap.fromTo(
          targets,
          {
            y,
          },
          {
            y: 0,
            duration,
            stagger,
            delay:delay,
            ease: "power3.out",
          }
        );

        if (trigger === "scroll") {
          ScrollTrigger.create({
            trigger: ref.current,
            start,
            end:"top 30%",
            animation: anim,
            toggleActions: "play none none reverse",
          });
        }
      };


      document.fonts.ready.then(() => {
        requestAnimationFrame(run);
      });

      return () => {
        split?.revert();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: ref }
  );

  return ref;
}
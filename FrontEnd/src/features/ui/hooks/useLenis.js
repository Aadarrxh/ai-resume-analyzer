import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLenis({
  duration = 1.2,
  smoothWheel = true,
  smoothTouch = false,
  wheelMultiplier = 1,
  touchMultiplier = 2,
  infinite = false,
} = {}) {
  const location = useLocation();

  useEffect(() => {
    // Create Lenis instance
    const lenis = new Lenis({
      duration,
      smoothWheel,
      smoothTouch,
      wheelMultiplier,
      touchMultiplier,
      infinite,
    });

    // Sync Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // RAF loop
    const update = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    // Prevent GSAP lag smoothing conflicts
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    // Route change -> instantly scroll to top
    lenis.scrollTo(0, {
      immediate: true,
    });

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [
    location.pathname,
    duration,
    smoothWheel,
    smoothTouch,
    wheelMultiplier,
    touchMultiplier,
    infinite,
  ]);
}
import { createContext, useContext, useState } from "react";

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [canAnimate, setCanAnimate] = useState(false);

  return (
    <AnimationContext.Provider
      value={{
        canAnimate,
        setCanAnimate,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimationFlow = () =>
  useContext(AnimationContext);
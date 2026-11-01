import { useEffect } from "react";

const useReloadOnResize = () => {
  /*useEffect(() => {
    let timeout;

    const handleResize = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        window.location.reload();
      }, 300);
    };

    window.addEventListener(
      "resize",
      handleResize
    );*/

    return () => {
      /*clearTimeout(timeout);

      window.removeEventListener(
        "resize",
        handleResize
      );*/
      null
    };
  /*}, []);*/
};

export default useReloadOnResize;
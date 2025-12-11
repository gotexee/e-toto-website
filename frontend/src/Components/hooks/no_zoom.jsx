import { useEffect } from "react";

export default function useParticlesEffect() {

useEffect(() => {
    const preventZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchstart", preventZoom, { passive: false });

    document.body.style.overflowX = "hidden";

    return () => {
      document.removeEventListener("touchstart", preventZoom);
      document.body.style.overflowX = "";
    };
  }, []);
}
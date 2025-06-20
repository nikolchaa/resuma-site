import { useEffect, useRef, useState } from "preact/hooks";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";

export const VantaBackground = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!vantaRef.current) return;

    if (vantaEffect) vantaEffect.destroy();

    const effect = FOG({
      el: vantaRef.current,
      THREE,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      highlightColor: 0x00d9cb,
      midtoneColor: 0x00d9cb,
      lowlightColor: isDark ? 0x000000 : 0xffffff,
      baseColor: isDark ? 0x000000 : 0xffffff,
      blurFactor: 0.65,
    });

    setVantaEffect(effect);

    return () => effect.destroy();
  }, [isDark]);

  return (
    <div className='absolute inset-0 pointer-events-none bg-background -z-20'>
      <div className='absolute inset-0 bottom-1 -z-10' ref={vantaRef} />
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-t ${
          isDark ? "from-black to-black/0" : "from-white to-white/0"
        }`}
      />
    </div>
  );
};

import { useEffect, useRef, useState } from "preact/hooks";
import { motion as m, useInView } from "motion/react";

export function ScrollRevealText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { margin: "-10% 0px" });
  const delay = 0.05; // Default delay for each word

  const words = text.split(" ");

  return (
    <h2 ref={ref} className='text-center px-8'>
      {words.map((word, i) => (
        <m.span
          key={i}
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 24, filter: "blur(6px)" }
          }
          transition={{
            duration: 0.5,
            delay: i * delay,
            ease: [0.33, 1, 0.68, 1],
          }}
          className={`inline-block whitespace-pre text-[clamp(2rem,4vw,3rem)] font-semibold text-foreground z-10 ${className}`}
        >
          {word + " "}
        </m.span>
      ))}
    </h2>
  );
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 24,
}: {
  children: preact.ComponentChildren;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-10% 0px" });

  const [hasAnimated, setHasAnimated] = useState(false);
  const shouldTrack = delay > 0;

  useEffect(() => {
    if (shouldTrack && isInView && !hasAnimated) {
      const timeout = setTimeout(() => setHasAnimated(true), 100);
      return () => clearTimeout(timeout);
    }
  }, [isInView, hasAnimated, shouldTrack]);

  const effectiveDelay = shouldTrack && hasAnimated ? 0 : delay;

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y, filter: "blur(6px)" }
      }
      transition={{
        duration: 0.6,
        delay: effectiveDelay,
        ease: [0.33, 1, 0.68, 1],
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

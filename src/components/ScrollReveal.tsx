import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { cn } from "@/lib/utils";

/*
 * Scroll-triggered reveals, driven by CSS (see `.reveal` in style.css).
 *
 * Content is fully visible in the prerendered HTML. Once the page has
 * hydrated, `html.reveal-ready` is set (see index.tsx) and only elements
 * without `data-inview` are hidden, so anything already on screen never
 * flickers and nothing stays hidden if JavaScript fails to load.
 */

const ROOT_MARGIN_RATIO = 0.075;

let sharedObserver: IntersectionObserver | null = null;

function getObserver() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-inview", "");
          } else {
            entry.target.removeAttribute("data-inview");
          }
        }
      },
      { rootMargin: `-${ROOT_MARGIN_RATIO * 100}% 0px` }
    );
  }
  return sharedObserver;
}

function isInViewport(element: Element) {
  const rect = element.getBoundingClientRect();
  const margin = window.innerHeight * ROOT_MARGIN_RATIO;
  return rect.top < window.innerHeight - margin && rect.bottom > margin;
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    // Mark on-screen elements synchronously, before reveal-ready is applied.
    if (isInViewport(element)) element.setAttribute("data-inview", "");

    const observer = getObserver();
    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  return ref;
}

export function ScrollRevealText({
  text,
  highlight = "",
}: {
  text: string;
  highlight?: string;
}) {
  const ref = useReveal<HTMLHeadingElement>();
  const words = text.split(" ");

  return (
    <h2 ref={ref} className='reveal-text text-center'>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        const endsWithDot = word.endsWith(".");
        const cleanWord = endsWithDot ? word.slice(0, -1) : word;
        const isHighlighted = cleanWord === highlight;

        return (
          <span
            key={i}
            style={{ "--i": i }}
            className='reveal-word whitespace-pre text-[clamp(2rem,4vw,3rem)] font-semibold z-10'
          >
            <span
              className={isHighlighted ? "text-primary" : "text-foreground"}
            >
              {cleanWord}
            </span>
            {endsWithDot && <span className='text-foreground'>.</span>}
            {!isLast && " "}
          </span>
        );
      })}
    </h2>
  );
}

export function ScrollReveal({
  children,
  className,
}: {
  children: ComponentChildren;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={cn("reveal", className)}>
      {children}
    </div>
  );
}

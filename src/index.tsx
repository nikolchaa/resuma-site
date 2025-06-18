import { hydrate, prerender as ssr } from "preact-iso";

import "./style.css";

import { setInitialTheme } from "./lib/setInitialTheme";

import { useEffect } from "preact/hooks";
import Lenis from "lenis";
import { ScrollReveal, ScrollRevealText } from "./components/ScrollReveal";
import { Footer } from "./components/Footer";
import SystemRequirements from "./components/Requirements";
import { Bento } from "./components/Bento";
import { Header } from "./components/Header";

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.2,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    window.lenis = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Header />

      <main className='flex flex-col items-center justify-center gap-24 px-4 py-24'>
        <section
          className={
            "flex flex-col items-center justify-center max-w-4xl mx-auto"
          }
        >
          <ScrollRevealText
            text='Build your resume in minutes.'
            highlight='minutes'
          />
          <ScrollReveal>
            <p className='text-muted-foreground text-center max-w-xl mx-auto'>
              Resuma is a privacy-first resume builder powered by local AI.
            </p>
          </ScrollReveal>
          <Bento />
        </section>

        <section
          className={
            "flex flex-col items-center justify-center max-w-4xl mx-auto"
          }
          id={"requirements"}
        >
          <ScrollRevealText
            text='Resuma system requirements.'
            highlight='requirements'
          />
          <ScrollReveal>
            <p className='text-muted-foreground text-center max-w-xl mx-auto'>
              Resuma runs on pretty much any modern desktop computer.
            </p>
          </ScrollReveal>
          <SystemRequirements />
        </section>
      </main>

      <Footer />
    </>
  );
}

if (typeof window !== "undefined") {
  setInitialTheme();
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}

import { hydrate, prerender as ssr } from "preact-iso";

import "./style.css";

import { useEffect } from "preact/hooks";
import Lenis from "lenis";
import { ScrollReveal, ScrollRevealText } from "./components/ScrollReveal";
import { Footer } from "./components/Footer";
import SystemRequirements from "./components/Requirements";
import { Bento } from "./components/Bento";
import { Header } from "./components/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { ThemeProvider } from "./context/themeProvider";
import { FAQ, faqStructuredData } from "./content/faq";

/** Renders backtick-wrapped parts of an FAQ answer as <code>. */
function renderAnswer(text: string) {
  return text
    .split("`")
    .map((part, i) => (i % 2 === 1 ? <code key={i}>{part}</code> : part));
}

// JSON-LD sits inside a <script>; escape "<" so answer markup can't close it.
const FAQ_JSON_LD = JSON.stringify(faqStructuredData()).replace(
  /</g,
  "\\u003c"
);

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export function App() {
  useEffect(() => {
    // Reveal animations may only hide content once every on-screen element
    // has been marked; ScrollReveal effects run before this one, and the
    // frame delay covers anything mounted in the same commit.
    const revealFrame = requestAnimationFrame(() =>
      document.documentElement.classList.add("reveal-ready")
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => cancelAnimationFrame(revealFrame);
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.2,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    window.lenis = lenis;

    return () => {
      cancelAnimationFrame(revealFrame);
      cancelAnimationFrame(frame);
      lenis.destroy();
      window.lenis = undefined;
    };
  }, []);

  return (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
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
              Resuma is a privacy-first resume builder, powered by local AI or
              any model you choose.
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

        <section
          className='flex flex-col items-center justify-center w-[clamp(16rem,100%,56rem)] mx-auto'
          id='faq'
        >
          <ScrollRevealText
            text='Frequently asked questions.'
            highlight='questions'
          />
          <ScrollReveal>
            <p className='text-muted-foreground text-center max-w-xl mx-auto'>
              Everything you need to know about Resuma.
            </p>
          </ScrollReveal>

          <ScrollReveal className='w-full'>
            <Accordion type='single' collapsible className='w-full mt-6'>
              {FAQ.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <ScrollReveal>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>
                      {renderAnswer(item.answer)}
                      {item.link && (
                        <>
                          {item.link.prefix}
                          <a
                            href={item.link.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-primary-text underline underline-offset-2 hover:decoration-2'
                          >
                            {item.link.label}
                          </a>
                          {item.link.suffix}
                        </>
                      )}
                    </AccordionContent>
                  </ScrollReveal>
                </AccordionItem>
              ))}
            </Accordion>
            <script
              type='application/ld+json'
              dangerouslySetInnerHTML={{ __html: FAQ_JSON_LD }}
            />
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </ThemeProvider>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}

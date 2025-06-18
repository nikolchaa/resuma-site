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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";

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
              <AccordionItem value='item-1'>
                <ScrollReveal>
                  <AccordionTrigger>Is Resuma free to use?</AccordionTrigger>
                  <AccordionContent>
                    Yes - Resuma is 100% free and open-source under the GNU
                    GPLv3 license. You can find more about the licensing here:{" "}
                    <a
                      href='https://github.com/nikolchaa/resuma/blob/main/LICENSE'
                      target='_blank'
                      rel='noreferrer'
                      className='text-primary underline'
                    >
                      Project License
                    </a>
                  </AccordionContent>
                </ScrollReveal>
              </AccordionItem>
              <AccordionItem value='item-2'>
                <ScrollReveal>
                  <AccordionTrigger>Does Resuma work offline?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Resuma is a Tauri desktop application, which means all
                    features are local to your machine. Once installed, it
                    doesn't require any internet connection to function, giving
                    you full control and privacy.
                  </AccordionContent>
                </ScrollReveal>
              </AccordionItem>
              <AccordionItem value='item-3'>
                <ScrollReveal>
                  <AccordionTrigger>
                    What platforms are supported?
                  </AccordionTrigger>
                  <AccordionContent>
                    Resuma supports Windows, macOS (Apple Silicon-only), and
                    Linux. We provide <code>.exe</code>, <code>.dmg</code>, and{" "}
                    <code>.AppImage</code> binaries respectively. If you're on
                    an unsupported OS, you can still build it from source using
                    Rust and Node.js.
                  </AccordionContent>
                </ScrollReveal>
              </AccordionItem>
              <AccordionItem value='item-4'>
                <ScrollReveal>
                  <AccordionTrigger>Where is my data stored?</AccordionTrigger>
                  <AccordionContent>
                    Your data never leaves your device. Resuma stores resumes
                    locally. No data is ever synced or sent to a server - your
                    information is yours alone.
                  </AccordionContent>
                </ScrollReveal>
              </AccordionItem>
              <AccordionItem value='item-5'>
                <ScrollReveal>
                  <AccordionTrigger>
                    Can I import/export my resumes?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. You can export your resumes as PDFs and import/export{" "}
                    <code>.resume</code> files to move resumes between devices
                    or versions.
                  </AccordionContent>
                </ScrollReveal>
              </AccordionItem>
              <AccordionItem value='item-6'>
                <ScrollReveal>
                  <AccordionTrigger>
                    Can I contribute to Resuma?
                  </AccordionTrigger>
                  <AccordionContent>
                    Contributions are welcome! Whether it's code, bug reports,
                    or feature suggestions - head over to the{" "}
                    <a
                      href='https://github.com/nikolchaa/resuma'
                      target='_blank'
                      rel='noreferrer'
                      className='text-primary underline'
                    >
                      GitHub repository.
                    </a>
                  </AccordionContent>
                </ScrollReveal>
              </AccordionItem>
            </Accordion>
          </ScrollReveal>
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

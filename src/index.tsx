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
              <AccordionItem value='item-1'>
                <ScrollReveal>
                  <AccordionTrigger>Is Resuma free to use?</AccordionTrigger>
                  <AccordionContent>
                    Yes - Resuma is 100% free and open-source under the GNU
                    GPLv3 license. Cloud AI providers are optional and bill you
                    directly for their API usage. You can find more about the
                    licensing here:{" "}
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
                    Yes, with the default local AI. Resuma is a Tauri desktop
                    application, and its AI runs on your machine. You only need
                    an internet connection once, during onboarding, to download
                    the AI model and runtime. After that, everything works
                    offline. If you choose a cloud AI provider instead, AI
                    features need an internet connection.
                  </AccordionContent>
                </ScrollReveal>
              </AccordionItem>
              <AccordionItem value='item-models'>
                <ScrollReveal>
                  <AccordionTrigger>Which AI models can I use?</AccordionTrigger>
                  <AccordionContent>
                    By default, Resuma downloads a Qwen3 model sized for your
                    hardware (0.6B, 4B, or 14B) and runs it locally with
                    llama.cpp. You can also search thousands of GGUF models on
                    Hugging Face and download them right in the app, connect a
                    model host like Ollama or LM Studio, or use a cloud API -
                    OpenAI, Anthropic, Google Gemini, DeepSeek, Kimi, or any
                    OpenAI-compatible endpoint - with your own API key.
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
                    Linux. We provide a <code>.exe</code> installer for Windows,
                    a <code>.dmg</code> for macOS, and <code>.deb</code> and{" "}
                    <code>.rpm</code> packages for Linux. If you're on an
                    unsupported OS, you can still build it from source using
                    Rust and Node.js.
                  </AccordionContent>
                </ScrollReveal>
              </AccordionItem>
              <AccordionItem value='item-4'>
                <ScrollReveal>
                  <AccordionTrigger>Where is my data stored?</AccordionTrigger>
                  <AccordionContent>
                    Resuma stores your resumes, settings, and AI models locally
                    on your device, and never uploads or syncs your resumes to a
                    server. With the default local AI, nothing leaves your
                    device. If you choose a cloud AI provider, the resume text
                    and job description for each AI action are sent to that
                    provider under their terms. API keys are kept in your
                    system's credential manager, and Discord status is optional
                    and off by default. Read more in the{" "}
                    <a
                      href='https://github.com/nikolchaa/resuma/blob/main/PRIVACY.md'
                      target='_blank'
                      rel='noreferrer'
                      className='text-primary underline'
                    >
                      Privacy Policy
                    </a>
                    .
                  </AccordionContent>
                </ScrollReveal>
              </AccordionItem>
              <AccordionItem value='item-5'>
                <ScrollReveal>
                  <AccordionTrigger>
                    Can I import/export my resumes?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. You can export your resumes as PDF or plain text, and
                    import/export{" "}
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
    </ThemeProvider>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}

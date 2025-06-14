import { hydrate, prerender as ssr } from "preact-iso";

import "./style.css";
import { VantaBackground } from "./components/VantaBackground";

import Logo from "@/assets/Logo.svg?react";
import AppleLogo from "@/assets/Apple.svg?react";
import WindowsLogo from "@/assets/Windows.svg?react";
import LinuxLogo from "@/assets/Linux.svg?react";
import { setInitialTheme } from "./lib/setInitialTheme";

import { Button } from "./components/ui/button";
import { useEffect, useState } from "preact/hooks";
import Lenis from "lenis";
import { ScrollReveal, ScrollRevealText } from "./components/ScrollReveal";
import ClickSpark from "./components/ClickSpark";
import { Footer } from "./components/Footer";
import SystemRequirements from "./components/Requirements";

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

interface NavigatorUAData {
  platform: string;
}

export function App() {
  const [version, setVersion] = useState("Loading...");
  const [os, setOS] = useState<"Windows" | "MacOS" | "Linux" | "Other">(
    "Other"
  );

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

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const platform =
      (navigator as Navigator & { userAgentData?: NavigatorUAData })
        .userAgentData?.platform ||
      navigator.platform ||
      "";
    const platformLower = platform.toLowerCase();

    if (platformLower.includes("win") || /windows/i.test(userAgent)) {
      setOS("Windows");
    } else if (
      platformLower.includes("mac") ||
      /macintosh|mac os x/i.test(userAgent)
    ) {
      setOS("MacOS");
    } else if (platformLower.includes("linux") || /linux/i.test(userAgent)) {
      setOS("Linux");
    } else {
      setOS("Other");
    }
  }, []);

  useEffect(() => {
    fetch(
      "https://api.github.com/repos/nikolchaa/tauri-plugin-hwinfo/releases/latest"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.tag_name) {
          setVersion(data.tag_name);
        } else {
          setVersion("Unknown");
        }
        console.log(data);
      })
      .catch(() => setVersion("Unavailable"));
  }, []);

  return (
    <ClickSpark
      sparkColor='#00d9cb'
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <header className='relative w-full h-[calc(100vh-4rem)] sm:h-screen overflow-hidden flex flex-col items-center justify-center gap-6'>
        <VantaBackground />

        <ScrollReveal delay={0}>
          <Logo className='w-132 text-foreground drop-shadow-lg' />
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <p className='text-xl w-132 text-center leading-6 drop-shadow-lg'>
            Resuma is an open-source desktop application for building beautiful
            resumes. Fast, flexible, and privacy-oriented.
          </p>
        </ScrollReveal>

        <ScrollReveal
          delay={1}
          className='absolute bottom-16 flex flex-col gap-4 items-center justify-center w-full text-center'
        >
          <div className='flex gap-4'>
            <Button variant={os === "Windows" ? "secondary" : "outline"}>
              <WindowsLogo className='h-6 w-6' />
              Download for Windows
            </Button>
            <Button variant={os === "MacOS" ? "secondary" : "outline"}>
              <AppleLogo className='h-6 w-6' />
              Download for MacOS{" "}
              <span className='text-muted-foreground'>(ARM64)</span>
            </Button>
            <Button variant={os === "Linux" ? "secondary" : "outline"}>
              <LinuxLogo className='h-6 w-6' />
              Download for Linux{" "}
              <span className='text-muted-foreground'>(AppImage)</span>
            </Button>
          </div>

          <nav className='text-muted-foreground'>
            {`${version}`}
            <span className='mx-4'>|</span>
            <a
              href='#requirements'
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById("requirements");
                if (target) window.lenis?.scrollTo(target);
              }}
              className='relative after:absolute after:left-0 after:bottom-[-0.125rem] after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
            >
              Requirements
            </a>

            <span className='mx-4'>|</span>
            <a
              href='https://github.com/nikolchaa/resuma'
              target='_blank'
              rel='noreferrer'
              className='relative after:absolute after:left-0 after:bottom-[-0.125rem] after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
            >
              GitHub
            </a>
          </nav>
        </ScrollReveal>
      </header>

      <main className='flex flex-col items-center justify-center gap-4 p-4'>
        <section
          className={
            "flex flex-col items-center justify-center pt-20 pb-10 max-w-4xl mx-auto"
          }
        >
          <ScrollRevealText
            text='Build your resume in minutes.'
            highlight='minutes'
          />
          <ScrollReveal>
            <p className='text-muted-foreground text-center max-w-xl mx-auto'>
              Resuma is a privacy-first resume builder powered by local AI.{" "}
              <br />
              No internet, no delays, no data leaks.
            </p>
          </ScrollReveal>
        </section>

        <section
          className={
            "flex flex-col items-center justify-center py-10 max-w-4xl mx-auto"
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
          className={
            "flex flex-col items-center justify-center pt-10 pb-20 max-w-4xl mx-auto"
          }
        >
          <ScrollRevealText
            text='Export to PDF with a single click.'
            highlight='single'
          />
          <ScrollReveal>
            <p className='text-muted-foreground text-center max-w-xl mx-auto'>
              Once you’re done, generate a perfectly formatted PDF in seconds.
              No subscriptions, watermarks, or limitations.
            </p>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </ClickSpark>
  );
}

if (typeof window !== "undefined") {
  setInitialTheme();
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}

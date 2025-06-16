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
import { Footer } from "./components/Footer";
import SystemRequirements from "./components/Requirements";
import { ChevronDown, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

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
      /macintosh|mac os x|iPhone/i.test(userAgent)
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
    <>
      <header className='relative w-full h-[calc(100vh-4rem)] sm:h-screen overflow-hidden flex flex-col items-center justify-center gap-6'>
        <VantaBackground />

        <ScrollReveal delay={0}>
          <Logo className='max-w-132 w-[calc(100vw-2rem)] text-foreground drop-shadow-lg' />
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <p className='text-md sm:text-xl max-w-132 text-center leading-6 drop-shadow-lg mx-4'>
            Resuma is an open-source desktop application for building beautiful
            resumes. Fast, flexible, and privacy-oriented.
          </p>
        </ScrollReveal>

        <ScrollReveal
          delay={1}
          className='absolute bottom-16 flex flex-col gap-4 items-center justify-center w-full text-center'
        >
          {/* Visible on PC */}
          <div className='gap-4 hidden md:flex'>
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

          {/* Visible on Mobile layout */}
          <div className='flex gap-4 md:hidden'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type='button'
                  className="dark:backdrop-blur-sm select-none hover:cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3"
                >
                  <Download className='mr-2 h-5 w-5' /> Download options
                  <ChevronDown className='ml-2 h-4 w-4' />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align='center'
                className={
                  "w-56 mt-2 rounded-md border bg-background shadow-xs p-1 select-none gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:border-input dark:hover:bg-input/50 dark:backdrop-blur-sm"
                }
              >
                <DropdownMenuItem
                  onClick={() => console.log("Download for Windows")}
                >
                  <WindowsLogo className='mr-2 h-5 w-5' />
                  Windows
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => console.log("Download for MacOS")}
                >
                  <AppleLogo className='mr-2 h-5 w-5' />
                  MacOS{" "}
                  <span className='ml-auto text-xs text-muted-foreground'>
                    (ARM64)
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => console.log("Download for Linux")}
                >
                  <LinuxLogo className='mr-2 h-5 w-5' />
                  Linux{" "}
                  <span className='ml-auto text-xs text-muted-foreground'>
                    (AppImage)
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              Resuma is a privacy-first resume builder powered by local AI.
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

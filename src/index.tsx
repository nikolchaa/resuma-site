import { hydrate, prerender as ssr } from "preact-iso";

import "./style.css";
import { VantaBackground } from "./components/VantaBackground";

import Logo from "@/assets/Logo.svg?react";
import AppleLogo from "@/assets/Apple.svg?react";
import WindowsLogo from "@/assets/Windows.svg?react";
import LinuxLogo from "@/assets/Linux.svg?react";
import { setInitialTheme } from "./lib/setInitialTheme";

import { motion as m } from "motion/react";
import { Button } from "./components/ui/button";
import { useEffect, useState } from "preact/hooks";

export function App() {
  const [version, setVersion] = useState("Loading...");
  const [os, setOS] = useState<"Windows" | "MacOS" | "Linux" | "Other">(
    "Other"
  );

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const platform =
      (navigator as any).userAgentData?.platform || navigator.platform || "";
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
      })
      .catch(() => setVersion("Unavailable"));
  }, []);

  return (
    <>
      <header className='relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center gap-6'>
        <VantaBackground />
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0, ease: [0.15, 0.91, 0.98, 1] }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Logo className='w-132 text-foreground drop-shadow-lg' />
        </m.div>
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0.15, 0.91, 0.98, 1],
          }}
          exit={{ opacity: 0, y: -20 }}
          className={"text-xl w-132 text-center leading-6 drop-shadow-lg"}
        >
          Resuma is an open-source desktop application for building beautiful
          resumes. Fast, flexible, and privacy-oriented.
        </m.p>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 1,
            ease: [0.15, 0.91, 0.98, 1],
          }}
          exit={{ opacity: 0, y: -20 }}
          className='absolute bottom-16 flex flex-col gap-4 items-center justify-center w-full text-center'
        >
          <div className={"flex gap-4"}>
            <Button variant={os === "Windows" ? "secondary" : "outline"}>
              <WindowsLogo className={"h-6 w-6"} />
              Download for Windows
            </Button>
            <Button variant={os === "MacOS" ? "secondary" : "outline"}>
              <AppleLogo className={"h-6 w-6"} />
              Download for MacOS
            </Button>
            <Button variant={os === "Linux" ? "secondary" : "outline"}>
              <LinuxLogo className={"h-6 w-6"} />
              Download for Linux
            </Button>
          </div>

          <span className={"text-muted-foreground"}>
            {`${version}`}
            <span className='mx-4'>|</span>
            <a
              href='https://github.com/nikolchaa/resuma'
              target='_blank'
              rel='noreferrer'
              className='relative after:absolute after:left-0 after:bottom-[-0.125rem] after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
            >
              GitHub Repo
            </a>

            <span className='mx-4'>|</span>
            <a
              href='https://github.com/nikolchaa/resuma/issues'
              target='_blank'
              rel='noreferrer'
              className='relative after:absolute after:left-0 after:bottom-[-0.125rem] after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
            >
              Privacy Policy
            </a>
          </span>
        </m.div>
      </header>
      <main className='flex flex-col items-center justify-center gap-6 p-4'>
        To be continued...
      </main>
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

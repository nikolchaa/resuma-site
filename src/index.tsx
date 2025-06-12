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
import { Heart } from "lucide-react";

export function App() {
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
            <Button variant='outline'>
              <WindowsLogo className={"h-6 w-6"} />
              Download for Windows
            </Button>
            <Button variant='outline'>
              <AppleLogo className={"text-foreground h-6 w-6"} />
              Download for MacOS
            </Button>
            <Button variant='outline'>
              <LinuxLogo className={"text-foreground h-6 w-6"} />
              Download for Linux
            </Button>
          </div>
          <span className={"text-muted-foreground"}>
            v1.0.0 | Made with <Heart className={"h-4 w-4 inline"} />
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

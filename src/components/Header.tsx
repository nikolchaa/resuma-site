import { useEffect, useState } from "preact/hooks";
import { VantaBackground } from "./VantaBackground";
import { ScrollReveal } from "./ScrollReveal";
import { Button } from "./ui/button";
import Logo from "@/assets/Logo.svg?react";
import AppleLogo from "@/assets/Apple.svg?react";
import WindowsLogo from "@/assets/Windows.svg?react";
import LinuxLogo from "@/assets/Linux.svg?react";
import { ChevronDown, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const [version, setVersion] = useState("Loading...");
  const [os, setOS] = useState<"Windows" | "MacOS" | "Linux" | "Other">(
    "Other"
  );

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const platform =
      (navigator as Navigator & { userAgentData?: { platform?: string } })
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
    fetch("/.netlify/functions/latest-release")
      .then((res) => res.json())
      .then((data) => {
        setVersion(data.version || "Unknown Version");
      })
      .catch(() => setVersion("Unavailable"));
  }, []);

  return (
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
        <div className='gap-4 hidden md:flex'>
          <a
            href={`https://github.com/nikolchaa/resuma/releases/download/${version}/Resuma_${version.replace(
              "v",
              ""
            )}_x64-setup.exe`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button variant={os === "Windows" ? "secondary" : "outline"}>
              <WindowsLogo className='h-6 w-6' />
              Download for Windows
            </Button>
          </a>

          <a
            href={`https://github.com/nikolchaa/resuma/releases/download/${version}/Resuma_${version.replace(
              "v",
              ""
            )}_aarch64.dmg`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button variant={os === "MacOS" ? "secondary" : "outline"}>
              <AppleLogo className='h-6 w-6' />
              Download for MacOS{" "}
              <span className='text-muted-foreground'>(ARM64)</span>
            </Button>
          </a>

          <a
            href={`https://github.com/nikolchaa/resuma/releases/download/${version}/Resuma_${version.replace(
              "v",
              ""
            )}_amd64.AppImage`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button variant={os === "Linux" ? "secondary" : "outline"}>
              <LinuxLogo className='h-6 w-6' />
              Download for Linux{" "}
              <span className='text-muted-foreground'>(AppImage)</span>
            </Button>
          </a>
        </div>
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
  );
}

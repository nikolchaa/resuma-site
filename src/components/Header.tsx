import { useEffect, useState } from "preact/hooks";
import { FogBackground } from "./FogBackground";
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

const LATEST_RELEASE_URL =
  "https://github.com/nikolchaa/resuma/releases/latest";

const NAV_LINK_CLASS =
  "relative rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring after:absolute after:left-0 after:bottom-[-0.125rem] after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full focus-visible:after:w-full";

type ReleaseAsset = { url: string; size: number };

type ReleaseInfo = {
  version?: string;
  url?: string;
  assets?: Partial<Record<"windows" | "macos" | "deb" | "rpm", ReleaseAsset>>;
};

export function Header() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [versionLabel, setVersionLabel] = useState("Loading...");
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
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: ReleaseInfo) => {
        setRelease(data);
        setVersionLabel(data.version || "Latest release");
      })
      .catch(() => setVersionLabel("Latest release"));
  }, []);

  // Until the release is known (prerendered HTML, slow or failed fetch),
  // every button points at the latest release page instead of a guessed file.
  const windowsUrl = release?.assets?.windows?.url ?? LATEST_RELEASE_URL;
  const macUrl = release?.assets?.macos?.url ?? LATEST_RELEASE_URL;
  const releaseNotesUrl = release?.url ?? LATEST_RELEASE_URL;

  return (
    <header className='relative w-full h-[calc(100vh-4rem)] sm:h-screen overflow-hidden flex flex-col items-center justify-center gap-6'>
      <FogBackground />

      {/* Hero entrance is pure CSS (.hero-in) so the text paints without
          waiting for JavaScript; it is the page's largest contentful paint. */}
      <h1 className='hero-in'>
        <span className='sr-only'>Resuma</span>
        <Logo
          aria-hidden='true'
          className='max-w-132 w-[calc(100vw-2rem)] text-foreground drop-shadow-lg'
        />
      </h1>

      <p
        className='hero-in text-md sm:text-xl max-w-132 text-center leading-6 drop-shadow-lg mx-4'
        style={{ "--hero-delay": "0.1s" }}
      >
        Resuma is an open-source desktop application for building beautiful
        resumes. Fast, flexible, and privacy-oriented.
      </p>

      <div
        className='hero-in absolute bottom-16 flex flex-col gap-4 items-center justify-center w-full text-center'
        style={{ "--hero-delay": "0.25s" }}
      >
        <div className='gap-4 hidden md:flex'>
          <Button asChild variant={os === "Windows" ? "secondary" : "outline"}>
            <a href={windowsUrl} target='_blank' rel='noopener noreferrer'>
              <WindowsLogo className='h-6 w-6' aria-hidden='true' />
              Download for Windows
            </a>
          </Button>

          <Button asChild variant={os === "MacOS" ? "secondary" : "outline"}>
            <a href={macUrl} target='_blank' rel='noopener noreferrer'>
              <AppleLogo className='h-6 w-6' aria-hidden='true' />
              Download for macOS{" "}
              <span className='text-muted-foreground'>(ARM64)</span>
            </a>
          </Button>

          <Button asChild variant={os === "Linux" ? "secondary" : "outline"}>
            <a
              href={LATEST_RELEASE_URL}
              target='_blank'
              rel='noopener noreferrer'
            >
              <LinuxLogo className='h-6 w-6' aria-hidden='true' />
              Download for Linux
            </a>
          </Button>
        </div>
        <div className='flex gap-4 md:hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type='button'
                className="dark:backdrop-blur-sm select-none hover:cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3"
              >
                <Download className='mr-2 h-5 w-5' aria-hidden='true' />{" "}
                Download options
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
                onClick={() =>
                  window.open(windowsUrl, "_blank", "noopener,noreferrer")
                }
              >
                <WindowsLogo className='mr-2 h-5 w-5' />
                Windows
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  window.open(macUrl, "_blank", "noopener,noreferrer")
                }
              >
                <AppleLogo className='mr-2 h-5 w-5' />
                macOS{" "}
                <span className='ml-auto text-xs text-muted-foreground'>
                  (ARM64)
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  window.open(LATEST_RELEASE_URL, "_blank", "noopener,noreferrer")
                }
              >
                <LinuxLogo className='mr-2 h-5 w-5' />
                Linux
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <nav aria-label='Release and project links' className='text-muted-foreground'>
          <a
            href={releaseNotesUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={NAV_LINK_CLASS}
          >
            {versionLabel}
          </a>
          <span className='mx-4' aria-hidden='true'>
            |
          </span>
          <a
            href='#requirements'
            onClick={(e) => {
              const target = document.getElementById("requirements");
              if (!target || !window.lenis) return; // native anchor jump
              e.preventDefault();
              window.lenis.scrollTo(target);
            }}
            className={NAV_LINK_CLASS}
          >
            Requirements
          </a>
          <span className='mx-4' aria-hidden='true'>
            |
          </span>
          <a
            href='https://github.com/nikolchaa/resuma'
            target='_blank'
            rel='noopener noreferrer'
            className={NAV_LINK_CLASS}
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

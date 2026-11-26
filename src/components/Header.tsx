import { useEffect, useState } from "preact/hooks";
import { FogBackground } from "./FogBackground";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Logo from "@/assets/Logo.svg?react";
import AppleLogo from "@/assets/Apple.svg?react";
import WindowsLogo from "@/assets/Windows.svg?react";
import LinuxLogo from "@/assets/Linux.svg?react";
import { ChevronDown, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const LATEST_RELEASE_URL =
  "https://github.com/nikolchaa/resuma/releases/latest";

// Hero download buttons. The visitor's platform is highlighted in the
// foreground colour (white in dark mode, black in light mode); the others are
// translucent outlines over the fog. Hover classes are spelled out per variant
// so tailwind-merge replaces the Button defaults, whose dark-mode hover
// (1.5% -> 2.5% white) was too faint to see. Each button is split: the main
// part downloads the visitor's best match, the arrow lists the other files.
const HERO_BUTTON_BASE =
  "h-11 text-[0.95rem] transition-[background-color,border-color,color,box-shadow] duration-300 motion-reduce:transition-none";

function heroButtonClass(highlighted: boolean) {
  return highlighted
    ? `${HERO_BUTTON_BASE} shadow-lg shadow-black/20 hover:bg-foreground/85`
    : `${HERO_BUTTON_BASE} bg-background/50 backdrop-blur-sm hover:bg-foreground/10 hover:border-foreground/30 hover:text-foreground dark:bg-background/40 dark:border-foreground/15 dark:hover:bg-foreground/10 dark:hover:border-foreground/35`;
}

const NAV_LINK_CLASS =
  "relative rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring after:absolute after:left-0 after:bottom-[-0.125rem] after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full focus-visible:after:w-full";

type ReleaseInfo = NonNullable<typeof __LATEST_RELEASE__>;

type OS = "Windows" | "MacOS" | "Linux" | "Other";
type Arch = "x64" | "arm64";

/**
 * `short` names the file on the main button, where the platform alone isn't
 * enough. `beta`: built and checked automatically, but not yet tried on real
 * hardware (ARM computers and Intel Macs).
 */
type Choice = { key: ReleaseAssetKey; label: string; detail: string; short?: string; beta?: true };

/** Every installer, per platform, as the download menus list them. */
const PLATFORMS: {
  os: Exclude<OS, "Other">;
  name: string;
  Icon: typeof WindowsLogo;
  choices: Choice[];
  /** The installer for a visitor on this platform with this CPU. */
  pick: (arch: Arch | null) => ReleaseAssetKey;
}[] = [
  {
    os: "Windows",
    name: "Windows",
    Icon: WindowsLogo,
    choices: [
      { key: "windows-x64", label: "Windows", detail: "Intel or AMD (x64)" },
      { key: "windows-arm64", label: "Windows on ARM", detail: "Snapdragon and other ARM", short: "ARM", beta: true },
    ],
    pick: (arch) => (arch === "arm64" ? "windows-arm64" : "windows-x64"),
  },
  {
    os: "MacOS",
    name: "macOS",
    Icon: AppleLogo,
    choices: [
      { key: "macos-arm64", label: "Apple silicon", detail: "M1 and newer", short: "Apple silicon" },
      { key: "macos-x64", label: "Intel", detail: "Macs with Intel chips", short: "Intel", beta: true },
    ],
    // Safari doesn't tell, and nearly every Mac sold since 2021 is Apple silicon.
    pick: (arch) => (arch === "x64" ? "macos-x64" : "macos-arm64"),
  },
  {
    os: "Linux",
    name: "Linux",
    Icon: LinuxLogo,
    choices: [
      { key: "appimage-x64", label: "AppImage", detail: "x64, any distribution", short: "AppImage" },
      { key: "deb-x64", label: ".deb", detail: "x64, Debian and Ubuntu" },
      { key: "rpm-x64", label: ".rpm", detail: "x64, Fedora and openSUSE" },
      { key: "appimage-arm64", label: "AppImage", detail: "ARM64, any distribution", short: "AppImage, ARM", beta: true },
      { key: "deb-arm64", label: ".deb", detail: "ARM64, Debian and Ubuntu", beta: true },
      { key: "rpm-arm64", label: ".rpm", detail: "ARM64, Fedora and openSUSE", beta: true },
    ],
    pick: (arch) => (arch === "arm64" ? "appimage-arm64" : "appimage-x64"),
  },
];

/** Where an installer downloads from; the release page until it's known. */
function assetUrl(release: ReleaseInfo | null, key: ReleaseAssetKey) {
  return release?.assets?.[key]?.url ?? LATEST_RELEASE_URL;
}

function formatSize(bytes?: number) {
  return bytes ? `${Math.round(bytes / 1e5) / 10} MB` : "";
}

/**
 * The visitor's CPU where the browser says (Chromium browsers, and Linux
 * browsers through the platform string); null otherwise.
 */
async function detectArch(): Promise<Arch | null> {
  const hints = (
    navigator as Navigator & {
      userAgentData?: { getHighEntropyValues?: (keys: string[]) => Promise<{ architecture?: string }> };
    }
  ).userAgentData;
  try {
    const values = await hints?.getHighEntropyValues?.(["architecture"]);
    if (values?.architecture === "arm") return "arm64";
    if (values?.architecture === "x86") return "x64";
  } catch {
    // Not available; fall through to the platform string.
  }
  const platform = `${navigator.platform} ${navigator.userAgent}`;
  if (/aarch64|arm64|armv8/i.test(platform)) return "arm64";
  if (/x86_64|x64|win64|amd64/i.test(platform)) return "x64";
  return null;
}

export function Header() {
  // Start from the release baked in at build time (vite.config.ts) so the
  // prerendered page already shows the version and direct download links.
  const [release, setRelease] = useState<ReleaseInfo | null>(
    __LATEST_RELEASE__
  );
  const [versionLabel, setVersionLabel] = useState(
    __LATEST_RELEASE__?.version ?? "Loading..."
  );
  const [os, setOS] = useState<OS>("Other");
  const [arch, setArch] = useState<Arch | null>(null);

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
    detectArch().then(setArch);
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
      .catch(() =>
        // Keep the build-time version if the live check fails.
        setVersionLabel(__LATEST_RELEASE__?.version ?? "Latest release")
      );
  }, []);

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
        className='hero-in text-base sm:text-xl max-w-132 text-center leading-relaxed sm:leading-8 text-balance drop-shadow-lg mx-4'
        style={{ "--hero-delay": "0.1s" }}
      >
        Resuma is an open-source desktop application for building beautiful
        resumes. Fast, flexible, and privacy-oriented.
      </p>

      <div
        className='hero-in absolute bottom-16 flex flex-col gap-4 items-center justify-center w-full text-center'
        style={{ "--hero-delay": "0.25s" }}
      >
        <Downloads release={release} os={os} arch={arch} />
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

const MENU_CLASS =
  // Solid, so the page behind never shows through the list.
  "w-64 mt-2 rounded-md border bg-popover text-popover-foreground shadow-lg p-1 select-none text-sm dark:border-input";

/** One menu row: the installer's name, who it's for, and its size. */
function ChoiceItem({ choice, release }: { choice: Choice; release: ReleaseInfo | null }) {
  const asset = release?.assets?.[choice.key];
  return (
    <DropdownMenuItem asChild>
      <a href={assetUrl(release, choice.key)} target='_blank' rel='noopener noreferrer'>
        <span className='flex flex-col'>
          <span className='font-medium'>
            {choice.label}
            {choice.beta && <span className='ml-1.5 rounded-sm border px-1 text-[0.65rem] font-normal uppercase tracking-wide text-muted-foreground'>Beta</span>}
          </span>
          <span className='text-xs text-muted-foreground'>{choice.detail}</span>
        </span>
        <span className='ml-auto text-xs tabular-nums text-muted-foreground'>
          {asset ? formatSize(asset.size) : "Release page"}
        </span>
      </a>
    </DropdownMenuItem>
  );
}

/**
 * Download buttons: one split button per platform on wide screens (the
 * visitor's own highlighted), one menu with every installer on phones.
 */
function Downloads({ release, os, arch }: { release: ReleaseInfo | null; os: OS; arch: Arch | null }) {
  return (
    <>
      {/* The three split buttons need ~990px with their detail labels and
          ~800px without, so they start at lg with the details at xl; below
          lg, one menu lists every installer. */}
      <div className='hidden lg:flex flex-wrap justify-center gap-4 px-4'>
        {PLATFORMS.map(({ os: platform, name, Icon, choices, pick }) => {
          const highlighted = os === platform;
          const key = pick(os === platform ? arch : null);
          const main = choices.find((c) => c.key === key)!;
          const variant = highlighted ? "secondary" : "outline";
          return (
            <div
              key={platform}
              className='flex rounded-lg transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0'
            >
              <Button asChild size='lg' variant={variant} className={`${heroButtonClass(highlighted)} rounded-l-lg rounded-r-none px-5`}>
                <a href={assetUrl(release, key)} target='_blank' rel='noopener noreferrer'>
                  <Icon className='h-6 w-6' aria-hidden='true' />
                  Download for {name}
                  {main.short && (
                    <span className='hidden xl:inline text-muted-foreground'>
                      ({main.short}
                      {main.beta ? ", beta" : ""})
                    </span>
                  )}
                </a>
              </Button>
              {/* Non-modal: a modal menu locks scrolling, which makes the
                  smooth-scrolled page jump. The trigger is a plain button
                  because the menu needs its DOM node to position itself. */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    type='button'
                    className={cn(
                      buttonVariants({ variant, size: "lg" }),
                      heroButtonClass(highlighted),
                      "rounded-r-lg rounded-l-none border-l px-2.5"
                    )}
                    aria-label={`Other ${name} downloads`}
                  >
                    <ChevronDown className='h-4 w-4' aria-hidden='true' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className={MENU_CLASS}>
                  {choices.map((choice) => (
                    <ChoiceItem key={choice.key} choice={choice} release={release} />
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>

      <div className='flex gap-4 lg:hidden'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type='button'
              className="dark:backdrop-blur-sm select-none hover:cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-11 rounded-lg px-5 text-[0.95rem]"
            >
              <Download className='mr-2 h-5 w-5' aria-hidden='true' /> Download options
              <ChevronDown className='ml-2 h-4 w-4' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='center' className={`${MENU_CLASS} max-h-[60vh]`}>
            {PLATFORMS.map(({ os: platform, name, Icon, choices }, i) => (
              <div key={platform}>
                {i > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <Icon className='h-4 w-4' aria-hidden='true' />
                  {name}
                </DropdownMenuLabel>
                {choices.map((choice) => (
                  <ChoiceItem key={choice.key} choice={choice} release={release} />
                ))}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

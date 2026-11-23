import Logo from "@/assets/Logo.svg?react";
import { ScrollReveal } from "./ScrollReveal";

const REPO = "https://github.com/nikolchaa/resuma";

const LINKS = [
  { label: "GitHub", href: REPO },
  { label: "Releases", href: `${REPO}/releases` },
  { label: "Trademark", href: `${REPO}/blob/main/TRADEMARK.md` },
  { label: "Terms of Service", href: `${REPO}/blob/main/TERMS.md` },
  { label: "Privacy Policy", href: `${REPO}/blob/main/PRIVACY.md` },
  { label: "License", href: `${REPO}/blob/main/LICENSE` },
  { label: "Contact", href: "mailto:contact@nikolchaa.com" },
];

const LINK_CLASS =
  "relative rounded-sm outline-none transition-colors duration-300 hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring after:absolute after:left-0 after:bottom-[-0.15rem] after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100";

export function Footer() {
  return (
    <footer className='w-full border-t bg-background text-muted-foreground text-sm flex justify-center'>
      <ScrollReveal className='flex flex-col items-center gap-6 py-16 sm:py-20'>
        <Logo
          className='h-10 sm:h-12 w-auto text-foreground'
          role='img'
          aria-label='Resuma'
        />
        <nav aria-label='Project, legal and contact'>
          <ul className='flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4'>
            {LINKS.map((link) => {
              const external = link.href.startsWith("http");
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={LINK_CLASS}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className='text-xs'>
          © {new Date().getFullYear()} Resuma™
          <span className='mx-2' aria-hidden='true'>
            ·
          </span>
          Built with{" "}
          <span role='img' aria-label='love' className='text-primary'>
            ♥
          </span>{" "}
          in Serbia.
        </p>
      </ScrollReveal>
    </footer>
  );
}

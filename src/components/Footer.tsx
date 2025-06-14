import Logo from "@/assets/Logo.svg?react";
import { ScrollReveal } from "./ScrollReveal";

export function Footer() {
  return (
    <footer className='w-full border-t bg-background text-muted-foreground text-sm mt-16 flex justify-center py-8'>
      <ScrollReveal className='flex flex-col items-center gap-4'>
        <Logo className='h-12 w-auto text-foreground' />
        <nav className='flex flex-wrap items-center justify-center gap-6 text-sm'>
          <a
            href='https://github.com/nikolchaa/resuma/blob/main/TRADEMARK.md'
            target='_blank'
            rel='noreferrer'
          >
            Trademark
          </a>
          <a
            href='https://github.com/nikolchaa/resuma/blob/main/TERMS.md'
            target='_blank'
            rel='noreferrer'
          >
            Terms of Service
          </a>
          <a
            href='https://github.com/nikolchaa/resuma/blob/main/PRIVACY.md'
            target='_blank'
            rel='noreferrer'
          >
            Privacy Policy
          </a>
          <a
            href='https://github.com/nikolchaa/resuma/blob/main/LICENSE'
            target='_blank'
            rel='noreferrer'
          >
            License
          </a>
          <a href='mailto:contact@nikolchaa.com'>Contact</a>
        </nav>
        <p className='text-xs'>
          © {new Date().getFullYear()} Resuma™ Built with ♥ in Serbia.
        </p>
      </ScrollReveal>
    </footer>
  );
}

import Logo from "@/assets/Logo.svg?react";
import { ScrollReveal } from "./ScrollReveal";

export function Footer() {
  return (
    <footer className='w-full border-t bg-background text-muted-foreground text-sm flex justify-center'>
      <ScrollReveal className='flex flex-col items-center gap-4 my-16'>
        <Logo className='h-12 w-auto text-foreground' />
        <nav className='flex flex-wrap items-center justify-center gap-4 px-4 text-sm text-muted-foreground'>
          <a
            href='https://github.com/nikolchaa/resuma/blob/main/TRADEMARK.md'
            target='_blank'
            rel='noreferrer'
            className='relative after:absolute after:left-0 after:bottom-[-0.05rem] after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
          >
            Trademark
          </a>
          <a
            href='https://github.com/nikolchaa/resuma/blob/main/TERMS.md'
            target='_blank'
            rel='noreferrer'
            className='relative after:absolute after:left-0 after:bottom-[-0.05rem] after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
          >
            Terms of Service
          </a>
          <a
            href='https://github.com/nikolchaa/resuma/blob/main/PRIVACY.md'
            target='_blank'
            rel='noreferrer'
            className='relative after:absolute after:left-0 after:bottom-[-0.05rem] after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
          >
            Privacy Policy
          </a>
          <a
            href='https://github.com/nikolchaa/resuma/blob/main/LICENSE'
            target='_blank'
            rel='noreferrer'
            className='relative after:absolute after:left-0 after:bottom-[-0.05rem] after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
          >
            License
          </a>
          <a
            href='mailto:contact@nikolchaa.com'
            className='relative after:absolute after:left-0 after:bottom-[-0.05rem] after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
          >
            Contact
          </a>
        </nav>

        <p className='text-xs'>
          © {new Date().getFullYear()} Resuma™ Built with ♥ in Serbia.
        </p>
      </ScrollReveal>
    </footer>
  );
}

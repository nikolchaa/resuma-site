import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { useEffect, useState } from "preact/hooks";

import NewLight from "@/assets/New Resume - Light.mp4";
import NewDark from "@/assets/New Resume - Dark.mp4";

import ResumaDark from "@/assets/ResumaDark.webp";
import ResumaLight from "@/assets/ResumaLight.webp";

export function Bento() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className='grid max-w-6xl sm:grid-cols-4 gap-6 py-12'>
      <VerticalCard />
      <HorizontalCard isDark={isDark} />
      <SmallCard1 isDark={isDark} />
      <SmallCard4 isDark={isDark} />
      <BigCard />
      <SmallCard3 />
      <SmallCard2 />
    </div>
  );
}

function VerticalCard() {
  return (
    <ScrollReveal className='col-span-2 sm:row-span-2 sm:col-span-1'>
      <Card className={"w-full h-full py-0 gap-0"}>
        {/* <h3 className='text-lg font-semibold text-foreground'>Resume Wizard</h3>
        <p className='text-sm text-muted-foreground'>
          Trim & enhance your resume with AI.
        </p> */}
      </Card>
    </ScrollReveal>
  );
}

function HorizontalCard({ isDark }: { isDark: boolean }) {
  return (
    <ScrollReveal className='col-span-2 aspect-[436/206]'>
      <Card className='w-full h-full py-0 gap-0 overflow-y-visible relative group'>
        <div className='absolute w-[50%] h-[150%] overflow-hidden bottom-0 right-0 rounded-br-xl'>
          <img
            src={isDark ? ResumaLight : ResumaDark}
            alt='Resuma Light'
            className='border w-full rotate-12 skew-12 absolute left-10 transition-all duration-300 bottom-10 group-hover:bottom-12 sm:group-hover:bottom-14'
            style={{ clipPath: "inset(0 0 20% 0)" }} // Fix for the wear pixel leakage
          />

          <img
            src={isDark ? ResumaDark : ResumaLight}
            alt='Resuma Dark'
            className='border w-full rotate-12 skew-12 absolute left-1 transition-all duration-300 bottom-0 group-hover:bottom-1 sm:group-hover:bottom-2'
          />
        </div>
        <div className='absolute inset-6 w-[40%] flex flex-col justify-center text-muted-foreground'>
          <span
            className={
              "text-xl font-semibold flex items-center gap-2 text-foreground"
            }
          >
            <Wand2 className='w-6 h-6 text-primary inline' /> Themes
          </span>
          Resuma offers dark and light UI themes.
        </div>
      </Card>
    </ScrollReveal>
  );
}

function SmallCard1({ isDark }: { isDark: boolean }) {
  return (
    <ScrollReveal className='sm:aspect-square'>
      <Card className={"w-full h-full py-0 gap-0"}>
        <video
          className='w-full object-cover rounded-xl'
          autoPlay
          loop
          muted
          playsInline
          src={isDark ? NewDark : NewLight}
        />
      </Card>
    </ScrollReveal>
  );
}

function SmallCard2() {
  return (
    <ScrollReveal className='sm:aspect-square'>
      <Card className={"w-full h-full py-0 gap-0"}>
        {/* <Paintbrush className='w-6 h-6 text-primary' />
        <h3 className='text-lg font-semibold text-foreground'>Custom Themes</h3>
        <p className='text-sm text-muted-foreground'>
          Professional, Modern, and Compact layouts.
        </p> */}
      </Card>
    </ScrollReveal>
  );
}

function SmallCard3() {
  return (
    <ScrollReveal className='sm:aspect-square'>
      <Card className={"w-full h-full py-0 gap-0"}>
        {/* <Cpu className='w-6 h-6 text-primary' />
        <h3 className='text-lg font-semibold text-foreground'>
          Built with Rust + Tauri
        </h3>
        <p className='text-sm text-muted-foreground'>
          Fast, secure native app experience.
        </p> */}
      </Card>
    </ScrollReveal>
  );
}

function SmallCard4({ isDark }: { isDark: boolean }) {
  return (
    <ScrollReveal className='sm:aspect-square'>
      <Card className={"w-full h-full py-0 gap-0"}>
        <video
          className='w-full object-cover rounded-xl'
          autoPlay
          loop
          muted
          playsInline
          src={isDark ? NewDark : NewLight}
        />
      </Card>
    </ScrollReveal>
  );
}

function BigCard() {
  return (
    <ScrollReveal className='col-span-2 row-span-2'>
      <Card className='w-full h-full py-0 gap-0 aspect-square'>
        {/* <Cpu className='w-6 h-6 text-primary' />
        <h3 className='text-lg font-semibold text-foreground'>
          Built with Rust + Tauri
        </h3>
        <p className='text-sm text-muted-foreground'>
          Fast, secure native app experience.
        </p> */}
      </Card>
    </ScrollReveal>
  );
}

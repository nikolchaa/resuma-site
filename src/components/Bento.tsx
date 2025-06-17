import { Card } from "@/components/ui/card";
import {
  Brain,
  FileText,
  Wand2,
  Paintbrush,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

import NewLight from "@/assets/New Resume - Light.mp4";
import NewDark from "@/assets/New Resume - Dark.mp4";
import { useEffect, useState } from "preact/hooks";

export function Bento() {
  return (
    <div className='grid max-w-6xl sm:grid-cols-4 gap-6 py-12'>
      <VerticalCard />
      <HorizontalCard />
      <SmallCard1 />
      <SmallCard4 />
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
        <Wand2 className='w-6 h-6 text-primary' />
        <h3 className='text-lg font-semibold text-foreground'>Resume Wizard</h3>
        <p className='text-sm text-muted-foreground'>
          Trim & enhance your resume with AI.
        </p>
      </Card>
    </ScrollReveal>
  );
}

function HorizontalCard() {
  return (
    <ScrollReveal className='col-span-2'>
      <Card className={"w-full h-full py-0 gap-0"}>
        <Brain className='w-6 h-6 text-primary' />
        <h3 className='text-lg font-semibold text-foreground'>Local AI</h3>
        <p className='text-sm text-muted-foreground'>
          Fully private, offline resume editing.
        </p>
      </Card>
    </ScrollReveal>
  );
}

function SmallCard1() {
  return (
    <ScrollReveal className='aspect-square'>
      <Card className={"w-full h-full py-0 gap-0"}>
        <ShieldCheck className='w-6 h-6 text-primary' />
        <h3 className='text-lg font-semibold text-foreground'>ATS Optimized</h3>
        <p className='text-sm text-muted-foreground'>
          Beat resume scanners with smart formatting.
        </p>
      </Card>
    </ScrollReveal>
  );
}

function SmallCard2() {
  return (
    <ScrollReveal className='aspect-square'>
      <Card className={"w-full h-full py-0 gap-0"}>
        <Paintbrush className='w-6 h-6 text-primary' />
        <h3 className='text-lg font-semibold text-foreground'>Custom Themes</h3>
        <p className='text-sm text-muted-foreground'>
          Professional, Modern, and Compact layouts.
        </p>
      </Card>
    </ScrollReveal>
  );
}

function SmallCard3() {
  return (
    <ScrollReveal className='aspect-square'>
      <Card className={"w-full h-full py-0 gap-0"}>
        <Cpu className='w-6 h-6 text-primary' />
        <h3 className='text-lg font-semibold text-foreground'>
          Built with Rust + Tauri
        </h3>
        <p className='text-sm text-muted-foreground'>
          Fast, secure native app experience.
        </p>
      </Card>
    </ScrollReveal>
  );
}

function SmallCard4() {
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
    <ScrollReveal className='aspect-square'>
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
    <ScrollReveal className='col-span-2 row-span-2 sm:aspect-square'>
      <Card className={"w-full h-full py-0 gap-0"}>
        <FileText className='w-6 h-6 text-primary' />
        <h3 className='text-lg font-semibold text-foreground'>
          Live PDF Preview
        </h3>
        <p className='text-sm text-muted-foreground'>
          View your resume as you write it.
        </p>
      </Card>
    </ScrollReveal>
  );
}

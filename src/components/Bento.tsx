import { Card } from "@/components/ui/card";
import { Cpu, Sparkles, Star, Wand2 } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { useEffect, useRef, useState } from "preact/hooks";
import { Button } from "./ui/button";

import NewLight from "@/assets/New Resume - Light.mp4";
import NewDark from "@/assets/New Resume - Dark.mp4";

import ResumaDark from "@/assets/ResumaDark.webp";
import ResumaLight from "@/assets/ResumaLight.webp";

import GitHub from "@/assets/github.svg?react";
import Waves from "@/assets/Waves.svg?react";

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
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-6 py-12 max-w-6xl'>
      <SmallCard1 />
      <HorizontalCard1 isDark={isDark} />
      <SmallCard2 isDark={isDark} />
      <HorizontalCard2 />
      <BigCard />
      <SmallCard3 />
      <SmallCard4 />
    </div>
  );
}

function HorizontalCard1({ isDark }: { isDark: boolean }) {
  return (
    <ScrollReveal className='col-span-2 aspect-[436/206] order-1 sm:order-2'>
      <Card className='w-full h-full py-0 gap-0 overflow-y-visible relative group'>
        <div className='absolute w-[50%] h-[125%] overflow-hidden bottom-0 right-0 rounded-br-xl'>
          <img
            onDragStart={(e) => e.preventDefault()}
            src={isDark ? ResumaLight : ResumaDark}
            alt='Resuma Light'
            className='border w-full rotate-12 skew-12 absolute left-10 transition-all duration-300 bottom-10 group-hover:bottom-12 sm:group-hover:bottom-14 rounded-[2px]'
            style={{ clipPath: "inset(0 0 20% 0)" }} // Fix for the pixel leakage
          />

          <img
            onDragStart={(e) => e.preventDefault()}
            src={isDark ? ResumaDark : ResumaLight}
            alt='Resuma Dark'
            className='border w-full rotate-12 skew-12 absolute left-1 transition-all duration-300 bottom-0 group-hover:bottom-1 sm:group-hover:bottom-2 rounded-[2px]'
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

export function HorizontalCard2() {
  const [position, setPosition] = useState(70);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newPos = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, newPos)));
  };

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    const move = (e: MouseEvent) => handleDrag(e.clientX);
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const onTouchStart = () => {
    const move = (e: TouchEvent) => handleDrag(e.touches[0].clientX);
    const up = () => {
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
  };

  return (
    <ScrollReveal className='col-span-2 aspect-[436/206] order-4 sm:order-4'>
      <Card className='w-full h-full relative overflow-hidden p-0'>
        <div ref={containerRef} className='relative w-full h-full select-none'>
          {/* After AI */}
          <div className='absolute inset-0 p-3 text-left text-sm leading-relaxed text-foreground bg-background min-[31.25em]:max-[40em]:text-lg min-[27.875em]:max-[31.25em]:text-base'>
            <p>
              As an ex-employee, I led key projects, managed client workflows,
              and coordinated cross-functional teams, achieving notable results
              in both client satisfaction and project completion.
            </p>
          </div>

          {/* Before AI */}
          <div
            className='absolute inset-0 p-3 text-left text-sm leading-relaxed text-muted-foreground bg-background min-[31.25em]:max-[40em]:text-lg min-[27.875em]:max-[31.25em]:text-base'
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <p>Worked on various client projects...</p>
          </div>

          {/* Slider Handle */}
          <div
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            className='absolute top-0 bottom-0 flex items-center cursor-ew-resize'
            style={{
              left: `${position}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className='w-1 h-full bg-primary' />
            <div className='w-5 h-5 bg-primary rounded-full shadow-md mx-auto absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2' />
          </div>
        </div>

        {/* Caption */}
        <div
          className={`absolute bottom-0 left-0 w-full text-foreground z-10 bg-gradient-to-t from-background to-transparent p-6 pointer-events-none min-[40em]:max-[43.9375em]:hidden max-[22.25em]:hidden min-[43.9375em]:max-[51.75em]:p-3 max-[26.125em]:p-3`}
        >
          <span className='text-xl font-semibold flex items-center gap-2 mb-1'>
            <Sparkles className='w-6 h-6 text-primary inline' />
            AI Enhancement
          </span>
          <p className='text-sm text-muted-foreground max-[26.125em]:hidden min-[43.9375em]:max-[51.75em]:hidden'>
            Slide to reveal how AI improves your tone and impact.
          </p>
        </div>
      </Card>
    </ScrollReveal>
  );
}

function SmallCard1() {
  return (
    <ScrollReveal className='aspect-square order-2 sm:order-1'>
      <Card className={"w-full h-full py-0 gap-0"}></Card>
    </ScrollReveal>
  );
}

function SmallCard2({ isDark }: { isDark: boolean }) {
  return (
    <ScrollReveal className='aspect-square order-3 sm:order-3'>
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

function SmallCard3() {
  return (
    <ScrollReveal className='aspect-square order-6 sm:order-6'>
      <Card className='w-full h-full relative overflow-hidden'></Card>
    </ScrollReveal>
  );
}

function SmallCard4() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/nikolchaa/tauri-plugin-hwinfo")
      .then((res) => res.json())
      .then((data) => {
        if (data?.stargazers_count) {
          setStars(data.stargazers_count);
        }
      })
      .catch((err) => console.error("Failed to fetch stars:", err));
  }, []);

  return (
    <ScrollReveal className='aspect-square order-7 sm:order-7'>
      <Card className='w-full h-full relative overflow-hidden'>
        <div className='absolute inset-0 flex flex-col items-center justify-center gap-[10%] px-[5%] text-center text-[min(4vw,0.95rem)]'>
          {/* GitHub Icon */}
          <GitHub className='w-[18%] max-w-[40px] h-auto' />

          {/* Text label */}
          <div className='text-muted-foreground leading-snug text-[min(3.2vw,0.8rem)] md:text-base'>
            Support us on GitHub
          </div>

          {/* Button that links to repo */}
          <a
            href='https://github.com/nikolchaa/resuma'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button
              variant='default'
              className='text-[min(3.2vw,0.8rem)]'
              size='sm'
            >
              <Star className='w-4 h-4' />
              {stars !== null
                ? `${stars.toLocaleString()} stars`
                : "Loading..."}
            </Button>
          </a>
        </div>
      </Card>
    </ScrollReveal>
  );
}

export function BigCard() {
  return (
    <ScrollReveal className='col-span-2 row-span-2 order-5 sm:order-5'>
      <Card className='w-full h-full aspect-square p-4 pb-0 flex flex-col items-start bg-background text-foreground gap-3 relative overflow-hidden'>
        {/* Badge */}
        <div className='flex items-center gap-2 text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full z-10'>
          <Sparkles className='w-3.5 h-3.5' />
          Local AI Core
        </div>

        {/* Title */}
        <div className='text-2xl font-bold flex items-center gap-2 z-10 min-sm:max-[42.125rem]:text-lg max-[21.3125rem]:text-lg'>
          <Cpu className='w-6 h-6 text-muted-foreground' />
          Powered by llama.cpp
        </div>

        {/* Description */}
        <div className='text-muted-foreground text-sm leading-snug z-10 min-sm:max-[42.125rem]:text-xs min-[21.3125rem]:max-sm:text-base max-[21.3125rem]:text-base'>
          Resuma uses{" "}
          <span className='font-semibold text-foreground'>llama.cpp</span> under
          the hood to run
          <span className='font-semibold text-foreground'>
            {" "}
            Qwen3 models (0.6B–32B)
          </span>{" "}
          locally on your machine. It's fully offline, open-source, and
          optimized for performance via native Rust + CLI integration.
        </div>

        {/* Watermark + Waves */}
        <div className='absolute bottom-0 left-0 w-full'>
          {/* Huge AI Watermark */}
          <span
            className='text-foreground/10 font-bold absolute left-1/2 -translate-x-1/2
              bottom-0
              text-[clamp(4rem,22vw,15rem)]
              leading-[clamp(4rem,22vw,15rem)]
              min-[58rem]:text-[15rem]
              min-[58rem]:leading-[15rem]
              min-[58rem]:bottom-[2rem]
              max-[23.4375rem]:hidden
              max-sm:text-[clamp(4rem,50vw,20rem)]
              max-sm:leading-[clamp(4rem,50vw,20rem)]
              max-sm:bottom-[clamp(1rem,5vw,5rem)]
              pointer-events-none select-none whitespace-nowrap'
          >
            AI
          </span>

          {/* Responsive SVG Waves */}
          <Waves
            className='w-full h-auto absolute left-0 
              -bottom-[2rem] 
              sm:max-[58rem]:-bottom-[2.5rem] 
              sm:-bottom-[1rem]'
          />
        </div>
      </Card>
    </ScrollReveal>
  );
}

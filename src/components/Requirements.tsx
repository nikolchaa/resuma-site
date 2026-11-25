import type { ComponentChildren } from "preact";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Cog, Computer, Disc, Globe, type LucideIcon } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

type Spec = {
  title: string;
  icon: LucideIcon;
  rows: { label: string; value: ComponentChildren }[];
};

const SPECS: Spec[] = [
  {
    title: "Operating Systems",
    icon: Computer,
    rows: [
      {
        label: "Windows",
        value: (
          <>
            10 or 11, 64-bit (x86_64), <code>.exe</code>
          </>
        ),
      },
      {
        label: "macOS",
        value: (
          <>
            Apple Silicon (ARM64) only, <code>.dmg</code>
          </>
        ),
      },
      {
        label: "Linux",
        value: (
          <>
            Modern 64-bit distro (x86_64), <code>.deb</code> or{" "}
            <code>.rpm</code>
          </>
        ),
      },
    ],
  },
  {
    title: "Network Requirements",
    icon: Globe,
    rows: [
      {
        label: "No AI",
        value: "No internet connection needed. Nothing is downloaded.",
      },
      {
        label: "Local AI",
        value:
          "Default. Internet is only needed during onboarding to download the model and runtime; after that, everything works fully offline.",
      },
      {
        label: "Ollama, LM Studio",
        value: "Work offline on your own machine.",
      },
      {
        label: "Cloud AI",
        value: "Needs an internet connection whenever you use AI features.",
      },
    ],
  },
  {
    title: "Hardware Requirements",
    icon: Cog,
    rows: [
      {
        label: "CPU",
        value: (
          <>
            64-bit x86_64 or Apple Silicon, <code>AVX2</code> recommended on
            x86_64
          </>
        ),
      },
      {
        label: "RAM",
        value: "8GB minimum for local AI, 16GB+ recommended",
      },
      {
        label: "GPU (optional)",
        value: (
          <ul className='space-y-1'>
            <li>
              <span className='text-foreground'>Windows:</span> Vulkan (AMD,
              NVIDIA, Intel), HIP (AMD with ROCm support), or CUDA 12.4
              (NVIDIA)
            </li>
            <li>
              <span className='text-foreground'>Linux:</span> Vulkan (AMD,
              NVIDIA, Intel)
            </li>
            <li>
              <span className='text-foreground'>macOS:</span> Metal (built into
              Apple Silicon)
            </li>
          </ul>
        ),
      },
      {
        label: "VRAM",
        value: "6GB+ runs Qwen3 4B on the GPU, 12GB+ runs Qwen3 14B",
      },
      {
        label: "No AI or remote AI",
        value: "No GPU or extra RAM needed",
      },
    ],
  },
  {
    title: "Disk Space",
    icon: Disc,
    rows: [
      {
        label: "Installer",
        value: "~5MB (Windows), ~6MB (macOS), ~7MB (Linux)",
      },
      { label: "App", value: "~16MB installed" },
      {
        label: "Model",
        value:
          "~805MB (Qwen3 0.6B), ~3.3GB (4B), or ~9GB (14B), picked to fit your hardware",
      },
      {
        label: "Runtime",
        value: "~35MB (CPU), ~60MB (Vulkan), ~300MB (CUDA), ~1.5GB (HIP)",
      },
      {
        label: "Estimated total",
        value:
          "~850MB to ~11GB depending on runtime and model, none of it needed with No AI, Ollama, LM Studio, or a cloud API",
      },
    ],
  },
];

export default function SystemRequirements() {
  return (
    <div className='grid gap-6 max-w-6xl w-full mx-auto py-12 grid-cols-1 md:grid-cols-2'>
      {SPECS.map(({ title, icon: Icon, rows }) => (
        <ScrollReveal key={title} className='h-full'>
          <Card className='h-full'>
            <CardContent className='text-sm'>
              <CardTitle className='flex items-center gap-3 text-base'>
                <span className='grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary'>
                  <Icon className='size-4.5' aria-hidden='true' />
                </span>
                {title}
              </CardTitle>
              <dl className='mt-5 divide-y divide-border'>
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className='grid grid-cols-1 gap-1 py-3 first:pt-0 last:pb-0 min-[26rem]:grid-cols-[8.5rem_1fr] min-[26rem]:gap-4'
                  >
                    <dt className='font-medium text-foreground'>{row.label}</dt>
                    <dd className='text-muted-foreground leading-relaxed'>
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </ScrollReveal>
      ))}
    </div>
  );
}

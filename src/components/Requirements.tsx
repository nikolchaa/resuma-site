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
            10 or 11, on x64 (Intel or AMD) or ARM64 (Snapdragon),{" "}
            <code>.exe</code>
          </>
        ),
      },
      {
        label: "macOS",
        value: (
          <>
            Apple silicon or Intel, <code>.dmg</code>
          </>
        ),
      },
      {
        label: "Linux",
        value: (
          <>
            Modern 64-bit distribution on x64 or ARM64: AppImage for any
            distribution, or <code>.deb</code> and <code>.rpm</code>. Local AI
            on ARM64 needs glibc 2.38 or newer (Ubuntu 24.04, Debian 13,
            Fedora 39, or later)
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
            64-bit x64 or ARM64 (Apple silicon, Snapdragon, other ARM),{" "}
            <code>AVX2</code> recommended on x64
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
              NVIDIA, Intel), HIP (AMD with ROCm support), CUDA 12.4
              (NVIDIA), or OpenCL (Snapdragon)
            </li>
            <li>
              <span className='text-foreground'>Linux:</span> Vulkan (AMD,
              NVIDIA, Intel), on x64 and ARM64
            </li>
            <li>
              <span className='text-foreground'>macOS:</span> Metal on Apple
              silicon; Intel Macs run local AI on the CPU
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
        value:
          "~6MB (Windows), ~8MB (macOS), ~9MB (.deb, .rpm), ~93MB (AppImage, which carries its own libraries)",
      },
      { label: "App", value: "~18MB (Windows) to ~26MB (Linux) installed" },
      {
        label: "Model",
        value:
          "~805MB (Qwen3 0.6B), ~3.3GB (4B), or ~9GB (14B), picked to fit your hardware",
      },
      {
        label: "Runtime",
        value: (
          <ul className='space-y-1'>
            <li>~12MB to ~24MB (CPU), ~14MB (OpenCL), ~16MB (Metal), or ~25MB to ~37MB (Vulkan)</li>
            <li>~430MB to ~745MB (HIP, with AMD's ROCm libraries and the kernels for your GPU: least for Radeon RX 6000, most for RX 9000)</li>
            <li>~715MB (CUDA, with NVIDIA's runtime files)</li>
          </ul>
        ),
      },
      {
        label: "Job matching",
        value:
          "Optional ~640MB model that makes tailoring a resume to a job faster and more consistent with local AI",
      },
      {
        label: "Estimated total",
        value:
          "~850MB to ~10GB of downloads depending on runtime and model, none of it needed with No AI, Ollama, LM Studio, or a cloud API",
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

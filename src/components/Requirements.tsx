import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Cog, Computer, Disc, Globe } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export default function SystemRequirements() {
  return (
    <div className='grid gap-6 max-w-6xl mx-auto py-12 grid-cols-1 md:grid-cols-2'>
      <ScrollReveal>
        <Card>
          <CardContent className='text-sm text-muted-foreground space-y-2'>
            <CardTitle className='mb-4'>
              <Computer className='h-4 w-4 mr-1 inline text-primary' />{" "}
              Operating Systems
            </CardTitle>
            <ul className='list-disc list-inside'>
              <li>
                <strong>Windows:</strong> 10 or 11, 64-bit (x86_64),{" "}
                <code>.exe</code>
              </li>
              <li>
                <strong>macOS:</strong> Apple Silicon (ARM64) only,{" "}
                <code>.dmg</code>
              </li>
              <li>
                <strong>Linux:</strong> Modern 64-bit distro (x86_64),{" "}
                <code>.deb</code> or <code>.rpm</code>
              </li>
            </ul>
          </CardContent>
        </Card>
      </ScrollReveal>
      <ScrollReveal>
        <Card>
          <CardContent className='text-sm text-muted-foreground space-y-2'>
            <CardTitle className='mb-4'>
              <Globe className='h-4 w-4 mr-1 inline text-primary' /> Network
              Requirements
            </CardTitle>
            <p>
              With the default local AI, you only need an internet connection
              during onboarding to download the model and runtime. Once setup
              is complete, all features work fully offline.
            </p>
            <p>
              Ollama and LM Studio work offline on your own machine. Cloud AI
              providers need an internet connection whenever you use AI
              features.
            </p>
          </CardContent>
        </Card>
      </ScrollReveal>
      <ScrollReveal>
        <Card>
          <CardContent className='text-sm text-muted-foreground space-y-2'>
            <CardTitle className='mb-4'>
              <Cog className='h-4 w-4 mr-1 inline text-primary' /> Hardware
              Requirements
            </CardTitle>
            <ul className='list-disc list-inside'>
              <li>
                <strong>CPU:</strong> 64-bit x86_64 or Apple Silicon,{" "}
                <code>AVX2</code> recommended on x86_64
              </li>
              <li>
                <strong>RAM:</strong> 8GB minimum, 16GB+ recommended
              </li>
              <li>
                <strong>GPU (optional):</strong>
                <ul className='list-disc list-inside ml-4'>
                  <li>
                    <strong>Windows:</strong> Vulkan (AMD, NVIDIA, Intel), HIP
                    (AMD with ROCm support), or CUDA 12.4 (NVIDIA)
                  </li>
                  <li>
                    <strong>Linux:</strong> Vulkan (AMD, NVIDIA, Intel)
                  </li>
                  <li>
                    <strong>macOS:</strong> Metal (built into Apple Silicon)
                  </li>
                </ul>
              </li>
              <li>
                <strong>VRAM:</strong> 6GB+ runs Qwen3 4B on the GPU, 12GB+
                runs Qwen3 14B
              </li>
              <li>
                <strong>Cloud or remote AI:</strong> no GPU or extra RAM needed
              </li>
            </ul>
          </CardContent>
        </Card>
      </ScrollReveal>

      <ScrollReveal>
        <Card>
          <CardContent className='text-sm text-muted-foreground space-y-2'>
            <CardTitle className='mb-4'>
              <Disc className='h-4 w-4 mr-1 inline text-primary' /> Disk Space
            </CardTitle>
            <ul className='list-disc list-inside'>
              <li>
                <strong>Installer size:</strong> ~5MB (Windows), ~6MB (macOS),
                ~7MB (Linux)
              </li>
              <li>
                <strong>App size:</strong> ~16MB installed
              </li>
              <li>
                <strong>Model:</strong> ~805MB (Qwen3 0.6B), ~3.3GB (4B), or
                ~9GB (14B), picked to fit your hardware
              </li>
              <li>
                <strong>Runtime:</strong> ~35MB (CPU), ~60MB (Vulkan), ~300MB
                (CUDA), ~1.5GB (HIP)
              </li>
              <li>
                <strong>Estimated total:</strong> ~850MB to ~11GB depending on
                runtime and model, none of it needed with Ollama, LM Studio, or
                a cloud API
              </li>
            </ul>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}

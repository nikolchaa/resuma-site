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
                <strong>Windows:</strong> 10 or 11, 64-bit (x86_64)
              </li>
              <li>
                <strong>macOS:</strong> Apple Silicon (ARM64) only
              </li>
              <li>
                <strong>Linux:</strong> Modern 64-bit distro (x86_64)
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
              Internet connection is required for downloading models and
              runtimes during onboarding. Once setup is complete, all features
              work fully offline.
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
                <strong>CPU:</strong> 64-bit (x86_64) with <code>AVX2</code>{" "}
                support
              </li>
              <li>
                <strong>RAM:</strong> 8GB minimum, 16GB+ recommended
              </li>
              <li>
                <strong>GPU:</strong>
                <ul className='list-disc list-inside ml-4'>
                  <li>
                    <strong>Vulkan:</strong> AMD, NVIDIA, Intel with Vulkan
                    support
                  </li>
                  <li>
                    <strong>HIP:</strong> AMD GPUs with ROCm support
                  </li>
                  <li>
                    <strong>CUDA:</strong> NVIDIA GPUs with CUDA 12.4 support
                  </li>
                  <li>
                    <strong>CPU:</strong> Supported but slower performance
                  </li>
                </ul>
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
                <strong>App size:</strong> ~16MB installed
              </li>
              <li>
                <strong>Base Model:</strong> ~805MB
              </li>
              <li>
                <strong>Runtime:</strong> ~35MB (CPU), ~70MB (Vulkan), ~1.5GB
                (HIP)
              </li>
              <li>
                <strong>Estimated total:</strong> ~850MB to 2.5GB depending on
                runtime and model
              </li>
            </ul>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}

/*
 * FAQ content. Rendered by the FAQ accordion (index.tsx) and serialized to
 * FAQPage structured data, so the visible answers and the schema never drift.
 *
 * `answer` is plain text; wrap file names in backticks to render them as
 * <code>. An optional `link` is appended after the answer.
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  link?: { prefix: string; label: string; href: string; suffix?: string };
};

export const FAQ: FaqItem[] = [
  {
    id: "free",
    question: "Is Resuma free to use?",
    answer:
      "Yes - Resuma is 100% free and open-source under the GNU GPLv3 license. Cloud AI providers are optional and bill you directly for their API usage.",
    link: {
      prefix: " You can find more about the licensing here: ",
      label: "Project License",
      href: "https://github.com/nikolchaa/resuma/blob/main/LICENSE",
      suffix: ".",
    },
  },
  {
    id: "offline",
    question: "Does Resuma work offline?",
    answer:
      "Yes, with the default local AI. Resuma is a Tauri desktop application, and its AI runs on your machine. You only need an internet connection once, during onboarding, to download the AI model and runtime. After that, everything works offline. If you choose a cloud AI provider instead, AI features need an internet connection.",
  },
  {
    id: "models",
    question: "Which AI models can I use?",
    answer:
      "By default, Resuma downloads a Qwen3 model sized for your hardware (0.6B, 4B, or 14B) and runs it locally with llama.cpp. You can also search thousands of GGUF models on Hugging Face and download them right in the app, connect a model host like Ollama or LM Studio, or use a cloud API - OpenAI, Anthropic, Google Gemini, DeepSeek, Kimi, or any OpenAI-compatible endpoint - with your own API key.",
  },
  {
    id: "platforms",
    question: "What platforms are supported?",
    answer:
      "Resuma supports Windows, macOS (Apple Silicon-only), and Linux. We provide a `.exe` installer for Windows, a `.dmg` for macOS, and `.deb` and `.rpm` packages for Linux. If you're on an unsupported OS, you can still build it from source using Rust and Node.js.",
  },
  {
    id: "data",
    question: "Where is my data stored?",
    answer:
      "Resuma stores your resumes, settings, and AI models locally on your device, and never uploads or syncs your resumes to a server. With the default local AI, nothing leaves your device. If you choose a cloud AI provider, the resume text and job description for each AI action are sent to that provider under their terms. API keys are kept in your system's credential manager, and Discord status is optional and off by default.",
    link: {
      prefix: " Read more in the ",
      label: "Privacy Policy",
      href: "https://github.com/nikolchaa/resuma/blob/main/PRIVACY.md",
      suffix: ".",
    },
  },
  {
    id: "export",
    question: "Can I import/export my resumes?",
    answer:
      "Yes. You can export your resumes as PDF or plain text, and import/export `.resume` files to move resumes between devices or versions.",
  },
  {
    id: "contribute",
    question: "Can I contribute to Resuma?",
    answer:
      "Contributions are welcome! Whether it's code, bug reports, or feature suggestions - head over to the",
    link: {
      prefix: " ",
      label: "GitHub repository",
      href: "https://github.com/nikolchaa/resuma",
      suffix: ".",
    },
  },
];

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** FAQPage JSON-LD built from the same items the accordion renders. */
export function faqStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => {
      const answer = escapeHtml(item.answer.replace(/`/g, ""));
      const link = item.link
        ? `${escapeHtml(item.link.prefix)}<a href="${item.link.href}">${escapeHtml(
            item.link.label
          )}</a>${escapeHtml(item.link.suffix ?? "")}`
        : "";
      return {
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: answer + link },
      };
    }),
  };
}

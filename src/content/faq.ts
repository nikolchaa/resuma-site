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
      "Yes - Resuma is 100% free and open-source under the GNU GPLv3 license. AI is optional, and if you choose a cloud AI provider, it bills you directly for its API usage.",
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
      "Yes. Resuma is a Tauri desktop application, and everything except cloud AI works without an internet connection. With No AI, Resuma downloads no model or runtime and makes no AI requests. With the default local AI, you need a connection once, during onboarding, to download the AI model and runtime; after that, everything works offline. If you choose a cloud AI provider, AI features need an internet connection.",
  },
  {
    id: "ai-optional",
    question: "Do I have to use AI?",
    answer:
      "No, AI is entirely optional. Pick No AI during onboarding or later in Settings → AI Settings, and Resuma skips the model download and makes no AI requests. Writing, editing, templates, and PDF export all work without it; only the AI actions - tailoring a resume to a job, rewording entries, and Ask AI - are turned off. Checking a resume against a job ad's keywords still works. You can switch AI on at any time.",
  },
  {
    id: "models",
    question: "Which AI models can I use?",
    answer:
      "If you turn AI on, Resuma by default downloads a Qwen3 model sized for your hardware (0.6B, 4B, or 14B) and runs it locally with llama.cpp. You can also search thousands of GGUF models on Hugging Face and download them right in the app, connect a model host like Ollama or LM Studio, or use a cloud API - OpenAI, Anthropic, Google Gemini, DeepSeek, Kimi, or any OpenAI-compatible endpoint - with your own API key.",
  },
  {
    id: "templates",
    question: "Can I change how my resume looks?",
    answer:
      "Yes. Resuma comes with four built-in templates - Professional, Modern, Compact, and the two-column Sidebar - and an editor mode for every level of control. Simple shows only the forms. Design adds colours, section order, renamed sections, and custom sections for languages, volunteering, certificates, and more. Source lets you edit the resume and its template as text in Resuma Markup (`.rsm`), with live error checking. Templates you make can be saved to My templates and reused in any resume, and with AI turned on, Ask AI can suggest content or template changes for you to review before applying. The preview updates as you type, without flashing.",
  },
  {
    id: "platforms",
    question: "What platforms are supported?",
    answer:
      "Resuma runs on Windows, macOS, and Linux, on both x64 (Intel and AMD) and ARM64 computers. There's a `.exe` installer for Windows, including Windows on ARM; a `.dmg` for Macs with Apple silicon or Intel chips; and an AppImage that runs on any Linux distribution, plus `.deb` and `.rpm` packages. Local AI picks the llama.cpp build for your computer's processor. On anything else, you can build Resuma from source with Rust and Node.js.",
  },
  {
    id: "data",
    question: "Where is my data stored?",
    answer:
      "Resuma stores your resumes, settings, and AI models locally on your device, and never uploads or syncs your resumes to a server. Resumes and settings are encrypted on disk, and a recovery key lets you open them on another computer. With No AI or the default local AI, nothing leaves your device. If you choose a cloud AI provider, the resume text and job description for each AI action are sent to that provider under their terms. API keys are kept in your system's credential manager, and Discord status and connections from other AI apps are optional and off by default.",
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
      "Yes. You can export your resumes as PDF or plain text, import and export `.resume` files to move single resumes between devices, and create a password-protected encrypted backup of all your resumes and your profile to restore on another computer.",
  },
  {
    id: "ai-apps",
    question: "Can other AI apps work with my resumes?",
    answer:
      "Yes, if you allow it. Resuma can connect to AI apps on your computer that support the Model Context Protocol (MCP), such as a desktop AI assistant or a coding tool. They can read your resumes, check templates, and suggest changes that you review, apply, or undo in Resuma. The connection is off by default, protected by a token, and keeps your personal details hidden unless you choose to share them.",
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

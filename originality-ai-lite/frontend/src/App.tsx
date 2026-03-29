import React, { useState, useCallback, useRef } from "react";
import InputBox from "./components/InputBox";
import ActionButtons from "./components/ActionButtons";
import PlagiarismResult from "./components/PlagiarismResult";
import HumanizedResult from "./components/HumanizedResult";
import Loader from "./components/Loader";
import {
  SunIcon,
  MoonIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

const API_BASE = window.location.hostname === "localhost" 
  ? "http://localhost:8000" 
  : "https://originality-ai-backend.onrender.com";

interface PlagiarismData {
  score: number;
  suspicious_sentences: string[];
  explanation: string;
}

type LoadingState = "idle" | "plagiarism" | "humanize" | "fixall-p" | "fixall-h";

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const toggle = useCallback(() => {
    setDark((d) => {
      const next = !d;
      localStorage.setItem("theme", next ? "dark" : "light");
      if (next) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return next;
    });
  }, []);

  // Apply on first render
  React.useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []); // eslint-disable-line

  return { dark, toggle };
}

export default function App() {
  const { dark, toggle } = useDarkMode();

  const [inputText, setInputText] = useState("");
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [plagiarismData, setPlagiarismData] = useState<PlagiarismData | null>(null);
  const [humanizedText, setHumanizedText] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const isLoading = loadingState !== "idle";

  const scrollToResults = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleCheckPlagiarism = useCallback(async () => {
    if (!inputText.trim()) return;
    setError(null);
    setLoadingState("plagiarism");
    setPlagiarismData(null);
    try {
      const res = await fetch(`${API_BASE}/api/check-plagiarism`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Server error" }));
        throw new Error(err.detail || "Failed to check plagiarism");
      }
      const data = await res.json();
      setPlagiarismData(data);
      scrollToResults();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoadingState("idle");
    }
  }, [inputText]);

  const handleHumanize = useCallback(async () => {
    if (!inputText.trim()) return;
    setError(null);
    setLoadingState("humanize");
    setHumanizedText(null);
    try {
      const res = await fetch(`${API_BASE}/api/humanize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Server error" }));
        throw new Error(err.detail || "Failed to humanize text");
      }
      
      const data = await res.json();
      setHumanizedText(data.humanized_text);
      scrollToResults();
      
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoadingState("idle");
    }
  }, [inputText]);



  const loadingMessage = () => {
    switch (loadingState) {
      case "plagiarism": return "Analyzing text for plagiarism...";
      case "humanize":   return "Rewriting text to sound human...";
      case "fixall-p":   return "Step 1/2 — Checking plagiarism...";
      case "fixall-h":   return "Step 2/2 — Humanizing text...";
      default: return "Processing...";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 glass border-b border-white/30 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-md shadow-brand-500/30">
              <ShieldCheckIcon className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <h1 className="text-sm font-bold text-gradient">Originality AI Lite</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                Check Plagiarism &amp; Humanize Text in One Click
              </p>
            </div>
          </div>

          {/* Dark mode toggle */}
          <button
            id="btn-dark-mode"
            onClick={toggle}
            className="
              w-9 h-9 rounded-full flex items-center justify-center
              bg-gray-100 hover:bg-gray-200
              dark:bg-gray-800 dark:hover:bg-gray-700
              transition-all duration-200
            "
            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {dark
              ? <SunIcon className="w-4 h-4 text-amber-400" />
              : <MoonIcon className="w-4 h-4 text-brand-500" />
            }
          </button>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="text-center pt-10 pb-6 px-4">
        <div className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold
          bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300
          border border-brand-200/60 dark:border-brand-700/40">
          Powered by Google Gemini AI
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Check &amp; Humanize<br />
          <span className="text-gradient">Any Text Instantly</span>
        </h2>
        <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm">
          Paste your content below — detect AI-written or plagiarized patterns, then rewrite it to sound authentically human.
        </p>
      </section>

      {/* ── Main Card ──────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pb-16 space-y-6">
        <div className="card">
          <div className="card-inner space-y-5">
            <InputBox
              value={inputText}
              onChange={setInputText}
              disabled={isLoading}
            />

            <ActionButtons
              onCheckPlagiarism={handleCheckPlagiarism}
              onHumanize={handleHumanize}
              loading={isLoading}
              hasText={inputText.trim().length > 0}
            />
          </div>
        </div>

        {/* ── Loading ─────────────────────────────── */}
        {isLoading && (
          <div className="card">
            <div className="card-inner">
              <Loader message={loadingMessage()} />
            </div>
          </div>
        )}

        {/* ── Error ───────────────────────────────── */}
        {error && !isLoading && (
          <div className="card animate-fade-in border-red-200 dark:border-red-800/50">
            <div className="card-inner flex items-start gap-3">
              <ExclamationCircleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400 text-sm">Error</p>
                <p className="text-sm text-red-500 dark:text-red-300 mt-0.5">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Results ─────────────────────────────── */}
        <div ref={resultsRef} className="space-y-6">
          {plagiarismData && !isLoading && (
            <PlagiarismResult data={plagiarismData} originalText={inputText} />
          )}
          {humanizedText && !isLoading && (
            <HumanizedResult text={humanizedText} />
          )}
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="border-t border-gray-200/60 dark:border-gray-800/60 py-5 text-center px-4">
        <p className="text-xs text-gray-400 dark:text-gray-500 max-w-lg mx-auto">
          ⚠️ Results are AI-based estimations and may not match professional plagiarism tools like Turnitin.
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
          Originality AI Lite · Built with Google Gemini &amp; FastAPI
        </p>
      </footer>
    </div>
  );
}

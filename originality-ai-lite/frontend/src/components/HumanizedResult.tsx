import React, { useState } from "react";
import {
  CheckCircleIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";

interface HumanizedResultProps {
  text: string;
}

const HumanizedResult: React.FC<HumanizedResultProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "humanized-output.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="humanized-result" className="card animate-slide-up">
      <div className="card-inner space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base">
              Humanized Output
            </h3>
          </div>

          <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            ✨ Original
          </span>
        </div>

        {/* Output text */}
        <div
          className="
            rounded-xl border border-emerald-200 dark:border-emerald-800/50
            bg-emerald-50/40 dark:bg-emerald-950/20
            p-4 text-sm leading-7
            text-gray-800 dark:text-gray-200
            whitespace-pre-wrap
          "
        >
          {text}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            id="btn-copy"
            className="btn-secondary"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="w-4 h-4" />
                Copy Text
              </>
            )}
          </button>

          <button
            id="btn-download"
            className="btn-secondary"
            onClick={handleDownload}
            title="Download as .txt"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Download .txt
          </button>
        </div>
      </div>
    </div>
  );
};

export default HumanizedResult;

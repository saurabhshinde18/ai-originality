import React from "react";
import { highlightSuspicious } from "../utils/highlightText";
import {
  ShieldExclamationIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";

interface PlagiarismData {
  score: number;
  suspicious_sentences: string[];
  explanation: string;
}

interface PlagiarismResultProps {
  data: PlagiarismData;
  originalText: string;
}

function scoreColor(score: number) {
  if (score >= 70) return "text-red-500";
  if (score >= 40) return "text-amber-500";
  return "text-emerald-500";
}

function scoreBarColor(score: number) {
  if (score >= 70) return "bg-red-500";
  if (score >= 40) return "bg-amber-400";
  return "bg-emerald-500";
}

function scoreLabel(score: number) {
  if (score >= 70) return { text: "High Risk", cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" };
  if (score >= 40) return { text: "Medium Risk", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" };
  return { text: "Low Risk", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" };
}

const PlagiarismResult: React.FC<PlagiarismResultProps> = ({ data, originalText }) => {
  const { score, suspicious_sentences, explanation } = data;
  const highlighted = highlightSuspicious(originalText, suspicious_sentences);
  const label = scoreLabel(score);

  return (
    <div id="plagiarism-result" className="card animate-slide-up">
      <div className="card-inner space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {score >= 50 ? (
              <ShieldExclamationIcon className="w-5 h-5 text-red-500" />
            ) : (
              <CheckBadgeIcon className="w-5 h-5 text-emerald-500" />
            )}
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base">
              Plagiarism Report
            </h3>
          </div>
          <span className={`badge ${label.cls}`}>{label.text}</span>
        </div>

        {/* Score ring + bar */}
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-extrabold tabular-nums ${scoreColor(score)}`}>
              {score}%
            </span>
            <span className="text-sm text-gray-400 dark:text-gray-500 mb-1">
              plagiarism / AI-detected
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${scoreBarColor(score)}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Explanation */}
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <p className="font-semibold text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
            AI Explanation
          </p>
          {explanation}
        </div>

        {/* Highlighted text */}
        {suspicious_sentences.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Highlighted Suspicious Sections
            </p>
            <div
              className="
                text-sm leading-7 text-gray-800 dark:text-gray-200
                p-4 rounded-xl border border-red-100 dark:border-red-900/40
                bg-red-50/40 dark:bg-red-950/20
              "
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {suspicious_sentences.length} suspicious sentence(s) highlighted in red
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlagiarismResult;

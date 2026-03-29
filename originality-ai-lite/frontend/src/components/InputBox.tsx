import React, { useRef, useCallback } from "react";
import { countWords, countChars } from "../utils/highlightText";

interface InputBoxProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ value, onChange, disabled }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      const el = textareaRef.current;
      if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    },
    [onChange]
  );

  const words = countWords(value);
  const chars = countChars(value);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        id="main-textarea"
        className="
          w-full min-h-[200px] px-4 py-4 rounded-xl resize-none
          text-sm leading-relaxed
          bg-white/60 dark:bg-gray-800/60
          border border-gray-200 dark:border-gray-700
          text-gray-800 dark:text-gray-200
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-brand-400/60
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        placeholder="Paste your text here..."
        value={value}
        onChange={handleChange}
        disabled={disabled}
        spellCheck
        aria-label="Input text"
      />
      {/* Live counters */}
      <div className="flex items-center gap-3 mt-2 px-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          <strong className="text-brand-500">{words}</strong> words
        </span>
        <span className="text-gray-300 dark:text-gray-600 select-none">·</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          <strong className="text-brand-500">{chars}</strong> characters
        </span>
      </div>
    </div>
  );
};

export default InputBox;

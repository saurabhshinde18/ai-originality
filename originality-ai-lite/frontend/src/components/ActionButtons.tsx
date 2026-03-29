import React from "react";
import {
  SparklesIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

interface ActionButtonsProps {
  onCheckPlagiarism: () => void;
  onHumanize: () => void;
  loading: boolean;
  hasText: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCheckPlagiarism,
  onHumanize,
  loading,
  hasText,
}) => {
  const disabled = loading || !hasText;

  return (
    <div className="flex flex-wrap gap-3">
      <button
        id="btn-check-plagiarism"
        className="btn-primary"
        onClick={onCheckPlagiarism}
        disabled={disabled}
        title="Analyze text for plagiarism"
      >
        <MagnifyingGlassIcon className="w-4 h-4" />
        Check Plagiarism
      </button>

      <button
        id="btn-humanize"
        className="btn-primary"
        onClick={onHumanize}
        disabled={disabled}
        title="Rewrite text to sound human"
      >
        <SparklesIcon className="w-4 h-4" />
        Humanize Text
      </button>
    </div>
  );
};

export default ActionButtons;

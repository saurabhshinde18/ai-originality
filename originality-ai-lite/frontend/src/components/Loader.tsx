import React from "react";

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Processing..." }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-8 animate-fade-in">
    {/* Spinner ring */}
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-brand-200 dark:border-brand-900" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin-slow" />
    </div>
    <p className="text-sm font-medium text-brand-600 dark:text-brand-300 tracking-wide">
      {message}
    </p>
  </div>
);

export default Loader;

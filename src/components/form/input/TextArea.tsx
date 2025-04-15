import React, { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      placeholder = "Enter your message",
      rows = 3,
      value,
      onChange,
      className = "",
      disabled = false,
      success = false,
      error = false,
      hint,
      ...rest
    },
    ref
  ) => {
    let textareaClasses = `w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

    if (disabled) {
      textareaClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (error) {
      textareaClasses += ` text-error-800 border-error-500 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500`;
    } else if (success) {
      textareaClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500`;
    } else {
      textareaClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
    }

    return (
      <div className="relative">
        <textarea
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={textareaClasses}
          {...rest}
        />
        {hint && (
          <p
            className={`mt-1 text-xs ${
              error ? "text-error-500" : success ? "text-success-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;

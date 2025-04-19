import React, { FC } from "react";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const  FileInput: FC<FileInputProps> = ({
  className = "",
  onChange,
  success = false,
  error = false,
  hint,
  ...rest
}) => {
  let inputClasses = `focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border text-sm shadow-theme-xs transition-colors
    file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid
    file:py-3 file:pl-3.5 file:pr-3 file:text-sm placeholder:text-gray-400
    hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300
    dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-400
    dark:file:bg-white/[0.03] dark:file:text-gray-400
    ${className}`;

  if (error) {
    inputClasses += " border-error-500 text-error-800 dark:border-error-500 dark:text-error-400";
  } else if (success) {
    inputClasses += " border-success-400 text-success-500 dark:border-success-500 dark:text-success-400";
  } else {
    inputClasses += " border-gray-300 text-gray-500 dark:border-gray-700";
  }

  return (
    <div className="relative">
      <input
        type="file"
        className={inputClasses}
        onChange={onChange}
     
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
};

export default FileInput;

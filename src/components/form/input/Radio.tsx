import React, { forwardRef } from "react";

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  success?: boolean;
  error?: boolean;
  hint?: string;
  label: string;
}

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      id,
      name,
      value,
      checked,
      onChange,
      disabled = false,
      success = false,
      error = false,
      hint,
      className = "",
      label,
      ...rest
    },
    ref
  ) => {
    let radioClasses = `h-4 w-4 rounded-full border border-gray-300 checked:border-transparent focus:ring-2 focus:ring-offset-1 focus:outline-none transition duration-150 ease-in-out ${className}`;

    if (disabled) {
      radioClasses += ` text-gray-400 cursor-not-allowed`;
    } else if (error) {
      radioClasses += ` text-error-500 focus:ring-error-500`;
    } else if (success) {
      radioClasses += ` text-success-500 focus:ring-success-500`;
    } else {
      radioClasses += ` text-brand-500 focus:ring-brand-500`;
    }

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={radioClasses}
          {...rest}
        />
        <label htmlFor={id} className="text-sm text-gray-700 dark:text-white/80 cursor-pointer">
          {label}
        </label>
        {hint && (
          <p
            className={`ml-2 text-xs ${
              error ? "text-error-500" : success ? "text-success-500" : "text-gray-500"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

RadioButton.displayName = "RadioButton";

export default RadioButton;

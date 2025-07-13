"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";
import Radio from "../input/Radio";
import { UseFormRegisterReturn } from "react-hook-form";

interface RadioButtonsProps {
  title: string;
  name: string;
  options: { label: string; value: string | boolean }[]; // allow boolean if needed
  register: UseFormRegisterReturn;
  error?: boolean;
  hint?: string;
  value?: string | boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RadioButtons({
  title,
  name,
  options,
  register,
  error,
  hint,
  value,
  onChange,
}: RadioButtonsProps & { value?: string | boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <ComponentCard title={title}>
      <div className="flex flex-wrap items-center gap-8">
        {options.map((option, index) => {
          // Ensure value is always a string for the input
          const optionValue = String(option.value);
          const checked = String(value) === optionValue;
          const radioProps = {
            id: `${name}-${optionValue}`,
            value: optionValue,
            label: option.label,
            error: error,
            hint: index === options.length - 1 ? hint : undefined,
            checked,
            ...(onChange ? { onChange } : {}),
            ...(!value && !onChange ? register : {}),
          };
          return <Radio key={index} {...radioProps} />;
        })}
      </div>
    </ComponentCard>
  );
}

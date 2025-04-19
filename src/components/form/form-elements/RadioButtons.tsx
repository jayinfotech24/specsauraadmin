"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";
import Radio from "../input/Radio";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface RadioButtonsProps {
  title: string;
  name: string;
  options: { label: string; value: string }[];
  register: UseFormRegisterReturn;
  error?: boolean;
  hint?: string;
}

export default function RadioButtons({
  title,
  name,
  options,
  register,
  error,
  hint,
}: RadioButtonsProps) {
  return (
    <ComponentCard title={title}>
      <div className="flex flex-wrap items-center gap-8">
        {options.map((option, index) => (
         <Radio
  key={index}
  id={`${name}-${option.value}`}
  value={option.value}
  label={option.label}
  error={error}
  hint={index === options.length - 1 ? hint : undefined}
  {...register}
/>

        ))}
      </div>
    </ComponentCard>
  );
}

"use client";
import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder-gray-500 dark:placeholder-white ${className}`}
      {...props}
    />
  );
};

export default InputField;

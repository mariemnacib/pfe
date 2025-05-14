"use client";
import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ children, className = "", ...props }) => {
  return (
    <label className={`text-gray-800 dark:text-white ${className}`} {...props}>
      {children}
    </label>
  );
};

export default Label;

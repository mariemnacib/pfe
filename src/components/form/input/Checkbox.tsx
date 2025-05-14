"use client";
import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ className, onChange, checked, ...props }) => {
  return <input type="checkbox" className={className} onChange={onChange} checked={checked} {...props} />;
};

export default Checkbox;

"use client";

import React from "react";

interface RedButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;  // ✅ Added disabled prop
}

const RedButton: React.FC<RedButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}  // ✅ Apply disabled state
      className={`px-4 py-2 rounded-xl border border-transparent transition-all duration-200 ease-in-out 
                 ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 text-white hover:bg-white hover:text-red-600 hover:border-red-600"}`}
    >
      {text}
    </button>
  );
};

export default RedButton;

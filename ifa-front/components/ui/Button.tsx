"use client";

import React from "react";

interface RedButtonProps {
  text: string;
  onClick?: () => void;
}

const RedButton: React.FC<RedButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-red-500 text-white border border-transparent 
                 transition-all duration-200 ease-in-out 
                 hover:bg-white hover:text-red-600 hover:border-red-600"
    >
      {text}
    </button>
  );
};

export default RedButton;

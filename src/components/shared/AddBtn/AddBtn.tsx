import React, { ReactNode } from 'react';

interface AddBtnProps {
  text: string;
  icon?: ReactNode; 
  onClick?: () => void;
  className?: string; 
}

const AddBtn: React.FC<AddBtnProps> = ({ text, icon, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 
      bg-[#4285F4] hover:bg-[#3378e8] text-white font-medium rounded-xl 
      transition-all duration-200 active:scale-95 shadow-sm ${className} cursor-pointer`}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      
      <span className="text-[16px] whitespace-nowrap">{text}</span>
    </button>
  );
};

export default AddBtn;
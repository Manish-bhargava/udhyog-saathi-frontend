import React from 'react';

const Logo = ({ size = "normal", invert = false, onClick = () => {} }) => {
  const boxSize = size === "small" ? "w-8 h-8 rounded-md" : "w-10 h-10 rounded-lg";
  const textSize = size === "small" ? "text-sm" : "text-lg";
  
  const colors = invert 
    ? "bg-white text-blue-600 border-white" 
    : "bg-gradient-to-br from-blue-600 to-blue-500 text-white border-blue-400";
    
  return (
    <div 
      className={`${boxSize} ${colors} flex items-center justify-center shadow-lg border box-border flex-shrink-0 cursor-pointer`}
      onClick={onClick}
    >
      <span className={`font-black ${textSize} tracking-tighter`}>US</span>
    </div>
  );
};

export default Logo;
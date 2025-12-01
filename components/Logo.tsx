import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "text-2xl" }) => {
  return (
    <div className={`font-extrabold tracking-tighter select-none ${className} flex items-center`}>
      <span className="text-slate-800">AutoMate</span>
      <span className="text-emerald-500">IQ</span>
    </div>
  );
};

export default Logo;
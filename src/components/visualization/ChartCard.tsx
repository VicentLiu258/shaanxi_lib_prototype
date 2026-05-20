import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  extra?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children, className, extra }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative bg-[#0a1a3c]/60 border border-[#0d3a6e] rounded-lg overflow-hidden backdrop-blur-md transition-all duration-300",
        "hover:shadow-[0_0_15px_rgba(0,180,255,0.3)] group",
        className
      )}
    >
      {/* Glow effect at corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00c8ff] opacity-50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00c8ff] opacity-50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00c8ff] opacity-50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00c8ff] opacity-50" />
      
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#0d3a6e]/50 bg-[#0d3a6e]/20">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-[#00c8ff] shadow-[0_0_8px_#00c8ff]" />
          <span className="text-sm font-bold text-[#c8e6ff] tracking-wider">{title}</span>
        </div>
        {extra}
      </div>
      
      {/* Content */}
      <div className="p-4 relative">
        {children}
      </div>

      {/* Decorative scanning line animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="w-full h-[1px] bg-[#00c8ff] animate-[scan_4s_linear_infinite]" />
      </div>
    </motion.div>
  );
};

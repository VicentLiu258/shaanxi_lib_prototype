import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface MetricItemProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color?: string;
  className?: string;
}

export const MetricItem: React.FC<MetricItemProps> = ({ 
  label, 
  value, 
  unit, 
  icon, 
  color = "text-[#00c8ff]",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-3 rounded-lg bg-[#0d3a6e]/10 border border-[#0d3a6e]/30 relative group overflow-hidden", className)}>
      {/* Icon with light effect */}
      <div className={cn("mb-2 p-2 rounded-full relative", color, "bg-current bg-opacity-10 group-hover:scale-110 transition-transform duration-300")}>
        <div className="absolute inset-0 blur-md opacity-50 bg-current rounded-full" />
        <div className="relative">{icon}</div>
      </div>
      
      {/* Value */}
      <div className="flex items-baseline gap-1">
        <motion.span 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-2xl font-black font-mono text-white tracking-tight"
        >
          {value}
        </motion.span>
        {unit && <span className="text-[10px] text-slate-400 uppercase font-bold">{unit}</span>}
      </div>
      
      {/* Label */}
      <span className="text-[10px] text-[#c8e6ff]/70 font-bold uppercase tracking-widest mt-1">
        {label}
      </span>
      
      {/* Decorative corner */}
      <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[8px] border-r-[8px] border-b-[#00c8ff]/20 border-r-transparent rotate-180" />
    </div>
  );
};

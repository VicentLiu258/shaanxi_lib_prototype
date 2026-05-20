import React from 'react';

export const DigitalBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Main Grid */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(circle, #00c8ff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Scanning Beams */}
      <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#00c8ff] to-transparent opacity-20 animate-[moveVertical_20s_infinite]" />
      <div className="absolute top-0 right-[35%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#00c8ff] to-transparent opacity-20 animate-[moveVertical_15s_infinite_reverse]" />
      
      {/* Particle Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
    </div>
  );
};

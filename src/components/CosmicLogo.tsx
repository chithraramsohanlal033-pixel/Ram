import React from 'react';

interface CosmicLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
  className?: string;
}

export const CosmicLogo: React.FC<CosmicLogoProps> = ({
  size = 'md',
  showGlow = true,
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-6 h-6 rounded-lg',
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-3xl',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 group ${className}`}
    >
      {/* Luminous Cosmic Blue Glow Effect */}
      {showGlow && (
        <div
          className={`absolute inset-0 ${sizeMap[size]} bg-blue-500/40 blur-md group-hover:bg-blue-400/60 transition-all duration-300 scale-95 group-hover:scale-105 pointer-events-none`}
        />
      )}

      {/* Cosmic Galaxy Instagram Logo Image */}
      <div
        className={`relative overflow-hidden ${sizeMap[size]} ring-1 ring-blue-500/30 shadow-md shadow-blue-600/30 bg-black flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}
      >
        <img
          src="/azure_logo.jpg"
          alt="Instagram Cosmic Blue Logo"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

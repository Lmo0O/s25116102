import React from 'react';

interface PixelFishProps {
  fishId: string;
  size?: number; // width in px
  animated?: boolean;
  className?: string;
  showSparkles?: boolean;
}

export const PixelFish: React.FC<PixelFishProps> = ({
  fishId,
  size = 120,
  animated = false,
  className = '',
  showSparkles = false,
}) => {
  // Render pixel art SVG based on fishId
  const renderFishSvg = () => {
    switch (fishId) {
      case 'orange_carp':
        return (
          <svg
            viewBox="0 0 28 20"
            className={`w-full h-full [image-rendering:pixelated] drop-shadow-md ${
              animated ? 'animate-[swim_2s_ease-in-out_infinite]' : ''
            }`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outline */}
            <path
              d="M 6 3 H 19 V 4 H 22 V 5 H 24 V 7 H 26 V 13 H 24 V 15 H 22 V 16 H 19 V 17 H 6 V 16 H 4 V 15 H 2 V 12 H 1 V 8 H 2 V 5 H 4 V 4 H 6 V 3 Z"
              fill="#7c2d12"
            />
            {/* Tail Fin */}
            <path
              d="M 23 8 H 27 V 6 H 28 V 5 H 25 V 8 Z M 23 12 H 27 V 14 H 28 V 15 H 25 V 12 Z"
              fill="#ea580c"
            />
            <path
              d="M 24 9 H 26 V 11 H 24 Z"
              fill="#fb923c"
            />
            {/* Body Base - Orange */}
            <path
              d="M 6 4 H 19 V 5 H 22 V 7 H 23 V 13 H 22 V 15 H 19 V 16 H 6 V 15 H 4 V 12 H 2 V 8 H 4 V 5 H 6 V 4 Z"
              fill="#f97316"
            />
            {/* White Koi Markings */}
            <path
              d="M 9 5 H 14 V 9 H 9 Z M 16 7 H 19 V 11 H 16 Z M 5 11 H 8 V 14 H 5 Z"
              fill="#fff7ed"
            />
            {/* Belly highlight */}
            <path
              d="M 7 13 H 17 V 15 H 7 Z"
              fill="#ffedd5"
            />
            {/* Dorsal Fin */}
            <path
              d="M 10 2 H 16 V 3 H 10 Z M 12 1 H 15 V 2 H 12 Z"
              fill="#ea580c"
            />
            {/* Pectoral Fin */}
            <path
              d="M 8 10 H 12 V 12 H 8 Z"
              fill="#ea580c"
            />
            {/* Whiskers / Barbels */}
            <path
              d="M 1 9 H 2 V 11 H 1 Z M 0 10 H 1 V 11 H 0 Z"
              fill="#9a3412"
            />
            {/* Eye */}
            <rect x="4" y="6" width="2" height="3" fill="#1c1917" />
            <rect x="4" y="6" width="1" height="1" fill="#ffffff" />
            {/* Scale Shading */}
            <rect x="13" y="10" width="1" height="2" fill="#c2410c" />
            <rect x="18" y="8" width="1" height="2" fill="#c2410c" />
          </svg>
        );

      case 'yellow_puffer':
        return (
          <svg
            viewBox="0 0 24 22"
            className={`w-full h-full [image-rendering:pixelated] drop-shadow-md ${
              animated ? 'animate-[swim_2s_ease-in-out_infinite]' : ''
            }`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Spikes / Outline */}
            <path
              d="M 8 2 H 15 V 3 H 18 V 5 H 20 V 8 H 22 V 14 H 20 V 17 H 18 V 19 H 15 V 20 H 8 V 19 H 5 V 17 H 3 V 14 H 1 V 8 H 3 V 5 H 5 V 3 H 8 V 2 Z"
              fill="#854d0e"
            />
            {/* Spines sticking out */}
            <rect x="11" y="0" width="2" height="2" fill="#ca8a04" />
            <rect x="5" y="1" width="2" height="2" fill="#ca8a04" />
            <rect x="17" y="1" width="2" height="2" fill="#ca8a04" />
            <rect x="1" y="6" width="2" height="2" fill="#ca8a04" />
            <rect x="21" y="6" width="2" height="2" fill="#ca8a04" />
            <rect x="1" y="14" width="2" height="2" fill="#ca8a04" />
            <rect x="21" y="14" width="2" height="2" fill="#ca8a04" />
            <rect x="11" y="20" width="2" height="2" fill="#ca8a04" />
            {/* Body */}
            <path
              d="M 8 3 H 15 V 5 H 18 V 8 H 19 V 14 H 18 V 17 H 15 V 19 H 8 V 17 H 5 V 14 H 4 V 8 H 5 V 5 H 8 V 3 Z"
              fill="#facc15"
            />
            {/* Pale cream Belly */}
            <path
              d="M 7 12 H 16 V 16 H 14 V 18 H 9 V 16 H 7 Z"
              fill="#fef9c3"
            />
            {/* Tail Fin */}
            <path
              d="M 19 9 H 23 V 13 H 19 Z"
              fill="#eab308"
            />
            {/* Cute Cheek Blush */}
            <rect x="6" y="11" width="3" height="2" fill="#fb7185" />
            {/* Big Shiny Eye */}
            <rect x="7" y="6" width="4" height="4" fill="#18181b" />
            <rect x="7" y="6" width="2" height="2" fill="#ffffff" />
            <rect x="9" y="8" width="1" height="1" fill="#a1a1aa" />
            {/* Tiny Cute Mouth */}
            <rect x="4" y="10" width="2" height="1" fill="#713f12" />
            {/* Tiny Fin */}
            <rect x="13" y="10" width="2" height="3" fill="#ca8a04" />
          </svg>
        );

      case 'purple_fish':
        return (
          <svg
            viewBox="0 0 28 20"
            className={`w-full h-full [image-rendering:pixelated] drop-shadow-md ${
              animated ? 'animate-[swim_2s_ease-in-out_infinite]' : ''
            }`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dark Midnight Outline */}
            <path
              d="M 6 3 H 19 V 4 H 22 V 6 H 24 V 8 H 25 V 12 H 24 V 14 H 22 V 16 H 19 V 17 H 6 V 16 H 4 V 14 H 2 V 12 H 1 V 8 H 2 V 6 H 4 V 4 H 6 V 3 Z"
              fill="#3b0764"
            />
            {/* Majestic Crown/Fin */}
            <path
              d="M 8 1 H 13 V 3 H 8 Z M 14 0 H 17 V 3 H 14 Z M 18 1 H 20 V 3 H 18 Z"
              fill="#d946ef"
            />
            {/* Tail Fin - Split Flowing */}
            <path
              d="M 24 5 H 28 V 9 H 26 V 11 H 28 V 15 H 24 V 13 H 23 V 7 H 24 Z"
              fill="#a855f7"
            />
            <path
              d="M 26 6 H 27 V 8 H 26 Z M 26 12 H 27 V 14 H 26 Z"
              fill="#f0abfc"
            />
            {/* Body */}
            <path
              d="M 6 4 H 19 V 6 H 22 V 8 H 23 V 12 H 22 V 14 H 19 V 16 H 6 V 14 H 4 V 12 H 3 V 8 H 4 V 6 H 6 V 4 Z"
              fill="#7e22ce"
            />
            {/* Glowing Lavender Belly & Mid Section */}
            <path
              d="M 7 11 H 18 V 14 H 16 V 15 H 8 V 14 H 7 Z"
              fill="#c084fc"
            />
            {/* Glowing Speckles */}
            <rect x="9" y="7" width="1" height="1" fill="#fdf4ff" />
            <rect x="13" y="6" width="1" height="1" fill="#fdf4ff" />
            <rect x="16" y="8" width="1" height="1" fill="#fdf4ff" />
            <rect x="14" y="12" width="1" height="1" fill="#fdf4ff" />
            {/* Eye */}
            <rect x="5" y="6" width="3" height="3" fill="#1e1b4b" />
            <rect x="5" y="6" width="1" height="1" fill="#fdf4ff" />
            <rect x="6" y="7" width="1" height="1" fill="#f472b6" />
            {/* Pectoral Fin */}
            <path d="M 9 9 H 13 V 12 H 9 Z" fill="#9333ea" />
          </svg>
        );

      case 'golden_fish':
        return (
          <svg
            viewBox="0 0 28 22"
            className={`w-full h-full [image-rendering:pixelated] drop-shadow-lg ${
              animated ? 'animate-[swim_2s_ease-in-out_infinite]' : ''
            }`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Crown on Head! */}
            <path
              d="M 6 0 H 8 V 2 H 6 Z M 10 -1 H 12 V 2 H 10 Z M 14 0 H 16 V 2 H 14 Z M 7 2 H 15 V 3 H 7 Z"
              fill="#fef08a"
            />
            <rect x="8" y="2" width="1" height="1" fill="#ef4444" />
            <rect x="11" y="1" width="1" height="1" fill="#3b82f6" />
            <rect x="14" y="2" width="1" height="1" fill="#10b981" />
            {/* Outline */}
            <path
              d="M 6 4 H 19 V 5 H 22 V 7 H 24 V 9 H 25 V 14 H 24 V 16 H 22 V 18 H 19 V 19 H 6 V 18 H 4 V 16 H 2 V 13 H 1 V 9 H 2 V 6 H 4 V 5 H 6 V 4 Z"
              fill="#78350f"
            />
            {/* Golden Radiance Tail */}
            <path
              d="M 24 6 H 28 V 10 H 26 V 12 H 28 V 16 H 24 V 14 H 23 V 8 H 24 Z"
              fill="#d97706"
            />
            <path
              d="M 25 7 H 27 V 9 H 25 Z M 25 13 H 27 V 15 H 25 Z"
              fill="#fef08a"
            />
            {/* Body - Pure Gold */}
            <path
              d="M 6 5 H 19 V 7 H 22 V 9 H 23 V 14 H 22 V 16 H 19 V 18 H 6 V 16 H 4 V 13 H 3 V 9 H 4 V 7 H 6 V 5 Z"
              fill="#f59e0b"
            />
            {/* Golden scales shimmer */}
            <path
              d="M 8 7 H 12 V 9 H 8 Z M 14 8 H 18 V 10 H 14 Z M 9 11 H 14 V 13 H 9 Z M 15 12 H 19 V 14 H 15 Z"
              fill="#fbbf24"
            />
            {/* Brightest Highlights */}
            <path
              d="M 7 6 H 18 V 7 H 7 Z M 8 15 H 17 V 16 H 8 Z"
              fill="#fef3c7"
            />
            {/* Large Sparkle Eye */}
            <rect x="5" y="7" width="3" height="4" fill="#451a03" />
            <rect x="5" y="7" width="2" height="2" fill="#ffffff" />
            <rect x="7" y="9" width="1" height="1" fill="#fde047" />
            {/* Pectoral Fin */}
            <path d="M 9 10 H 13 V 13 H 9 Z" fill="#d97706" />
          </svg>
        );

      case 'blue_fish':
      default:
        // Matches the exact blue fish in the user mockup!
        return (
          <svg
            viewBox="0 0 28 20"
            className={`w-full h-full [image-rendering:pixelated] drop-shadow-md ${
              animated ? 'animate-[swim_2s_ease-in-out_infinite]' : ''
            }`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dark Navy Blue Outline */}
            <path
              d="M 6 3 H 18 V 4 H 21 V 6 H 23 V 8 H 24 V 12 H 23 V 14 H 21 V 16 H 18 V 17 H 6 V 16 H 4 V 14 H 2 V 12 H 1 V 8 H 2 V 6 H 4 V 4 H 6 V 3 Z"
              fill="#1e3a8a"
            />
            {/* Dorsal Fin */}
            <path
              d="M 9 1 H 15 V 3 H 9 Z"
              fill="#2563eb"
            />
            {/* Tail Fin */}
            <path
              d="M 23 6 H 27 V 10 H 25 V 12 H 27 V 16 H 23 V 14 H 22 V 8 H 23 Z"
              fill="#2563eb"
            />
            <path
              d="M 24 7 H 26 V 9 H 24 Z M 24 13 H 26 V 15 H 24 Z"
              fill="#60a5fa"
            />
            {/* Main Blue Body */}
            <path
              d="M 6 4 H 18 V 6 H 21 V 8 H 22 V 12 H 21 V 14 H 18 V 16 H 6 V 14 H 4 V 12 H 3 V 8 H 4 V 6 H 6 V 4 Z"
              fill="#3b82f6"
            />
            {/* Light Cyan Belly / Highlight */}
            <path
              d="M 7 12 H 17 V 15 H 7 Z M 6 10 H 8 V 12 H 6 Z"
              fill="#93c5fd"
            />
            {/* Scales details */}
            <path
              d="M 11 6 H 12 V 11 H 11 Z M 15 6 H 16 V 11 H 15 Z M 18 8 H 19 V 12 H 18 Z"
              fill="#1d4ed8"
            />
            {/* Eye */}
            <rect x="5" y="6" width="3" height="3" fill="#0f172a" />
            <rect x="5" y="6" width="1" height="1" fill="#ffffff" />
            {/* Pectoral Fin */}
            <path d="M 8 9 H 12 V 12 H 8 Z" fill="#2563eb" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{ width: size, height: (size * 20) / 28 }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      {renderFishSvg()}
      {showSparkles && (
        <>
          <div className="absolute -top-1 -right-1 text-amber-300 animate-ping text-xs">✦</div>
          <div className="absolute -bottom-1 -left-1 text-amber-300 animate-pulse text-xs">★</div>
          <div className="absolute top-1/2 -right-2 text-yellow-200 animate-bounce text-xs">✨</div>
        </>
      )}
    </div>
  );
};

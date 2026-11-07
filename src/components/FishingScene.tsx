import React, { useEffect, useState } from 'react';
import { FishingState } from '../types/game';
import { soundManager } from '../utils/audio';

interface FishingSceneProps {
  fishingState: FishingState;
  onBobberClick: () => void;
  timeOfDay?: 'day' | 'dusk' | 'night';
}

export const FishingScene: React.FC<FishingSceneProps> = ({
  fishingState,
  onBobberClick,
  timeOfDay = 'day',
}) => {
  // Swimming fish shadow state in the lake to make it feel alive!
  const [fishShadows, setFishShadows] = useState<Array<{ id: number; x: number; y: number; speed: number; direction: number }>>([
    { id: 1, x: 45, y: 72, speed: 0.08, direction: 1 },
    { id: 2, x: 75, y: 82, speed: 0.05, direction: -1 },
    { id: 3, x: 60, y: 64, speed: 0.06, direction: 1 },
  ]);

  // Tick fish shadows
  useEffect(() => {
    const interval = setInterval(() => {
      setFishShadows((prev) =>
        prev.map((f) => {
          let newX = f.x + f.speed * f.direction;
          let newDir = f.direction;
          if (newX > 88) {
            newX = 88;
            newDir = -1;
          } else if (newX < 36) {
            newX = 36;
            newDir = 1;
          }
          return { ...f, x: newX, direction: newDir };
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Theme palettes based on timeOfDay
  const themes = {
    day: {
      sky: 'from-[#73b2e8] via-[#a3d3f5] to-[#cfeaf8]',
      mountain: '#5c80a8',
      distantForest: '#417255',
      waterTop: '#3787be',
      waterBottom: '#235987',
      waterGlint: '#80c2ee',
      grass: '#5c9e38',
      dockWood: '#80502a',
    },
    dusk: {
      sky: 'from-[#ea580c] via-[#f97316] to-[#fed7aa]',
      mountain: '#6d3c5b',
      distantForest: '#5c3a38',
      waterTop: '#b85442',
      waterBottom: '#59293e',
      waterGlint: '#fdba74',
      grass: '#786e24',
      dockWood: '#61381b',
    },
    night: {
      sky: 'from-[#0b132b] via-[#1c2541] to-[#3a506b]',
      mountain: '#152238',
      distantForest: '#0f241a',
      waterTop: '#1b3b5f',
      waterBottom: '#0e1f33',
      waterGlint: '#64dfdf',
      grass: '#224a2f',
      dockWood: '#3d2b1f',
    },
  };

  const currentTheme = themes[timeOfDay];

  // Coordinates for the fishing line
  // Rod tip: approx x=35.5%, y=41.5%
  // Bobber in water: approx x=45.5%, y=61%
  const isLineActive = fishingState !== 'idle';
  const isCasting = fishingState === 'casting';
  const isBiting = fishingState === 'biting';
  const isReeling = fishingState === 'reeling';

  return (
    <div className="relative w-full h-full overflow-hidden select-none cursor-pointer" onClick={onBobberClick}>
      {/* 1. SKY & DISTANT MOUNTAINS */}
      <div className={`absolute inset-0 bg-gradient-to-b ${currentTheme.sky} transition-colors duration-1000`}>
        {/* Sun / Moon */}
        {timeOfDay === 'day' && (
          <div className="absolute top-10 right-32 w-16 h-16 rounded-full bg-[#fffbeb] shadow-[0_0_40px_#fde047] opacity-90 animate-pulse pointer-events-none" />
        )}
        {timeOfDay === 'dusk' && (
          <div className="absolute top-20 right-28 w-20 h-20 rounded-full bg-[#f97316] shadow-[0_0_50px_#ea580c] opacity-95 pointer-events-none" />
        )}
        {timeOfDay === 'night' && (
          <div className="absolute top-8 right-24 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-[#fef08a] shadow-[0_0_25px_#fef08a]" />
            <div className="absolute -top-1 -right-2 text-white text-xs animate-ping">✦</div>
            <div className="absolute top-12 left-16 text-yellow-100 text-xs animate-pulse">★</div>
            <div className="absolute top-4 -left-12 text-yellow-100 text-xs animate-pulse">✦</div>
            <div className="absolute top-24 left-44 text-white text-[10px] animate-ping">★</div>
          </div>
        )}

        {/* Fluffy Pixel Clouds */}
        <div className="absolute top-8 left-[10%] w-36 h-12 bg-white/80 rounded-full blur-[0.5px] pointer-events-none animate-[float-gentle_8s_ease-in-out_infinite]" />
        <div className="absolute top-14 left-[45%] w-48 h-14 bg-white/75 rounded-full blur-[0.5px] pointer-events-none animate-[float-gentle_12s_ease-in-out_infinite]" />
        <div className="absolute top-6 right-[15%] w-32 h-10 bg-white/70 rounded-full blur-[0.5px] pointer-events-none animate-[float-gentle_10s_ease-in-out_infinite]" />
      </div>

      {/* 2. MOUNTAIN SILHOUETTE & DISTANT PINE TREES */}
      <svg
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
        className="absolute top-[18%] left-0 w-full h-[32%] pointer-events-none opacity-85"
      >
        {/* Layer 1: Distant soft mountains */}
        <polygon
          points="0,200 120,90 280,180 430,70 610,170 780,100 920,160 1000,120 1000,400 0,400"
          fill={currentTheme.mountain}
          opacity="0.6"
        />
        {/* Layer 2: Middle mountains */}
        <polygon
          points="0,240 180,130 350,230 520,120 710,210 860,140 1000,220 1000,400 0,400"
          fill={currentTheme.mountain}
          opacity="0.85"
        />
        {/* Pine Tree Forest Ridge along lake bank */}
        <path
          d="M 0,270 L 40,245 L 80,270 L 130,240 L 170,270 L 220,245 L 260,265 L 310,240 L 360,270 L 420,240 L 480,270 L 530,242 L 590,268 L 650,238 L 710,268 L 770,242 L 830,270 L 890,245 L 940,268 L 1000,240 L 1000,400 L 0,400 Z"
          fill={currentTheme.distantForest}
        />
      </svg>

      {/* 3. LAKE WATER SURFACE */}
      <div
        className={`absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-b ${currentTheme.waterTop} ${currentTheme.waterBottom} transition-colors duration-1000 overflow-hidden`}
      >
        {/* Water Shore Edge Transition */}
        <div className="absolute top-0 left-0 w-full h-3 bg-black/15" />

        {/* Dynamic Water Ripples and Specular Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle wave stripes */}
          <div className="absolute top-[12%] left-0 w-full h-[2px] bg-white/20" />
          <div className="absolute top-[28%] left-[10%] w-[80%] h-[2px] bg-white/15" />
          <div className="absolute top-[45%] left-[5%] w-[90%] h-[2px] bg-white/20" />
          <div className="absolute top-[65%] left-[15%] w-[75%] h-[2px] bg-white/15" />
          <div className="absolute top-[82%] left-0 w-full h-[2px] bg-white/10" />

          {/* Sparkles on water surface */}
          <div className="absolute top-[20%] left-[45%] text-white/50 text-[10px] animate-pulse">✦</div>
          <div className="absolute top-[35%] left-[62%] text-white/60 text-xs animate-ping">✦</div>
          <div className="absolute top-[50%] left-[38%] text-white/40 text-[10px] animate-pulse">✦</div>
          <div className="absolute top-[68%] left-[52%] text-white/50 text-xs animate-pulse">✦</div>
          <div className="absolute top-[30%] left-[78%] text-white/40 text-[10px] animate-ping">✦</div>

          {/* Swimming Fish Shadows in the lake */}
          {fishShadows.map((fish) => (
            <div
              key={fish.id}
              className="absolute pointer-events-none opacity-25 transition-transform duration-200"
              style={{
                left: `${fish.x}%`,
                top: `${fish.y}%`,
                transform: `scaleX(${fish.direction})`,
              }}
            >
              <div className="w-8 h-2.5 rounded-full bg-slate-950/60 blur-[1px] relative">
                {/* tail fin shadow */}
                <div className="absolute right-0 top-0.5 w-2 h-1.5 bg-slate-950/50 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Concentric ripples around the Bobber */}
        {isLineActive && (
          <div className="absolute top-[32%] left-[45.5%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className={`w-14 h-6 border-2 border-white/40 rounded-full animate-ripple ${isBiting ? 'border-amber-300 border-3' : ''}`} />
            <div
              className={`w-24 h-10 border-2 border-white/25 rounded-full animate-ripple ${isBiting ? 'border-amber-200 border-3' : ''}`}
              style={{ animationDelay: '0.7s' }}
            />
            <div
              className="w-36 h-14 border border-white/15 rounded-full animate-ripple"
              style={{ animationDelay: '1.4s' }}
            />
          </div>
        )}

        {/* Reeling water splashes */}
        {isReeling && (
          <div className="absolute top-[30%] left-[45.5%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="text-xl text-cyan-200 animate-ping">💦</div>
            <div className="absolute -top-3 -left-3 text-lg text-white animate-bounce">💧</div>
            <div className="absolute -top-4 right-2 text-lg text-cyan-100 animate-pulse">💧</div>
          </div>
        )}

        {/* Casting landing plop splash */}
        {isCasting && (
          <div className="absolute top-[32%] left-[45.5%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-10 h-4 border-2 border-cyan-100/80 rounded-full animate-ping" />
            <div className="absolute -top-2 left-1 text-xs text-cyan-200 animate-bounce">💧</div>
          </div>
        )}
      </div>

      {/* 4. LEFT SHORE, COTTAGE & FLOWER MEADOW */}
      <div className="absolute bottom-0 left-0 w-[42%] h-[68%] pointer-events-none">
        {/* Cozy Cottage in the background */}
        <div className="absolute top-[8%] left-[4%] w-32 sm:w-40 h-28 pointer-events-none">
          {/* Cottage Roof (Red/Orange Pixel Roof) */}
          <div className="w-24 sm:w-30 h-12 bg-[#b9382b] border-2 border-[#54140e] relative rounded-t-sm shadow-md">
            {/* Chimney */}
            <div className="absolute -top-3 left-4 w-4 h-5 bg-[#78483b] border border-[#3b1f17]">
              {/* Smoke puff */}
              <div className="absolute -top-2.5 left-1 w-2 h-2 rounded-full bg-white/60 animate-ping" />
            </div>
            {/* Roof tiles pattern */}
            <div className="w-full h-full bg-[linear-gradient(90deg,transparent_4px,rgba(0,0,0,0.15)_4px)] [background-size:8px_8px]" />
          </div>
          {/* Cottage Walls (Warm Cream Wood) */}
          <div className="w-24 sm:w-30 h-14 bg-[#f1e0c5] border-2 border-[#6c4827] relative px-2 py-1 shadow-inner">
            {/* Cute wooden window */}
            <div className="absolute top-2 right-3 w-5 h-5 bg-[#71a6cc] border-2 border-[#432a15] rounded-xs flex items-center justify-center">
              <div className="w-full h-[1px] bg-[#432a15]" />
              <div className="h-full w-[1px] bg-[#432a15] absolute" />
            </div>
            {/* Wooden Door */}
            <div className="absolute bottom-0 left-4 w-6 h-10 bg-[#8c5225] border-2 border-[#432a15] rounded-t-xs" />
          </div>
          {/* Cottage Fence */}
          <div className="absolute bottom-0 -right-8 w-14 h-6 border-b-2 border-[#6c4827] flex gap-2">
            <div className="w-1.5 h-6 bg-[#ab7a46] border border-[#432a15]" />
            <div className="w-1.5 h-6 bg-[#ab7a46] border border-[#432a15]" />
            <div className="w-1.5 h-6 bg-[#ab7a46] border border-[#432a15]" />
          </div>
        </div>

        {/* Green Grass Bank with wild daisies */}
        <svg
          viewBox="0 0 400 350"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-[75%] pointer-events-none"
        >
          {/* Dark Soil underneath */}
          <path
            d="M 0,160 Q 180,180 280,260 L 290,350 L 0,350 Z"
            fill="#3a2514"
          />
          {/* Lush Green Top Grass */}
          <path
            d="M 0,150 Q 180,170 280,250 L 290,270 Q 170,185 0,170 Z"
            fill={currentTheme.grass}
          />
          <path
            d="M 0,140 Q 160,160 270,240 L 280,250 Q 160,170 0,155 Z"
            fill="#75bf43"
          />
        </svg>

        {/* Wild Daisies & Flora on Grass */}
        <div className="absolute bottom-12 left-6 flex items-center gap-2">
          <span className="text-white drop-shadow-[0_1px_1px_#000] text-sm animate-pulse">🌼</span>
          <span className="text-white drop-shadow-[0_1px_1px_#000] text-xs">🌸</span>
          <span className="text-white drop-shadow-[0_1px_1px_#000] text-sm">🌼</span>
        </div>
        <div className="absolute bottom-4 left-24 flex items-center gap-1.5">
          <span className="text-white drop-shadow-[0_1px_1px_#000] text-xs">🌼</span>
          <span className="text-white drop-shadow-[0_1px_1px_#000] text-sm">🌼</span>
        </div>
      </div>

      {/* 5. WOODEN FISHING DOCK & CHARACTER */}
      <div className="absolute bottom-[10%] left-[4%] sm:left-[8%] w-[38%] max-w-sm h-[52%] pointer-events-none z-10">
        {/* Wooden Dock Pier Planks */}
        <div className="absolute bottom-0 left-0 w-full h-24">
          {/* Pier vertical wooden stilts / posts in water */}
          <div className="absolute bottom-[-16px] left-[15%] w-5 h-20 bg-[#4e321b] border-2 border-[#2b180a] shadow-lg rounded-xs" />
          <div className="absolute bottom-[-24px] left-[45%] w-6 h-24 bg-[#412713] border-2 border-[#2b180a] shadow-lg rounded-xs" />
          <div className="absolute bottom-[-30px] right-[10%] w-6 h-28 bg-[#381f0d] border-2 border-[#221206] shadow-lg rounded-xs" />

          {/* Dock Horizontal Planks */}
          <div className="absolute bottom-6 left-0 w-full h-10 bg-[#7a4922] border-3 border-[#2e1909] rounded-md shadow-[0_6px_0_#221206] flex items-center justify-around px-2">
            <div className="w-1.5 h-full bg-[#523013]" />
            <div className="w-1.5 h-full bg-[#523013]" />
            <div className="w-1.5 h-full bg-[#523013]" />
            <div className="w-1.5 h-full bg-[#523013]" />
            <div className="w-1.5 h-full bg-[#523013]" />
          </div>
          {/* Top highlight plank */}
          <div className="absolute bottom-[44px] left-1 w-[98%] h-2.5 bg-[#9c6333] rounded-t-xs" />

          {/* Tackle Bucket sitting on the wooden dock */}
          <div className="absolute bottom-[48px] left-[10%] w-9 h-11 bg-[#475569] border-2 border-[#1e293b] rounded-b-md shadow-md flex flex-col justify-between p-0.5">
            {/* Water in bucket */}
            <div className="w-full h-2 bg-[#38bdf8] rounded-xs" />
            {/* Metal handle */}
            <div className="absolute -top-2 left-1 right-1 h-3 border-2 border-[#94a3b8] rounded-t-full pointer-events-none" />
          </div>
        </div>

        {/* 6. PIXEL ANGLER CHARACTER (The boy in bucket hat sitting on the dock) */}
        <div
          className={`absolute bottom-[46px] left-[32%] sm:left-[36%] w-24 sm:w-28 h-28 sm:h-32 transition-transform duration-200 ${
            isCasting
              ? 'animate-angler-cast'
              : isBiting
              ? 'animate-[bounce_0.4s_infinite]'
              : isReeling
              ? '-translate-y-1'
              : ''
          }`}
        >
          {/* Fisher Hat (Cream Fisherman Bucket Hat) */}
          <div className="absolute top-0 left-2 w-20 sm:w-22 h-10 z-20">
            {/* Hat Crown */}
            <div className="w-14 sm:w-16 h-7 bg-[#ded0b6] border-2 border-[#57432b] rounded-t-xl mx-auto relative shadow-xs">
              {/* Fish badge on hat */}
              <div className="w-3.5 h-1.5 bg-[#543b20] rounded-full mx-auto mt-2" />
            </div>
            {/* Hat Brim */}
            <div className="w-20 sm:w-22 h-3.5 bg-[#ecdcb9] border-2 border-[#57432b] rounded-full shadow-xs -mt-1" />
          </div>

          {/* Boy's Dark Messy Hair */}
          <div className="absolute top-7 left-3 w-16 h-8 bg-[#2d221c] rounded-b-md z-10 flex gap-0.5 px-1">
            <div className="w-2.5 h-5 bg-[#2d221c] rounded-b-full" />
            <div className="w-3 h-6 bg-[#2d221c] rounded-b-full" />
            <div className="w-3 h-5 bg-[#2d221c] rounded-b-full" />
            <div className="w-3.5 h-6 bg-[#2d221c] rounded-b-full" />
            <div className="w-2.5 h-4 bg-[#2d221c] rounded-b-full" />
          </div>

          {/* Cute Face */}
          <div className="absolute top-9 left-6 w-11 h-9 bg-[#fed7aa] border-2 border-[#57432b] rounded-md z-15">
            {/* Eye (looking right toward the lake) */}
            <div className="absolute top-3 right-2 w-2.5 h-3 bg-[#1e293b] rounded-xs">
              {/* Eye shine glint */}
              <div className="w-1 h-1 bg-white" />
            </div>
            {/* Cute pink cheek */}
            <div className="absolute top-4 left-1.5 w-2 h-1 bg-[#fb7185] rounded-full" />
            {/* Surprised mouth if biting */}
            {isBiting && (
              <div className="absolute bottom-1.5 right-3 w-1.5 h-2 bg-[#7f1d1d] rounded-full animate-ping" />
            )}
          </div>

          {/* Body: Grey Hoodie */}
          <div className="absolute top-16 left-6 w-13 h-10 bg-[#cbd5e1] border-2 border-[#475569] rounded-md z-10">
            {/* Hoodie strings */}
            <div className="w-0.5 h-3 bg-white ml-2 mt-0.5" />
          </div>

          {/* Arms holding the bamboo fishing rod */}
          <div
            className={`absolute top-18 left-12 w-9 h-4 bg-[#cbd5e1] border-2 border-[#475569] rounded-full z-20 origin-left transition-transform duration-150 ${
              isCasting
                ? 'animate-arm-cast'
                : isBiting
                ? 'rotate-[-10deg]'
                : isReeling
                ? 'rotate-[-22deg]'
                : 'rotate-[-4deg]'
            }`}
          />

          {/* Legs sitting on dock */}
          <div className="absolute top-24 left-7 w-12 h-6 bg-[#1e293b] border-2 border-[#0f172a] rounded-sm">
            {/* Bare feet dangling */}
            <div className="absolute -bottom-2 right-1 w-3.5 h-2.5 bg-[#fed7aa] border border-[#78350f] rounded-full" />
          </div>

          {/* Bamboo Fishing Rod */}
          <div
            className={`absolute top-12 left-15 w-28 sm:w-34 h-2 origin-bottom-left z-25 pointer-events-none transition-transform duration-200 ${
              isCasting
                ? 'animate-rod-cast'
                : isBiting
                ? 'rotate-[-36deg] translate-y-1'
                : isReeling
                ? 'rotate-[-52deg]'
                : 'rotate-[-32deg]'
            }`}
          >
            {/* Rod shaft (bamboo yellow-brown with notches) */}
            <div className="w-full h-2 bg-[#b45309] border border-[#451a03] rounded-full relative flex items-center justify-between px-2 shadow-xs">
              <div className="w-1 h-full bg-[#78350f]" />
              <div className="w-1 h-full bg-[#78350f]" />
              <div className="w-1 h-full bg-[#78350f]" />
              <div className="w-1 h-full bg-[#78350f]" />

              {/* Fishing Reel */}
              <div className="absolute -bottom-3 left-3 w-4 h-4 rounded-full bg-[#94a3b8] border-2 border-[#334155] shadow-xs flex items-center justify-center">
                <div className="w-1 h-1 bg-[#0f172a] rounded-full" />
              </div>
            </div>

            {/* Casting motion swoosh blur effect */}
            {isCasting && (
              <div className="absolute -top-3 right-0 w-16 h-8 pointer-events-none">
                <div className="w-full h-full border-t-2 border-r-2 border-white/50 rounded-tr-full animate-[ping_0.6s_ease-out]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7. FISHING LINE CONNECTING ROD TIP TO BOBBER */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isLineActive && (
          <path
            d={
              isCasting
                ? 'M 292,275 Q 380,220 455,395'
                : isBiting
                ? 'M 280,310 Q 360,350 455,395'
                : isReeling
                ? 'M 265,280 Q 340,320 455,390'
                : 'M 275,320 Q 360,380 455,395'
            }
            stroke="#ffffff"
            strokeWidth={isCasting ? '2' : '1.5'}
            strokeDasharray={isBiting ? '3,2' : undefined}
            fill="none"
            opacity="0.85"
            className={isBiting ? 'animate-pulse' : isCasting ? 'animate-[line-cast-arc_0.75s_ease-out]' : ''}
          />
        )}
      </svg>

      {/* 8. FLOATING BOBBER IN LAKE */}
      {isLineActive && (
        <div
          className={`absolute top-[61%] left-[45.5%] -translate-x-1/2 -translate-y-1/2 z-25 cursor-pointer group ${
            isCasting
              ? 'animate-bobber-cast'
              : isBiting
              ? 'animate-bobber-bite'
              : 'animate-bobber-idle'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onBobberClick();
          }}
          title={isBiting ? '有魚上鉤了！快收竿！' : '浮標漂浮在湖面上...'}
        >
          {/* Bobber Red Top & White Bottom */}
          <div className="relative w-6 h-7 flex flex-col items-center">
            {/* Bobber top antenna pin */}
            <div className="w-1 h-2 bg-[#1e293b] rounded-t-full" />
            {/* Red top half */}
            <div className="w-5 h-3 bg-[#dc2626] border-2 border-[#450a0a] rounded-t-full shadow-xs" />
            {/* White bottom half */}
            <div className="w-5 h-3 bg-[#ffffff] border-2 border-[#450a0a] -mt-0.5 rounded-b-full shadow-xs" />
          </div>

          {/* Exclamation Mark Speech Bubble above Bobber during bite! */}
          {isBiting && (
            <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex flex-col items-center animate-[bounce_0.5s_infinite]">
              {/* White Pixel Bubble with Red Exclamation */}
              <div className="bg-white border-2 border-[#1e293b] px-2 py-0.5 rounded-lg shadow-[0_3px_0_#0f172a] flex items-center justify-center">
                <span className="text-rose-600 font-black text-base leading-none">!</span>
              </div>
              {/* Bubble downward pointer triangle */}
              <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#1e293b] -mt-[1px]" />
            </div>
          )}
        </div>
      )}

      {/* 9. "有魚上鉤了！" COMIC BANNER PROMPT AT TOP CENTER */}
      {isBiting && (
        <div className="absolute top-[16%] sm:top-[18%] left-1/2 -translate-x-1/2 z-35 pointer-events-none animate-[scaleUp_0.2s_ease-out]">
          <div className="relative bg-[#fff7ed] border-3 border-[#3c2410] px-5 sm:px-8 py-2 sm:py-2.5 rounded-2xl shadow-[0_6px_0_#281508,0_10px_20px_rgba(0,0,0,0.3)] flex items-center gap-2">
            {/* Spark lines */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-lg animate-ping">
              💥
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-lg animate-ping">
              💥
            </div>

            <span className="text-xl sm:text-2xl font-black text-[#7c2d12] tracking-wider drop-shadow-[0_1px_0_#ffffff]">
              有魚上鉤了！
            </span>
          </div>
        </div>
      )}

      {/* 10. RIGHT SHORE: PEBBLES & REEDS */}
      <div className="absolute bottom-0 right-0 w-[28%] h-[40%] pointer-events-none">
        {/* River Stones / Boulders */}
        <div className="absolute bottom-4 right-14 w-20 h-14 bg-[#78716c] border-3 border-[#292524] rounded-full shadow-lg" />
        <div className="absolute bottom-2 right-6 w-16 h-12 bg-[#a8a29e] border-3 border-[#292524] rounded-full shadow-md" />

        {/* Green Reeds / Grass Clump */}
        <div className="absolute bottom-0 right-2 flex items-end gap-1">
          <div className="w-2.5 h-20 bg-[#2d6a4f] border border-[#1b4332] rounded-t-full origin-bottom rotate-[-8deg]" />
          <div className="w-3 h-28 bg-[#40916c] border border-[#1b4332] rounded-t-full origin-bottom" />
          <div className="w-2.5 h-24 bg-[#52b788] border border-[#1b4332] rounded-t-full origin-bottom rotate-[10deg]" />
          <div className="w-3 h-18 bg-[#2d6a4f] border border-[#1b4332] rounded-t-full origin-bottom rotate-[16deg]" />
        </div>
      </div>
    </div>
  );
};

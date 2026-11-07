import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CatchResult } from '../types/game';
import { PixelFish } from './PixelFish';
import { soundManager } from '../utils/audio';

interface CatchResultModalProps {
  result: CatchResult | null;
  onCollect: () => void;
}

export const CatchResultModal: React.FC<CatchResultModalProps> = ({
  result,
  onCollect,
}) => {
  useEffect(() => {
    if (!result) return;

    // Trigger confetti on rare or super rare fish
    if (result.fish.rarity === 'super_rare') {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff', '#eab308'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 70,
          origin: { x: 0.2, y: 0.7 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 70,
          origin: { x: 0.8, y: 0.7 },
        });
      }, 250);
    } else if (result.fish.rarity === 'rare') {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#c084fc', '#facc15', '#60a5fa'],
      });
    }

    // Keyboard handler for Space or Enter
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onCollect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [result, onCollect]);

  if (!result) return null;

  const { fish, size, isNew, isNewRecord } = result;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-[2px] animate-[fadeIn_0.15s_ease-out]">
      {/* Click outside to collect */}
      <div className="absolute inset-0" onClick={onCollect} />

      {/* The Result Card - Directly designed after the mockup card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-[#fdfbf6] rounded-2xl border-4 border-[#2d3b56] shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_0_2px_#ffffff] overflow-hidden animate-[scaleUp_0.2s_cubic-bezier(0.175,0.885,0.32,1.275)]">
        {/* Top Header Banner: Deep Slate Blue with Stars */}
        <div className="bg-[#3e5683] border-b-4 border-[#253654] py-3 px-4 text-center relative flex items-center justify-center shadow-md">
          <div className="flex items-center gap-2 text-white font-bold text-lg sm:text-xl tracking-wider drop-shadow-[0_2px_0_#1a263c]">
            <span className="text-yellow-300 text-lg sm:text-xl animate-pulse">★</span>
            <span className="tracking-widest">釣到啦！</span>
            <span className="text-yellow-300 text-lg sm:text-xl animate-pulse">★</span>
          </div>

          {/* Close button in header */}
          <button
            onClick={onCollect}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#273752] hover:bg-[#1f2b40] text-gray-200 text-xs font-bold flex items-center justify-center border border-[#49659b] cursor-pointer"
            title="關閉"
          >
            ✕
          </button>
        </div>

        {/* Card Content Area */}
        <div className="p-5 sm:p-6 flex flex-col items-center">
          {/* Main Visual Stage with Radiating Rays */}
          <div className="relative w-full h-40 sm:h-44 rounded-xl bg-gradient-to-b from-[#eaf3fa] to-[#d6e7f5] border-2 border-[#b8d2e8] flex items-center justify-center overflow-hidden shadow-inner">
            {/* Comic burst radiant rays */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className="w-56 h-56 rounded-full border-12 border-dashed border-[#5b87c7] animate-[spin_30s_linear_infinite]" />
            </div>

            {/* Sparkles around fish */}
            <div className="absolute top-3 left-4 text-amber-400 text-sm animate-ping">✦</div>
            <div className="absolute bottom-4 right-5 text-amber-400 text-sm animate-pulse">✦</div>
            <div className="absolute top-4 right-8 text-yellow-300 text-xs">✨</div>
            <div className="absolute bottom-5 left-7 text-sky-400 text-xs">✨</div>

            {/* Animated Big Pixel Fish */}
            <div className="relative z-10 transform scale-125 sm:scale-135 transition-transform hover:scale-140">
              <PixelFish
                fishId={fish.id}
                size={110}
                animated={true}
                showSparkles={fish.rarity !== 'common'}
              />
            </div>

            {/* Rarity Stamp badge at corner */}
            <div className="absolute top-2.5 left-2.5">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full border shadow-xs font-bold ${fish.badgeBg} ${fish.badgeText} ${fish.badgeBorder}`}
              >
                {fish.rarityLabel}
              </span>
            </div>

            {/* New record badge */}
            {isNewRecord && (
              <div className="absolute top-2.5 right-2.5 bg-amber-500 text-amber-950 font-black text-[11px] px-2 py-0.5 rounded-full border border-amber-700 shadow-xs animate-bounce">
                👑 體長新紀錄！
              </div>
            )}
          </div>

          {/* Fish Info Box */}
          <div className="w-full mt-4 flex items-center justify-between px-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-[#1e293b] tracking-wide">
                  {fish.name}
                </h3>
                {isNew && (
                  <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm animate-pulse">
                    NEW!
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                體長：<strong className="text-slate-800 text-sm font-retro-num">{size}</strong> cm
              </p>
            </div>

            {/* Gold reward display matching mockup */}
            <div className="flex items-center gap-1.5 bg-[#fef3c7] border-2 border-[#f59e0b] px-3.5 py-1.5 rounded-xl shadow-xs">
              <span className="text-xl">🪙</span>
              <span className="text-xl font-black text-amber-900 font-retro-num tracking-tight">
                +{fish.coins}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full my-3.5 flex items-center gap-2 opacity-50">
            <div className="flex-1 border-t-2 border-dashed border-[#b6c6dc]" />
            <span className="text-xs text-[#526b8e]">◆</span>
            <div className="flex-1 border-t-2 border-dashed border-[#b6c6dc]" />
          </div>

          {/* Status Note matching the mockup: "📖 已加入圖鑑！" */}
          <div className="w-full bg-[#eef5fa] rounded-lg border border-[#cfdfed] p-2.5 text-center text-xs text-[#2b4468] font-bold flex items-center justify-center gap-2">
            <span className="text-base">📖</span>
            <span>{isNew ? '✨ 新魚種！已登錄至魚類圖鑑！' : '已收錄於魚類圖鑑中！'}</span>
          </div>

          {/* Action Button: Collect and close */}
          <button
            onClick={() => {
              soundManager.playCoin();
              onCollect();
            }}
            className="w-full mt-4 py-3 px-4 rounded-xl font-black text-base text-white tracking-wider cursor-pointer bg-gradient-to-b from-[#4c75b2] to-[#345585] border-2 border-[#1e3455] shadow-[0_4px_0_#15243b] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#15243b] transition flex items-center justify-center gap-2"
          >
            <span>🪙 收下獎勵</span>
            <span className="text-xs opacity-75 font-normal">(按空白鍵)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

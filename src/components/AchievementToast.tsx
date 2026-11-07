import React, { useEffect } from 'react';
import { AchievementDefinition } from '../types/game';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface AchievementToastProps {
  achievement: AchievementDefinition | null;
  onClose: () => void;
  onOpenDrawer: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onClose,
  onOpenDrawer,
}) => {
  useEffect(() => {
    if (!achievement) return;

    // Small golden celebratory confetti burst
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.15 },
      colors: ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff'],
    });

    const timer = setTimeout(() => {
      onClose();
    }, 4200);

    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed top-18 sm:top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto animate-[slideDown_0.35s_cubic-bezier(0.175,0.885,0.32,1.275)]">
      <div
        onClick={() => {
          soundManager.playClick();
          onOpenDrawer();
          onClose();
        }}
        className="cursor-pointer bg-gradient-to-r from-[#2c1d11] via-[#452815] to-[#2c1d11] border-3 border-[#f59e0b] px-4 sm:px-6 py-2.5 rounded-2xl shadow-[0_8px_0_#1a0f08,0_12px_24px_rgba(0,0,0,0.6)] flex items-center gap-3.5 hover:brightness-110 active:scale-98 transition"
      >
        {/* Animated Golden Trophy Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#fbbf24] to-[#d97706] border-2 border-[#78350f] flex items-center justify-center text-xl shadow-inner animate-[bounce_1s_infinite]">
          <span>{achievement.icon}</span>
        </div>

        {/* Text info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-amber-400 tracking-wider">
              ✦ 成就達成！ ✦
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/40">
              可領取獎勵
            </span>
          </div>
          <span className="text-base sm:text-lg font-black text-amber-100 tracking-wide drop-shadow-[0_1px_0_#000]">
            {achievement.title}
          </span>
        </div>

        {/* Coin tag */}
        <div className="ml-2 bg-[#fef3c7] border-2 border-[#b45309] px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-xs">
          <span>🪙</span>
          <span className="font-retro-num text-xs font-black text-amber-900">
            +{achievement.rewardCoins}
          </span>
        </div>

        {/* Arrow prompt */}
        <span className="text-xs text-amber-300 opacity-75 hidden sm:inline ml-1">
          前往領取 →
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import { ACHIEVEMENTS, getAchievementProgress } from '../data/achievementData';
import { AchievementDefinition, GameStats } from '../types/game';
import { soundManager } from '../utils/audio';
import { Trophy, Check, Sparkles } from 'lucide-react';

interface AchievementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onClaimReward: (achievement: AchievementDefinition) => void;
}

export const AchievementDrawer: React.FC<AchievementDrawerProps> = ({
  isOpen,
  onClose,
  stats,
  onClaimReward,
}) => {
  // Calculate total completed and unclaimed count
  let completedCount = 0;
  let unclaimedCount = 0;

  ACHIEVEMENTS.forEach((ach) => {
    const record = stats.achievements?.[ach.id];
    const { isReady } = getAchievementProgress(ach, stats);
    if (record?.unlockedAt || isReady) {
      completedCount++;
      if (!record?.claimed) {
        unclaimedCount++;
      }
    }
  });

  const progressPercent = Math.round((completedCount / ACHIEVEMENTS.length) * 100);

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity animate-[fadeIn_0.2s_ease-out]"
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
        />
      )}

      {/* Slide-out Drawer Container */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm sm:max-w-md bg-[#fdf8ee] border-l-4 border-[#3c2410] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header: Wooden plank banner */}
        <div className="bg-[#6b4226] border-b-4 border-[#3c2410] px-5 py-4 text-amber-100 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#fbbf24] to-[#d97706] border-2 border-[#78350f] flex items-center justify-center text-lg shadow-inner">
              <Trophy size={20} className="text-amber-950" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wider text-amber-50 drop-shadow-[0_2px_0_#281508]">
                湖畔成就手札
              </h2>
              <div className="text-xs text-amber-200 flex items-center gap-2">
                <span>進度：{completedCount} / {ACHIEVEMENTS.length} 項</span>
                {unclaimedCount > 0 && (
                  <span className="bg-amber-400 text-amber-950 font-black px-1.5 py-0.2 rounded-full text-[10px] animate-pulse">
                    {unclaimedCount} 個獎勵可領取
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-[#8c2a2a] hover:bg-[#a83232] text-white font-bold flex items-center justify-center border-2 border-[#451010] shadow-[0_2px_0_#2b0a0a] active:translate-y-0.5 transition cursor-pointer"
            title="關閉成就抽屜 [按 A]"
          >
            ✕
          </button>
        </div>

        {/* Total Progress Bar Strip */}
        <div className="bg-[#ebd9bd] border-b-2 border-[#cbb192] px-5 py-2.5 flex items-center gap-3 text-xs text-[#5c3e21]">
          <span className="font-bold">總完成度</span>
          <div className="flex-1 bg-[#3c2410] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#a06e40]">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-retro-num text-[11px] font-bold text-[#3c2410]">{progressPercent}%</span>
        </div>

        {/* Achievement Cards Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#e8d8be_1px,transparent_1px)] [background-size:12px_12px]">
          {ACHIEVEMENTS.map((ach) => {
            const record = stats.achievements?.[ach.id];
            const { current, max, isReady } = getAchievementProgress(ach, stats);
            const isUnlocked = !!record?.unlockedAt || isReady;
            const isClaimed = !!record?.claimed;
            const progressRatio = Math.min(100, Math.round((current / max) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border-2 transition relative flex flex-col justify-between shadow-xs ${
                  isClaimed
                    ? 'bg-[#f0e7d6] border-[#cfc0a9] opacity-80'
                    : isUnlocked
                    ? 'bg-[#fffbeb] border-[#f59e0b] shadow-[0_3px_0_#b45309]'
                    : 'bg-[#faf3e6] border-[#dac9b0]'
                }`}
              >
                {/* Top row: Icon, Title, and Badge */}
                <div className="flex items-start gap-3">
                  {/* Badge Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center text-xl shrink-0 shadow-xs ${
                      isUnlocked
                        ? 'bg-gradient-to-b from-[#fef08a] to-[#fde047] border-[#b45309]'
                        : 'bg-[#e2d5c0] border-[#b5a38a] opacity-50 grayscale'
                    }`}
                  >
                    <span>{ach.icon}</span>
                  </div>

                  {/* Title & Lore */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-sm text-[#2b1809] truncate">
                        {ach.title}
                      </h4>

                      {/* Status indicator */}
                      {isClaimed ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                          <Check size={11} />
                          已完成
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-[10px] bg-amber-500 text-amber-950 font-black px-1.5 py-0.5 rounded animate-pulse">
                          可領取！
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#80674d] font-retro-num">
                          {current}/{max}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#6e5033] mt-0.5 leading-snug">
                      {ach.description}
                    </p>
                  </div>
                </div>

                {/* Bottom row: Progress Bar or Claim Button */}
                <div className="mt-3 pt-2 border-t border-[#e8d7be] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs text-[#785939]">
                    <span>獎勵：</span>
                    <span className="font-retro-num font-bold text-amber-700">🪙 +{ach.rewardCoins}</span>
                  </div>

                  {isClaimed ? (
                    <span className="text-xs text-[#8c745a] italic">獎勵已領取</span>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => onClaimReward(ach)}
                      className="px-3.5 py-1.5 bg-gradient-to-b from-[#f59e0b] to-[#d97706] hover:brightness-105 active:scale-95 text-amber-950 font-black text-xs rounded-lg border-2 border-[#78350f] shadow-[0_2px_0_#451a03] flex items-center gap-1 cursor-pointer animate-[pulse_2s_infinite]"
                    >
                      <Sparkles size={13} />
                      <span>領取 🪙 +{ach.rewardCoins}</span>
                    </button>
                  ) : (
                    /* Progress bar for ongoing achievement */
                    <div className="w-32 flex items-center gap-1.5">
                      <div className="flex-1 bg-[#dcd0bc] h-2 rounded-full overflow-hidden border border-[#b8a68e]">
                        <div
                          className="bg-[#b45309] h-full rounded-full transition-all"
                          style={{ width: `${progressRatio}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-retro-num text-[#856b50]">{progressRatio}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="bg-[#ebd9bd] border-t-2 border-[#cbb192] px-5 py-3 flex items-center justify-between text-xs text-[#6e5135]">
          <span>💡 提示：按 [A] 鍵可隨時開啟或收合此抽屜</span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-3 py-1 bg-[#6b4226] hover:bg-[#835332] text-amber-50 font-bold rounded-lg border border-[#3c2410] shadow-[0_2px_0_#281508] cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </>
  );
};

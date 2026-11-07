import React, { useState } from 'react';
import { FISH_LIST } from '../data/fishData';
import { FishDefinition, GameStats } from '../types/game';
import { PixelFish } from './PixelFish';
import { soundManager } from '../utils/audio';

interface FishEncyclopediaProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
}

export const FishEncyclopedia: React.FC<FishEncyclopediaProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  const [selectedFish, setSelectedFish] = useState<FishDefinition>(FISH_LIST[0]);

  if (!isOpen) return null;

  const caughtCount = Object.keys(stats.records).filter(
    (id) => (stats.records[id]?.count ?? 0) > 0
  ).length;
  const progressPercent = Math.round((caughtCount / FISH_LIST.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={() => { soundManager.playClick(); onClose(); }} />

      {/* Main Encyclopedia Book Container */}
      <div className="relative z-10 w-full max-w-2xl bg-[#f5ebd7] border-4 border-[#3c2410] rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Book Header */}
        <div className="bg-[#6b4226] border-b-4 border-[#3c2410] px-5 py-3.5 flex items-center justify-between text-amber-100">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="text-xl font-bold tracking-wider text-amber-50 drop-shadow-[0_2px_0_#281508]">
                湖畔魚類圖鑑
              </h2>
              <p className="text-xs text-amber-200">
                收集進度：{caughtCount} / {FISH_LIST.length} 種 ({progressPercent}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress bar */}
            <div className="hidden sm:block w-32 bg-[#3c2410] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#a06e40]">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-lg bg-[#8c2a2a] hover:bg-[#a83232] text-white font-bold flex items-center justify-center border-2 border-[#451010] shadow-[0_2px_0_#2b0a0a] active:translate-y-0.5 transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body: Split into Left Fish List & Right Fish Detail */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-5 bg-[radial-gradient(#e8d8be_1px,transparent_1px)] [background-size:12px_12px]">
          {/* Left: Fish List Grid (5 Fish) */}
          <div className="md:col-span-5 flex flex-col gap-2.5">
            <div className="text-xs font-bold text-[#6b4226] tracking-wider mb-1 flex items-center justify-between">
              <span>魚種清單</span>
              <span>{caughtCount}/{FISH_LIST.length} 已收錄</span>
            </div>

            <div className="flex flex-col gap-2">
              {FISH_LIST.map((fish) => {
                const record = stats.records[fish.id];
                const isDiscovered = (record?.count ?? 0) > 0;
                const isSelected = selectedFish.id === fish.id;

                return (
                  <button
                    key={fish.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedFish(fish);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border-2 transition flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#ffeec2] border-[#b45309] shadow-[0_3px_0_#78350f] -translate-y-0.5'
                        : 'bg-[#eee0c9] border-[#cbb192] hover:bg-[#f6ebd8]'
                    }`}
                  >
                    {/* Small fish icon / silhouette */}
                    <div
                      className={`w-12 h-10 rounded-md border flex items-center justify-center p-1 ${
                        isDiscovered
                          ? 'bg-[#d8e6f3] border-[#7da4c7]'
                          : 'bg-[#c5b79e] border-[#9f8e75]'
                      }`}
                    >
                      {isDiscovered ? (
                        <PixelFish fishId={fish.id} size={36} />
                      ) : (
                        <span className="text-lg opacity-40 font-bold text-[#5c4a32]">?</span>
                      )}
                    </div>

                    {/* Fish info snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`font-bold text-sm truncate ${
                            isDiscovered ? 'text-[#3b2413]' : 'text-[#8c7b66]'
                          }`}
                        >
                          {isDiscovered ? fish.name : '？？？？'}
                        </span>

                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                            isDiscovered ? `${fish.badgeBg} ${fish.badgeText}` : 'bg-gray-300 text-gray-600 border-gray-400'
                          }`}
                        >
                          {isDiscovered ? fish.rarityLabel : '未發現'}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#785e46] flex items-center gap-2 mt-0.5">
                        <span>🪙 {fish.coins} 金幣</span>
                        {isDiscovered && (
                          <span className="text-emerald-700 font-semibold">
                            已釣獲 {record?.count} 隻
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed View of Selected Fish */}
          <div className="md:col-span-7 bg-[#fdf8ee] border-3 border-[#c2aa8b] rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-inner">
            {(() => {
              const record = stats.records[selectedFish.id];
              const isDiscovered = (record?.count ?? 0) > 0;

              return (
                <div className="flex flex-col h-full">
                  {/* Fish Preview Stage */}
                  <div className="relative w-full h-44 rounded-lg bg-gradient-to-b from-[#bfe3f7] via-[#94cbe7] to-[#68a8cf] border-2 border-[#5487a8] overflow-hidden flex items-center justify-center shadow-inner">
                    {/* Water shine accents */}
                    <div className="absolute top-2 left-3 w-8 h-1 bg-white/40 rounded-full" />
                    <div className="absolute top-5 left-8 w-4 h-1 bg-white/30 rounded-full" />
                    <div className="absolute bottom-3 right-4 w-12 h-1 bg-white/20 rounded-full" />

                    {isDiscovered ? (
                      <div className="flex flex-col items-center">
                        <PixelFish
                          fishId={selectedFish.id}
                          size={130}
                          animated={true}
                          showSparkles={selectedFish.rarity === 'super_rare'}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#406883]">
                        <span className="text-5xl font-bold opacity-30 select-none">?</span>
                        <span className="text-xs font-semibold mt-1 opacity-75">
                          尚未釣到此魚種
                        </span>
                      </div>
                    )}

                    {/* Rarity Tag */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border shadow-xs font-bold ${
                          isDiscovered
                            ? `${selectedFish.badgeBg} ${selectedFish.badgeText} ${selectedFish.badgeBorder}`
                            : 'bg-gray-400 text-white border-gray-600'
                        }`}
                      >
                        {isDiscovered ? selectedFish.rarityLabel : '神秘魚種'}
                      </span>
                    </div>
                  </div>

                  {/* Fish Details */}
                  <div className="mt-4 flex-1 flex flex-col">
                    <div className="flex items-baseline justify-between border-b-2 border-[#e0cca8] pb-2">
                      <div>
                        <h3 className="text-lg font-bold text-[#3c2410]">
                          {isDiscovered ? selectedFish.name : '神秘魚種'}
                        </h3>
                        <p className="text-xs text-[#8c6f50] font-sans">
                          {isDiscovered ? selectedFish.englishName : 'Undiscovered Fish'}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-[#785b3b]">基礎售價</span>
                        <div className="text-base font-bold text-amber-700 font-retro-num flex items-center gap-1 justify-end">
                          <span>🪙</span>
                          <span>{selectedFish.coins}</span>
                        </div>
                      </div>
                    </div>

                    {/* Lore Description */}
                    <div className="mt-3 text-xs leading-relaxed text-[#5c3e21] bg-[#f5ebd7] p-3 rounded-lg border border-[#dfcbb1] italic">
                      {isDiscovered
                        ? selectedFish.description
                        : '經常出沒於寧靜湖畔中，帶著耐心下竿，或許下一次收竿就能與牠相遇！'}
                    </div>

                    {/* Stats Grid */}
                    <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-[#ede1cb] p-2.5 rounded-md border border-[#cbb393]">
                        <div className="text-[#806547] text-[11px]">累積釣獲數量</div>
                        <div className="text-sm font-bold text-[#3b2413] mt-0.5">
                          {isDiscovered ? `${record.count} 隻` : '0 隻'}
                        </div>
                      </div>

                      <div className="bg-[#ede1cb] p-2.5 rounded-md border border-[#cbb393]">
                        <div className="text-[#806547] text-[11px]">個人最大體長</div>
                        <div className="text-sm font-bold text-[#3b2413] mt-0.5">
                          {isDiscovered && record.maxSize > 0
                            ? `${record.maxSize} cm`
                            : isDiscovered
                            ? `${selectedFish.minSize} ~ ${selectedFish.maxSize} cm`
                            : '？？ cm'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#ebd9bd] border-t-2 border-[#cbb192] px-5 py-3 flex items-center justify-between text-xs text-[#6e5135]">
          <span>💡 提示：越稀有的魚種在水面上的咬鉤反應越激烈喔！</span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#6b4226] hover:bg-[#835332] text-amber-50 font-bold rounded-lg border border-[#3c2410] shadow-[0_2px_0_#281508] cursor-pointer"
          >
            關閉圖鑑
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FishingScene } from './components/FishingScene';
import { PixelFish } from './components/PixelFish';
import { FishEncyclopedia } from './components/FishEncyclopedia';
import { CatchResultModal } from './components/CatchResultModal';
import { AchievementDrawer } from './components/AchievementDrawer';
import { AchievementToast } from './components/AchievementToast';
import { FISH_LIST, getRandomFish, generateFishSize } from './data/fishData';
import { ACHIEVEMENTS, checkNewlyUnlockedAchievements, getAchievementProgress } from './data/achievementData';
import { CatchResult, FishingState, GameStats, AchievementDefinition } from './types/game';
import { soundManager } from './utils/audio';
import { Volume2, VolumeX, Sun, Sunset, Moon, RotateCcw, Sparkles, Trophy } from 'lucide-react';

const STORAGE_KEY = 'pixel_fishing_game_data_v1';

export default function App() {
  // Game Stats with local storage persistence
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          coins: parsed.coins ?? 120,
          totalCatches: parsed.totalCatches ?? 0,
          totalCasts: parsed.totalCasts ?? 0,
          records: parsed.records ?? {
            blue_fish: { count: 1, maxSize: 18.4, firstCaughtAt: Date.now() - 3600000 },
          },
          unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
          achievements: parsed.achievements ?? {},
        };
      }
    } catch {
      // fallback
    }
    // Default initial data: 120 coins like in the mockup image!
    return {
      coins: 120,
      totalCatches: 0,
      totalCasts: 0,
      records: {
        blue_fish: { count: 1, maxSize: 18.4, firstCaughtAt: Date.now() - 3600000 },
      },
      unlockedBadges: [],
      achievements: {},
    };
  });

  // Save stats on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save game data:', e);
    }
  }, [stats]);

  // Game state
  const [fishingState, setFishingState] = useState<FishingState>('idle');
  const [currentCatch, setCurrentCatch] = useState<CatchResult | null>(null);
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [isAchievementDrawerOpen, setIsAchievementDrawerOpen] = useState(false);
  const [activeAchievementToast, setActiveAchievementToast] = useState<AchievementDefinition | null>(null);
  const [hasNewEncyclopediaEntry, setHasNewEncyclopediaEntry] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'dusk' | 'night'>('day');
  const [isMuted, setIsMuted] = useState(() => soundManager.getMuted());
  const [floatingCoinText, setFloatingCoinText] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState('點擊「開始釣魚」將魚鉤拋入湖中～');

  // Timers
  const biteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const biteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear all pending timers
  const clearTimers = useCallback(() => {
    if (biteTimerRef.current) {
      clearTimeout(biteTimerRef.current);
      biteTimerRef.current = null;
    }
    if (biteTimeoutRef.current) {
      clearTimeout(biteTimeoutRef.current);
      biteTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // Helper: Evaluates achievements and triggers toast & sound if any new are unlocked
  const evaluateAndTriggerAchievements = useCallback((currentStats: GameStats) => {
    const newUnlocks = checkNewlyUnlockedAchievements(currentStats);
    if (newUnlocks.length > 0) {
      soundManager.playAchievement();
      // Show the first unlocked achievement toast
      setActiveAchievementToast(newUnlocks[0]);

      // Record them in stats
      setStats((prev) => {
        const nextAchievements = { ...(prev.achievements || {}) };
        newUnlocks.forEach((ach) => {
          if (!nextAchievements[ach.id]) {
            nextAchievements[ach.id] = {
              unlockedAt: Date.now(),
              claimed: false,
            };
          }
        });
        return {
          ...prev,
          achievements: nextAchievements,
        };
      });
    }
  }, []);

  // Action: Start Fishing (Cast rod)
  const handleStartFishing = useCallback(() => {
    if (fishingState !== 'idle') return;

    soundManager.playCast();
    setFishingState('casting');
    setHintMessage('咻～ 正在優雅揮竿拋出魚線...');

    // Increment total casts and check for achievements (e.g. first_cast)
    setStats((prev) => {
      const nextStats = {
        ...prev,
        totalCasts: (prev.totalCasts || 0) + 1,
      };
      // Check after state update
      setTimeout(() => evaluateAndTriggerAchievements(nextStats), 300);
      return nextStats;
    });

    // Allow full 750ms for natural swinging arc and bobber flight before transitioning to waiting
    setTimeout(() => {
      setFishingState('waiting');
      setHintMessage('浮標靜靜漂浮在湖面上... 請屏息凝神等待魚兒咬鉤～');

      // Random wait time before bite: 2.0 to 4.5 seconds
      const biteDelay = 2000 + Math.random() * 2500;

      biteTimerRef.current = setTimeout(() => {
        setFishingState('biting');
        soundManager.playBite();
        setHintMessage('⚡ 有魚咬鉤了！快點擊「收竿」或按下 [空白鍵]！');

        // Player has 3.8 seconds to react before the fish escapes
        biteTimeoutRef.current = setTimeout(() => {
          soundManager.playEscape();
          setFishingState('escaped');
          setHintMessage('💨 啊呀！魚游走了，下次收竿要再敏捷一點喔～');

          setTimeout(() => {
            setFishingState('idle');
            setHintMessage('調整好呼吸，隨時可以再次開始釣魚！');
          }, 1800);
        }, 3800);
      }, biteDelay);
    }, 750);
  }, [fishingState, evaluateAndTriggerAchievements]);

  // Action: Reel In
  const handleReelIn = useCallback(() => {
    if (fishingState === 'biting') {
      // SUCCESSFUL CATCH!
      clearTimers();
      soundManager.playReel();
      setFishingState('reeling');
      setHintMessage('用力收竿！大魚破水而出啦～');

      const fish = getRandomFish();
      const size = generateFishSize(fish);
      const existingRecord = stats.records[fish.id];
      const isNew = !existingRecord || existingRecord.count === 0;
      const isNewRecord = !existingRecord || size > (existingRecord.maxSize || 0);

      const catchResult: CatchResult = {
        fish,
        size,
        isNew,
        isNewRecord,
        timestamp: Date.now(),
      };

      if (isNew) {
        setHasNewEncyclopediaEntry(true);
      }

      // After fish leaps out of lake, show the catch modal!
      setTimeout(() => {
        soundManager.playCatch(fish.rarity);
        setCurrentCatch(catchResult);
        setFishingState('caught');
        setHintMessage(`🎉 太棒了！釣到了【${fish.name}】！`);
      }, 700);
    } else if (fishingState === 'waiting' || fishingState === 'casting') {
      // Reeled in too early before fish bit
      clearTimers();
      soundManager.playClick();
      setFishingState('idle');
      setHintMessage('魚兒還沒咬鉤呢，提前收回了魚竿。');
    }
  }, [fishingState, clearTimers, stats.records]);

  // Action: Collect Reward from catch modal
  const handleCollectReward = useCallback(() => {
    if (!currentCatch) return;

    const { fish, size, isNew } = currentCatch;
    soundManager.playCoin();

    // Trigger floating +XX coins animation
    setFloatingCoinText(`+${fish.coins}`);
    setTimeout(() => setFloatingCoinText(null), 1500);

    // Update Stats and verify newly unlocked achievements
    setStats((prev) => {
      const prevRecord = prev.records[fish.id];
      const newCount = (prevRecord?.count || 0) + 1;
      const newMaxSize = Math.max(prevRecord?.maxSize || 0, size);

      const nextCatches = (prev.totalCatches || 0) + 1;
      const nextCoins = prev.coins + fish.coins;
      const nextRecords = {
        ...prev.records,
        [fish.id]: {
          count: newCount,
          maxSize: newMaxSize,
          firstCaughtAt: prevRecord?.firstCaughtAt || Date.now(),
        },
      };

      const updatedStats: GameStats = {
        ...prev,
        coins: nextCoins,
        totalCatches: nextCatches,
        records: nextRecords,
      };

      // Check achievements with updated stats
      setTimeout(() => evaluateAndTriggerAchievements(updatedStats), 200);

      return updatedStats;
    });

    setCurrentCatch(null);
    setFishingState('idle');
    setHintMessage(
      isNew
        ? `✨ 【${fish.name}】已成功登記到魚類圖鑑中！獲得 ${fish.coins} 金幣！`
        : `獲得了 ${fish.coins} 金幣！湖中還有更多珍稀魚種等待你發掘！`
    );
  }, [currentCatch, evaluateAndTriggerAchievements]);

  // Action: Claim Achievement Reward inside the Achievement Drawer
  const handleClaimAchievementReward = useCallback((achievement: AchievementDefinition) => {
    soundManager.playCoin();
    setFloatingCoinText(`+${achievement.rewardCoins}`);
    setTimeout(() => setFloatingCoinText(null), 1500);

    setStats((prev) => {
      const nextAchievements = { ...(prev.achievements || {}) };
      nextAchievements[achievement.id] = {
        unlockedAt: nextAchievements[achievement.id]?.unlockedAt || Date.now(),
        claimed: true,
      };
      return {
        ...prev,
        coins: prev.coins + achievement.rewardCoins,
        achievements: nextAchievements,
      };
    });
  }, []);

  // Click on lake / bobber handler
  const handleLakeInteraction = useCallback(() => {
    if (fishingState === 'idle') {
      handleStartFishing();
    } else if (fishingState === 'biting' || fishingState === 'waiting') {
      handleReelIn();
    }
  }, [fishingState, handleStartFishing, handleReelIn]);

  // Keyboard shortcut listener: Space to fish/reel, B for book, A for achievements, M for mute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (fishingState === 'caught') {
          handleCollectReward();
        } else if (fishingState === 'biting' || fishingState === 'waiting') {
          handleReelIn();
        } else if (fishingState === 'idle') {
          handleStartFishing();
        }
      } else if (e.code === 'KeyB' || e.code === 'KeyT') {
        e.preventDefault();
        soundManager.playClick();
        setIsEncyclopediaOpen((prev) => !prev);
      } else if (e.code === 'KeyA') {
        e.preventDefault();
        soundManager.playClick();
        setIsAchievementDrawerOpen((prev) => !prev);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        const muted = soundManager.toggleMute();
        setIsMuted(muted);
      } else if (e.code === 'KeyD') {
        e.preventDefault();
        setTimeOfDay((prev) => (prev === 'day' ? 'dusk' : prev === 'dusk' ? 'night' : 'day'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fishingState, handleStartFishing, handleReelIn, handleCollectReward]);

  // Toggle Time of Day for atmospheric relaxation
  const cycleTimeOfDay = () => {
    soundManager.playClick();
    setTimeOfDay((prev) => (prev === 'day' ? 'dusk' : prev === 'dusk' ? 'night' : 'day'));
  };

  // Reset Progress
  const handleResetData = () => {
    if (window.confirm('確定要重新開始釣魚進度嗎？所有金幣、成就手札與圖鑑將恢復初始狀態。')) {
      soundManager.playClick();
      const initial: GameStats = {
        coins: 120,
        totalCatches: 0,
        totalCasts: 0,
        records: {
          blue_fish: { count: 1, maxSize: 18.4, firstCaughtAt: Date.now() },
        },
        unlockedBadges: [],
        achievements: {},
      };
      setStats(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  };

  // Calculate unclaimed achievements count for notification badge
  const unclaimedAchievementCount = ACHIEVEMENTS.filter((ach) => {
    const record = stats.achievements?.[ach.id];
    const { isReady } = getAchievementProgress(ach, stats);
    return (record?.unlockedAt || isReady) && !record?.claimed;
  }).length;

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between font-pixel bg-[#162032] select-none">
      {/* =========================================================================
          BACKGROUND / CENTRAL SCENE (Full Lake Scene)
          As requested: Clean, full view with animated water, dock, and angler.
         ========================================================================= */}
      <div className="absolute inset-0 z-0">
        <FishingScene
          fishingState={fishingState}
          onBobberClick={handleLakeInteraction}
          timeOfDay={timeOfDay}
        />
      </div>

      {/* =========================================================================
          TOP BAR HEADER (Left: Wooden Sign, Center: Coins, Right: Encyclopedia & Achievements)
         ========================================================================= */}
      <header className="relative z-30 w-full px-3 sm:px-6 pt-3 sm:pt-4 flex items-start justify-between pointer-events-none">
        {/* Left: Wooden Board Sign "像素悠閒 釣魚日" */}
        <div className="pointer-events-auto flex flex-col items-center animate-[float-gentle_6s_ease-in-out_infinite]">
          {/* Two hanging ropes attached to top edge */}
          <div className="w-40 sm:w-52 flex justify-between px-6 -mb-1 z-10 pointer-events-none">
            <div className="w-1.5 h-4 bg-[#4a2e16] border border-[#281508]" />
            <div className="w-1.5 h-4 bg-[#4a2e16] border border-[#281508]" />
          </div>

          {/* Wooden Sign Board */}
          <div className="pixel-plank-sign rounded-md px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2.5 sm:gap-3.5 shadow-xl hover:brightness-105 transition">
            {/* Leaping Blue Fish with Water Splashes */}
            <div className="relative w-8 sm:w-10 h-7 sm:h-9 flex items-center justify-center">
              <PixelFish fishId="blue_fish" size={34} animated={true} />
              {/* Pixel water droplets */}
              <div className="absolute -bottom-1 -right-1 text-cyan-200 text-[10px] animate-pulse">💧</div>
              <div className="absolute top-0 -left-1 text-cyan-200 text-[8px] animate-ping">✦</div>
            </div>

            {/* Game Title */}
            <div className="flex flex-col leading-tight">
              <div className="text-white text-xs sm:text-sm font-black tracking-wider drop-shadow-[0_2px_0_#2b1809]">
                像素悠閒
              </div>
              <div className="text-amber-100 text-base sm:text-xl font-black tracking-widest drop-shadow-[0_2px_0_#2b1809] -mt-0.5">
                釣魚日
              </div>
            </div>
          </div>
        </div>

        {/* Center: Coin Counter (Golden Coin + Balance) */}
        <div className="pointer-events-auto relative flex flex-col items-center">
          <div className="bg-[#241a13]/90 border-3 border-[#6b4728] px-4 sm:px-6 py-2 rounded-2xl shadow-[0_4px_0_#140c06,0_6px_12px_rgba(0,0,0,0.4)] flex items-center gap-2.5 sm:gap-3 backdrop-blur-xs">
            {/* Spinning/Gleaming Golden Pixel Coin */}
            <div className="relative w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-gradient-to-tr from-[#d97706] via-[#fbbf24] to-[#fef08a] border-2 border-[#78350f] shadow-inner flex items-center justify-center animate-[pulse_2s_infinite]">
              <span className="text-amber-950 font-black text-xs sm:text-sm">🪙</span>
              <div className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-white/70 rounded-full" />
            </div>

            {/* Coin Amount */}
            <span className="text-amber-300 font-retro-num text-lg sm:text-2xl font-black tracking-wider drop-shadow-[0_2px_0_#451a03]">
              {stats.coins.toLocaleString()}
            </span>
          </div>

          {/* Floating Coin Gain Animation */}
          {floatingCoinText && (
            <div className="absolute -bottom-7 font-retro-num text-amber-300 font-black text-sm sm:text-base animate-[bounce_0.8s_infinite] drop-shadow-[0_2px_0_#78350f]">
              🪙 {floatingCoinText}
            </div>
          )}
        </div>

        {/* Right: Achievements, Fish Encyclopedia & Setting Toggles */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5">
          {/* Quick atmosphere time toggle */}
          <button
            onClick={cycleTimeOfDay}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2b3a55]/85 hover:bg-[#394c6f] border-2 border-[#162133] shadow-[0_3px_0_#0f1725] text-amber-200 flex items-center justify-center cursor-pointer transition active:translate-y-0.5"
            title={`切換時間 (${timeOfDay === 'day' ? '白天' : timeOfDay === 'dusk' ? '黃昏' : '夜晚'}) [按 D]`}
          >
            {timeOfDay === 'day' ? (
              <Sun size={18} className="text-amber-300" />
            ) : timeOfDay === 'dusk' ? (
              <Sunset size={18} className="text-orange-400" />
            ) : (
              <Moon size={18} className="text-cyan-200" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const muted = soundManager.toggleMute();
              setIsMuted(muted);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2b3a55]/85 hover:bg-[#394c6f] border-2 border-[#162133] shadow-[0_3px_0_#0f1725] text-slate-200 flex items-center justify-center cursor-pointer transition active:translate-y-0.5"
            title={isMuted ? '開啟音效 [按 M]' : '靜音 [按 M]'}
          >
            {isMuted ? <VolumeX size={18} className="text-rose-400" /> : <Volume2 size={18} className="text-emerald-400" />}
          </button>

          {/* Reset progress (subtle) */}
          <button
            onClick={handleResetData}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2b3a55]/85 hover:bg-[#394c6f] border-2 border-[#162133] shadow-[0_3px_0_#0f1725] text-slate-400 hover:text-rose-300 flex items-center justify-center cursor-pointer transition active:translate-y-0.5"
            title="重設遊戲進度"
          >
            <RotateCcw size={15} />
          </button>

          {/* "🏆 成就手札" Top Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsAchievementDrawerOpen((prev) => !prev);
            }}
            className="relative px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-b from-[#8c5225] to-[#693915] border-3 border-[#3b1d07] shadow-[0_4px_0_#241003,0_6px_12px_rgba(0,0,0,0.3)] hover:brightness-110 active:translate-y-1 active:shadow-[0_1px_0_#241003] transition flex items-center gap-1.5 text-amber-100 font-black text-sm sm:text-base cursor-pointer"
            title="開啟成就任務抽屜 [按 A]"
          >
            <Trophy size={18} className="text-amber-300" />
            <span className="tracking-wider drop-shadow-[0_1px_0_#241003] hidden sm:inline">成就</span>

            {/* Notification badge when rewards are ready to claim */}
            {unclaimedAchievementCount > 0 && (
              <span className="w-4 h-4 bg-amber-400 text-amber-950 rounded-full text-[10px] font-black flex items-center justify-center animate-bounce -ml-0.5">
                {unclaimedAchievementCount}
              </span>
            )}
          </button>

          {/* "📖 魚類圖鑑" Button matching mockup */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsEncyclopediaOpen(true);
              setHasNewEncyclopediaEntry(false);
            }}
            className="relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-b from-[#3b537d] to-[#253654] border-3 border-[#162238] shadow-[0_4px_0_#0f1726,0_6px_12px_rgba(0,0,0,0.3)] hover:brightness-110 active:translate-y-1 active:shadow-[0_1px_0_#0f1726] transition flex items-center gap-2 text-white font-black text-sm sm:text-base cursor-pointer"
            title="開啟魚類圖鑑 [按 B]"
          >
            {/* Book Icon */}
            <span className="text-lg sm:text-xl">📖</span>
            <span className="tracking-wider drop-shadow-[0_1px_0_#0f1726]">魚類圖鑑</span>

            {/* Notification badge when new fish discovered */}
            {hasNewEncyclopediaEntry && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center animate-ping" />
            )}
            {hasNewEncyclopediaEntry && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                !
              </span>
            )}
          </button>
        </div>
      </header>

      {/* =========================================================================
          RIGHT SIDE DRAWER TOGGLE TAB BUTTON (Lake Edge Ribbon)
          As chosen: Side drawer easily accessible along the lake edge!
         ========================================================================= */}
      <button
        onClick={() => {
          soundManager.playClick();
          setIsAchievementDrawerOpen((prev) => !prev);
        }}
        className="fixed top-1/2 right-0 -translate-y-1/2 z-30 bg-gradient-to-b from-[#8c5225] to-[#5a2e10] hover:brightness-110 border-l-3 border-y-3 border-[#3c2410] shadow-[-5px_5px_15px_rgba(0,0,0,0.4)] px-2 sm:px-2.5 py-4 rounded-l-2xl text-amber-100 flex flex-col items-center gap-1.5 cursor-pointer active:translate-x-1 transition select-none group"
        title="開啟成就任務抽屜 [按 A]"
      >
        <Trophy size={18} className="text-amber-300 group-hover:scale-115 transition-transform" />
        <span className="text-xs font-bold [writing-mode:vertical-rl] tracking-widest text-amber-100 drop-shadow-[0_1px_0_#000]">
          成就任務
        </span>
        {unclaimedAchievementCount > 0 && (
          <span className="w-5 h-5 bg-gradient-to-b from-amber-300 to-amber-500 text-amber-950 rounded-full text-[10px] font-black flex items-center justify-center border border-amber-800 shadow-sm animate-bounce -mt-0.5">
            {unclaimedAchievementCount}
          </span>
        )}
      </button>

      {/* =========================================================================
          BOTTOM CONTROL BAR (Start Fishing & Reel In Buttons)
         ========================================================================= */}
      <footer className="relative z-30 w-full px-4 sm:px-6 pb-4 sm:pb-6 flex flex-col items-center gap-2.5 pointer-events-none">
        {/* Dynamic Helpful Status Toast / Hint */}
        <div className="pointer-events-auto bg-[#1b263b]/85 border-2 border-[#415a77] text-amber-100 text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-md backdrop-blur-xs flex items-center gap-2 animate-[fadeIn_0.2s]">
          <Sparkles size={14} className="text-amber-400" />
          <span>{hintMessage}</span>
          <span className="hidden sm:inline text-slate-400 text-[11px]">(空白鍵快速操作)</span>
        </div>

        {/* The Action Buttons: 開始釣魚 & 收竿 */}
        <div className="pointer-events-auto flex items-center justify-center gap-4 sm:gap-6">
          {/* 1. 開始釣魚 (Start Fishing Button) */}
          <button
            onClick={handleStartFishing}
            disabled={fishingState !== 'idle'}
            className={`min-w-[140px] sm:min-w-[180px] py-3 sm:py-3.5 px-5 sm:px-7 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 cursor-pointer border-3 transition ${
              fishingState === 'idle'
                ? 'pixel-btn-blue text-white border-[#1e3455] hover:brightness-105 active:scale-98 animate-[pulse_3s_infinite]'
                : 'pixel-btn-disabled text-slate-300 border-[#334155]'
            }`}
            title="拋出魚線，開始釣魚 [空白鍵]"
          >
            {/* Fishing Hook Icon */}
            <span className="text-xl sm:text-2xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">🎣</span>
            <span className="tracking-wider drop-shadow-[0_2px_0_#142442]">開始釣魚</span>
          </button>

          {/* 2. 收竿 (Reel In Button) */}
          <button
            onClick={handleReelIn}
            disabled={fishingState === 'idle' || fishingState === 'escaped' || fishingState === 'caught'}
            className={`min-w-[140px] sm:min-w-[180px] py-3 sm:py-3.5 px-5 sm:px-7 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 cursor-pointer border-3 transition ${
              fishingState === 'biting'
                ? 'bg-gradient-to-b from-[#eab308] to-[#ca8a04] text-amber-950 border-[#713f12] pixel-btn-active-bite'
                : fishingState === 'waiting'
                ? 'bg-gradient-to-b from-[#64748b] to-[#475569] text-white border-[#1e293b] hover:brightness-105 shadow-[0_4px_0_#0f172a]'
                : 'pixel-btn-disabled text-slate-300 border-[#334155]'
            }`}
            title="收回魚線 [空白鍵]"
          >
            {/* Rod / Reel Icon */}
            <span className="text-xl sm:text-2xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              {fishingState === 'biting' ? '💥' : '🎣'}
            </span>
            <span
              className={`tracking-wider ${
                fishingState === 'biting' ? 'drop-shadow-[0_1px_0_#fef08a] font-black' : 'drop-shadow-[0_2px_0_#1e293b]'
              }`}
            >
              {fishingState === 'biting' ? '快收竿！' : '收竿'}
            </span>
          </button>
        </div>
      </footer>

      {/* =========================================================================
          CATCH RESULT MODAL
          Displays as a popup window only when a fish is caught!
         ========================================================================= */}
      <CatchResultModal
        result={currentCatch}
        onCollect={handleCollectReward}
      />

      {/* =========================================================================
          ACHIEVEMENT TOAST (Dynamic notification sliding from top center)
         ========================================================================= */}
      <AchievementToast
        achievement={activeAchievementToast}
        onClose={() => setActiveAchievementToast(null)}
        onOpenDrawer={() => setIsAchievementDrawerOpen(true)}
      />

      {/* =========================================================================
          ACHIEVEMENT DRAWER (Side Drawer along the lake edge)
         ========================================================================= */}
      <AchievementDrawer
        isOpen={isAchievementDrawerOpen}
        onClose={() => setIsAchievementDrawerOpen(false)}
        stats={stats}
        onClaimReward={handleClaimAchievementReward}
      />

      {/* =========================================================================
          FISH ENCYCLOPEDIA MODAL
         ========================================================================= */}
      <FishEncyclopedia
        isOpen={isEncyclopediaOpen}
        onClose={() => setIsEncyclopediaOpen(false)}
        stats={stats}
      />
    </div>
  );
}

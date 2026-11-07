import { AchievementDefinition, GameStats } from '../types/game';
import { FISH_LIST } from './fishData';

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_cast',
    title: '初次下竿',
    description: '第一次將釣線與浮標拋入寧靜湖水中。',
    icon: '🎣',
    rewardCoins: 20,
    targetCount: 1,
  },
  {
    id: 'first_catch',
    title: '開張大吉',
    description: '成功釣起湖中的第一隻魚！',
    icon: '🐟',
    rewardCoins: 30,
    targetCount: 1,
  },
  {
    id: 'novice_angler',
    title: '釣魚新手',
    description: '享受垂釣樂趣，累積釣獲 5 隻魚。',
    icon: '🪣',
    rewardCoins: 50,
    targetCount: 5,
  },
  {
    id: 'skilled_angler',
    title: '熟練釣客',
    description: '技術純熟的湖畔達人，累積釣獲 20 隻魚。',
    icon: '🎖️',
    rewardCoins: 100,
    targetCount: 20,
  },
  {
    id: 'carp_master',
    title: '錦鯉報喜',
    description: '成功釣獲充滿喜氣的「橘色鯉魚」。',
    icon: '🎏',
    rewardCoins: 40,
    targetCount: 1,
  },
  {
    id: 'puffer_expert',
    title: '圓滾滾專家',
    description: '成功釣獲稀有且圓滾可愛的「黃色河豚」。',
    icon: '🐡',
    rewardCoins: 60,
    targetCount: 1,
  },
  {
    id: 'twilight_seeker',
    title: '暮光探尋者',
    description: '成功釣獲散發神秘紫光的「紫色魚」。',
    icon: '🔮',
    rewardCoins: 80,
    targetCount: 1,
  },
  {
    id: 'golden_legend',
    title: '黃金傳奇',
    description: '萬中選一！成功釣起傳說中的超稀有「黃金魚」！',
    icon: '👑',
    rewardCoins: 200,
    targetCount: 1,
  },
  {
    id: 'rich_angler',
    title: '小有所成',
    description: '累積財富，目前金幣總數達到 500 枚。',
    icon: '💰',
    rewardCoins: 100,
    targetCount: 500,
  },
  {
    id: 'encyclopedia_master',
    title: '圖鑑大師',
    description: '將湖畔所有的 5 種魚類全數收錄至圖鑑中！',
    icon: '📖',
    rewardCoins: 300,
    targetCount: 5,
  },
];

/**
 * Calculates current progress for a given achievement based on GameStats.
 */
export function getAchievementProgress(achievement: AchievementDefinition, stats: GameStats): { current: number; max: number; isReady: boolean } {
  const max = achievement.targetCount;
  let current = 0;

  switch (achievement.id) {
    case 'first_cast':
      current = Math.min((stats.totalCasts || 0), max);
      break;
    case 'first_catch':
      current = Math.min((stats.totalCatches || 0), max);
      break;
    case 'novice_angler':
    case 'skilled_angler':
      current = Math.min((stats.totalCatches || 0), max);
      break;
    case 'carp_master':
      current = (stats.records['orange_carp']?.count || 0) > 0 ? 1 : 0;
      break;
    case 'puffer_expert':
      current = (stats.records['yellow_puffer']?.count || 0) > 0 ? 1 : 0;
      break;
    case 'twilight_seeker':
      current = (stats.records['purple_fish']?.count || 0) > 0 ? 1 : 0;
      break;
    case 'golden_legend':
      current = (stats.records['golden_fish']?.count || 0) > 0 ? 1 : 0;
      break;
    case 'rich_angler':
      current = Math.min(stats.coins || 0, max);
      break;
    case 'encyclopedia_master': {
      const caughtCount = FISH_LIST.filter(f => (stats.records[f.id]?.count || 0) > 0).length;
      current = Math.min(caughtCount, max);
      break;
    }
    default:
      current = 0;
  }

  return {
    current,
    max,
    isReady: current >= max,
  };
}

/**
 * Evaluates all achievements and returns any newly unlocked achievements that haven't been recorded yet.
 */
export function checkNewlyUnlockedAchievements(stats: GameStats): AchievementDefinition[] {
  const newlyUnlocked: AchievementDefinition[] = [];

  for (const ach of ACHIEVEMENTS) {
    const existing = stats.achievements?.[ach.id];
    // If not already recorded as unlocked
    if (!existing) {
      const { isReady } = getAchievementProgress(ach, stats);
      if (isReady) {
        newlyUnlocked.push(ach);
      }
    }
  }

  return newlyUnlocked;
}

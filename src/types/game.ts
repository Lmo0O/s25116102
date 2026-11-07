export type FishRarity = 'common' | 'rare' | 'super_rare';

export interface FishDefinition {
  id: string;
  name: string;
  englishName: string;
  rarity: FishRarity;
  rarityLabel: string;
  coins: number;
  description: string;
  catchChance: number; // probability weight
  minSize: number; // in cm
  maxSize: number;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  primaryColor: string;
  accentColor: string;
}

export interface CaughtRecord {
  count: number;
  maxSize: number;
  firstCaughtAt: number; // timestamp
}

export interface CatchResult {
  fish: FishDefinition;
  size: number;
  isNew: boolean;
  isNewRecord: boolean;
  timestamp: number;
}

export type FishingState =
  | 'idle'      // Character waiting on dock
  | 'casting'   // Rod swinging forward, bobber flying
  | 'waiting'   // Bobber in water, waiting for fish to bite
  | 'biting'    // Exclamation mark, "有魚上鉤了！", player must reel in
  | 'reeling'   // Pulling fish up
  | 'caught'    // Fish modal open
  | 'escaped';  // Fish got away (too late)

export interface AchievementRecord {
  unlockedAt: number;
  claimed: boolean;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCoins: number;
  targetCount: number;
}

export interface GameStats {
  coins: number;
  totalCatches: number;
  totalCasts: number;
  records: Record<string, CaughtRecord>;
  unlockedBadges: string[];
  achievements: Record<string, AchievementRecord>;
}

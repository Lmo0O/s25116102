import { FishDefinition } from '../types/game';

export const FISH_LIST: FishDefinition[] = [
  {
    id: 'blue_fish',
    name: '小藍魚',
    englishName: 'Blue Perch',
    rarity: 'common',
    rarityLabel: '普通',
    coins: 10,
    description: '小湖中最常見的活潑小魚，湛藍的鱗片在陽光下閃爍著水波的光彩，性情溫馴討喜。',
    catchChance: 36,
    minSize: 12.5,
    maxSize: 22.0,
    badgeBg: 'bg-[#5b8ea9]',
    badgeText: 'text-white',
    badgeBorder: 'border-[#3f677d]',
    primaryColor: '#3b82f6',
    accentColor: '#93c5fd',
  },
  {
    id: 'orange_carp',
    name: '橘色鯉魚',
    englishName: 'Orange Carp',
    rarity: 'common',
    rarityLabel: '普通',
    coins: 15,
    description: '象徵吉祥與好運的亮橘色鯉魚，擺動尾鰭時非常敏捷，喜歡在荷葉與岸邊岩石旁游弋。',
    catchChance: 30,
    minSize: 20.0,
    maxSize: 38.5,
    badgeBg: 'bg-[#5b8ea9]',
    badgeText: 'text-white',
    badgeBorder: 'border-[#3f677d]',
    primaryColor: '#f97316',
    accentColor: '#fed7aa',
  },
  {
    id: 'yellow_puffer',
    name: '黃色河豚',
    englishName: 'Yellow Pufferfish',
    rarity: 'rare',
    rarityLabel: '稀有',
    coins: 30,
    description: '圓滾滾的黃色小河豚，一受驚嚇就會把自己鼓成氣球模樣，是湖畔最受歡迎的療癒小明星。',
    catchChance: 18,
    minSize: 15.0,
    maxSize: 28.0,
    badgeBg: 'bg-[#9365c7]',
    badgeText: 'text-white',
    badgeBorder: 'border-[#694294]',
    primaryColor: '#eab308',
    accentColor: '#fef08a',
  },
  {
    id: 'purple_fish',
    name: '紫色魚',
    englishName: 'Twilight Violet Fish',
    rarity: 'rare',
    rarityLabel: '稀有',
    coins: 40,
    description: '帶著微弱夢幻紫光的神秘深水魚，唯有在微風徐徐、湖面如鏡的平靜時刻才有機會偶遇。',
    catchChance: 11,
    minSize: 26.0,
    maxSize: 45.0,
    badgeBg: 'bg-[#9365c7]',
    badgeText: 'text-white',
    badgeBorder: 'border-[#694294]',
    primaryColor: '#a855f7',
    accentColor: '#e9d5ff',
  },
  {
    id: 'golden_fish',
    name: '黃金魚',
    englishName: 'Legendary Golden Fish',
    rarity: 'super_rare',
    rarityLabel: '超稀有',
    coins: 100,
    description: '傳說中萬年難得一遇的黃金神魚！通體宛如純金鑄造，據說只要釣起牠就能帶來一整年的無盡好運！',
    catchChance: 5,
    minSize: 42.0,
    maxSize: 72.0,
    badgeBg: 'bg-gradient-to-r from-[#d97706] to-[#fbbf24]',
    badgeText: 'text-amber-950 font-bold',
    badgeBorder: 'border-[#b45309]',
    primaryColor: '#f59e0b',
    accentColor: '#fef3c7',
  },
];

export function getRandomFish(): FishDefinition {
  const totalWeight = FISH_LIST.reduce((sum, f) => sum + f.catchChance, 0);
  let randomVal = Math.random() * totalWeight;

  for (const fish of FISH_LIST) {
    if (randomVal < fish.catchChance) {
      return fish;
    }
    randomVal -= fish.catchChance;
  }
  return FISH_LIST[0];
}

export function generateFishSize(fish: FishDefinition): number {
  const variance = Math.random() * (fish.maxSize - fish.minSize);
  const size = fish.minSize + variance;
  return Math.round(size * 10) / 10;
}

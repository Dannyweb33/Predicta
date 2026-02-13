export type MarketStatus = 'active' | 'closed' | 'resolved';

export type MarketCategory = 
  | 'ecosystem'
  | 'governance'
  | 'technology'
  | 'partnerships'
  | 'tokenomics'
  | 'other';

export interface Market {
  id: number;
  question: string;
  deadline: number; // Unix timestamp
  totalYes: number;
  totalNo: number;
  status: MarketStatus;
  outcome: boolean | null; // true = YES won, false = NO won, null = not resolved
  createdAt: number; // Unix timestamp
  category?: MarketCategory;
}

export interface UserPosition {
  marketId: number;
  side: 'yes' | 'no';
  amount: number;
  potentialPayout?: number;
}

export interface LeaderboardEntry {
  address: string;
  totalWinnings: number;
  marketsParticipated: number;
  winRate: number;
}

/**
 * Format USDC amount for display
 */
export function formatUSDC(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Calculate implied odds from market totals
 */
export function getImpliedOdds(totalYes: number, totalNo: number): {
  yes: number;
  no: number;
} {
  const total = totalYes + totalNo;
  if (total === 0) {
    return { yes: 50, no: 50 };
  }
  
  return {
    yes: Math.round((totalYes / total) * 100),
    no: Math.round((totalNo / total) * 100),
  };
}

/**
 * Get category label for display
 */
export function getCategoryLabel(category?: MarketCategory): string {
  const labels: Record<MarketCategory, string> = {
    ecosystem: 'Ecosystem',
    governance: 'Governance',
    technology: 'Technology',
    partnerships: 'Partnerships',
    tokenomics: 'Tokenomics',
    other: 'Other',
  };
  
  return category ? labels[category] : 'Other';
}

/**
 * Extract category from question if it has [CATEGORY] prefix
 */
export function extractCategory(question: string): MarketCategory {
  const match = question.match(/^\[(\w+)\]\s*(.+)$/);
  if (match) {
    const category = match[1].toLowerCase() as MarketCategory;
    if (['ecosystem', 'governance', 'technology', 'partnerships', 'tokenomics', 'other'].includes(category)) {
      return category;
    }
  }
  return 'other';
}

/**
 * Remove category prefix from question
 */
export function removeCategoryPrefix(question: string): string {
  return question.replace(/^\[\w+\]\s*/, '');
}

/**
 * Get badge label for leaderboard
 */
export function getBadgeLabel(badge: 'whale' | 'shark' | 'dolphin' | 'minnow'): string {
  const labels: Record<'whale' | 'shark' | 'dolphin' | 'minnow', string> = {
    whale: 'Whale',
    shark: 'Shark',
    dolphin: 'Dolphin',
    minnow: 'Minnow',
  };
  return labels[badge];
}

/**
 * Get badge color classes for leaderboard
 */
export function getBadgeColor(badge: 'whale' | 'shark' | 'dolphin' | 'minnow'): string {
  const colors: Record<'whale' | 'shark' | 'dolphin' | 'minnow', string> = {
    whale: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    shark: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dolphin: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    minnow: 'bg-green-500/10 text-green-400 border-green-500/20',
  };
  return colors[badge];
}

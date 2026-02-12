import { useAllMarkets } from './useMarkets';

export interface LeaderboardEntry {
  address: string;
  rank: number;
  totalProfit: number;
  winRate: number;
  totalBets: number;
  wonBets: number;
  volume: number;
  streak: number;
  badge?: 'whale' | 'shark' | 'dolphin' | 'minnow';
}

// Alternative: Calculate leaderboard from resolved markets only
export function useLeaderboardFromMarkets() {
  const { markets } = useAllMarkets();
  const resolvedMarkets = markets.filter((m) => m.status === 'resolved' && m.outcome !== undefined);

  // This is a simplified version - in production you'd need to track all bets via events
  // For now, we'll return an empty leaderboard since we can't efficiently get all users
  // To implement a full leaderboard, you would need:
  // 1. Events in the contract to track all bets
  // 2. A mapping in the contract to track all users
  // 3. Or use The Graph or similar indexing service
  
  const entries: LeaderboardEntry[] = [];

  return {
    entries,
    isLoading: false,
  };
}

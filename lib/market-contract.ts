import type { Market, MarketStatus } from './market-data';
import { extractCategory } from './market-data';

/**
 * On-chain market data structure (matches Solidity struct)
 */
export interface OnChainMarket {
  id: bigint;
  question: string;
  deadline: bigint;
  totalYes: bigint;
  totalNo: bigint;
  status: 0 | 1 | 2; // 0 = Active, 1 = Closed, 2 = Resolved
  outcome: boolean;
  createdAt: bigint;
}

/**
 * Convert on-chain market data to app Market type
 */
export function onChainMarketToMarket(onChainMarket: OnChainMarket): Market {
  const statusMap: Record<0 | 1 | 2, MarketStatus> = {
    0: 'active',
    1: 'closed',
    2: 'resolved',
  };

  const category = extractCategory(onChainMarket.question);
  const question = onChainMarket.question.replace(/^\[\w+\]\s*/, '');

  return {
    id: Number(onChainMarket.id),
    question,
    deadline: Number(onChainMarket.deadline),
    totalYes: Number(onChainMarket.totalYes) / 1e6, // Convert from 6 decimals
    totalNo: Number(onChainMarket.totalNo) / 1e6, // Convert from 6 decimals
    status: statusMap[onChainMarket.status],
    outcome: onChainMarket.status === 2 ? onChainMarket.outcome : null,
    createdAt: Number(onChainMarket.createdAt),
    category,
  };
}

import { useAccount } from 'wagmi';
import { useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { ARC_SIGNAL_MARKET_ABI, getContractAddresses, isContractConfigured } from '@/lib/contracts';
import { useMarketCount, useAllMarkets } from './useMarkets';
import type { UserPosition } from '@/lib/market-data';

export function useUserPositions() {
  const { address } = useAccount();
  const { market } = getContractAddresses();
  const configured = isContractConfigured();
  const { count } = useMarketCount();
  const { markets } = useAllMarkets();

  // Buscar todos os market IDs do usuário
  const { data: userMarketsData, isLoading } = useReadContracts({
    contracts: address && count > 0 && configured
      ? Array.from({ length: count }, (_, i) => ({
          address: market,
          abi: ARC_SIGNAL_MARKET_ABI,
          functionName: 'getUserPosition' as const,
          args: [address!, BigInt(i)],
        }))
      : [],
    query: {
      enabled: !!address && count > 0 && configured,
    },
  });

  // Processar posições
  const positions: UserPosition[] = [];
  
  if (userMarketsData && address) {
    userMarketsData.forEach((resultItem, index) => {
      // Handle both formats: {data: ...} or {result: ..., status: ...}
      const data = (resultItem as any).data || (resultItem as any).result;
      const error = (resultItem as any).error;
      
      if (data && !error) {
        const position = data as {
          marketId: bigint;
          side: 0 | 1;
          amount: bigint;
          timestamp: bigint;
        };
        
        if (position.amount > 0n) {
          const marketId = Number(position.marketId);
          const marketData = markets.find((m) => m.id === marketId);
          
          // Calcular payout potencial baseado no mercado atual
          let potentialPayout = Number(formatUnits(position.amount, 6));
          if (marketData) {
            const totalPool = marketData.totalYes + marketData.totalNo;
            const userPool = position.side === 0 ? marketData.totalYes : marketData.totalNo;
            if (userPool > 0 && totalPool > 0) {
              potentialPayout = (Number(formatUnits(position.amount, 6)) * totalPool) / userPool;
            }
          }
          
          positions.push({
            marketId,
            side: position.side === 0 ? 'yes' : 'no',
            amount: Number(formatUnits(position.amount, 6)),
            potentialPayout,
          });
        }
      }
    });
  }

  return {
    positions,
    isLoading: isLoading || !configured,
  };
}

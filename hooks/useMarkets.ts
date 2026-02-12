import React from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { ARC_SIGNAL_MARKET_ABI, getContractAddresses } from '@/lib/contracts';
import { onChainMarketToMarket, type OnChainMarket } from '@/lib/market-contract';
import type { Market } from '@/lib/market-data';
import { isContractConfigured } from '@/lib/contracts';

export function useMarketCount() {
  const { market } = getContractAddresses();
  const configured = isContractConfigured();

  const { data: count, refetch: refetchCount } = useReadContract({
    address: market,
    abi: ARC_SIGNAL_MARKET_ABI,
    functionName: 'marketCounter',
    query: {
      enabled: configured,
      refetchInterval: 30000, // Refetch every 30 seconds (reduced to avoid 429)
    },
  });

  return {
    count: count ? Number(count) : 0,
    refetchCount,
  };
}

export function useAllMarkets() {
  const { market } = getContractAddresses();
  const configured = isContractConfigured();
  const { count, refetchCount } = useMarketCount();

  // Criar array de IDs de mercado - usar useMemo para recalcular quando count muda
  const marketIds = React.useMemo(
    () => Array.from({ length: count }, (_, i) => BigInt(i)),
    [count]
  );

  // Buscar todos os mercados em paralelo - usar useMemo para recalcular quando count muda
  const contracts = React.useMemo(
    () =>
      marketIds.map((marketId) => ({
        address: market,
        abi: ARC_SIGNAL_MARKET_ABI,
        functionName: 'getMarket' as const,
        args: [marketId],
      })),
    [marketIds, market]
  );

  const { data: marketsData, isLoading, refetch, error: marketsError } = useReadContracts({
    contracts: contracts.length > 0 && configured ? contracts : [],
    query: {
      enabled: count > 0 && configured,
      refetchInterval: 30000, // Refetch every 30 seconds (reduced to avoid 429)
      staleTime: 0,
    },
  });

  // Log errors
  React.useEffect(() => {
    if (marketsError) {
      console.error('Error loading markets:', marketsError);
    }
  }, [marketsError]);

  // Log contracts array when it changes
  React.useEffect(() => {
    if (contracts.length > 0) {
      console.log('Contracts to fetch:', contracts.length, contracts);
    }
  }, [contracts]);

  const markets: Market[] = React.useMemo(
    () => {
      if (!marketsData) {
        console.log('No marketsData yet');
        return [];
      }
      
      console.log('Raw marketsData:', marketsData);
      console.log('MarketsData length:', marketsData.length);
      
      return marketsData
        .map((resultItem, index) => {
          // useReadContracts can return either {data: {...}, error: ...} or {result: {...}, status: 'success'}
          // Try both formats
          const data = (resultItem as any).data || (resultItem as any).result;
          const status = (resultItem as any).status;
          const error = (resultItem as any).error;
          
          // Check for errors first
          if (error || status === 'error') {
            console.error(`Error loading market ${marketIds[index]}:`, error || 'Unknown error');
            return null;
          }
          
          // Check if data exists
          if (!data) {
            console.warn(`No data for market ${marketIds[index]}. Full resultItem:`, resultItem);
            return null;
          }
          
          try {
            console.log(`Market ${marketIds[index]} raw data:`, data);
            console.log(`Market ${marketIds[index]} data type:`, typeof data);
            
            // Handle tuple return type - viem returns tuples as arrays
            let onChainMarket: OnChainMarket;
            
            if (Array.isArray(data)) {
              // If it's an array (tuple), map it to the struct
              const [
                id,
                question,
                deadline,
                totalYes,
                totalNo,
                status,
                outcome,
                createdAt
              ] = data;
              
              onChainMarket = {
                id: BigInt(id),
                question: String(question),
                deadline: BigInt(deadline),
                totalYes: BigInt(totalYes),
                totalNo: BigInt(totalNo),
                status: Number(status) as 0 | 1 | 2,
                outcome: Boolean(outcome),
                createdAt: BigInt(createdAt),
              };
            } else if (data && typeof data === 'object') {
              // If it's already an object, use it directly
              onChainMarket = data as unknown as OnChainMarket;
            } else {
              console.error(`Invalid data format for market ${marketIds[index]}:`, data);
              return null;
            }
            
            // Validate the data structure
            if (!onChainMarket || typeof onChainMarket !== 'object') {
              console.error(`Invalid market data for ${marketIds[index]}:`, onChainMarket);
              return null;
            }
            
            const market = onChainMarketToMarket({
              ...onChainMarket,
              id: marketIds[index],
            });
            
            console.log(`✅ Successfully loaded market ${marketIds[index]}:`, market);
            return market;
          } catch (error) {
            console.error(`❌ Error processing market ${marketIds[index]}:`, error);
            console.error('Data:', data);
            return null;
          }
        })
        .filter((m): m is Market => m !== null);
    },
    [marketsData, marketIds]
  );

  // Combined refetch function that refetches both count and markets
  const refetchAll = React.useCallback(async () => {
    await refetchCount();
    // Wait a bit for count to update, then refetch markets
    setTimeout(async () => {
      await refetch();
    }, 500);
  }, [refetchCount, refetch]);

  return {
    markets,
    isLoading: isLoading || !configured,
    refetch: refetchAll,
    count,
  };
}

export function useMarketById(marketId: number | null) {
  const { market } = getContractAddresses();
  const configured = isContractConfigured();
  const marketIdBigInt = marketId !== null ? BigInt(marketId) : null;

  const { data: marketData, isLoading, refetch } = useReadContract({
    address: market,
    abi: ARC_SIGNAL_MARKET_ABI,
    functionName: 'getMarket',
    args: marketIdBigInt !== null ? [marketIdBigInt] : undefined,
    query: {
      enabled: marketIdBigInt !== null && configured,
    },
  });

  const marketResult: Market | null = marketData
    ? onChainMarketToMarket(marketData as unknown as OnChainMarket)
    : null;

  return {
    market: marketResult,
    isLoading: isLoading || !configured,
    refetch,
  };
}

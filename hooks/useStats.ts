import { useAllMarkets } from './useMarkets';
import { isContractConfigured } from '@/lib/contracts';

export function useStats() {
  const configured = isContractConfigured();
  const { markets, isLoading } = useAllMarkets();

  const totalVolume = markets.reduce(
    (sum, m) => sum + m.totalYes + m.totalNo,
    0
  );

  const activeMarkets = markets.filter((m) => m.status === 'active').length;

  // TODO: Buscar número de traders únicos do contrato
  const uniqueTraders = 0; // Placeholder - precisa de evento ou mapping no contrato

  const tvlLocked = markets
    .filter((m) => m.status === 'active')
    .reduce((sum, m) => sum + m.totalYes + m.totalNo, 0);

  return {
    totalVolume,
    activeMarkets,
    uniqueTraders,
    tvlLocked,
    isLoading: isLoading || !configured,
  };
}

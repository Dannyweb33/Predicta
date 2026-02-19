import { useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { ARC_SIGNAL_MARKET_ABI, USDC_ABI, getContractAddresses } from '@/lib/contracts';
import { toast } from 'sonner';

export function useMarketContract() {
  const { address } = useAccount();
  const { market, usdc } = getContractAddresses();

  return {
    marketAddress: market,
    usdcAddress: usdc,
  };
}

export function useMarket(marketId: bigint | number | null) {
  const { market, usdc } = getContractAddresses();
  const marketIdBigInt = marketId !== null ? BigInt(Number(marketId)) : null;

  const { data: marketData, refetch: refetchMarket } = useReadContract({
    address: market,
    abi: ARC_SIGNAL_MARKET_ABI,
    functionName: 'getMarket',
    args: marketIdBigInt !== null ? [marketIdBigInt] : undefined,
    query: {
      enabled: marketIdBigInt !== null,
    },
  });

  return {
    market: marketData,
    refetchMarket,
  };
}

export function useUserPosition(marketId: bigint | number | null) {
  const { address } = useAccount();
  const { market } = getContractAddresses();
  const marketIdBigInt = marketId !== null ? BigInt(Number(marketId)) : null;

  const { data: position, refetch: refetchPosition } = useReadContract({
    address: market,
    abi: ARC_SIGNAL_MARKET_ABI,
    functionName: 'getUserPosition',
    args: address && marketIdBigInt !== null ? [address, marketIdBigInt] : undefined,
    query: {
      enabled: !!address && marketIdBigInt !== null,
    },
  });

  return {
    position,
    refetchPosition,
  };
}

export function usePlaceBet() {
  const { market, usdc } = getContractAddresses();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const placeBet = async (marketId: number, side: 0 | 1, amount: string) => {
    try {
      // Convert amount to USDC (6 decimals)
      const amountWei = parseUnits(amount, 6);

      await writeContract({
        address: market,
        abi: ARC_SIGNAL_MARKET_ABI,
        functionName: 'placeBet',
        args: [BigInt(marketId), side, amountWei],
      });
    } catch (err) {
      console.error('Error placing bet:', err);
      toast.error('Failed to place bet');
    }
  };

  return {
    placeBet,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useApproveUSDC() {
  const { usdc } = getContractAddresses();
  const { market } = getContractAddresses();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = async (amount: string) => {
    try {
      const amountWei = parseUnits(amount, 6);
      // Approve max amount for convenience
      const maxApproval = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

      await writeContract({
        address: usdc,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [market, maxApproval],
      });
    } catch (err) {
      console.error('Error approving USDC:', err);
      toast.error('Failed to approve USDC');
    }
  };

  return {
    approve,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useUSDCBalance() {
  const { address } = useAccount();
  const { usdc } = getContractAddresses();

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: usdc,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    balance: balance ? formatUnits(balance, 6) : '0',
    balanceWei: balance,
    refetchBalance,
  };
}

export function useUSDCAllowance() {
  const { address } = useAccount();
  const { usdc, market } = getContractAddresses();

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: usdc,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: address ? [address, market] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    allowance: allowance ? formatUnits(allowance, 6) : '0',
    allowanceWei: allowance,
    refetchAllowance,
  };
}

export function useClaimPayout() {
  const { market } = getContractAddresses();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('Payout claimed successfully!');
      reset();
    }
  }, [isSuccess, hash, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to claim payout');
    }
  }, [error]);

  const claim = async (marketId: number) => {
    try {
      await writeContract({
        address: market,
        abi: ARC_SIGNAL_MARKET_ABI,
        functionName: 'claimPayout',
        args: [BigInt(marketId)],
      });
    } catch (err) {
      console.error('Error claiming payout:', err);
      // Error toast is handled by useEffect above
    }
  };

  return {
    claim,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useCalculatePayout(marketId: bigint | number | null, side: 0 | 1, amount: string) {
  const { market } = getContractAddresses();
  const marketIdBigInt = marketId !== null ? BigInt(Number(marketId)) : null;
  const amountWei = amount ? parseUnits(amount, 6) : BigInt(0);

  const { data: payout } = useReadContract({
    address: market,
    abi: ARC_SIGNAL_MARKET_ABI,
    functionName: 'calculatePayout',
    args: marketIdBigInt !== null && amountWei > 0 ? [marketIdBigInt, side, amountWei] : undefined,
    query: {
      enabled: marketIdBigInt !== null && amountWei > 0,
    },
  });

  return {
    payout: payout ? formatUnits(payout, 6) : '0',
    payoutWei: payout,
  };
}

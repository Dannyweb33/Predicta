import { useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { ARC_SIGNAL_MARKET_ABI, getContractAddresses } from '@/lib/contracts';
import { toast } from 'sonner';
import { useAllMarkets } from './useMarkets';
import { formatQuestionWithCategory } from '@/lib/market-category';
import type { Market } from '@/lib/market-data';

export function useCreateMarket() {
  const { market } = getContractAddresses();
  const { writeContract, data: hash, error, isPending, reset } = useWriteContract();
  const { refetch } = useAllMarkets();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle success
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('Market created successfully!');
      // Wait a bit for the transaction to be indexed, then refetch multiple times
      const refetchWithRetry = async (attempts = 0) => {
        if (attempts < 5) {
          await refetch();
          // If still no markets after 3 seconds, try again
          setTimeout(() => {
            refetchWithRetry(attempts + 1);
          }, 3000);
        }
      };
      setTimeout(() => {
        refetchWithRetry();
      }, 2000);
      reset();
    }
  }, [isSuccess, hash, refetch, reset]);

  // Handle error
  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to create market');
    }
  }, [error]);

  const createMarket = async (question: string, category: Market['category'], deadline: Date) => {
    if (!question.trim()) {
      toast.error('Question cannot be empty');
      return;
    }

    if (!category) {
      toast.error('Category is required');
      return;
    }

    const deadlineTimestamp = Math.floor(deadline.getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);

    if (deadlineTimestamp <= now) {
      toast.error('Deadline must be in the future');
      return;
    }

    // Format question with category tag: [CATEGORY] Question
    const formattedQuestion = formatQuestionWithCategory(question, category);

    try {
      await writeContract({
        address: market,
        abi: ARC_SIGNAL_MARKET_ABI,
        functionName: 'createMarket',
        args: [formattedQuestion, BigInt(deadlineTimestamp)],
      });
    } catch (err) {
      console.error('Error creating market:', err);
    }
  };

  return {
    createMarket,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

export function useIsOwner() {
  const { address } = useAccount();
  const { market } = getContractAddresses();

  const { data: owner } = useReadContract({
    address: market,
    abi: ARC_SIGNAL_MARKET_ABI,
    functionName: 'owner',
  });

  return {
    isOwner: owner && address && owner.toLowerCase() === address.toLowerCase(),
    owner: owner as string | undefined,
  };
}

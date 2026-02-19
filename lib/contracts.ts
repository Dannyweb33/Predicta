import { type Address } from 'viem';

// ArcSignalMarket ABI - includes all functions used in the app
export const ARC_SIGNAL_MARKET_ABI = [
  {
    inputs: [],
    name: 'marketCounter',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'marketId', type: 'uint256' }],
    name: 'getMarket',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'string', name: 'question', type: 'string' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'uint256', name: 'totalYes', type: 'uint256' },
          { internalType: 'uint256', name: 'totalNo', type: 'uint256' },
          { internalType: 'uint8', name: 'status', type: 'uint8' },
          { internalType: 'bool', name: 'outcome', type: 'bool' },
          { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
        ],
        internalType: 'struct ArcSignalMarket.Market',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: 'marketId', type: 'uint256' },
    ],
    name: 'getUserPosition',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'marketId', type: 'uint256' },
          { internalType: 'uint8', name: 'side', type: 'uint8' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
        ],
        internalType: 'struct ArcSignalMarket.Position',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'marketId', type: 'uint256' },
      { internalType: 'uint8', name: 'side', type: 'uint8' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'placeBet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'marketId', type: 'uint256' }],
    name: 'claimPayout',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'marketId', type: 'uint256' },
      { internalType: 'uint8', name: 'side', type: 'uint8' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'calculatePayout',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'question', type: 'string' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    name: 'createMarket',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'marketId', type: 'uint256' },
      { internalType: 'bool', name: 'outcome', type: 'bool' },
    ],
    name: 'resolveMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: 'marketId', type: 'uint256' },
    ],
    name: 'canClaim',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// USDC ABI - Standard ERC20 functions
export const USDC_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

/**
 * Get contract addresses from environment variables
 */
export function getContractAddresses(): {
  market: Address;
  usdc: Address;
} {
  const market = process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as Address;
  const usdc = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as Address;

  // Return zero addresses during SSR/build if not configured
  if (!market || !usdc) {
    return {
      market: '0x0000000000000000000000000000000000000000' as Address,
      usdc: '0x0000000000000000000000000000000000000000' as Address,
    };
  }

  return { market, usdc };
}

/**
 * Check if contracts are configured
 */
export function isContractConfigured(): boolean {
  const market = process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS;
  const usdc = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS;

  return !!(market && usdc && market !== '' && usdc !== '');
}

'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { defineChain } from 'viem';

// Arc Testnet chain definition
const arcTestnet = defineChain({
  id: Number(process.env.NEXT_PUBLIC_ARC_CHAIN_ID || 5042002),
  name: 'Arc Testnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ARC_RPC_URL || 'https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: process.env.NEXT_PUBLIC_ARC_EXPLORER_URL || 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
});

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// Only throw error in runtime, not during build
if (typeof window !== 'undefined' && !projectId) {
  console.error(
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required. Get one at https://cloud.walletconnect.com'
  );
}

export const config = getDefaultConfig({
  appName: 'Predicta',
  projectId: projectId || '00000000000000000000000000000000', // Dummy projectId for build
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http(),
  },
  ssr: false, // Disable SSR to avoid indexedDB issues
});

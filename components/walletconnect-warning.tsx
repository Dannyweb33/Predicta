'use client';

import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function WalletConnectWarning() {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

  if (projectId && projectId !== '00000000000000000000000000000000') {
    return null;
  }

  return (
    <Alert className="mx-auto max-w-7xl mb-4 border-yellow-500/50 bg-yellow-500/10">
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-500">WalletConnect Not Configured</AlertTitle>
      <AlertDescription className="text-yellow-500/80">
        To connect wallets, configure NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your .env.local file.
        <br />
        <a 
          href="https://cloud.walletconnect.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline hover:text-yellow-400"
        >
          Get your Project ID here
        </a>
      </AlertDescription>
    </Alert>
  );
}

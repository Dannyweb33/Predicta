'use client';

import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isContractConfigured } from '@/lib/contracts';

export function ContractWarning() {
  if (isContractConfigured()) {
    return null;
  }

  return (
    <Alert className="mx-auto max-w-7xl mb-4 border-yellow-500/50 bg-yellow-500/10">
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-500">Contracts Not Configured</AlertTitle>
      <AlertDescription className="text-yellow-500/80">
        Please configure NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS and NEXT_PUBLIC_USDC_CONTRACT_ADDRESS
        in your .env.local file. Deploy contracts first using: forge script script/Deploy.s.sol
      </AlertDescription>
    </Alert>
  );
}

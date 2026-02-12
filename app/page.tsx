"use client"

import { useState } from "react"
import { Header, type AppPage } from "@/components/header"
import { StatsBar } from "@/components/stats-bar"
import { MarketList } from "@/components/market-list"
import { PositionsPanel } from "@/components/positions-panel"
import { BetDialog } from "@/components/bet-dialog"
import { PortfolioView } from "@/components/portfolio-view"
import { LeaderboardView } from "@/components/leaderboard-view"
import { ContractWarning } from "@/components/contract-warning"
import { WalletConnectWarning } from "@/components/walletconnect-warning"
import type { Market } from "@/lib/market-data"

export default function Page() {
  const [activePage, setActivePage] = useState<AppPage>("markets")
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSelectMarket = (market: Market) => {
    setSelectedMarket(market)
    setDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activePage={activePage} onNavigate={setActivePage} />

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <WalletConnectWarning />
        <ContractWarning />
        {activePage === "markets" && (
          <>
            <StatsBar />
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
              <MarketList onSelectMarket={handleSelectMarket} />
              <aside className="space-y-4">
                <PositionsPanel />

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                  <h3 className="text-sm font-semibold text-primary">
                    How Predicta Works
                  </h3>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-bold text-primary">
                        1
                      </span>
                      Browse active markets about ARC ecosystem events
                    </li>
                    <li className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-bold text-primary">
                        2
                      </span>
                      Bet USDC on YES or NO outcomes
                    </li>
                    <li className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-bold text-primary">
                        3
                      </span>
                      Claim rewards when the market resolves
                    </li>
                  </ul>
                  <p className="mt-3 text-[10px] text-muted-foreground/70">
                    Powered by Circle USDC with future CCTP bridge support
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}

        {activePage === "portfolio" && <PortfolioView />}

        {activePage === "leaderboard" && <LeaderboardView />}
      </main>

      <BetDialog
        market={selectedMarket}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}

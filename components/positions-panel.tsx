"use client"

import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  MARKETS,
  USER_POSITIONS,
  formatUSDC,
} from "@/lib/market-data"

export function PositionsPanel() {
  const totalBet = USER_POSITIONS.reduce((acc, p) => acc + p.amount, 0)
  const totalPotential = USER_POSITIONS.reduce(
    (acc, p) => acc + p.potentialPayout,
    0
  )

  return (
    <div className="rounded-xl border border-border/50 bg-card">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Your Positions
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {USER_POSITIONS.length} active bets
          </p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total Bet
            </p>
            <p className="font-mono text-sm font-semibold text-foreground">
              {formatUSDC(totalBet)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Potential Return
            </p>
            <p className="font-mono text-sm font-semibold text-accent">
              {formatUSDC(totalPotential)}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border/30">
        {USER_POSITIONS.map((position) => {
          const market = MARKETS.find((m) => m.id === position.marketId)
          if (!market) return null

          const pnl = position.potentialPayout - position.amount
          const pnlPercent = ((pnl / position.amount) * 100).toFixed(1)

          return (
            <div
              key={`${position.marketId}-${position.side}`}
              className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/30"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  position.side === "yes"
                    ? "bg-accent/10 text-accent"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {position.side === "yes" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  {market.question}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] font-semibold ${
                      position.side === "yes"
                        ? "text-accent"
                        : "text-destructive"
                    }`}
                  >
                    {position.side.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatUSDC(position.amount)} USDC
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-mono text-xs font-semibold text-foreground">
                  {formatUSDC(position.potentialPayout)}
                </p>
                <p className="font-mono text-[10px] text-accent">
                  +{pnlPercent}%
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-border/50 px-5 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 gap-1.5"
        >
          View All Positions
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

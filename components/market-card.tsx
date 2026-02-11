"use client"

import { Clock, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  type Market,
  getImpliedOdds,
  formatUSDC,
  getCategoryLabel,
} from "@/lib/market-data"

interface MarketCardProps {
  market: Market
  onSelect: (market: Market) => void
}

export function MarketCard({ market, onSelect }: MarketCardProps) {
  const odds = getImpliedOdds(market.totalYes, market.totalNo)
  const totalPool = market.totalYes + market.totalNo
  const yesPercent = totalPool > 0 ? (market.totalYes / totalPool) * 100 : 50

  const deadlineDate = new Date(market.deadline)
  const now = new Date()
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
  )

  return (
    <button
      type="button"
      onClick={() => onSelect(market)}
      className="group w-full text-left rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-border bg-secondary text-muted-foreground text-[10px] px-1.5 py-0"
          >
            {getCategoryLabel(market.category)}
          </Badge>
          {market.status === "resolved" ? (
            <Badge className="bg-accent/10 text-accent border-accent/20 text-[10px] px-1.5 py-0">
              Resolved
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary text-[10px] px-1.5 py-0"
            >
              Active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          {market.status === "resolved" ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
          ) : (
            <Clock className="h-3.5 w-3.5" />
          )}
          <span className="font-mono text-xs">
            {market.status === "resolved"
              ? market.outcome
                ? "YES"
                : "NO"
              : `${daysLeft}d left`}
          </span>
        </div>
      </div>

      <h3 className="mt-3 text-sm font-medium text-foreground leading-snug text-pretty group-hover:text-primary transition-colors">
        {market.question}
      </h3>

      {/* Odds bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-accent" />
            <span className="font-mono font-semibold text-accent">
              YES {odds.yes}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-semibold text-destructive">
              NO {odds.no}%
            </span>
            <TrendingDown className="h-3 w-3 text-destructive" />
          </div>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-destructive/20">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-accent/80 transition-all"
            style={{ width: `${yesPercent}%` }}
          />
        </div>
      </div>

      {/* Pool info */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Total Pool
          </p>
          <p className="font-mono text-sm font-semibold text-foreground">
            {formatUSDC(totalPool)}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              USDC
            </span>
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              YES Pool
            </p>
            <p className="font-mono text-xs text-accent">
              {formatUSDC(market.totalYes)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              NO Pool
            </p>
            <p className="font-mono text-xs text-destructive">
              {formatUSDC(market.totalNo)}
            </p>
          </div>
        </div>
      </div>
    </button>
  )
}

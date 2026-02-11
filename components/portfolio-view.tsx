"use client"

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MARKETS,
  PORTFOLIO_POSITIONS,
  PORTFOLIO_HISTORY,
  getPortfolioStats,
  getImpliedOdds,
  formatUSDC,
  getCategoryLabel,
} from "@/lib/market-data"

export function PortfolioView() {
  const stats = getPortfolioStats()

  const activePositions = PORTFOLIO_POSITIONS.filter((p) => p.status === "active")
  const resolvedPositions = PORTFOLIO_POSITIONS.filter(
    (p) => p.status === "won" || p.status === "lost"
  )

  return (
    <div>
      {/* Portfolio header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your positions, P&L, and betting history
          </p>
        </div>
        <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Wallet className="h-4 w-4" />
          Deposit USDC
        </Button>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Total Deposited</p>
          </div>
          <p className="mt-3 font-mono text-xl font-bold text-foreground">
            {formatUSDC(stats.totalDeposited)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">USDC</span>
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Portfolio Value</p>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-mono text-xl font-bold text-foreground">
              {formatUSDC(stats.currentValue)}
            </p>
            <span
              className={`font-mono text-xs font-semibold ${
                stats.totalPnl >= 0 ? "text-accent" : "text-destructive"
              }`}
            >
              {stats.totalPnl >= 0 ? "+" : ""}
              {stats.totalPnlPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Trophy className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-xs text-muted-foreground">Win Rate</p>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-mono text-xl font-bold text-foreground">
              {stats.winRate.toFixed(0)}%
            </p>
            <span className="text-xs text-muted-foreground">
              {PORTFOLIO_POSITIONS.filter((p) => p.status === "won").length}W / {PORTFOLIO_POSITIONS.filter((p) => p.status === "lost").length}L
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Active Bets</p>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-mono text-xl font-bold text-foreground">{stats.activeBets}</p>
            <span className="text-xs text-muted-foreground">of {stats.totalBets} total</span>
          </div>
        </div>
      </div>

      {/* Portfolio chart */}
      <div className="mt-6 rounded-xl border border-border/50 bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Portfolio Value Over Time</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Since Jan 2026</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-lg font-bold text-foreground">
              {formatUSDC(stats.currentValue)}
            </span>
            <span className="font-mono text-xs text-accent">
              +{stats.totalPnlPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Simple sparkline chart */}
        <div className="mt-4 h-40">
          <PortfolioChart data={PORTFOLIO_HISTORY} />
        </div>
      </div>

      {/* Active Positions */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Active Positions ({activePositions.length})
          </h2>
        </div>

        <div className="mt-3 space-y-2">
          {activePositions.map((position) => {
            const market = MARKETS.find((m) => m.id === position.marketId)
            if (!market) return null

            const odds = getImpliedOdds(market.totalYes, market.totalNo)
            const currentOdds = position.side === "yes" ? odds.yes : odds.no
            const pnl = position.potentialPayout - position.amount
            const pnlPercent = ((pnl / position.amount) * 100).toFixed(1)

            return (
              <div
                key={`${position.marketId}-${position.side}`}
                className="rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-primary/20"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      position.side === "yes"
                        ? "bg-accent/10 text-accent"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {position.side === "yes" ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-border bg-secondary text-muted-foreground text-[10px] px-1.5 py-0"
                      >
                        {getCategoryLabel(market.category)}
                      </Badge>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="font-mono text-[10px]">
                          {Math.max(
                            0,
                            Math.ceil(
                              (new Date(market.deadline).getTime() - Date.now()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )}
                          d left
                        </span>
                      </div>
                    </div>

                    <p className="mt-1.5 text-sm font-medium text-foreground leading-snug text-pretty">
                      {market.question}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Position
                        </p>
                        <p
                          className={`font-mono text-xs font-bold ${
                            position.side === "yes" ? "text-accent" : "text-destructive"
                          }`}
                        >
                          {position.side.toUpperCase()} @ {formatUSDC(position.amount)} USDC
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Current Odds
                        </p>
                        <p className="font-mono text-xs text-foreground">{currentOdds}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Potential Payout
                        </p>
                        <p className="font-mono text-xs text-accent">
                          {formatUSDC(position.potentialPayout)} USDC
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Unrealized P&L
                        </p>
                        <p className="font-mono text-xs text-accent">
                          +{formatUSDC(pnl)} ({pnlPercent}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Resolved Positions */}
      {resolvedPositions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-foreground">
            Resolved ({resolvedPositions.length})
          </h2>

          <div className="mt-3 space-y-2">
            {resolvedPositions.map((position) => {
              const market = MARKETS.find((m) => m.id === position.marketId)
              if (!market) return null

              const isWon = position.status === "won"
              const pnl = isWon
                ? (position.resolvedPayout ?? 0) - position.amount
                : -position.amount

              return (
                <div
                  key={`${position.marketId}-${position.side}-resolved`}
                  className="rounded-xl border border-border/50 bg-card/50 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        isWon
                          ? "bg-accent/10 text-accent"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {isWon ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            isWon
                              ? "border-accent/20 bg-accent/10 text-accent text-[10px] px-1.5 py-0"
                              : "border-destructive/20 bg-destructive/10 text-destructive text-[10px] px-1.5 py-0"
                          }
                        >
                          {isWon ? "Won" : "Lost"}
                        </Badge>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {position.side.toUpperCase()}
                        </span>
                      </div>

                      <p className="mt-1.5 text-sm font-medium text-foreground/70 leading-snug">
                        {market.question}
                      </p>

                      <div className="mt-2 flex items-center gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Bet
                          </p>
                          <p className="font-mono text-xs text-foreground/70">
                            {formatUSDC(position.amount)} USDC
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Return
                          </p>
                          <p
                            className={`font-mono text-xs font-semibold ${
                              isWon ? "text-accent" : "text-destructive"
                            }`}
                          >
                            {isWon ? `+${formatUSDC(pnl)}` : formatUSDC(pnl)} USDC
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Mini Chart ────────────────────────────────────────────

function PortfolioChart({ data }: { data: { date: string; value: number }[] }) {
  if (data.length < 2) return null

  const min = Math.min(...data.map((d) => d.value)) * 0.9
  const max = Math.max(...data.map((d) => d.value)) * 1.05
  const range = max - min

  const width = 100
  const height = 100

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d.value - min) / range) * height,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  return (
    <div className="relative h-full w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#portfolioGradient)" />
        <path d={linePath} fill="none" stroke="hsl(217 91% 60%)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 translate-y-5">
        {data.filter((_, i) => i % 2 === 0 || i === data.length - 1).map((d) => (
          <span key={d.date} className="font-mono text-[10px] text-muted-foreground">
            {d.date}
          </span>
        ))}
      </div>
    </div>
  )
}

"use client"

import {
  Trophy,
  Medal,
  Flame,
  BarChart3,
  DollarSign,
  Users,
  Crown,
  ArrowUpRight,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLeaderboardFromMarkets } from "@/hooks/useLeaderboard"
import {
  formatUSDC,
  getBadgeLabel,
  getBadgeColor,
} from "@/lib/market-data"

export function LeaderboardView() {
  const { entries, isLoading } = useLeaderboardFromMarkets()
  
  // For now, show empty state since we need events to track all users efficiently
  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)

  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Leaderboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Top traders ranked by profit on Predicta prediction markets
        </p>
      </div>

      {isLoading ? (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">Loading leaderboard...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <Trophy className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium text-foreground">No leaderboard data yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Leaderboard will appear once markets are resolved and payouts are claimed
          </p>
        </div>
      ) : (
        <>

      {/* Leaderboard stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Trophy className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-xs text-muted-foreground">Top Profit</p>
          </div>
          <p className="mt-3 font-mono text-xl font-bold text-foreground">
            {entries.length > 0 ? formatUSDC(entries[0].totalProfit) : "0"}
            <span className="ml-1 text-xs font-normal text-muted-foreground">USDC</span>
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Best Win Rate</p>
          </div>
          <p className="mt-3 font-mono text-xl font-bold text-foreground">
            {entries.length > 0 ? entries[0].winRate.toFixed(0) : "0"}%
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <DollarSign className="h-4 w-4 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Total Volume</p>
          </div>
          <p className="mt-3 font-mono text-xl font-bold text-foreground">
            {formatUSDC(entries.reduce((s, e) => s + e.volume, 0))}
            <span className="ml-1 text-xs font-normal text-muted-foreground">USDC</span>
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Total Traders</p>
          </div>
          <p className="mt-3 font-mono text-xl font-bold text-foreground">
            {entries.length}
            <span className="ml-1 text-xs font-normal text-muted-foreground">ranked</span>
          </p>
        </div>
      </div>

      {/* Podium - top 3 */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {top3.map((entry, i) => {
          const rankColors = [
            "border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-card",
            "border-slate-400/30 bg-gradient-to-b from-slate-400/10 to-card",
            "border-orange-600/30 bg-gradient-to-b from-orange-600/10 to-card",
          ]
          const rankIcons = [
            <Crown key="crown" className="h-5 w-5 text-amber-400" />,
            <Medal key="medal2" className="h-5 w-5 text-slate-400" />,
            <Medal key="medal3" className="h-5 w-5 text-orange-500" />,
          ]

          return (
            <div
              key={entry.address}
              className={`relative rounded-xl border p-5 text-center transition-colors hover:border-primary/30 ${rankColors[i]}`}
            >
              <div className="absolute right-3 top-3 font-mono text-xs text-muted-foreground">
                #{entry.rank}
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  {rankIcons[i]}
                </div>
                <p className="mt-3 font-mono text-sm font-bold text-foreground">
                  {entry.address}
                </p>
                {entry.badge && (
                  <Badge className={`mt-1.5 text-[10px] px-2 py-0 ${getBadgeColor(entry.badge)}`}>
                    {getBadgeLabel(entry.badge)}
                  </Badge>
                )}
                <p className="mt-3 font-mono text-xl font-bold text-accent">
                  +{formatUSDC(entry.totalProfit)}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">USDC</span>
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {entry.winRate}% WR
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {entry.totalBets} bets
                  </span>
                  {entry.streak > 0 && (
                    <span className="flex items-center gap-0.5 font-mono text-xs text-amber-400">
                      <Flame className="h-3 w-3" />
                      {entry.streak}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full table */}
      <div className="mt-6 rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="border-b border-border/50 px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">All Rankings</h2>
        </div>

        {/* Table header */}
        <div className="hidden sm:grid sm:grid-cols-[48px_1fr_120px_80px_80px_100px_60px] items-center gap-2 border-b border-border/30 bg-secondary/30 px-5 py-2.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Rank</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Trader</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Profit</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Win Rate</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Bets</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Volume</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Streak</span>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-border/30">
          {entries.map((entry) => (
            <div
              key={entry.address}
              className="flex flex-col gap-2 px-5 py-3.5 transition-colors hover:bg-secondary/20 sm:grid sm:grid-cols-[48px_1fr_120px_80px_80px_100px_60px] sm:items-center sm:gap-2"
            >
              {/* Rank */}
              <div className="flex items-center gap-3 sm:contents">
                <span
                  className={`font-mono text-sm font-bold ${
                    entry.rank <= 3 ? "text-amber-400" : "text-muted-foreground"
                  }`}
                >
                  #{entry.rank}
                </span>

                {/* Address + badge */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium text-foreground">
                    {entry.address}
                  </span>
                  {entry.badge && (
                    <Badge
                      className={`text-[9px] px-1.5 py-0 ${getBadgeColor(entry.badge)}`}
                    >
                      {getBadgeLabel(entry.badge)}
                    </Badge>
                  )}
                </div>

                {/* Profit - visible on mobile in same row */}
                <span className="ml-auto font-mono text-sm font-semibold text-accent sm:hidden">
                  +{formatUSDC(entry.totalProfit)}
                </span>
              </div>

              {/* Desktop-only columns */}
              <span className="hidden font-mono text-sm font-semibold text-accent text-right sm:block">
                +{formatUSDC(entry.totalProfit)}
              </span>
              <span className="hidden font-mono text-sm text-foreground text-right sm:block">
                {entry.winRate}%
              </span>
              <span className="hidden font-mono text-sm text-muted-foreground text-right sm:block">
                {entry.wonBets}/{entry.totalBets}
              </span>
              <span className="hidden font-mono text-sm text-muted-foreground text-right sm:block">
                {formatUSDC(entry.volume)}
              </span>
              <div className="hidden sm:flex items-center justify-end gap-1">
                {entry.streak > 0 ? (
                  <>
                    <Flame className="h-3.5 w-3.5 text-amber-400" />
                    <span className="font-mono text-sm text-amber-400">{entry.streak}</span>
                  </>
                ) : (
                  <span className="font-mono text-sm text-muted-foreground/50">-</span>
                )}
              </div>

              {/* Mobile-only details row */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground sm:hidden">
                <span className="font-mono">{entry.winRate}% WR</span>
                <span className="font-mono">{entry.wonBets}/{entry.totalBets} bets</span>
                <span className="font-mono">{formatUSDC(entry.volume)} vol</span>
                {entry.streak > 0 && (
                  <span className="flex items-center gap-0.5 font-mono text-amber-400">
                    <Flame className="h-3 w-3" />
                    {entry.streak}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  )
}

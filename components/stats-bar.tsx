"use client"

import { TrendingUp, Users, BarChart3, DollarSign, Loader2 } from "lucide-react"
import { useStats } from "@/hooks/useStats"
import { formatUSDC } from "@/lib/market-data"

export function StatsBar() {
  const { totalVolume, activeMarkets, uniqueTraders, tvlLocked, isLoading } = useStats()

  const stats = [
    {
      label: "Total Volume",
      value: formatUSDC(totalVolume),
      icon: DollarSign,
      change: "",
    },
    {
      label: "Active Markets",
      value: String(activeMarkets),
      icon: BarChart3,
      change: "",
    },
    {
      label: "Unique Traders",
      value: uniqueTraders > 0 ? String(uniqueTraders) : "—",
      icon: Users,
      change: "",
    },
    {
      label: "TVL Locked",
      value: formatUSDC(tvlLocked),
      icon: TrendingUp,
      change: "",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-primary/20"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <stat.icon className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="font-mono text-lg font-semibold text-foreground leading-tight">
                {isLoading ? "..." : stat.value}
              </p>
              {stat.change && (
                <span className="font-mono text-xs text-accent">
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

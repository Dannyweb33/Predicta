"use client"

import { TrendingUp, Users, BarChart3, DollarSign } from "lucide-react"

const stats = [
  {
    label: "Total Volume",
    value: "$274,900",
    icon: DollarSign,
    change: "+12.4%",
  },
  {
    label: "Active Markets",
    value: "7",
    icon: BarChart3,
    change: "+2",
  },
  {
    label: "Unique Traders",
    value: "1,247",
    icon: Users,
    change: "+89",
  },
  {
    label: "TVL Locked",
    value: "$186,200",
    icon: TrendingUp,
    change: "+8.1%",
  },
]

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-primary/20"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
            <stat.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="font-mono text-lg font-semibold text-foreground leading-tight">
                {stat.value}
              </p>
              <span className="font-mono text-xs text-accent">
                {stat.change}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

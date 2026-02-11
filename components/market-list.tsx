"use client"

import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketCard } from "@/components/market-card"
import { MARKETS, type Market } from "@/lib/market-data"

interface MarketListProps {
  onSelectMarket: (market: Market) => void
}

type FilterCategory = "all" | "tvl" | "protocol" | "supply" | "governance" | "ecosystem"

export function MarketList({ onSelectMarket }: MarketListProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<FilterCategory>("all")

  const filteredMarkets = MARKETS.filter((market) => {
    const matchesSearch = market.question
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesCategory =
      category === "all" || market.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Prediction Markets
          </h2>
          <p className="text-xs text-muted-foreground">
            {filteredMarkets.length} markets available
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search markets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-52 bg-secondary/50 border-border/50 pl-9 text-xs placeholder:text-muted-foreground/50 focus-visible:ring-primary"
            />
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-secondary/50 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <Tabs
        value={category}
        onValueChange={(v) => setCategory(v as FilterCategory)}
        className="mt-4"
      >
        <TabsList className="h-8 bg-secondary/50">
          <TabsTrigger value="all" className="text-xs px-3 py-1">
            All
          </TabsTrigger>
          <TabsTrigger value="tvl" className="text-xs px-3 py-1">
            TVL
          </TabsTrigger>
          <TabsTrigger value="protocol" className="text-xs px-3 py-1">
            Protocol
          </TabsTrigger>
          <TabsTrigger value="supply" className="text-xs px-3 py-1">
            Supply
          </TabsTrigger>
          <TabsTrigger value="governance" className="text-xs px-3 py-1">
            Governance
          </TabsTrigger>
          <TabsTrigger value="ecosystem" className="text-xs px-3 py-1">
            Ecosystem
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {filteredMarkets.map((market) => (
          <MarketCard
            key={market.id}
            market={market}
            onSelect={onSelectMarket}
          />
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">
            No markets found
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}

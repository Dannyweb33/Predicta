"use client"

import { useState } from "react"
import React from "react"
import { Search, SlidersHorizontal, Loader2, Plus, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketCard } from "@/components/market-card"
import { useAllMarkets } from "@/hooks/useMarkets"
import { useIsOwner } from "@/hooks/useCreateMarket"
import { useAccount } from "wagmi"
import { CreateMarketDialog } from "@/components/create-market-dialog"
import { type Market, getCategoryLabel } from "@/lib/market-data"

interface MarketListProps {
  onSelectMarket: (market: Market) => void
}

type FilterCategory = "all" | "tvl" | "protocol" | "supply" | "governance" | "ecosystem" | "closed"

export function MarketList({ onSelectMarket }: MarketListProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<FilterCategory>("all")
  const [createMarketOpen, setCreateMarketOpen] = useState(false)
  const { markets, isLoading, refetch, count } = useAllMarkets()
  const { isOwner } = useIsOwner()
  const { isConnected } = useAccount()

  // Debug: log count and markets
  React.useEffect(() => {
    console.log('Market count:', count, 'Markets:', markets.length)
  }, [count, markets.length])

  const filteredMarkets = markets.filter((market) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      market.question.toLowerCase().includes(searchLower) ||
      market.category.toLowerCase().includes(searchLower) ||
      getCategoryLabel(market.category).toLowerCase().includes(searchLower);
    
    // Filter by category
    let matchesCategory = false;
    if (category === "closed") {
      // Show only closed markets that are less than 1 week old
      const deadlineDate = new Date(market.deadline);
      const now = new Date();
      const daysSinceClosed = Math.floor((now.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24));
      matchesCategory = market.status === "closed" && daysSinceClosed <= 7;
    } else if (category === "all") {
      // In "all", exclude closed markets (they have their own tab)
      matchesCategory = market.status !== "closed";
    } else {
      // Other categories: match category and exclude closed
      matchesCategory = market.category === category && market.status !== "closed";
    }
    
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
            {isLoading ? "Loading..." : `${filteredMarkets.length} markets available (Total: ${count})`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => refetch()}
            size="sm"
            variant="outline"
            className="gap-1.5"
            disabled={isLoading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {isOwner && isConnected && (
            <Button
              onClick={() => setCreateMarketOpen(true)}
              size="sm"
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Market
            </Button>
          )}
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
          <TabsTrigger value="closed" className="text-xs px-3 py-1">
            Closed
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Loading markets...
          </p>
        </div>
      ) : (
        <>
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
                {markets.length === 0 && count === 0
                  ? "No markets have been created yet"
                  : markets.length === 0 && count > 0
                  ? `Found ${count} markets but unable to load details. Try refreshing.`
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          )}
        </>
      )}
      <CreateMarketDialog open={createMarketOpen} onOpenChange={setCreateMarketOpen} />
    </div>
  )
}

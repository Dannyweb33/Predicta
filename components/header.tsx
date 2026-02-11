"use client"

import React from "react"

import { Activity, Wallet, Zap, BarChart3, Trophy, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

export type AppPage = "markets" | "portfolio" | "leaderboard"

interface HeaderProps {
  activePage: AppPage
  onNavigate: (page: AppPage) => void
}

const NAV_ITEMS: { page: AppPage; label: string; icon: React.ElementType }[] = [
  { page: "markets", label: "Markets", icon: TrendingUp },
  { page: "portfolio", label: "Portfolio", icon: BarChart3 },
  { page: "leaderboard", label: "Leaderboard", icon: Trophy },
]

export function Header({ activePage, onNavigate }: HeaderProps) {
  const { isConnected } = useAccount()

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("markets")}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground tracking-tight">
                ArcSignal
              </span>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/5 text-primary text-[10px] px-1.5 py-0"
              >
                BETA
              </Badge>
            </div>
          </button>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => onNavigate(item.page)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activePage === item.page
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 sm:flex">
            <Activity className="h-3.5 w-3.5 text-accent" />
            <span className="font-mono text-xs text-accent">ARC Testnet</span>
          </div>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <Button 
                          size="sm" 
                          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={openConnectModal}
                        >
                          <Wallet className="h-4 w-4" />
                          <span className="hidden sm:inline">Connect Wallet</span>
                          <span className="sm:hidden">Connect</span>
                        </Button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <Button 
                          size="sm" 
                          className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={openChainModal}
                        >
                          Wrong network
                        </Button>
                      );
                    }

                    return (
                      <div style={{ display: 'flex', gap: 12 }}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={openChainModal}
                          className="gap-2"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 12,
                                height: 12,
                                borderRadius: 999,
                                overflow: 'hidden',
                                marginRight: 4,
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  style={{ width: 12, height: 12 }}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </Button>

                        <Button
                          size="sm"
                          onClick={openAccountModal}
                          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Wallet className="h-4 w-4" />
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ''}
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="flex items-center gap-1 border-t border-border/30 px-4 py-1.5 md:hidden">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.page}
            type="button"
            onClick={() => onNavigate(item.page)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors ${
              activePage === item.page
                ? "bg-secondary text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>
    </header>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react"
import {
  type Market,
  getImpliedOdds,
  formatUSDC,
  getCategoryLabel,
} from "@/lib/market-data"
import {
  usePlaceBet,
  useApproveUSDC,
  useUSDCBalance,
  useUSDCAllowance,
  useCalculatePayout,
} from "@/hooks/useMarket"
import { toast } from "sonner"

interface BetDialogProps {
  market: Market | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BetDialog({ market, open, onOpenChange }: BetDialogProps) {
  const { isConnected } = useAccount()
  const [side, setSide] = useState<"yes" | "no">("yes")
  const [amount, setAmount] = useState("")
  const [needsApproval, setNeedsApproval] = useState(false)

  const betAmount = Number.parseFloat(amount) || 0
  const betAmountWei = betAmount > 0 ? BigInt(Math.floor(betAmount * 1000000)) : BigInt(0)

  const { balance } = useUSDCBalance()
  const { allowance, refetchAllowance } = useUSDCAllowance()
  const { approve, isPending: isApproving, isSuccess: approveSuccess } = useApproveUSDC()
  const { placeBet, isPending: isPlacingBet, isSuccess: betSuccess, hash } = usePlaceBet()
  const { payout } = useCalculatePayout(
    market?.id ?? null,
    side === "yes" ? 0 : 1,
    amount
  )

  const potentialPayout = Number.parseFloat(payout) || 0
  const multiplier = betAmount > 0 ? potentialPayout / betAmount : 0

  // Check if approval is needed
  useEffect(() => {
    if (betAmount > 0 && allowance) {
      const allowanceNum = Number.parseFloat(allowance)
      setNeedsApproval(allowanceNum < betAmount)
    } else {
      setNeedsApproval(false)
    }
  }, [betAmount, allowance])

  // Handle approval success
  useEffect(() => {
    if (approveSuccess) {
      toast.success("USDC approved successfully")
      refetchAllowance()
    }
  }, [approveSuccess, refetchAllowance])

  // Handle bet success
  useEffect(() => {
    if (betSuccess) {
      toast.success("Bet placed successfully!")
      setAmount("")
      onOpenChange(false)
    }
  }, [betSuccess, onOpenChange])

  if (!market) return null

  const odds = getImpliedOdds(market.totalYes, market.totalNo)
  const totalPool = market.totalYes + market.totalNo
  const yesPercent = totalPool > 0 ? (market.totalYes / totalPool) * 100 : 50

  const deadlineDate = new Date(market.deadline)
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
  )

  const handleApprove = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet")
      return
    }
    await approve(amount)
  }

  const handlePlaceBet = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet")
      return
    }
    if (betAmount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    if (Number.parseFloat(balance) < betAmount) {
      toast.error("Insufficient USDC balance")
      return
    }
    await placeBet(market.id, side === "yes" ? 0 : 1, amount)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setConfirmed(false)
      setAmount("")
      setSide("yes")
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-border/50 bg-card sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className="border-border bg-secondary text-muted-foreground text-[10px] px-1.5 py-0"
            >
              {getCategoryLabel(market.category)}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="font-mono text-[10px]">{daysLeft}d left</span>
            </div>
          </div>
          <DialogTitle className="text-foreground text-base leading-snug text-pretty">
            {market.question}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Place a bet on this prediction market
          </DialogDescription>
        </DialogHeader>

        {/* Current Odds */}
        <div className="rounded-lg border border-border/50 bg-secondary/50 p-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-accent" />
              <span className="font-mono font-semibold text-accent">
                YES {odds.yes}%
              </span>
            </div>
            <span className="font-mono text-muted-foreground text-[10px]">
              Pool: {formatUSDC(totalPool)} USDC
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-semibold text-destructive">
                NO {odds.no}%
              </span>
              <TrendingDown className="h-3 w-3 text-destructive" />
            </div>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-destructive/20">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-accent/80 transition-all"
              style={{ width: `${yesPercent}%` }}
            />
          </div>
        </div>

        {betSuccess ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <CheckCircle2 className="h-7 w-7 text-accent" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                Bet Placed Successfully
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatUSDC(betAmount)} USDC on{" "}
                {side === "yes" ? "YES" : "NO"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Side selection */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSide("yes")}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all ${
                  side === "yes"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-accent/30"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                YES
              </button>
              <button
                type="button"
                onClick={() => setSide("no")}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all ${
                  side === "no"
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-destructive/30"
                }`}
              >
                <TrendingDown className="h-4 w-4" />
                NO
              </button>
            </div>

            {/* Amount input */}
            <div>
              <label
                htmlFor="bet-amount"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Amount (USDC)
              </label>
              <div className="relative">
                <Input
                  id="bet-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-secondary/50 border-border/50 font-mono text-foreground pr-14 placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
                  USDC
                </span>
              </div>
              <div className="mt-2 flex gap-1.5">
                {[10, 50, 100, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className="rounded-md bg-secondary px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Payout preview */}
            {betAmount > 0 && (
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Your bet
                  </span>
                  <span className="font-mono text-xs text-foreground">
                    {formatUSDC(betAmount)} USDC
                  </span>
                </div>
                <div className="my-2 flex items-center justify-center">
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Potential payout
                  </span>
                  <span
                    className={`font-mono text-sm font-semibold ${
                      side === "yes" ? "text-accent" : "text-destructive"
                    }`}
                  >
                    {formatUSDC(potentialPayout)} USDC
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Multiplier
                  </span>
                  <span className="font-mono text-xs text-primary">
                    {multiplier.toFixed(2)}x
                  </span>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="flex items-start gap-2 rounded-lg bg-destructive/5 border border-destructive/10 p-2.5">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive/70" />
              <p className="text-[11px] text-destructive/70 leading-relaxed">
                Prediction markets involve risk. Only bet what you can afford to
                lose. Bets are final and cannot be reversed.
              </p>
            </div>

            {/* Balance info */}
            {isConnected && (
              <div className="text-xs text-muted-foreground">
                Balance: {formatUSDC(Number.parseFloat(balance) || 0)} USDC
              </div>
            )}

            {/* Approve or Place Bet button */}
            {needsApproval ? (
              <Button
                onClick={handleApprove}
                disabled={betAmount <= 0 || isApproving || !isConnected}
                className="w-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  `Approve USDC`
                )}
              </Button>
            ) : (
              <Button
                onClick={handlePlaceBet}
                disabled={betAmount <= 0 || isPlacingBet || !isConnected || needsApproval}
                className={`w-full font-semibold ${
                  side === "yes"
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                }`}
              >
                {isPlacingBet ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing bet...
                  </>
                ) : betAmount > 0 ? (
                  `Place ${formatUSDC(betAmount)} USDC on ${side.toUpperCase()}`
                ) : (
                  "Enter amount to bet"
                )}
              </Button>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

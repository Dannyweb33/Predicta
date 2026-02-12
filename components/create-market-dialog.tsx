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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useCreateMarket, useIsOwner } from "@/hooks/useCreateMarket"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Market } from "@/lib/market-data"

interface CreateMarketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateMarketDialog({ open, onOpenChange }: CreateMarketDialogProps) {
  const { isConnected } = useAccount()
  const { isOwner } = useIsOwner()
  const { createMarket, isPending, isConfirming, isSuccess } = useCreateMarket()
  const [question, setQuestion] = useState("")
  const [category, setCategory] = useState<Market["category"]>("ecosystem")
  const [deadline, setDeadline] = useState<Date | undefined>(undefined)

  // Reset form on success
  useEffect(() => {
    if (isSuccess) {
      setQuestion("")
      setCategory("ecosystem")
      setDeadline(undefined)
      onOpenChange(false)
    }
  }, [isSuccess, onOpenChange])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast.error("Please connect your wallet")
      return
    }

    if (!isOwner) {
      toast.error("Only the contract owner can create markets")
      return
    }

    if (!question.trim()) {
      toast.error("Question cannot be empty")
      return
    }

    if (!deadline) {
      toast.error("Please select a deadline")
      return
    }

    await createMarket(question, category, deadline)
  }

  if (!isOwner && isConnected) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-border/50 bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Access Denied</DialogTitle>
            <DialogDescription>
              Only the contract owner can create markets.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/50 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Market</DialogTitle>
          <DialogDescription>
            Create a new prediction market for the ARC ecosystem
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-foreground">
              Question
            </Label>
            <Input
              id="question"
              placeholder="e.g., Will ARC TVL exceed $100M by June 2026?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-secondary/50 border-border/50 text-foreground"
              disabled={isPending || isConfirming}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as Market["category"])}
              disabled={isPending || isConfirming}
            >
              <SelectTrigger className="bg-secondary/50 border-border/50 text-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tvl">TVL</SelectItem>
                <SelectItem value="protocol">Protocol</SelectItem>
                <SelectItem value="supply">USDC Supply</SelectItem>
                <SelectItem value="governance">Governance</SelectItem>
                <SelectItem value="ecosystem">Ecosystem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-secondary/50 border-border/50",
                    !deadline && "text-muted-foreground"
                  )}
                  disabled={isPending || isConfirming}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isPending || isConfirming}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!question.trim() || !category || !deadline || isPending || isConfirming || !isConnected}
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isConfirming ? "Confirming..." : "Creating..."}
                </>
              ) : (
                "Create Market"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import React from 'react';
import { Card } from "@/components/ui/card";
import { Wallet, TrendingUp } from "lucide-react";

interface StatsDisplayProps {
  mainBalance: number;
  currentPot: number;
}

export function StatsDisplay({ mainBalance, currentPot }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto mb-8">
      <Card className="bg-secondary/40 border-border p-4 flex flex-col justify-center items-center">
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
          <Wallet className="w-4 h-4" />
          MAIN WALLET
        </div>
        <div className="text-2xl font-bold font-headline text-foreground tabular-nums">
          {mainBalance.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">PU</span>
        </div>
      </Card>
      
      <Card className="bg-primary/10 border-primary/20 p-4 flex flex-col justify-center items-center shadow-[0_0_20px_rgba(40,48,240,0.15)]">
        <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
          <TrendingUp className="w-4 h-4" />
          CURRENT POT
        </div>
        <div className="text-2xl font-bold font-headline text-accent tabular-nums">
          {currentPot.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">PU</span>
        </div>
      </Card>
    </div>
  );
}
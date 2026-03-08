import React from 'react';
import { cn } from "@/lib/utils";
import { Zap, ShieldAlert } from "lucide-react";

interface TitanFlipProps {
  isFlipping: boolean;
  isRevealed: boolean;
  multiplier: number | null;
  onFlip: () => void;
  disabled: boolean;
}

export function TitanFlip({ isFlipping, isRevealed, multiplier, onFlip, disabled }: TitanFlipProps) {
  return (
    <div className="flex justify-center w-full max-w-sm mx-auto perspective-2000">
      <div
        className={cn(
          "relative w-full aspect-[4/5] cursor-pointer group rounded-3xl overflow-visible",
          isFlipping && "animate-titan-spin",
          disabled && !isRevealed && "pointer-events-none opacity-90"
        )}
        onClick={() => !disabled && !isFlipping && onFlip()}
      >
        <div className={cn(
          "card-inner w-full h-full relative",
          isRevealed && !isFlipping && "card-reveal"
        )}>
          {/* Front: The Titan Initiator */}
          <div className="card-front bg-gradient-to-br from-primary/20 to-secondary border-4 border-primary/50 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(40,48,240,0.3)] group-hover:border-accent group-hover:shadow-accent/20 transition-all duration-500">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary animate-pulse shadow-[0_0_30px_rgba(40,48,240,0.5)]">
              <Zap className="w-12 h-12 text-accent fill-accent/20" />
            </div>
            <h3 className="mt-8 text-2xl font-black font-headline tracking-tighter text-foreground">TITAN FLIP</h3>
            <p className="mt-2 text-xs font-bold text-muted-foreground uppercase tracking-[0.4em]">50/50 Chance</p>
            {!disabled && (
              <div className="absolute bottom-10 animate-bounce">
                <span className="text-xs font-bold text-accent">CLICK TO RISK ALL</span>
              </div>
            )}
          </div>

          {/* Back: The Result */}
          <div className={cn(
            "card-back flex flex-col items-center justify-center border-8 shadow-2xl",
            multiplier && multiplier > 0 
              ? "bg-accent/10 border-accent shadow-accent/20" 
              : "bg-destructive/10 border-destructive shadow-destructive/20"
          )}>
            {multiplier && multiplier > 0 ? (
              <>
                <Zap className="w-16 h-16 text-accent mb-4 animate-bounce" />
                <span className="text-7xl font-black font-headline text-accent tracking-tighter">DOUBLE</span>
                <span className="text-sm mt-4 text-accent font-bold tracking-[0.3em]">POT RECOVERED X2</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
                <span className="text-7xl font-black font-headline text-destructive tracking-tighter">NOTHING</span>
                <span className="text-sm mt-4 text-destructive font-bold tracking-[0.3em]">POT ANNIHILATED</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
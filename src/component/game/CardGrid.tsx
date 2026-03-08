
import React from 'react';
import { cn } from "@/lib/utils";
import { HelpCircle, Star, Zap, Skull, TrendingUp } from "lucide-react";

interface CardItem {
  id: string;
  multiplier: number;
  revealed: boolean;
}

interface CardGridProps {
  cards: CardItem[];
  shuffling: boolean;
  onSelect: (index: number) => void;
  disabled: boolean;
}

export function CardGrid({ cards, shuffling, onSelect, disabled }: CardGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-3xl mx-auto perspective-2000 px-4">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={cn(
            "relative w-full aspect-[3/4] cursor-pointer group rounded-xl sm:rounded-3xl overflow-visible transition-all duration-300",
            shuffling && index === cards.findIndex(c => c.revealed) && "animate-titan-spin",
            disabled && !card.revealed && "opacity-60 pointer-events-none scale-95"
          )}
          onClick={() => !disabled && onSelect(index)}
        >
          <div className={cn(
            "card-inner w-full h-full relative duration-700 transform-style-3d",
            card.revealed && "card-reveal"
          )}>
            {/* Front of Card */}
            <div className="card-front bg-gradient-to-br from-secondary to-card border-2 border-border group-hover:border-accent/50 transition-all flex flex-col items-center justify-center shadow-xl">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-background/50 flex items-center justify-center border border-border group-hover:border-accent group-hover:bg-accent/10 transition-all">
                <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground group-hover:text-accent" />
              </div>
              <span className="mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] hidden sm:block">Mystery</span>
            </div>

            {/* Back of Card (The Result) */}
            <div className={cn(
              "card-back flex flex-col items-center justify-center border-4 sm:border-8 shadow-2xl",
              card.multiplier >= 1.0 
                ? (card.multiplier >= 2.0 ? "bg-primary/10 border-primary" : "bg-accent/10 border-accent") 
                : "bg-destructive/10 border-destructive"
            )}>
              {card.multiplier >= 2.0 && <Star className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 animate-pulse" />}
              {card.multiplier >= 1.0 && card.multiplier < 2.0 && <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-accent mb-2" />}
              {card.multiplier < 1.0 && card.multiplier > 0 && <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-destructive mb-2 opacity-50" />}
              {card.multiplier === 0 && <Skull className="w-6 h-6 sm:w-8 sm:h-8 text-destructive mb-2" />}
              
              <span className={cn(
                "text-2xl sm:text-5xl font-black font-headline tracking-tighter",
                card.multiplier >= 1.0 ? (card.multiplier >= 2.0 ? "text-primary" : "text-accent") : "text-destructive"
              )}>
                {card.multiplier}x
              </span>
              <span className="text-[8px] sm:text-[10px] mt-2 text-muted-foreground uppercase font-black tracking-widest text-center px-1">
                {card.multiplier >= 2.0 ? 'Jackpot' : card.multiplier >= 1.0 ? 'Profit' : 'Loss'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

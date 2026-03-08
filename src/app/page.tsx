
"use client"

import React, { useState, useCallback, useMemo } from 'react';
import { WalletSetup } from '@/components/game/WalletSetup';
import { StatsDisplay } from '@/components/game/StatsDisplay';
import { TitanFlip } from '@/components/game/TitanFlip';
import { CardGrid } from '@/components/game/CardGrid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Coins, 
  RotateCcw, 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  AlertCircle,
  Zap,
  Grid3X3,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type GameMode = 'titan' | 'stake';
type GameState = 'setup' | 'mode-selection' | 'betting' | 'ready' | 'flipping' | 'result' | 'bankrupt';

interface CardItem {
  id: string;
  multiplier: number;
  revealed: boolean;
}

export default function TitanFlipGame() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [gameMode, setGameMode] = useState<GameMode>('titan');
  const [mainBalance, setMainBalance] = useState<number>(0);
  const [currentPot, setCurrentPot] = useState<number>(0);
  const [anteAmount, setAnteAmount] = useState<string>('50');
  const [currentMultiplier, setCurrentMultiplier] = useState<number | null>(null);
  const [gridCards, setGridCards] = useState<CardItem[]>([]);
  const { toast } = useToast();

  const handleInitializeWallet = (balance: number) => {
    setMainBalance(balance);
    setGameState('mode-selection');
  };

  const selectMode = (mode: GameMode) => {
    setGameMode(mode);
    setGameState('betting');
    // Set default stake based on mode limits: Titan Max 50, Stake Max 100
    setAnteAmount(mode === 'titan' ? '50' : '100');
  };

  const initGrid = useCallback(() => {
    // Multipliers set: 
    // -30% (0.7), -20% (0.8), -10% (0.9), -5% (0.95)
    // Double (2.0) and Nothing (0.0)
    // Plus fillers for a 3x3 grid (9 cards)
    const multipliers = [2.0, 1.5, 1.15, 1.05, 0.95, 0.9, 0.8, 0.7, 0.0];
    const shuffled = [...multipliers].sort(() => Math.random() - 0.5);
    setGridCards(shuffled.map((m, i) => ({
      id: `card-${i}-${Date.now()}`,
      multiplier: m,
      revealed: false
    })));
  }, []);

  const startChallenge = () => {
    const amount = parseFloat(anteAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    if (amount > mainBalance) {
      toast({
        title: "Insufficient Funds",
        description: "Your main wallet cannot cover this ante.",
        variant: "destructive"
      });
      return;
    }

    // Limit check for Titan mode (Max 50)
    if (gameMode === 'titan' && amount > 50) {
      toast({
        title: "Limit Exceeded",
        description: "Maximum stake for TITAN FLIP is 50 PU.",
        variant: "destructive"
      });
      return;
    }

    // Limit check for Stake mode (Max 100)
    if (gameMode === 'stake' && amount > 100) {
      toast({
        title: "Limit Exceeded",
        description: "Maximum stake for STAKE GRID is 100 PU.",
        variant: "destructive"
      });
      return;
    }

    setMainBalance(prev => prev - amount);
    setCurrentPot(amount);
    
    if (gameMode === 'stake') {
      initGrid();
    }
    
    setGameState('ready');
  };

  const handleExecuteFlip = () => {
    if (gameState !== 'ready' && gameState !== 'result') return;

    setGameState('flipping');
    setCurrentMultiplier(null);

    setTimeout(() => {
      // Pure 50/50 logic for Titan Flip
      const isWinner = Math.random() > 0.5;
      const multiplier = isWinner ? 1.0 : -1.0;
      setCurrentMultiplier(multiplier);
      
      const potChange = currentPot * multiplier;
      const newPotValue = Math.max(0, currentPot + potChange);

      setTimeout(() => {
        setCurrentPot(newPotValue);
        if (newPotValue <= 0) {
          setGameState('bankrupt');
        } else {
          setGameState('result');
        }
      }, 500);
    }, 2000);
  };

  const handleGridSelect = (index: number) => {
    if (gameState !== 'ready') return;
    
    setGameState('flipping');
    
    setTimeout(() => {
      const selectedCard = gridCards[index];
      const newMultiplier = selectedCard.multiplier;
      setCurrentMultiplier(newMultiplier);

      const updatedCards = gridCards.map((c, i) => 
        i === index ? { ...c, revealed: true } : { ...c, revealed: true }
      );
      setGridCards(updatedCards);

      const newPotValue = currentPot * newMultiplier;

      setTimeout(() => {
        setCurrentPot(newPotValue);
        if (newPotValue <= 0) {
          setGameState('bankrupt');
        } else {
          setGameState('result');
        }
      }, 800);
    }, 1500);
  };

  const handleWithdraw = () => {
    setMainBalance(prev => prev + currentPot);
    setCurrentPot(0);
    setGameState('mode-selection');
    toast({
      title: "Fortune Secured",
      description: "Tokens successfully transferred to main wallet.",
    });
  };

  const handleResetGame = () => {
    setGameState('setup');
    setMainBalance(0);
    setCurrentPot(0);
    setCurrentMultiplier(null);
  };

  if (gameState === 'setup') {
    return <WalletSetup onInitialize={handleInitializeWallet} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-4xl mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40 border border-primary-foreground/20">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-headline tracking-tighter text-foreground">TITAN PROTOCOL</h1>
            <p className="text-[10px] text-accent font-bold tracking-[0.3em] uppercase opacity-80">Secure High Stakes</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleResetGame} className="text-muted-foreground hover:text-foreground transition-colors">
          <RotateCcw className="w-4 h-4 mr-2" /> REBOOT
        </Button>
      </header>

      {gameState !== 'mode-selection' && (
        <StatsDisplay mainBalance={mainBalance} currentPot={currentPot} />
      )}

      <main className="w-full flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto py-8">
        
        {gameState === 'mode-selection' && (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <button 
              onClick={() => selectMode('titan')}
              className="group relative bg-card/40 hover:bg-primary/10 border-2 border-border/50 hover:border-primary/50 p-12 rounded-[2.5rem] transition-all flex flex-col items-center text-center space-y-6"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-black font-headline tracking-tighter">TITAN FLIP</h2>
                <p className="text-muted-foreground mt-2 font-medium">True 50/50 "Double or Nothing". Max 50 PU.</p>
              </div>
              <div className="bg-primary/20 px-4 py-1 rounded-full text-[10px] font-black tracking-widest text-primary uppercase">LIMIT: 50 PU</div>
            </button>

            <button 
              onClick={() => selectMode('stake')}
              className="group relative bg-card/40 hover:bg-accent/10 border-2 border-border/50 hover:border-accent/50 p-12 rounded-[2.5rem] transition-all flex flex-col items-center text-center space-y-6"
            >
              <div className="w-20 h-20 bg-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Grid3X3 className="w-10 h-10 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-black font-headline tracking-tighter">STAKE GRID</h2>
                <p className="text-muted-foreground mt-2 font-medium">3x3 Mystery Grid. Max 100 PU.</p>
              </div>
              <div className="bg-accent/20 px-4 py-1 rounded-full text-[10px] font-black tracking-widest text-accent uppercase">LIMIT: 100 PU</div>
            </button>
          </div>
        )}

        {gameState === 'betting' && (
          <div className="w-full max-w-md bg-card/40 backdrop-blur-sm border-2 border-border/50 rounded-3xl p-10 shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black font-headline text-foreground tracking-tight uppercase">
                 {gameMode === 'titan' ? 'Titan' : 'Stake'} Ante
               </h2>
               <Button variant="outline" size="xs" onClick={() => setGameState('mode-selection')} className="text-[10px] h-6 px-2">CHANGE MODE</Button>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Wallet className="w-3 h-3" /> Stake Amount (PU)
                </label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-accent" />
                  <Input 
                    type="number" 
                    value={anteAmount}
                    onChange={(e) => setAnteAmount(e.target.value)}
                    className="pl-12 py-8 bg-secondary/20 border-border/50 text-2xl font-bold focus:ring-accent focus:border-accent rounded-2xl"
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-accent font-black uppercase tracking-widest mt-2">
                  <Info className="w-3 h-3" /> 
                  Max stake for {gameMode === 'titan' ? 'TITAN' : 'GRID'} is {gameMode === 'titan' ? '50' : '100'} PU
                </div>
              </div>
              <Button 
                onClick={startChallenge}
                className={cn(
                  "w-full py-10 text-xl font-black text-white shadow-2xl hover:scale-[1.02] transition-all rounded-2xl",
                  gameMode === 'titan' ? "bg-primary hover:bg-primary/90 shadow-primary/20" : "bg-accent hover:bg-accent/90 shadow-accent/20"
                )}
              >
                INITIALIZE {gameMode.toUpperCase()}
              </Button>
            </div>
          </div>
        )}

        {(gameState === 'ready' || gameState === 'flipping' || gameState === 'result') && (
          <div className="w-full space-y-12 animate-in fade-in duration-700">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
                <div className={cn("w-2 h-2 rounded-full", gameState === 'flipping' ? "bg-accent animate-ping" : "bg-accent")} />
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">
                  {gameState === 'flipping' ? 'System Processing' : 'Awaiting Selection'}
                </span>
              </div>
              <h3 className="text-4xl font-black font-headline text-foreground tracking-tighter">
                {gameState === 'flipping' ? 'CALCULATING ODDS...' : 
                 gameState === 'result' ? 'OUTCOME REALIZED' : 
                 gameMode === 'titan' ? 'THE TITAN IS READY' : 'CHOOSE YOUR FORTUNE'}
              </h3>
            </div>
            
            {gameMode === 'titan' ? (
              <TitanFlip 
                isFlipping={gameState === 'flipping'}
                isRevealed={gameState === 'result'}
                multiplier={currentMultiplier}
                onFlip={handleExecuteFlip}
                disabled={gameState === 'flipping' || gameState === 'result'}
              />
            ) : (
              <CardGrid 
                cards={gridCards}
                shuffling={gameState === 'flipping'}
                onSelect={handleGridSelect}
                disabled={gameState === 'flipping' || gameState === 'result'}
              />
            )}

            {gameState === 'result' && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 animate-in slide-in-from-bottom duration-700 max-w-2xl mx-auto w-full">
                <Button 
                  onClick={() => {
                    if (gameMode === 'titan') {
                      handleExecuteFlip();
                    } else {
                      setGameState('betting');
                    }
                  }}
                  className="group w-full py-8 text-xl font-black bg-primary text-white border-2 border-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(40,48,240,0.4)] rounded-2xl"
                >
                  <TrendingUp className="w-6 h-6 mr-3 group-hover:scale-125 transition-transform" /> 
                  {gameMode === 'titan' ? 'DOUBLE UP AGAIN' : 'NEW GRID ROUND'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleWithdraw}
                  className="w-full py-8 text-xl font-black border-2 border-accent text-accent hover:bg-accent hover:text-background rounded-2xl"
                >
                  CASH OUT {currentPot.toFixed(2)} PU
                </Button>
              </div>
            )}
          </div>
        )}

        {gameState === 'bankrupt' && (
          <div className="w-full max-w-md bg-destructive/5 border-2 border-destructive/20 rounded-[2.5rem] p-12 text-center animate-in bounce-in duration-700 shadow-2xl">
            <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-destructive/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
            <h2 className="text-5xl font-black font-headline text-destructive mb-4 tracking-tighter">ANNIHILATED</h2>
            <p className="text-muted-foreground mb-10 text-lg font-medium">The flip was not in your favor. The pot has returned to the void.</p>
            <Button 
              onClick={() => {
                setCurrentPot(0);
                setCurrentMultiplier(null);
                setGameState(mainBalance > 0 ? 'betting' : 'setup');
              }}
              className="w-full py-8 bg-destructive hover:bg-destructive/90 text-white font-black text-xl rounded-2xl shadow-lg shadow-destructive/20"
            >
              RESTART PROTOCOL
            </Button>
          </div>
        )}
      </main>

      <footer className="w-full max-w-4xl mt-auto py-8 border-t border-border/30 text-center">
        <div className="flex justify-center gap-8 text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">
          <span>Provably Fair</span>
          <span className="text-border">•</span>
          <span>Infinite Scalability</span>
          <span className="text-border">•</span>
          <span>Titan Protocol v3.0</span>
        </div>
      </footer>
    </div>
  );
}

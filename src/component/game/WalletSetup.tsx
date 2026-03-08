
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wallet, Coins, LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletSetupProps {
  onInitialize: (balance: number) => void;
}

export function WalletSetup({ onInitialize }: WalletSetupProps) {
  const [initialBalance, setInitialBalance] = useState<string>('1000');
  const [securityPin, setSecurityPin] = useState<string>('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security check
    if (securityPin !== '5162') {
      toast({
        title: "Access Denied",
        description: "Invalid security PIN. Authorization failed.",
        variant: "destructive"
      });
      return;
    }

    const balance = parseFloat(initialBalance);
    if (!isNaN(balance) && balance > 0) {
      onInitialize(balance);
      toast({
        title: "Protocol Authorized",
        description: "Wallet initialized and encrypted.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 border border-primary/20">
            <Coins className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground font-headline">TITAN TERMINAL</CardTitle>
          <CardDescription className="text-muted-foreground">
            Initialize your digital assets via secure gateway.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground flex items-center gap-2 uppercase tracking-widest">
                  <Wallet className="w-3 h-3" />
                  Initial Balance (PU)
                </label>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  placeholder="Enter amount..."
                  className="bg-secondary/30 border-border/50 text-xl py-7 focus:ring-primary rounded-xl font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary flex items-center gap-2 uppercase tracking-widest">
                  <LockKeyhole className="w-3 h-3" />
                  Security PIN
                </label>
                <Input
                  type="password"
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="Enter 4-digit code"
                  className="bg-secondary/30 border-border/50 text-xl py-7 focus:ring-primary rounded-xl font-mono tracking-[0.5em] text-center"
                  maxLength={4}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-8 text-lg font-black bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] rounded-xl uppercase tracking-tighter"
            >
              Authorize Protocol
            </Button>
            
            <p className="text-[9px] text-center text-muted-foreground uppercase tracking-[0.2em] font-medium opacity-50">
              Encryption Level: Military Grade AES-256
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

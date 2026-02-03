import { useState } from "react";
import { useCreateReport } from "@/hooks/use-reports";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Swords, Crosshair } from "lucide-react";
import { motion } from "framer-motion";

interface CreateReportDialogProps {
  trigger?: React.ReactNode;
}

export function CreateReportDialog({ trigger }: CreateReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [opponent, setOpponent] = useState("");
  const [game, setGame] = useState<"valorant" | "lol">("valorant");
  const { mutate, isPending } = useCreateReport();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponent.trim()) return;

    mutate(
      { opponent, game },
      {
        onSuccess: (data) => {
          setOpen(false);
          toast({
            title: "Intel Gathered",
            description: `Scouting report for ${opponent} is ready.`,
          });
          setLocation(`/reports/${data.id}`);
        },
        onError: (err) => {
          toast({
            title: "Scouting Failed",
            description: err.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="w-full md:w-auto gap-2 bg-primary hover:bg-primary/90 text-white font-mono uppercase tracking-widest shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)] border-0 h-12 text-base">
            <Crosshair className="w-5 h-5" />
            Initialize Scan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-background/95 border-primary/20 backdrop-blur-xl sm:max-w-[500px] p-0 overflow-hidden gap-0">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-display text-white flex items-center gap-3">
            <Swords className="w-6 h-6 text-primary" />
            TARGET ACQUISITION
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="opponent" className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Opponent ID / Team Name
            </Label>
            <div className="relative group">
              <Input
                id="opponent"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                placeholder="e.g. T1 Faker"
                className="bg-black/40 border-white/10 text-lg py-6 font-display focus:border-primary/50 focus:ring-primary/20 transition-all placeholder:text-white/20"
                autoFocus
              />
              <div className="absolute inset-0 -z-10 bg-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity blur-lg" />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Select Sector (Game)
            </Label>
            <RadioGroup
              value={game}
              onValueChange={(val) => setGame(val as "valorant" | "lol")}
              className="grid grid-cols-2 gap-4"
            >
              <Label
                htmlFor="valorant"
                className={`
                  flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${game === "valorant" 
                    ? "border-primary bg-primary/10 text-white shadow-[0_0_15px_-5px_hsl(var(--primary)/0.4)]" 
                    : "border-white/5 bg-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/10"}
                `}
              >
                <RadioGroupItem value="valorant" id="valorant" className="sr-only" />
                <span className="font-display font-bold text-lg tracking-wide">VALORANT</span>
                <span className="text-[10px] font-mono uppercase mt-1 opacity-70">Tactical Shooter</span>
              </Label>

              <Label
                htmlFor="lol"
                className={`
                  flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${game === "lol" 
                    ? "border-secondary bg-secondary/10 text-white shadow-[0_0_15px_-5px_hsl(var(--secondary)/0.4)]" 
                    : "border-white/5 bg-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/10"}
                `}
              >
                <RadioGroupItem value="lol" id="lol" className="sr-only" />
                <span className="font-display font-bold text-lg tracking-wide">LEAGUE</span>
                <span className="text-[10px] font-mono uppercase mt-1 opacity-70">MOBA</span>
              </Label>
            </RadioGroup>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/10 hover:bg-white/5 hover:text-white font-mono uppercase text-xs"
            >
              Abort
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || !opponent}
              className="bg-primary hover:bg-primary/90 min-w-[140px] font-mono uppercase text-xs tracking-wider"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                "Generate Intel"
              )}
            </Button>
          </div>
        </form>

        {isPending && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="w-64 space-y-4">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <p className="text-center font-mono text-sm text-primary animate-pulse uppercase tracking-widest">
                Analyzing Match History...
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

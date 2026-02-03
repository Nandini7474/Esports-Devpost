import { useReports } from "@/hooks/use-reports";
import { CreateReportDialog } from "@/components/CreateReportDialog";
import { ReportCard } from "@/components/ReportCard";
import { Header } from "@/components/Header";
import { Loader2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Reports() {
  const [gameFilter, setGameFilter] = useState<'valorant' | 'lol' | undefined>(undefined);
  const [search, setSearch] = useState("");
  const { data: reports, isLoading } = useReports(gameFilter);

  const filteredReports = reports?.filter(r => 
    r.opponent.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">Intel Archive</h1>
              <p className="text-muted-foreground font-light">Access previous tactical assessments and scouting data.</p>
            </div>
            <CreateReportDialog />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by opponent..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background/50 border-white/10"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={!gameFilter ? "secondary" : "outline"}
                onClick={() => setGameFilter(undefined)}
                className="font-mono text-xs uppercase"
              >
                All
              </Button>
              <Button 
                variant={gameFilter === 'valorant' ? "secondary" : "outline"}
                onClick={() => setGameFilter('valorant')}
                className={`font-mono text-xs uppercase ${gameFilter === 'valorant' ? 'bg-primary/20 text-primary border-primary/20' : ''}`}
              >
                Valorant
              </Button>
              <Button 
                variant={gameFilter === 'lol' ? "secondary" : "outline"}
                onClick={() => setGameFilter('lol')}
                className={`font-mono text-xs uppercase ${gameFilter === 'lol' ? 'bg-secondary/20 text-secondary border-secondary/20' : ''}`}
              >
                League
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports?.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
              {filteredReports?.length === 0 && (
                <div className="col-span-full py-20 text-center text-muted-foreground font-mono">
                  No matching reports found.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import { useReports } from "@/hooks/use-reports";
import { CreateReportDialog } from "@/components/CreateReportDialog";
import { ReportCard } from "@/components/ReportCard";
import { Header } from "@/components/Header";
import { Loader2, Activity, Database, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: reports, isLoading, error } = useReports();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <section className="relative py-16 md:py-24 mb-16 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-primary mb-6 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  System Online
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-[0.9]">
                  DOMINATE THE <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">MATCHUP</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl font-light leading-relaxed">
                  AI-powered tactical reconnaissance for esports. Analyze opponent tendencies, exploit weaknesses, and secure the victory before the match begins.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <CreateReportDialog />
                </div>
              </motion.div>
            </div>

            {/* Stats / Features Grid */}
            <motion.div 
              className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {[
                { icon: Database, title: "Historical Data", desc: "Access deep match history from Grid API" },
                { icon: Zap, title: "Instant Analysis", desc: "AI processes hours of gameplay in seconds" },
                { icon: Activity, title: "Pattern Recognition", desc: "Identify recurring strategic behaviors" },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover-elevate cursor-pointer group">
                  <item.icon className="w-8 h-8 text-accent mb-4 group-hover:text-primary transition-colors" />
                  <h3 className="text-lg font-display text-white mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </section>

          {/* Recent Reports Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display text-white flex items-center gap-3">
                <span className="w-1.5 h-6 bg-accent rounded-sm" />
                Recent Operations
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-xl bg-white/5 animate-pulse border border-white/5" />
                ))}
              </div>
            ) : error ? (
              <div className="p-12 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                <Activity className="w-12 h-12 text-destructive mb-4 opacity-50" />
                <h3 className="text-lg font-mono text-white mb-2">Failed to retrieve intel</h3>
                <p className="text-muted-foreground text-sm">Could not connect to the archives.</p>
              </div>
            ) : reports && reports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center bg-white/5">
                <Database className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-mono text-white mb-2">Archive Empty</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                  No previous scouting reports found. Initialize a scan to begin gathering intelligence.
                </p>
                <CreateReportDialog />
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

import { useReport } from "@/hooks/use-reports";
import { Header } from "@/components/Header";
import { type ScoutingReportContent } from "@shared/schema";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { 
  ChevronLeft, Loader2, Download, Share2, 
  Target, Shield, Swords, BrainCircuit, AlertTriangle, FileText,
  Activity, Database, Zap, TrendingUp, Users
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function ReportDetail() {
  const [, params] = useRoute("/reports/:id");
  const id = parseInt(params?.id || "0");
  const { data: report, isLoading, error } = useReport(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="font-mono text-primary uppercase tracking-widest animate-pulse">
            Decrypting Intel...
          </p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-display text-white mb-4">Report Not Found</h1>
            <Link href="/reports">
              <Button variant="outline">Return to Archive</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const content = report.content as unknown as ScoutingReportContent;
  const isVal = report.game === 'valorant';
  const themeColor = isVal ? 'text-primary' : 'text-secondary';
  const themeBg = isVal ? 'bg-primary' : 'bg-secondary';
  const themeBorder = isVal ? 'border-primary' : 'border-secondary';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const IconMap = {
    Swords,
    BrainCircuit,
    Target,
    Shield,
    Activity,
    Database,
    Zap,
    AlertTriangle,
    FileText
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top Nav */}
          <div className="mb-8 flex items-center justify-between">
            <Link href="/reports">
              <Button variant="ghost" className="text-muted-foreground hover:text-white pl-0 gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to Intel Archive
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-white/10 gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button size="sm" className={`${themeBg} text-background gap-2`}>
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Report Header */}
          <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-8 mb-8 backdrop-blur-md">
            <div className={`absolute top-0 right-0 w-64 h-64 ${themeBg} opacity-10 blur-[100px] pointer-events-none`} />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="outline" className={`uppercase font-mono tracking-widest text-xs py-1 px-3 ${themeBorder} ${themeColor} bg-transparent`}>
                    {isVal ? "Valorant Protocol" : "League Analysis"}
                  </Badge>
                  <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                    {format(new Date(report.createdAt!), 'yyyy-MM-dd HH:mm:ss')}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-wide">
                  TARGET: <span className={themeColor}>{report.opponent}</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl text-lg font-light leading-relaxed mb-6">
                  {content.summary}
                </p>

                {/* Instant Analysis & Historical Context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <h3 className="text-accent font-display text-sm uppercase mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Instant Analysis
                    </h3>
                    <p className="text-sm text-foreground/80">{content.instant_analysis?.current_form}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {content.instant_analysis?.key_threats?.map((threat, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] uppercase border-accent/30 text-accent">
                          Threat: {threat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                    <h3 className="text-secondary font-display text-sm uppercase mb-2 flex items-center gap-2">
                      <Database className="w-4 h-4" /> Historical Context
                    </h3>
                    <p className="text-sm text-foreground/80">{content.historical_context}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end justify-center">
                <div className="text-right">
                  <span className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Confidence Score</span>
                  <div className={`text-4xl font-display font-bold ${themeColor}`}>
                    94%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Success Rate & Pattern Graph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              <CardTitle className="text-white font-display text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Performance Trends
              </CardTitle>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: 'Match 1', score: 40 },
                    { name: 'Match 2', score: 30 },
                    { name: 'Match 3', score: 65 },
                    { name: 'Match 4', score: 45 },
                    { name: 'Match 5', score: 80 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#00f2ff" strokeWidth={2} dot={{ fill: '#00f2ff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              <CardTitle className="text-white font-display text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" /> Win Probability Analysis
              </CardTitle>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Predictive Win Rate</span>
                    <span className="text-xl font-bold text-secondary">72.4%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: '72.4%' }}></div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-xs font-mono text-secondary uppercase mb-2">Recommended Next Player</h4>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-secondary border-secondary/30 uppercase">TENZ (Sub)</Badge>
                    <span className="text-xs text-muted-foreground">+12% Win Probability increase if swapped</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Grid Layout */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Column - Main Intel */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Pattern Recognition */}
              <motion.div variants={item}>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden border-l-4 border-l-accent">
                  <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
                    <CardTitle className="flex items-center gap-3 font-display text-xl text-white">
                      <Activity className="w-6 h-6 text-accent" />
                      Pattern Recognition
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-mono uppercase text-muted-foreground mb-3 tracking-widest">Repeated Behaviors</h4>
                        <div className="flex flex-wrap gap-2">
                          {content.pattern_recognition?.repeated_behaviors?.map((b, i) => (
                            <Badge key={i} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                              {b}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-xs font-mono uppercase text-emerald-400 mb-3 tracking-widest">Core Strengths</h4>
                          <ul className="space-y-2">
                            {content.pattern_recognition?.strengths?.map((s, i) => (
                              <li key={i} className="text-sm text-foreground/80 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-mono uppercase text-destructive mb-3 tracking-widest">Core Weaknesses</h4>
                          <ul className="space-y-2">
                            {content.pattern_recognition?.weaknesses?.map((w, i) => (
                              <li key={i} className="text-sm text-foreground/80 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-destructive" />
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tendencies */}
              <motion.div variants={item}>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
                    <CardTitle className="flex items-center gap-3 font-display text-xl text-white">
                      <BrainCircuit className="w-6 h-6 text-accent" />
                      Key Tendencies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {content.tendencies.map((t, i) => (
                        <li key={i} className="flex gap-4 group">
                          <span className="font-mono text-accent/50 text-sm mt-1">0{i+1}</span>
                          <p className="text-foreground/90 leading-relaxed group-hover:text-white transition-colors">{t}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Strategies */}
              <motion.div variants={item}>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
                    <CardTitle className="flex items-center gap-3 font-display text-xl text-white">
                      <Swords className="w-6 h-6 text-secondary" />
                      Strategic Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-4">
                      {content.strategies.map((s, i) => (
                        <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                          <p className="text-foreground/90 leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Raw Stats Accordion */}
              {content.raw_stats_summary && (
                <motion.div variants={item}>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="stats" className="border-white/10 bg-white/5 rounded-xl px-4">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3 text-white font-display text-lg">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          Raw Data Packet
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto font-mono text-xs text-muted-foreground">
                          {JSON.stringify(content.raw_stats_summary, null, 2)}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              )}
            </div>

            {/* Right Column - Actionable Intel */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Weaknesses - Highlighted */}
              <motion.div variants={item}>
                <Card className="bg-destructive/10 border-destructive/20 backdrop-blur-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                    <AlertTriangle className="w-24 h-24 text-destructive" />
                  </div>
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center gap-3 font-display text-xl text-destructive-foreground">
                      <Target className="w-6 h-6 text-destructive" />
                      Exploitable Weaknesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 relative z-10">
                    <ul className="space-y-3">
                      {content.exploitable_patterns.map((w, i) => (
                        <li key={i} className="flex gap-3 text-sm text-white/90 font-medium">
                          <span className="text-destructive mt-1">►</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Preparation */}
              <motion.div variants={item}>
                <Card className="bg-emerald-500/5 border-emerald-500/20 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 font-display text-xl text-emerald-400">
                      <Shield className="w-6 h-6 text-emerald-500" />
                      Counter-Protocols
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <ul className="space-y-4">
                      {content.preparation.map((p, i) => (
                        <li key={i} className="relative pl-6 text-sm text-foreground/90">
                          <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-emerald-500/50 border border-emerald-500" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

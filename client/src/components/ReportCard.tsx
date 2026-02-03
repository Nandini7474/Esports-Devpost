import { Link } from "wouter";
import { format } from "date-fns";
import { type Report } from "@shared/schema";
import { ArrowRight, Calendar, User, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ReportCard({ report }: { report: Report }) {
  const isVal = report.game === "valorant";
  const accentColor = isVal ? "text-primary" : "text-secondary";
  const borderColor = isVal ? "group-hover:border-primary/50" : "group-hover:border-secondary/50";

  return (
    <Link href={`/reports/${report.id}`}>
      <div className="group h-full cursor-pointer">
        <Card className={`
          h-full bg-background/40 backdrop-blur-sm border-white/5 
          transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-background/60
          ${borderColor}
        `}>
          <CardHeader className="p-6 pb-2">
            <div className="flex justify-between items-start mb-2">
              <Badge 
                variant="outline" 
                className={`
                  uppercase tracking-wider font-mono text-[10px] border-white/10 bg-white/5
                  ${isVal ? "text-primary" : "text-secondary"}
                `}
              >
                {isVal ? "Valorant" : "League of Legends"}
              </Badge>
              <div className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {report.createdAt ? format(new Date(report.createdAt), 'MMM d, HH:mm') : 'Unknown'}
              </div>
            </div>
            <h3 className="text-xl font-display font-bold text-white tracking-wide truncate group-hover:text-white/90 transition-colors">
              {report.opponent}
            </h3>
          </CardHeader>
          
          <CardContent className="p-6 pt-2 pb-4">
            <p className="text-sm text-muted-foreground line-clamp-3 font-medium leading-relaxed">
              {(report.content as any).summary || "No summary available."}
            </p>
          </CardContent>

          <CardFooter className="p-6 pt-0 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Full Analysis Ready</span>
            </div>
            <div className={`
              p-2 rounded-full bg-white/5 text-muted-foreground 
              transition-all duration-300 group-hover:bg-white/10 group-hover:text-white
            `}>
              <ArrowRight className="w-4 h-4" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </Link>
  );
}

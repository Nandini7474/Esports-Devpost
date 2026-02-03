import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-20 w-20 text-destructive animate-pulse" />
        </div>
        <h1 className="text-5xl font-display font-bold text-white tracking-widest">404</h1>
        <div className="space-y-2">
          <h2 className="text-xl font-mono text-primary uppercase tracking-wider">Signal Lost</h2>
          <p className="text-muted-foreground">
            The requested tactical data does not exist or has been redacted.
          </p>
        </div>

        <div className="pt-6">
          <Link href="/">
            <button className="px-6 py-3 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono uppercase text-sm tracking-widest transition-all hover:border-primary/50">
              Return to Base
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

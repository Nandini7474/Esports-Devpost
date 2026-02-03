import { Link, useLocation } from "wouter";
import { Gamepad2, TrendingUp, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: TrendingUp },
    { href: "/reports", label: "Intel Archive", icon: ShieldAlert },
  ];

  return (
    <header className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-primary/10 rounded-lg border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <Gamepad2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-wider text-white">
                  SCOUT<span className="text-primary">MASTER</span>
                </span>
                <span className="text-[10px] text-muted-foreground tracking-[0.2em] font-mono uppercase">
                  Tactical Intelligence
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-md flex items-center gap-2 font-mono text-sm uppercase tracking-wide transition-all duration-200",
                    isActive 
                      ? "bg-white/5 text-primary border border-white/5 shadow-[0_0_15px_-5px_hsl(var(--primary)/0.5)]" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="md:hidden">
            {/* Mobile menu trigger could go here */}
          </div>
        </div>
      </div>
    </header>
  );
}

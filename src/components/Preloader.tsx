import { Radio } from "lucide-react";

export function Preloader() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="space-y-6 text-center">
        <div className="relative">
          <Radio className="w-16 h-16 text-primary animate-pulse" />
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 animate-pulse">
            AudioCast
          </h2>
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    </div>
  );
}
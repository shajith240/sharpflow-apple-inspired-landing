import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { useEffect, useMemo, useState } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { "agent-id"?: string };
    }
  }
}

const queryClient = new QueryClient();

const ConvaiGate: React.FC<{ agentId: string }> = ({ agentId }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const expectedPassword = useMemo(
    () => (import.meta.env.VITE_CONVAI_PASSWORD as string) || "devpass",
    []
  );

  useEffect(() => {
    const flag = localStorage.getItem("convai_unlocked_v1");
    if (flag === "1") setUnlocked(true);
  }, []);

  const unlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password === expectedPassword) {
      setUnlocked(true);
      setError(null);
      localStorage.setItem("convai_unlocked_v1", "1");
    } else {
      setError("Incorrect passcode");
    }
  };

  if (unlocked) {
    return (
      <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <form
        onSubmit={unlock}
        className="rounded-xl border border-border/60 bg-background/95 backdrop-blur px-4 py-3 shadow-lg w-[280px]"
      >
        <div className="text-sm font-medium mb-2">Unlock Voice Assistant</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter passcode"
          className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        />
        {error && (
          <div className="mt-1 text-xs text-red-500">{error}</div>
        )}
        <button
          type="submit"
          className="mt-2 w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Unlock
        </button>
        <div className="mt-2 text-[11px] text-muted-foreground">
          Site under development. Assistant requires a passcode.
        </div>
      </form>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ConvaiGate agentId="agent_3501k28cz9h7fzv8wx19vvcadegb" />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

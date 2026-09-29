import { CheckSquare, LogOut, Menu } from "lucide-react";

export function Navbar({ name, onLogout, onMenu }: { name: string; onLogout: () => void; onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="rounded-lg p-2 hover:bg-muted md:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 font-bold text-primary md:hidden">
          <CheckSquare className="h-5 w-5" /> TaskFlow
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:inline">Hi, <b className="text-foreground">{name}</b></span>
        <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </header>
  );
}

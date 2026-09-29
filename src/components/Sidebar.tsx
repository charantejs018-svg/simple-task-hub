import { CheckSquare, LayoutDashboard, Plus, X } from "lucide-react";

export function Sidebar({ open, onClose, onNewTask }: { open: boolean; onClose: () => void; onNewTask: () => void }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-foreground/30 md:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-card p-5 transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-bold text-primary">
            <CheckSquare className="h-6 w-6" /> TaskFlow
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-muted md:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-2">
          <div className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 font-medium text-accent-foreground">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </div>
          <button onClick={() => { onNewTask(); onClose(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted">
            <Plus className="h-4 w-4" /> New Task
          </button>
        </nav>
      </aside>
    </>
  );
}

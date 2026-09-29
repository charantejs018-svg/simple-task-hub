import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, ListTodo, Loader, Plus, Search } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { TaskCard, fmt, statusStyle } from "@/components/TaskCard";
import { TaskForm, type TaskInput } from "@/components/TaskForm";
import { Modal } from "@/components/Modal";
import { getTasks, logoutUser, newId, saveTasks, type SessionUser, type Status, type Task } from "@/utils/storage";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TaskFlow" },
      { name: "description", content: "Your personal task dashboard." },
      { property: "og:title", content: "Dashboard — TaskFlow" },
      { property: "og:description", content: "Your personal task dashboard." },
    ],
  }),
  component: () => <ProtectedRoute>{(user) => <Dashboard user={user} />}</ProtectedRoute>,
});

const control = "rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Dashboard({ user }: { user: SessionUser }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(() => getTasks(user.id));
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<{ type: "new" | "edit" | "view" | "delete"; task?: Task } | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sort, setSort] = useState("asc");

  useEffect(() => saveTasks(user.id, tasks), [tasks, user.id]);

  const stats = [
    { label: "Total Tasks", value: tasks.length, icon: ListTodo, cls: "bg-primary/10 text-primary" },
    { label: "Pending", value: tasks.filter((t) => t.status === "Pending").length, icon: Clock, cls: "bg-warning/20 text-warning-foreground" },
    { label: "In Progress", value: tasks.filter((t) => t.status === "In Progress").length, icon: Loader, cls: "bg-info/15 text-info" },
    { label: "Completed", value: tasks.filter((t) => t.status === "Completed").length, icon: CheckCircle2, cls: "bg-success/15 text-success" },
  ];

  const visible = useMemo(() => {
    return tasks
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
      .filter((t) => status === "All" || t.status === status)
      .filter((t) => priority === "All" || t.priority === priority)
      .sort((a, b) => (sort === "asc" ? a.dueDate.localeCompare(b.dueDate) : b.dueDate.localeCompare(a.dueDate)));
  }, [tasks, search, status, priority, sort]);

  const create = (input: TaskInput) => {
    setTasks([{ ...input, id: newId(), createdAt: new Date().toISOString() }, ...tasks]);
    setModal(null);
    toast.success("Task created.");
  };
  const update = (id: string, patch: Partial<Task>, msg = "Task updated.") => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    toast.success(msg);
  };
  const remove = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setModal(null);
    toast.success("Task deleted.");
  };
  const logout = () => {
    logoutUser();
    toast.success("You have been logged out.");
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} onNewTask={() => setModal({ type: "new" })} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar name={user.name} onLogout={logout} onMenu={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Here's an overview of your tasks.</p>
            </div>
            <button onClick={() => setModal({ type: "new" })} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" /> New Task
            </button>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm">
                <div className={`rounded-xl p-3 ${s.cls}`}><s.icon className="h-5 w-5" /></div>
                <div>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input className={`${control} w-full pl-9`} placeholder="Search by title…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className={control} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
              <option value="All">All statuses</option><option>Pending</option><option>In Progress</option><option>Completed</option>
            </select>
            <select className={control} value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Filter by priority">
              <option value="All">All priorities</option><option>Low</option><option>Medium</option><option>High</option>
            </select>
            <select className={control} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by due date">
              <option value="asc">Due date: soonest first</option>
              <option value="desc">Due date: latest first</option>
            </select>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-card p-12 text-center text-muted-foreground">
              {tasks.length === 0 ? "No tasks yet. Click “New Task” to create your first one." : "No tasks match your filters."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onView={() => setModal({ type: "view", task: t })}
                  onEdit={() => setModal({ type: "edit", task: t })}
                  onDelete={() => setModal({ type: "delete", task: t })}
                  onStatus={(s: Status) => update(t.id, { status: s }, s === "Completed" ? "Task marked as completed." : `Status changed to ${s}.`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {modal?.type === "new" && (
        <Modal title="New Task" onClose={() => setModal(null)}>
          <TaskForm onSubmit={create} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "edit" && modal.task && (
        <Modal title="Edit Task" onClose={() => setModal(null)}>
          <TaskForm initial={modal.task} onSubmit={(i) => { update(modal.task!.id, i); setModal(null); }} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "view" && modal.task && (
        <Modal title={modal.task.title} onClose={() => setModal(null)}>
          <p className="mb-4 whitespace-pre-wrap text-sm text-muted-foreground">{modal.task.description || "No description"}</p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-muted-foreground">Priority</dt><dd className="font-medium">{modal.task.priority}</dd>
            <dt className="text-muted-foreground">Status</dt><dd><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[modal.task.status]}`}>{modal.task.status}</span></dd>
            <dt className="text-muted-foreground">Due date</dt><dd className="font-medium">{fmt(modal.task.dueDate)}</dd>
            <dt className="text-muted-foreground">Created</dt><dd className="font-medium">{fmt(modal.task.createdAt)}</dd>
          </dl>
        </Modal>
      )}
      {modal?.type === "delete" && modal.task && (
        <Modal title="Delete task?" onClose={() => setModal(null)}>
          <p className="mb-6 text-sm text-muted-foreground">Are you sure you want to delete “{modal.task.title}”? This cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setModal(null)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={() => remove(modal.task!.id)} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

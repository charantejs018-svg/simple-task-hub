import { Calendar, CheckCircle2, Eye, Pencil, Trash2 } from "lucide-react";
import type { Status, Task } from "@/utils/storage";

const priorityStyle: Record<string, string> = {
  Low: "bg-success/15 text-success",
  Medium: "bg-warning/20 text-warning-foreground",
  High: "bg-destructive/15 text-destructive",
};
export const statusStyle: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground",
  "In Progress": "bg-info/15 text-info",
  Completed: "bg-success/15 text-success",
};

export const fmt = (d: string) => (d ? new Date(d).toLocaleDateString() : "—");

type Props = {
  task: Task;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatus: (s: Status) => void;
};

export function TaskCard({ task, onView, onEdit, onDelete, onStatus }: Props) {
  const overdue = task.status !== "Completed" && task.dueDate && task.dueDate < new Date().toISOString().slice(0, 10);
  return (
    <div className="flex flex-col rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className={`font-semibold ${task.status === "Completed" ? "text-muted-foreground line-through" : ""}`}>{task.title}</h3>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyle[task.priority]}`}>{task.priority}</span>
      </div>
      <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">{task.description || "No description"}</p>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
        <span className={`flex items-center gap-1 ${overdue ? "font-semibold text-destructive" : "text-muted-foreground"}`}>
          <Calendar className="h-3.5 w-3.5" /> Due {fmt(task.dueDate)}{overdue ? " (overdue)" : ""}
        </span>
        <span className="text-muted-foreground">Created {fmt(task.createdAt)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatus(e.target.value as Status)}
          className={`rounded-lg border-0 px-2 py-1.5 text-xs font-medium ${statusStyle[task.status]}`}
          aria-label="Change status"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <div className="ml-auto flex gap-1">
          {task.status !== "Completed" && (
            <button onClick={() => onStatus("Completed")} title="Mark completed" className="rounded-lg p-2 text-success hover:bg-success/10"><CheckCircle2 className="h-4 w-4" /></button>
          )}
          <button onClick={onView} title="View" className="rounded-lg p-2 hover:bg-muted"><Eye className="h-4 w-4" /></button>
          <button onClick={onEdit} title="Edit" className="rounded-lg p-2 hover:bg-muted"><Pencil className="h-4 w-4" /></button>
          <button onClick={onDelete} title="Delete" className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}

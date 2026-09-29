import { useState, type FormEvent } from "react";
import type { Priority, Status, Task } from "@/utils/storage";

export type TaskInput = Pick<Task, "title" | "description" | "priority" | "status" | "dueDate">;

const input = "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

export function TaskForm({ initial, onSubmit, onCancel }: { initial?: Task; onSubmit: (t: TaskInput) => void; onCancel: () => void }) {
  const [form, setForm] = useState<TaskInput>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    priority: initial?.priority ?? "Medium",
    status: initial?.status ?? "Pending",
    dueDate: initial?.dueDate ?? "",
  });
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: { title?: string; dueDate?: string } = {};
    if (!form.title.trim()) errs.title = "Task title cannot be empty.";
    else if (form.title.length > 100) errs.title = "Title must be under 100 characters.";
    if (!form.dueDate) errs.dueDate = "Please choose a due date.";
    else if (!initial && form.dueDate < new Date().toISOString().slice(0, 10)) errs.dueDate = "Due date cannot be in the past.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() });
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label className="mb-1 block text-sm font-medium">Title *</label>
        <input className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Finish project report" />
        {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea className={input} rows={3} maxLength={1000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Priority</label>
          <select className={input} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select className={input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>
            <option>Pending</option><option>In Progress</option><option>Completed</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Due date *</label>
          <input type="date" className={input} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          {errors.dueDate && <p className="mt-1 text-xs text-destructive">{errors.dueDate}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
        <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          {initial ? "Save changes" : "Create task"}
        </button>
      </div>
    </form>
  );
}

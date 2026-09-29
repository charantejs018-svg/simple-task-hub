// Simple localStorage helpers. Keys: "users", "currentUser", "tasks_<userId>"
export type User = { id: string; name: string; email: string; password: string };
export type Priority = "Low" | "Medium" | "High";
export type Status = "Pending" | "In Progress" | "Completed";
export type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  createdAt: string;
};

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const getUsers = () => read<User[]>("users", []);

export function registerUser(name: string, email: string, password: string) {
  const users = getUsers();
  const clean = email.trim().toLowerCase();
  if (users.some((u) => u.email === clean)) throw new Error("An account with this email already exists.");
  const user: User = { id: newId(), name: name.trim(), email: clean, password };
  write("users", [...users, user]);
  return user;
}

export function loginUser(email: string, password: string) {
  const user = getUsers().find((u) => u.email === email.trim().toLowerCase() && u.password === password);
  if (!user) throw new Error("Incorrect email or password.");
  write("currentUser", { id: user.id, name: user.name, email: user.email });
  return user;
}

export type SessionUser = Omit<User, "password">;
export const getCurrentUser = () => read<SessionUser | null>("currentUser", null);
export const logoutUser = () => localStorage.removeItem("currentUser");

export const getTasks = (userId: string) => read<Task[]>(`tasks_${userId}`, []);
export const saveTasks = (userId: string, tasks: Task[]) => write(`tasks_${userId}`, tasks);

export const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AuthLayout, authInput } from "@/components/AuthLayout";
import { isValidEmail, registerUser } from "@/utils/storage";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — TaskFlow" },
      { name: "description", content: "Create a free TaskFlow account." },
      { property: "og:title", content: "Register — TaskFlow" },
      { property: "og:description", content: "Create a free TaskFlow account." },
    ],
  }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) return setError("All fields are required.");
    if (!isValidEmail(form.email)) return setError("Please enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    try {
      registerUser(form.name, form.email, form.password);
      toast.success("Account created! Please log in.");
      navigate({ to: "/login" });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Start organising your tasks in seconds.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input className={authInput} maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input type="email" className={authInput} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input type="password" className={authInput} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="w-full rounded-lg bg-primary py-2.5 font-medium text-primary-foreground hover:bg-primary/90">Register</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Login</Link>
      </p>
    </AuthLayout>
  );
}

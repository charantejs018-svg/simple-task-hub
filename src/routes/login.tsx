import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AuthLayout, authInput } from "@/components/AuthLayout";
import { getCurrentUser, isValidEmail, loginUser } from "@/utils/storage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — TaskFlow" },
      { name: "description", content: "Log in to TaskFlow to manage your tasks." },
      { property: "og:title", content: "Login — TaskFlow" },
      { property: "og:description", content: "Log in to TaskFlow to manage your tasks." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (getCurrentUser()) navigate({ to: "/dashboard", replace: true });
  }, [navigate]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return setError("Email and password are required.");
    if (!isValidEmail(email)) return setError("Please enter a valid email address.");
    try {
      const u = loginUser(email, password);
      toast.success(`Welcome back, ${u.name}!`);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue to your dashboard.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input type="email" className={authInput} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input type="password" className={authInput} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="w-full rounded-lg bg-primary py-2.5 font-medium text-primary-foreground hover:bg-primary/90">Login</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account? <Link to="/register" className="font-medium text-primary hover:underline">Register</Link>
      </p>
    </AuthLayout>
  );
}

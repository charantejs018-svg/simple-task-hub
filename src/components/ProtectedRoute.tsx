import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getCurrentUser, type SessionUser } from "@/utils/storage";

export function ProtectedRoute({ children }: { children: (user: SessionUser) => ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) navigate({ to: "/login", replace: true });
    setUser(u);
  }, [navigate]);

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }
  return <>{children(user)}</>;
}

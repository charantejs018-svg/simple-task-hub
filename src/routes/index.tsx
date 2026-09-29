import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getCurrentUser } from "@/utils/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TaskFlow — Simple Task Manager" },
      { name: "description", content: "Organise, track and complete your tasks with TaskFlow." },
      { property: "og:title", content: "TaskFlow — Simple Task Manager" },
      { property: "og:description", content: "Organise, track and complete your tasks with TaskFlow." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: getCurrentUser() ? "/dashboard" : "/login", replace: true });
  }, [navigate]);
  return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
}

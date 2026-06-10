import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Calendar, Users, Stethoscope, MessageSquare, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · MediVoice" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const tabs = [
    { to: "/admin", label: "Appointments", icon: Calendar, exact: true },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/admin/conversations", label: "AI Conversations", icon: MessageSquare },
    { to: "/admin/doctors", label: "Doctors", icon: Stethoscope },
    { to: "/admin/patients", label: "Patients", icon: Users },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Hospital operations overview</p>
        </div>
      </div>
      <div className="flex gap-1 mb-6 border-b overflow-x-auto">
        {tabs.map((t) => {
          const active = t.exact ? path === t.to : path.startsWith(t.to);
          return (
            <Link key={t.to} to={t.to} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 ${active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </Link>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
}

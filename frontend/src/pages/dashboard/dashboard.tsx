import { useMemo } from "react";
import taskManagementLogo from "@/assets/logos/logo.png";
import { Button } from "@/components/ui/button";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { Menu } from "@/components/shared/menu";
import { SearchBar } from "@/components/ui/search_bar";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/queries";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LayoutDashboard, CheckCircle2, Clock, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Fetch Data
  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // 2. Normalize Data
  const projects = useMemo(() => {
    return Array.isArray(projectsData)
      ? projectsData
      : (projectsData as any)?.data || [];
  }, [projectsData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 3. Dynamic Statistics Calculation
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p: any) => p.status === "active"
  ).length;

  // Mocking chart data based on actual projects
  // (In a real app, your backend might send this, or you've grouped by project.createdAt)
  const chartData = useMemo(() => {
    return [
      { name: "Projects", count: totalProjects, fill: "#3b82f6" },
      { name: "Active", count: activeProjects, fill: "#10b981" },
      {
        name: "Pending",
        count: totalProjects - activeProjects,
        fill: "#f59e0b",
      },
    ];
  }, [totalProjects, activeProjects]);

  // Check if we are exactly on the /dashboard home route
  const isHome = location.pathname === "/dashboard";

  return (
    <div className="min-h-screen flex bg-neutral-50/50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-neutral-200 p-8 flex flex-col justify-between sticky top-0 h-screen">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center p-1">
              <img
                src={taskManagementLogo}
                className="w-full h-full object-contain invert"
                alt="logo"
              />
            </div>
            <span className="font-bold text-xl text-neutral-800">Taskly</span>
          </div>
          <nav>
            <Menu />
          </nav>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 rounded-xl py-6"
        >
          <CiLogout size={20} />
          <span className="font-semibold">Log out</span>
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-30 px-8 py-4">
          <SearchBar />
        </header>

        <div className="p-8 space-y-8">
          {/* ONLY SHOW ANALYTICS ON /DASHBOARD */}
          {isHome ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Projects"
                  value={totalProjects.toString()}
                  icon={<LayoutDashboard className="text-blue-500" />}
                  label="All created projects"
                />
                <StatCard
                  title="Active Status"
                  value={activeProjects.toString()}
                  icon={<CheckCircle2 className="text-green-500" />}
                  label="Currently in progress"
                />
                <StatCard
                  title="Archived/Other"
                  value={(totalProjects - activeProjects).toString()}
                  icon={<Clock className="text-orange-500" />}
                  label="Completed or paused"
                />
              </div>

              <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">
                      Project Distribution
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Real-time data from your workspace
                    </p>
                  </div>
                  <BarChart3 className="text-neutral-300" />
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9ca3af", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9ca3af", fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : null}

          {/* This handles nested routes like /dashboard/projects/1/tasks */}
          <section>
            <Outlet />
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  label,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="bg-white border border-neutral-200 p-6 rounded-3xl shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-neutral-50 rounded-2xl">{icon}</div>
        <div>
          <h4 className="text-2xl font-bold text-neutral-900 leading-none">
            {value}
          </h4>
          <p className="text-sm font-medium text-neutral-500 mt-1">{title}</p>
        </div>
      </div>
      <p className="text-xs text-neutral-400 border-t pt-3">{label}</p>
    </div>
  );
}

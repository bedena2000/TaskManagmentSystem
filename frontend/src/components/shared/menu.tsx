import { menuList } from "@/helpers";
import type { MenuListItemInterface } from "@/types";
import { Link, useParams, useLocation } from "react-router-dom";
import { Button } from "../ui/button";

export function Menu() {
  const { projectId } = useParams();
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-2">
      {menuList.map((item: MenuListItemInterface) => {
        const Icon = item.icon;

        // Dynamic logic for the Tasks link
        let targetHref = item.href;
        if (item.title === "Tasks") {
          targetHref = projectId
            ? `/dashboard/projects/${projectId}/tasks`
            : "/dashboard/projects";
        }

        // Check if the current path matches the link
        const isActive =
          location.pathname === targetHref ||
          (item.title === "Projects" &&
            location.pathname.includes("/projects"));

        return (
          <Link key={item.id} to={targetHref} className="w-full">
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-4 px-4 py-6 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              <Icon
                size={20}
                className={isActive ? "text-white" : "text-neutral-400"}
              />
              <span className="font-medium">{item.title}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}

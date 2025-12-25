import { Link } from "react-router-dom";

interface ProjectItemProps {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export default function ProjectItem({
  id,
  name,
  description,
  createdAt,
}: ProjectItemProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link to={`/dashboard/projects/${id}/tasks`} state={{ projectName: name }}>
      <div className="group relative bg-white border border-neutral-200 p-5 rounded-xl transition-all duration-200 hover:border-blue-500 hover:shadow-md cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-neutral-800 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <span className="text-xs font-medium text-neutral-400 bg-neutral-50 px-2 py-1 rounded-md">
            #{id}
          </span>
        </div>

        <p className="text-neutral-600 text-sm line-clamp-2 mb-4 h-10">
          {description || "No description provided."}
        </p>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
              Created on
            </span>
            <span className="text-xs text-neutral-700 font-medium">
              {formattedDate}
            </span>
          </div>

          {/* Subtle arrow that appears on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

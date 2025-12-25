import { PiArrowArcLeftBold, PiArrowArcRightBold } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import ProjectModal from "@/components/ui/project_modal";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/queries";
import type { ProjectElementInterface } from "@/types";
import ProjectItem from "@/components/shared/project_item";

export default function Projects() {
  const [projectModal, setProjectModal] = useState(false);

  // 1. State for pagination
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5,
  });

  // Normalize data (handling your backend 'name' vs 'title' fix from earlier)
  const projects = useMemo(() => {
    return Array.isArray(projectsData)
      ? projectsData
      : (projectsData as any)?.data || [];
  }, [projectsData]);

  // 2. Calculate the items to display
  const paginatedProjects = useMemo(() => {
    return projects.slice(currentIndex, currentIndex + itemsPerPage);
  }, [projects, currentIndex]);

  // 3. Navigation handlers
  const handleNext = () => {
    if (currentIndex + itemsPerPage < projects.length) {
      setCurrentIndex((prev) => prev + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex((prev) => prev - itemsPerPage);
    }
  };

  const handleProjectModal = () => {
    setProjectModal((prev) => !prev);
  };

  return (
    <div className="p-16 relative">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-700 font-semibold text-2xl">Projects</p>
          <p className="text-xs text-neutral-400 mt-1">
            Showing {currentIndex + 1} -{" "}
            {Math.min(currentIndex + itemsPerPage, projects.length)} of{" "}
            {projects.length}
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            {/* Left Arrow */}
            <PiArrowArcLeftBold
              onClick={handlePrev}
              className={`transition-all ${
                currentIndex === 0
                  ? "text-neutral-200 cursor-not-allowed"
                  : "text-neutral-700 cursor-pointer hover:text-blue-600"
              }`}
              size={22}
            />
            {/* Right Arrow */}
            <PiArrowArcRightBold
              onClick={handleNext}
              className={`transition-all ${
                currentIndex + itemsPerPage >= projects.length
                  ? "text-neutral-200 cursor-not-allowed"
                  : "text-neutral-700 cursor-pointer hover:text-blue-600"
              }`}
              size={22}
            />
          </div>

          <Button onClick={handleProjectModal} className="cursor-pointer gap-2">
            Create Project
            <FiPlus />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-12 min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : paginatedProjects.length > 0 ? (
          paginatedProjects.map((item: ProjectElementInterface) => (
            <ProjectItem
              id={item.id}
              createdAt={item.createdAt}
              description={item.description}
              name={item.name}
              key={item.id}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
            <p className="text-neutral-400">No projects found.</p>
          </div>
        )}
      </div>

      {projectModal && <ProjectModal onClose={() => setProjectModal(false)} />}
    </div>
  );
}

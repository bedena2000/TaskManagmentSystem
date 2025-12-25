import { useState, useEffect, useRef, useMemo } from "react";
import { GoSearch } from "react-icons/go";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/queries";
import { useNavigate } from "react-router-dom";
import { CiFolderOn } from "react-icons/ci";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // 1. Normalize the data source (handles Axios objects or raw arrays)
  const projectsArray = useMemo(() => {
    if (!projectsData) return [];
    return Array.isArray(projectsData) 
      ? projectsData 
      : (projectsData as any)?.data || [];
  }, [projectsData]);

  // 2. The Fix: Search using 'name' because your backend uses Project.create({ name: title })
  const filteredProjects = useMemo(() => {
    const searchLower = query.trim().toLowerCase();
    if (!searchLower || !projectsArray.length) return [];

    return projectsArray.filter((project: any) => {
      // Your backend stores the title in a database column called 'name'
      const projectName = String(project?.name || project?.title || "").toLowerCase();
      const projectDesc = String(project?.description || "").toLowerCase();

      return projectName.includes(searchLower) || projectDesc.includes(searchLower);
    }).slice(0, 5);
  }, [query, projectsArray]);

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (path: string, state?: any) => {
    navigate(path, { state });
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto py-3 px-8" ref={searchRef}>
      {/* Search Input Container */}
      <div className={`group flex items-center justify-between p-3 border rounded-xl transition-all duration-200 bg-white ${
        isOpen && query.trim() 
          ? "ring-2 ring-blue-500 border-transparent shadow-lg" 
          : "border-neutral-200 shadow-sm"
      }`}>
        <input
          className="w-full outline-none pr-4 text-sm text-neutral-700 bg-transparent"
          placeholder="Search projects..."
          value={query}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <GoSearch size={20} className={`${query.trim() ? "text-blue-500" : "text-neutral-400"}`} />
      </div>

      {/* Results Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-8 right-8 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="max-h-[400px] overflow-y-auto p-2">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-3 py-2 border-b mb-1">
              Projects Found ({filteredProjects.length})
            </p>
            
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project: any) => (
                <button
                  key={project.id}
                  onClick={() => 
                    handleItemClick(`/dashboard/projects/${project.id}/tasks`, { 
                      projectName: project.name || project.title 
                    })
                  }
                  className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-xl transition-colors text-left group"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <CiFolderOn size={18} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-neutral-800 truncate">
                      {project.name || project.title}
                    </p>
                    {project.description && (
                      <p className="text-xs text-neutral-500 truncate italic">
                        {project.description}
                      </p>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-10 text-center">
                <p className="text-sm text-neutral-500 font-medium">No results for "{query}"</p>
                <p className="text-xs text-neutral-400 mt-1 italic">
                  Search only looks at project names and descriptions.
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-neutral-50 p-3 border-t border-neutral-100 flex justify-between items-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Quick Navigation</span>
            <button 
              onClick={() => handleItemClick('/dashboard/projects')}
              className="text-[10px] text-blue-600 font-bold hover:underline"
            >
              SEE ALL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "@/queries";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Import a spinner icon

export default function ProjectModal({ onClose }: { onClose: () => void }) {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTitleError, setProjectTitleError] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    },
    onError: (error) => {
      console.error(error);
      navigate("/404");
    },
  });

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleCreate = () => {
    setProjectTitleError(false);

    // Only title is required
    if (projectTitle.trim().length === 0) {
      setProjectTitleError(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      mutate({
        title: projectTitle,
        description: projectDescription, // This can be empty now
        token,
      });
    }
  };

  return (
    // Backdrop overlay
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md border rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-xl font-bold text-neutral-800">Create New Project</h2>
          <p className="text-sm text-neutral-500">Give your project a name and start tracking tasks.</p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Project Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700">Project Title</label>
            <Input
              placeholder="e.g. Website Redesign"
              value={projectTitle}
              className={projectTitleError ? "border-red-500 focus-visible:ring-red-500" : ""}
              onChange={(event) => {
                setProjectTitle(event.target.value);
                if (event.target.value.trim().length > 0) setProjectTitleError(false);
              }}
            />
            {projectTitleError && (
              <p className="text-xs text-red-600 font-medium italic">Project title is required.</p>
            )}
          </div>

          {/* Project Description (Optional) */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label className="text-sm font-semibold text-neutral-700">Description</label>
              <span className="text-xs text-neutral-400">Optional</span>
            </div>
            <textarea
              className="flex min-h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="What is this project about?"
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 cursor-pointer"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
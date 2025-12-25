import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/queries";
import { Button } from "./button";
import { Input } from "./input";
import { Loader2 } from "lucide-react";

export default function TaskModal({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [titleError, setTitleError] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      onClose();
    },
  });

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleCreate = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    mutate({ projectId, title, description, priority });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md border rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-xl font-bold text-neutral-800">
            Create New Task
          </h2>
          <p className="text-sm text-neutral-500">
            Add a specific task to your project board.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Task Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700">
              Task Title
            </label>
            <Input
              placeholder="e.g. Design Login Page"
              value={title}
              className={
                titleError ? "border-red-500 focus-visible:ring-red-500" : ""
              }
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError(false);
              }}
            />
            {titleError && (
              <p className="text-xs text-red-600 font-medium italic">
                Title is required.
              </p>
            )}
          </div>

          {/* Priority Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700">
              Priority
            </label>
            <div className="flex gap-2">
              {["low", "medium", "high", "urgent"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md border capitalize transition-all ${
                    priority === p
                      ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                      : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label className="text-sm font-semibold text-neutral-700">
                Description
              </label>
              <span className="text-xs text-neutral-400">Optional</span>
            </div>
            <textarea
              className="flex min-h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                "Add Task"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

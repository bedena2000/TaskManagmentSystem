import { useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasksByProject, updateTaskStatus, deleteTask } from "@/queries";
import { Button } from "@/components/ui/button";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import TaskModal from "@/components/ui/TaskModal";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

export default function Tasks() {
  const { projectId } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const projectName = location.state?.projectName || "Project Tasks";
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Tasks
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => fetchTasksByProject(projectId!),
    enabled: !!projectId,
  });

  // 2. Update Status Mutation (Drag & Drop)
  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: string }) =>
      updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  // 3. Delete Task Mutation
  const { mutate: deleteTaskMutation } = useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  const handleDelete = (e: React.MouseEvent, taskId: number) => {
    e.stopPropagation(); // Prevents drag events from triggering
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation(taskId);
    }
  };

  const columns = [
    { id: "todo", title: "To Do", color: "bg-slate-100" },
    { id: "in_progress", title: "In Progress", color: "bg-blue-50/50" },
    { id: "done", title: "Done", color: "bg-emerald-50/50" },
  ];

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    updateStatus({
      taskId: parseInt(draggableId),
      status: destination.droppableId,
    });
  };

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-sm text-neutral-500 font-medium">
            Projects / {projectName}
          </h1>
          <p className="text-neutral-800 font-bold text-3xl">Board</p>
        </div>

        <div className="flex items-center gap-6">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 shadow-sm"
          >
            <FiPlus />
            Create Task
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-1 gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`flex-1 min-w-75 rounded-xl flex flex-col ${column.color} p-4`}
            >
              <div className="flex justify-between items-center mb-4 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-neutral-700 uppercase text-xs tracking-wider">
                    {column.title}
                  </h3>
                  <span className="bg-white/50 px-2 py-0.5 rounded text-[10px] font-bold text-neutral-500">
                    {tasks?.filter((t: any) => t.status === column.id).length ||
                      0}
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-col gap-3 h-full overflow-y-auto min-h-37.5"
                  >
                    {isLoading ? (
                      <div className="h-20 bg-white/50 rounded-lg animate-pulse" />
                    ) : (
                      tasks
                        ?.filter((task: any) => task.status === column.id)
                        .map((task: any, index: number) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing group relative"
                              >
                                {/* Delete Button - Visible on Hover */}
                                <button
                                  onClick={(e) => handleDelete(e, task.id)}
                                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                  title="Delete Task"
                                >
                                  <FiTrash2 size={14} />
                                </button>

                                <div className="flex flex-col gap-2">
                                  <span
                                    className={`w-8 h-1 rounded-full ${
                                      task.priority === "high" ||
                                      task.priority === "urgent"
                                        ? "bg-red-400"
                                        : "bg-blue-400"
                                    }`}
                                  />
                                  <h4 className="font-semibold text-neutral-800 text-sm leading-tight pr-6">
                                    {task.title}
                                  </h4>
                                  {task.description && (
                                    <p className="text-xs text-neutral-500 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-tighter">
                                      ID-{task.id}
                                    </span>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 uppercase">
                                      {task.priority}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {isModalOpen && (
        <TaskModal
          projectId={projectId!}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

import { api } from "@/lib/axios";

interface SignUpPayload {
  email: string;
  password: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface SignInResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
  token: string;
}

interface ProjectPayload {
  title: string;
  description?: string;
  token: string;
}

export const signUp = async (data: SignUpPayload) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const signIn = async (data: SignInPayload): Promise<SignInResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const createProject = async (
  data: ProjectPayload
): Promise<ProjectPayload> => {
  const token = localStorage.getItem("token");

  const response = await api.post("/project", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const fetchProjects = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/project", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response.data);

  return response.data;
};

export const fetchTasksByProject = async (projectId: string) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/project/${projectId}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTask = async ({
  projectId,
  title,
  description,
  priority,
}: any) => {
  const token = localStorage.getItem("token");
  const response = await api.post(
    `/project/${projectId}/tasks`,
    { title, description, priority },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateTaskStatus = async (taskId: number, status: string) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    `/project/tasks/${taskId}`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const deleteTask = async (taskId: number) => {
  const token = localStorage.getItem("token");
  const response = await api.delete(`/project/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

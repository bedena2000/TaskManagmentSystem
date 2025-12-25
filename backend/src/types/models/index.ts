export interface UserType {
  id: number;
  email: string;
  password: string;
  role: string;
}

export interface ProjectType {
  id: number;
  name: string;
  description?: string;
  status: "active" | "completed" | "archived";
  startDate?: string | Date;
  endDate?: string | Date;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

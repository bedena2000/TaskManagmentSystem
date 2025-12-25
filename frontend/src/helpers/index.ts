import type { RegistrationErrorMessageInterface } from "@/types";
import { RxDashboard } from "react-icons/rx";
import { CiFolderOn } from "react-icons/ci";
import { FaTasks } from "react-icons/fa";

export const getFieldError = (
  field: string,
  errors?: RegistrationErrorMessageInterface[] | null
) => {
  if (!errors || errors.length === 0) return null;
  return errors.find((e) => e.field === field)?.message ?? null;
};

export const menuList = [
  {
    id: 1,
    title: "Dashboard",
    icon: RxDashboard,
    href: '/dashboard'
  },
  {
    id: 2,
    title: "Projects",
    icon: CiFolderOn,
    href: '/dashboard/projects'
  },

  {
    id: 3,
    title: "Tasks",
    icon: FaTasks,
    href: '/dashboard/tasks'
  },
];

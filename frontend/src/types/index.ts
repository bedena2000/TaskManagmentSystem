export interface RegistrationErrorMessageInterface {
  field: string;
  message: string;
}

export interface MenuListItemInterface {
  id: number;
  title: string;
  icon: any;
  href: string;
}

export interface ProjectElementInterface {
  createdAt: string;
  description: string;
  endDate: string;
  id: number;
  name: string;
  startDate: string;
  status: string;
  updatedAt: string;
  userId: number;
}

// @/types/index.ts

export interface RegistrationErrorMessageInterface {
  field: string; // e.g., "email" or "password"
  message: string; // e.g., "Invalid email format"
}

// If your SignInResponse isn't defined yet, here it is too:
export interface SignInResponse {
  token: string;
  message?: string;
  user: {
    id: number;
    email: string;
    [key: string]: any;
  };
}

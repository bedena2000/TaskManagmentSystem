import type { RegistrationErrorMessageInterface } from "@/types";

export const getFieldError = (
  field: string,
  errors?: RegistrationErrorMessageInterface[] | null
) => {
  if (!errors || errors.length === 0) return null;
  return errors.find((e) => e.field === field)?.message ?? null;
};

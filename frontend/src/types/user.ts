export type Role = "ROLE_OPERATOR" | "ROLE_ADMIN";

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  roles: Role[];
};

export type LoginCredentials = {
  email: string;
  password: string;
};


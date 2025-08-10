export type User = {
  id: string;
  name: string;
  email: string;
  role: 'ujier' | 'simpatizante' | 'miembro';
};

export type Ujier = User & {
  additionalField: string; // Replace with actual fields
};

export type Simpatizante = User & {
  additionalField: string; // Replace with actual fields
};

export type Miembro = User & {
  additionalField: string; // Replace with actual fields
};

export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type Theme = {
  primaryColor: string;
  secondaryColor: string;
  // Add more theme-related properties as needed
};
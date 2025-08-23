export type User = {
  id: string;
  name: string;
  email: string;
  role: "ujier" | "simpatizante" | "miembro";
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

// Tipos para el sistema de conteo
export type CategoriaMiembro = "hermano" | "hermana" | "nino" | "adolescente";

export type MiembroData = {
  id: string;
  nombre: string;
  telefono?: string;
  categoria: CategoriaMiembro;
  notas?: string;
  fechaRegistro: string;
};

export type SimpatizanteData = {
  id: string;
  nombre: string;
  telefono?: string;
  notas?: string;
  fechaRegistro: string;
};

export type UjierData = {
  id: string;
  nombre: string;
  password: string;
  rol: "admin" | "directiva" | "ujier";
  activo: boolean;
  fechaCreacion: string;
};

export type ConteoData = {
  fecha: string;
  servicio: string;
  ujier: string[];
  hermanos: number;
  hermanas: number;
  ninos: number;
  adolescentes: number;
  simpatizantes: number;
  total: number;
  simpatizantesAsistieron?: Array<{ id: string; nombre: string }>;
  miembrosAsistieron?: {
    hermanos?: Array<{ id: string; nombre: string }>;
    hermanas?: Array<{ id: string; nombre: string }>;
    ninos?: Array<{ id: string; nombre: string }>;
    adolescentes?: Array<{ id: string; nombre: string }>;
  };
};

export type HistorialRecord = {
  id: string;
  fecha: string;
  servicio: string;
  ujier: string | string[];
  hermanos: number;
  hermanas: number;
  ninos: number;
  adolescentes: number;
  simpatizantes: number;
  total: number;
  simpatizantesAsistieron?: Array<{ id: string; nombre: string }>;
  miembrosAsistieron?: {
    hermanos?: Array<{ id: string; nombre: string }>;
    hermanas?: Array<{ id: string; nombre: string }>;
    ninos?: Array<{ id: string; nombre: string }>;
    adolescentes?: Array<{ id: string; nombre: string }>;
  };
};

export type Servicio = {
  value: string;
  label: string;
};

export type BulkCounts = {
  hermanos: string;
  hermanas: string;
  ninos: string;
  adolescentes: string;
  simpatizantes: string;
};

export type NewSimpatizante = {
  nombre: string;
  telefono: string;
  notas: string;
};

// Tipos para debug
export type DebugInfo = {
  success: boolean;
  message: string;
  data?: unknown;
};

export type TestResult = {
  success: boolean;
  message: string;
  data?: unknown;
};

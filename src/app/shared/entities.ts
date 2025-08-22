export interface Student {
  name: string;
  surname: string;
  age: number;
  dni: string;
  average: number;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  credits: number;
}

export interface Enrollment {
  id: string;
  studentDni: string;
  courseId: string;
  enrollmentDate: Date;
}

export interface DialogData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'delete';
  student?: Student;
  course?: Course;
  enrollment?: Enrollment;
}

// Nuevas interfaces para autenticación
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
  email?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface EnrollmentWithDetails {
  enrollment: Enrollment;
  student: Student | null;
  course: Course | null;
}

export interface ConfirmDialogData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'delete';
} 
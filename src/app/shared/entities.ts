export interface Student {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
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
  studentId: string;
  courseId: string;
  enrollmentDate: Date;
}

// Interfaces para requests de creación
export interface CreateStudentRequest {
  dni: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  average?: number;
}

export interface CreateCourseRequest {
  name: string;
  description: string;
  credits: number;
}

export interface CreateEnrollmentRequest {
  studentId: string;
  courseId: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Interfaces para requests de actualización
export interface UpdateStudentRequest {
  dni: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

export interface UpdateCourseRequest {
  name: string;
  description: string;
  credits: number;
}

export interface UpdateUserRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface DialogData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'delete';
  student?: Student;
  course?: Course;
  enrollment?: Enrollment;
}

// Interfaces para autenticación
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
  email: string;
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
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
export interface Student {
  name: string;
  surname: string;
  age: number;
  dni: string;
  average: number;
}

export interface DialogData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'delete';
  student?: Student;
} 
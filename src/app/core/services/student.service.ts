import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Student } from '../../shared/entities';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private students: Student[] = [];
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.http.get<Student[]>('mocks/students.json')
      .pipe(
        tap(data => {
          this.students = data;
          this.studentsSubject.next(this.students);
        }),
        catchError(error => {
          console.error('Error cargando estudiantes:', error);
          // Datos mock de respaldo
          this.students = [
            {
              name: "Juan",
              surname: "Pérez",
              age: 20,
              dni: "12345678",
              average: 8.5
            },
            {
              name: "María",
              surname: "Gómez",
              age: 22,
              dni: "87654321",
              average: 9.0
            },
            {
              name: "Pedro",
              surname: "López",
              age: 21,
              dni: "11223344",
              average: 7.5
            }
          ];
          this.studentsSubject.next(this.students);
          return of(this.students);
        })
      )
      .subscribe();
  }

  // Obtener todos los estudiantes
  getStudents(): Observable<Student[]> {
    return this.students$;
  }

  // Obtener estudiante por DNI
  getStudentByDni(dni: string): Student | null {
    const students = this.studentsSubject.value;
    return students.find(student => student.dni === dni) || null;
  }

  // Agregar nuevo estudiante
  addStudent(student: Student): Observable<Student> {
    // Validar que el DNI no exista
    if (this.students.some(s => s.dni === student.dni)) {
      throw new Error('Ya existe un estudiante con ese DNI');
    }

    const newStudent = { ...student };
    this.students = [...this.students, newStudent];
    this.studentsSubject.next(this.students);
    
    return of(newStudent);
  }

  // Actualizar estudiante existente
  updateStudent(updatedStudent: Student): Observable<Student> {
    const index = this.students.findIndex(s => s.dni === updatedStudent.dni);
    if (index === -1) {
      throw new Error('Estudiante no encontrado');
    }

    this.students[index] = { ...updatedStudent };
    this.students = [...this.students];
    this.studentsSubject.next(this.students);
    
    return of(updatedStudent);
  }

  // Eliminar estudiante
  deleteStudent(dni: string): Observable<boolean> {
    const index = this.students.findIndex(s => s.dni === dni);
    if (index === -1) {
      throw new Error('Estudiante no encontrado');
    }

    this.students = this.students.filter(s => s.dni !== dni);
    this.studentsSubject.next(this.students);
    
    return of(true);
  }

  // Verificar si existe un DNI
  dniExists(dni: string): boolean {
    return this.students.some(student => student.dni === dni);
  }

  // Obtener estadísticas
  getStatistics(): Observable<{
    total: number;
    averageAge: number;
    averageGrade: number;
    topStudent: Student | null;
  }> {
    return this.students$.pipe(
      map(students => {
        if (students.length === 0) {
          return {
            total: 0,
            averageAge: 0,
            averageGrade: 0,
            topStudent: null
          };
        }

        const total = students.length;
        const averageAge = students.reduce((sum, s) => sum + s.age, 0) / total;
        const averageGrade = students.reduce((sum, s) => sum + s.average, 0) / total;
        const topStudent = students.reduce((top, current) => 
          current.average > top.average ? current : top, students[0]);

        return {
          total,
          averageAge: Math.round(averageAge * 100) / 100,
          averageGrade: Math.round(averageGrade * 100) / 100,
          topStudent
        };
      })
    );
  }
} 
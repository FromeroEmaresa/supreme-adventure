import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Student } from '../../shared/entities';
import { CloudMockApiService } from './cloud-mock-api.service';
import { isUsingCloudApi } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private students: Student[] = [];
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();

  constructor(private http: HttpClient, private cloudApi: CloudMockApiService) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const useCloud = isUsingCloudApi();
    const source$ = useCloud
      ? this.cloudApi.getStudents()
      : this.http.get<Student[]>('/api/students');

    source$
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
              id: "1",
              firstName: "Juan",
              lastName: "Pérez",
              age: 20,
              dni: "12345678",
              email: "juan@example.com",
              average: 8.5
            },
            {
              id: "2",
              firstName: "María",
              lastName: "Gómez",
              age: 22,
              dni: "87654321",
              email: "maria@example.com",
              average: 9.0
            },
            {
              id: "3",
              firstName: "Pedro",
              lastName: "López",
              age: 21,
              dni: "11223344",
              email: "pedro@example.com",
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
  getStudentByDni(dni: string): Observable<Student | null> {
    return this.students$.pipe(
      map(students => students.find(student => student.dni === dni) || null)
    );
  }

  // Obtener estudiante por ID
  getStudentById(id: string): Observable<Student | null> {
    return this.students$.pipe(
      map(students => students.find(student => student.id === id) || null)
    );
  }

  // Agregar nuevo estudiante
  addStudent(student: Student): Observable<Student> {
    // Validar que el DNI no exista
    if (this.students.some(s => s.dni === student.dni)) {
      throw new Error('Ya existe un estudiante con ese DNI');
    }

    const useCloud = isUsingCloudApi();
    const request$ = useCloud
      ? this.cloudApi.createStudent({
          dni: student.dni,
          firstName: student.firstName,
          lastName: student.lastName,
          age: student.age,
          email: student.email,
          average: student.average
        })
      : this.http.post<Student>('/api/students', student);

    return request$.pipe(
      tap(newStudent => {
        this.students = [...this.students, newStudent];
        this.studentsSubject.next(this.students);
      }),
      catchError(error => {
        console.error('Error agregando estudiante:', error);
        // Fallback a comportamiento local
        const newStudent = { ...student };
        this.students = [...this.students, newStudent];
        this.studentsSubject.next(this.students);
        return of(newStudent);
      })
    );
  }

  // Actualizar estudiante existente
  updateStudent(updatedStudent: Student): Observable<Student> {
    const index = this.students.findIndex(s => s.dni === updatedStudent.dni);
    if (index === -1) {
      throw new Error('Estudiante no encontrado');
    }

    const useCloud = isUsingCloudApi();
    const request$ = useCloud
      ? this.cloudApi.updateStudent(this.students[index].id, {
          dni: updatedStudent.dni,
          firstName: updatedStudent.firstName,
          lastName: updatedStudent.lastName,
          age: updatedStudent.age,
          email: updatedStudent.email
        })
      : this.http.put<Student>(`/api/students/${index}`, updatedStudent);

    return request$.pipe(
      tap(student => {
        this.students[index] = { ...student };
        this.students = [...this.students];
        this.studentsSubject.next(this.students);
      }),
      catchError(error => {
        console.error('Error actualizando estudiante:', error);
        // Fallback a comportamiento local
        this.students[index] = { ...updatedStudent };
        this.students = [...this.students];
        this.studentsSubject.next(this.students);
        return of(updatedStudent);
      })
    );
  }

  // Eliminar estudiante
  deleteStudent(dni: string): Observable<boolean> {
    const index = this.students.findIndex(s => s.dni === dni);
    if (index === -1) {
      throw new Error('Estudiante no encontrado');
    }

    const useCloud = isUsingCloudApi();
    const studentId = this.students[index].id;
    const request$ = useCloud
      ? this.cloudApi.deleteStudent(studentId)
      : this.http.delete<void>(`/api/students/${index}`);

    return request$.pipe(
      tap(() => {
        this.students = this.students.filter(s => s.dni !== dni);
        this.studentsSubject.next(this.students);
      }),
      map(() => true),
      catchError(error => {
        console.error('Error eliminando estudiante:', error);
        // Fallback a comportamiento local
        this.students = this.students.filter(s => s.dni !== dni);
        this.studentsSubject.next(this.students);
        return of(true);
      })
    );
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
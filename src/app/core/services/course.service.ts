import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Course } from '../../shared/entities';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [];
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.http.get<Course[]>('/api/courses')
      .pipe(
        tap(data => {
          this.courses = data;
          this.coursesSubject.next(this.courses);
        }),
        catchError(error => {
          console.error('Error cargando cursos:', error);
          // Datos mock de respaldo
          this.courses = [
            {
              id: "1",
              name: "Matemáticas Avanzadas",
              description: "Curso de matemáticas para estudiantes de nivel avanzado que cubre cálculo diferencial e integral.",
              credits: 4
            },
            {
              id: "2", 
              name: "Programación en JavaScript",
              description: "Aprende los fundamentos de JavaScript y desarrollo web moderno con frameworks populares.",
              credits: 3
            },
            {
              id: "3",
              name: "Historia Mundial",
              description: "Un recorrido completo por los eventos más importantes de la historia mundial desde la antigüedad hasta la actualidad.",
              credits: 2
            }
          ];
          this.coursesSubject.next(this.courses);
          return of(this.courses);
        })
      )
      .subscribe();
  }

  // Obtener todos los cursos
  getCourses(): Observable<Course[]> {
    return this.courses$;
  }

  // Obtener curso por ID
  getCourseById(id: string): Observable<Course | null> {
    return this.courses$.pipe(
      map(courses => courses.find(course => course.id === id) || null)
    );
  }

  // Agregar nuevo curso
  addCourse(course: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>('/api/courses', course).pipe(
      tap(newCourse => {
        this.courses = [...this.courses, newCourse];
        this.coursesSubject.next(this.courses);
      }),
      catchError(error => {
        console.error('Error agregando curso:', error);
        // Fallback a comportamiento local
        const newId = (Math.max(...this.courses.map(c => parseInt(c.id) || 0), 0) + 1).toString();
        const newCourse = { ...course, id: newId };
        this.courses = [...this.courses, newCourse];
        this.coursesSubject.next(this.courses);
        return of(newCourse);
      })
    );
  }

  // Actualizar curso existente
  updateCourse(updatedCourse: Course): Observable<Course> {
    const index = this.courses.findIndex(c => c.id === updatedCourse.id);
    if (index === -1) {
      throw new Error('Curso no encontrado');
    }

    return this.http.put<Course>(`/api/courses/${updatedCourse.id}`, updatedCourse).pipe(
      tap(course => {
        this.courses[index] = { ...course };
        this.courses = [...this.courses];
        this.coursesSubject.next(this.courses);
      }),
      catchError(error => {
        console.error('Error actualizando curso:', error);
        // Fallback a comportamiento local
        this.courses[index] = { ...updatedCourse };
        this.courses = [...this.courses];
        this.coursesSubject.next(this.courses);
        return of(updatedCourse);
      })
    );
  }

  // Eliminar curso
  deleteCourse(id: string): Observable<boolean> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Curso no encontrado');
    }

    return this.http.delete<any>(`/api/courses/${id}`).pipe(
      tap(() => {
        this.courses = this.courses.filter(c => c.id !== id);
        this.coursesSubject.next(this.courses);
      }),
      map(() => true),
      catchError(error => {
        console.error('Error eliminando curso:', error);
        // Fallback a comportamiento local
        this.courses = this.courses.filter(c => c.id !== id);
        this.coursesSubject.next(this.courses);
        return of(true);
      })
    );
  }

  // Verificar si existe un curso
  courseExists(id: string): boolean {
    return this.courses.some(course => course.id === id);
  }

  // Obtener estadísticas
  getStatistics(): Observable<{
    total: number;
    avgDescriptionLength: number;
  }> {
    return this.courses$.pipe(
      map(courses => {
        if (courses.length === 0) {
          return {
            total: 0,
            avgDescriptionLength: 0
          };
        }

        const total = courses.length;
        const avgDescriptionLength = courses.reduce((sum, c) => sum + c.description.length, 0) / total;

        return {
          total,
          avgDescriptionLength: Math.round(avgDescriptionLength * 100) / 100
        };
      })
    );
  }
}
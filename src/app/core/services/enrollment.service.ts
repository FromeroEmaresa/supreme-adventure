import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Enrollment, Student, Course } from '../../shared/entities';
import { StudentService } from './student.service';
import { CourseService } from './course.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private enrollments: Enrollment[] = [];
  private enrollmentsSubject = new BehaviorSubject<Enrollment[]>([]);
  public enrollments$ = this.enrollmentsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private studentService: StudentService,
    private courseService: CourseService
  ) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.http.get<any[]>('/api/enrollments')
      .pipe(
        tap(data => {
          // Convertir fechas de string a Date
          this.enrollments = data.map(enrollment => ({
            ...enrollment,
            enrollmentDate: new Date(enrollment.enrollmentDate)
          }));
          this.enrollmentsSubject.next(this.enrollments);
        }),
        catchError(error => {
          console.error('Error cargando inscripciones:', error);
          // Datos mock de respaldo
          this.enrollments = [
            {
              id: "1",
              studentDni: "12345678",
              courseId: "1",
              enrollmentDate: new Date('2024-01-15T10:00:00.000Z')
            },
            {
              id: "2",
              studentDni: "87654321", 
              courseId: "2",
              enrollmentDate: new Date('2024-01-20T14:30:00.000Z')
            },
            {
              id: "3",
              studentDni: "12345678",
              courseId: "3", 
              enrollmentDate: new Date('2024-02-01T09:15:00.000Z')
            }
          ];
          this.enrollmentsSubject.next(this.enrollments);
          return of(this.enrollments);
        })
      )
      .subscribe();
  }

  // Obtener todas las inscripciones
  getEnrollments(): Observable<Enrollment[]> {
    return this.enrollments$;
  }

  // Obtener inscripciones con datos completos (estudiante y curso)
  getEnrollmentsWithDetails(): Observable<Array<{
    enrollment: Enrollment;
    student: Student | null;
    course: Course | null;
  }>> {
    return combineLatest([
      this.enrollments$,
      this.studentService.getStudents(),
      this.courseService.getCourses()
    ]).pipe(
      map(([enrollments, students, courses]) => {
        return enrollments.map(enrollment => ({
          enrollment,
          student: students.find(s => s.dni === enrollment.studentDni) || null,
          course: courses.find(c => c.id === enrollment.courseId) || null
        }));
      })
    );
  }

  // Obtener inscripciones por estudiante
  getEnrollmentsByStudent(studentDni: string): Observable<Enrollment[]> {
    return this.enrollments$.pipe(
      map(enrollments => enrollments.filter(e => e.studentDni === studentDni))
    );
  }

  // Obtener inscripciones por curso
  getEnrollmentsByCourse(courseId: string): Observable<Enrollment[]> {
    return this.enrollments$.pipe(
      map(enrollments => enrollments.filter(e => e.courseId === courseId))
    );
  }

  // Obtener cursos de un estudiante
  getStudentCourses(studentDni: string): Observable<Course[]> {
    return combineLatest([
      this.getEnrollmentsByStudent(studentDni),
      this.courseService.getCourses()
    ]).pipe(
      map(([enrollments, courses]) => {
        const courseIds = enrollments.map(e => e.courseId);
        return courses.filter(c => courseIds.includes(c.id));
      })
    );
  }

  // Obtener estudiantes de un curso
  getCourseStudents(courseId: string): Observable<Student[]> {
    return combineLatest([
      this.getEnrollmentsByCourse(courseId),
      this.studentService.getStudents()
    ]).pipe(
      map(([enrollments, students]) => {
        const studentDnis = enrollments.map(e => e.studentDni);
        return students.filter(s => studentDnis.includes(s.dni));
      })
    );
  }

  // Agregar nueva inscripción
  addEnrollment(studentDni: string, courseId: string): Observable<Enrollment> {
    // Verificar que el estudiante no esté ya inscrito en el curso
    if (this.enrollments.some(e => e.studentDni === studentDni && e.courseId === courseId)) {
      throw new Error('El estudiante ya está inscrito en este curso');
    }

    // Verificar que el estudiante exista
    if (!this.studentService.getStudentByDni(studentDni)) {
      throw new Error('Estudiante no encontrado');
    }

    // Verificar que el curso exista
    if (!this.courseService.getCourseById(courseId)) {
      throw new Error('Curso no encontrado');
    }

    const newEnrollmentData = {
      studentDni,
      courseId,
      enrollmentDate: new Date().toISOString()
    };

    return this.http.post<any>('/api/enrollments', newEnrollmentData).pipe(
      map(response => ({
        ...response,
        enrollmentDate: new Date(response.enrollmentDate)
      })),
      tap(newEnrollment => {
        this.enrollments = [...this.enrollments, newEnrollment];
        this.enrollmentsSubject.next(this.enrollments);
      }),
      catchError(error => {
        console.error('Error agregando inscripción:', error);
        // Fallback a comportamiento local
        const newId = (Math.max(...this.enrollments.map(e => parseInt(e.id) || 0), 0) + 1).toString();
        const newEnrollment: Enrollment = {
          id: newId,
          studentDni,
          courseId,
          enrollmentDate: new Date()
        };
        this.enrollments = [...this.enrollments, newEnrollment];
        this.enrollmentsSubject.next(this.enrollments);
        return of(newEnrollment);
      })
    );
  }

  // Eliminar inscripción
  deleteEnrollment(id: string): Observable<boolean> {
    const index = this.enrollments.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Inscripción no encontrada');
    }

    return this.http.delete<any>(`/api/enrollments/${id}`).pipe(
      tap(() => {
        this.enrollments = this.enrollments.filter(e => e.id !== id);
        this.enrollmentsSubject.next(this.enrollments);
      }),
      map(() => true),
      catchError(error => {
        console.error('Error eliminando inscripción:', error);
        // Fallback a comportamiento local
        this.enrollments = this.enrollments.filter(e => e.id !== id);
        this.enrollmentsSubject.next(this.enrollments);
        return of(true);
      })
    );
  }

  // Verificar si existe una inscripción
  enrollmentExists(studentDni: string, courseId: string): boolean {
    return this.enrollments.some(e => e.studentDni === studentDni && e.courseId === courseId);
  }

  // Obtener estadísticas
  getStatistics(): Observable<{
    total: number;
    uniqueStudents: number;
    uniqueCourses: number;
    avgEnrollmentsPerStudent: number;
    avgEnrollmentsPerCourse: number;
  }> {
    return this.enrollments$.pipe(
      map(enrollments => {
        if (enrollments.length === 0) {
          return {
            total: 0,
            uniqueStudents: 0,
            uniqueCourses: 0,
            avgEnrollmentsPerStudent: 0,
            avgEnrollmentsPerCourse: 0
          };
        }

        const total = enrollments.length;
        const uniqueStudents = new Set(enrollments.map(e => e.studentDni)).size;
        const uniqueCourses = new Set(enrollments.map(e => e.courseId)).size;
        const avgEnrollmentsPerStudent = total / uniqueStudents;
        const avgEnrollmentsPerCourse = total / uniqueCourses;

        return {
          total,
          uniqueStudents,
          uniqueCourses,
          avgEnrollmentsPerStudent: Math.round(avgEnrollmentsPerStudent * 100) / 100,
          avgEnrollmentsPerCourse: Math.round(avgEnrollmentsPerCourse * 100) / 100
        };
      })
    );
  }
}
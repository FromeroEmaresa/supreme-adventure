import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError, map } from 'rxjs/operators';
import { Student, Course, Enrollment, User, LoginRequest, AuthResponse } from '../../shared/entities';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {

  // Simular una API base URL
  private readonly API_BASE_URL = 'https://api.ejemplo.com/v1';
  
  // Simular headers de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Simular delay de red
  private simulateNetworkDelay(): Observable<any> {
    return of(null).pipe(delay(Math.random() * 1000 + 500)); // 500-1500ms
  }

  // Simular errores de red ocasionalmente
  private simulateNetworkError(): boolean {
    return Math.random() < 0.05; // 5% de probabilidad de error
  }

  // Manejo de errores HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 401:
          errorMessage = 'No autorizado. Token inválido o expirado.';
          break;
        case 403:
          errorMessage = 'Acceso denegado. No tienes permisos para esta operación.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor.';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('Mock API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // ===== AUTHENTICATION ENDPOINTS =====
  
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.simulateNetworkDelay().pipe(
      map(() => {
        if (this.simulateNetworkError()) {
          throw new Error('Error de conexión');
        }
        
        // Simular validación de credenciales
        if (credentials.username === 'admin' && credentials.password === 'admin') {
          return {
            user: {
              id: '1',
              username: 'admin',
              password: 'admin',
              name: 'Administrador',
              email: 'admin@ejemplo.com',
              role: 'admin' as const
            },
            token: 'mock-jwt-token-admin-' + Date.now()
          };
        } else if (credentials.username === 'user' && credentials.password === 'user') {
          return {
            user: {
              id: '2',
              username: 'user',
              password: 'user',
              name: 'Usuario',
              email: 'user@ejemplo.com',
              role: 'user' as const
            },
            token: 'mock-jwt-token-user-' + Date.now()
          };
        } else {
          throw new Error('Credenciales inválidas');
        }
      }),
      catchError(error => this.handleError({ error, status: 401 } as HttpErrorResponse))
    );
  }

  logout(): Observable<void> {
    return this.simulateNetworkDelay().pipe(
      map(() => {
        if (this.simulateNetworkError()) {
          throw new Error('Error de conexión');
        }
        // Simular logout exitoso
        return;
      }),
      catchError(error => this.handleError({ error, status: 500 } as HttpErrorResponse))
    );
  }

  // ===== STUDENTS ENDPOINTS =====
  
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.API_BASE_URL}/students`, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 1000 + 300),
      catchError(error => this.handleError(error))
    );
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.API_BASE_URL}/students/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 500 + 200),
      catchError(error => this.handleError(error))
    );
  }

  createStudent(student: Omit<Student, 'id'>): Observable<Student> {
    return this.http.post<Student>(`${this.API_BASE_URL}/students`, student, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 800 + 400),
      catchError(error => this.handleError(error))
    );
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.API_BASE_URL}/students/${id}`, student, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 600 + 300),
      catchError(error => this.handleError(error))
    );
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/students/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 400 + 200),
      catchError(error => this.handleError(error))
    );
  }

  // ===== COURSES ENDPOINTS =====
  
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.API_BASE_URL}/courses`, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 1000 + 300),
      catchError(error => this.handleError(error))
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.API_BASE_URL}/courses/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 500 + 200),
      catchError(error => this.handleError(error))
    );
  }

  createCourse(course: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(`${this.API_BASE_URL}/courses`, course, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 800 + 400),
      catchError(error => this.handleError(error))
    );
  }

  updateCourse(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.API_BASE_URL}/courses/${id}`, course, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 600 + 300),
      catchError(error => this.handleError(error))
    );
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/courses/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 400 + 200),
      catchError(error => this.handleError(error))
    );
  }

  // ===== ENROLLMENTS ENDPOINTS =====
  
  getEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.API_BASE_URL}/enrollments`, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 1000 + 300),
      catchError(error => this.handleError(error))
    );
  }

  getEnrollmentById(id: number): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.API_BASE_URL}/enrollments/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 500 + 200),
      catchError(error => this.handleError(error))
    );
  }

  createEnrollment(enrollment: Omit<Enrollment, 'id'>): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.API_BASE_URL}/enrollments`, enrollment, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 800 + 400),
      catchError(error => this.handleError(error))
    );
  }

  updateEnrollment(id: number, enrollment: Enrollment): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.API_BASE_URL}/enrollments/${id}`, enrollment, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 600 + 300),
      catchError(error => this.handleError(error))
    );
  }

  deleteEnrollment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/enrollments/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 400 + 200),
      catchError(error => this.handleError(error))
    );
  }

  // ===== USERS ENDPOINTS =====
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_BASE_URL}/users`, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 1000 + 300),
      catchError(error => this.handleError(error))
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_BASE_URL}/users/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 500 + 200),
      catchError(error => this.handleError(error))
    );
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.API_BASE_URL}/users`, user, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 800 + 400),
      catchError(error => this.handleError(error))
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.API_BASE_URL}/users/${id}`, user, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 600 + 300),
      catchError(error => this.handleError(error))
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/users/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      delay(Math.random() * 400 + 200),
      catchError(error => this.handleError(error))
    );
  }

  constructor(private http: HttpClient) {}
}

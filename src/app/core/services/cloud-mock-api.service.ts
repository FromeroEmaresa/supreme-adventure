import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, delay } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { 
  Student, 
  Course, 
  Enrollment, 
  User, 
  LoginRequest, 
  AuthResponse,
  CreateStudentRequest,
  CreateCourseRequest,
  CreateEnrollmentRequest,
  CreateUserRequest,
  UpdateStudentRequest,
  UpdateCourseRequest,
  UpdateUserRequest
} from '../../shared/entities';

@Injectable({
  providedIn: 'root'
})
export class CloudMockApiService {
  
  // APIs reales en la nube para simular servicios externos
  private readonly CLOUD_APIS = {
    // JSONPlaceholder - API real en la nube para datos de ejemplo
    users: 'https://jsonplaceholder.typicode.com/users',
    posts: 'https://jsonplaceholder.typicode.com/posts',
    
    // MockAPI.io - API personalizada para tu sistema
    academic: 'https://68bedb5c9c70953d96ede86f.mockapi.io/api',
    
    // JSON Server en la nube (Heroku/Railway)
    jsonServer: 'https://fromero-e01-api.herokuapp.com',
    
    // API de ejemplo personalizada
    example: 'https://api.ejemplo.com/v1'
  };

  // Headers de autenticación simulados
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || 'mock-jwt-token-cloud';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-API-Key': 'fromero-e01-cloud-key',
      'X-Request-ID': this.generateRequestId()
    });
  }

  private generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Simular delay de red realista
  private simulateNetworkDelay(): Observable<void> {
    const delayMs = Math.floor(Math.random() * 1500) + 500; // 500-2000ms
    return of(void 0).pipe(delay(delayMs));
  }

  // Simular errores de red ocasionales
  private simulateNetworkError(): Observable<never> {
    const errorChance = Math.random();
    if (errorChance < 0.05) { // 5% de probabilidad de error
      const errors = [
        { status: 500, message: 'Internal Server Error' },
        { status: 503, message: 'Service Unavailable' },
        { status: 408, message: 'Request Timeout' },
        { status: 429, message: 'Too Many Requests' }
      ];
      const randomError = errors[Math.floor(Math.random() * errors.length)];
      return throwError(() => new Error(`Cloud API Error: ${randomError.message}`));
    }
    return throwError(() => new Error('Network Error'));
  }

  // ===== AUTHENTICATION =====
  
  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('🌐 Cloud Mock API: Login against MockAPI.io');
    const url = `${this.CLOUD_APIS.academic}/login`;
    return this.http.get<any[]>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(records => {
        const match = records.find(r => r.username === credentials.username && r.password === credentials.password);
        if (!match) {
          throw new Error('Invalid credentials');
        }
        const role = (match.role === 'admin' || match.role === 'user')
          ? (match.role as 'admin' | 'user')
          : (match.username === 'admin' ? ('admin' as const) : ('user' as const));
        const user: User = {
          id: String(match.id ?? match.objectId ?? match._id ?? '0'),
          username: match.username,
          password: match.password,
          name: match.username,
          email: `${match.username}@sistema.com`,
          role
        };
        const response: AuthResponse = {
          user,
          token: `mockapi-jwt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        return response;
      }),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Login error', error);
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    console.log('🌐 Cloud Mock API: Logout request to cloud service');
    
    return this.simulateNetworkDelay().pipe(
      map(() => {
        // Simular logout en la nube
        localStorage.removeItem('token');
        return void 0;
      }),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Logout error', error);
        return of(void 0); // Siempre permitir logout
      })
    );
  }

  // ===== STUDENTS =====
  
  getStudents(): Observable<Student[]> {
    console.log('🌐 Cloud Mock API: Fetching students from MockAPI.io');
    const url = `${this.CLOUD_APIS.academic}/students`;
    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() }).pipe(
      map(items => items.map((it: any) => ({
        id: String(it.id),
        dni: String(it.dni),
        firstName: it.firstName,
        lastName: it.lastName,
        age: Number(it.age ?? 0),
        email: it.email ?? `${it.firstName}.${it.lastName}@example.com`,
        average: Number(it.average ?? 0)
      }) as Student)),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error fetching students', error);
        return this.getLocalStudents();
      })
    );
  }

  createStudent(student: CreateStudentRequest): Observable<Student> {
    console.log('🌐 Cloud Mock API: Creating student in MockAPI.io');
    const url = `${this.CLOUD_APIS.academic}/students`;
    return this.http.post<any>(url, student, { headers: this.getAuthHeaders() }).pipe(
      map((created: any) => ({
        id: String(created.id),
        dni: String(created.dni),
        firstName: created.firstName,
        lastName: created.lastName,
        age: Number(created.age ?? student.age),
        email: created.email ?? student.email,
        average: Number(created.average ?? student.average ?? 0)
      }) as Student),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error creating student', error);
        return throwError(() => error);
      })
    );
  }

  updateStudent(id: string, student: UpdateStudentRequest): Observable<Student> {
    console.log('🌐 Cloud Mock API: Updating student in MockAPI.io');
    const url = `${this.CLOUD_APIS.academic}/students/${id}`;
    return this.http.put<any>(url, student, { headers: this.getAuthHeaders() }).pipe(
      map((updated: any) => ({
        id: String(updated.id ?? id),
        dni: String(updated.dni ?? student.dni),
        firstName: updated.firstName ?? student.firstName,
        lastName: updated.lastName ?? student.lastName,
        age: Number(updated.age ?? student.age),
        email: updated.email ?? student.email,
        average: Number(updated.average ?? 0)
      }) as Student),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error updating student', error);
        return throwError(() => error);
      })
    );
  }

  deleteStudent(id: string): Observable<void> {
    console.log('🌐 Cloud Mock API: Deleting student from MockAPI.io');
    const url = `${this.CLOUD_APIS.academic}/students/${id}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error deleting student', error);
        return throwError(() => error);
      })
    );
  }

  // ===== COURSES =====
  
  getCourses(): Observable<Course[]> {
    console.log('🌐 Cloud Mock API: Fetching courses from cloud');
    
    // Usar posts de JSONPlaceholder para simular cursos
    return this.http.get<any[]>(`${this.CLOUD_APIS.posts}`).pipe(
      map(posts => posts.slice(0, 8).map((post, index) => ({
        id: (index + 1).toString(),
        name: post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title,
        description: post.body.length > 100 ? post.body.substring(0, 100) + '...' : post.body,
        credits: (index % 5) + 1
      }))),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error fetching courses', error);
        // Fallback a datos locales si la API falla
        return this.getLocalCourses();
      })
    );
  }

  createCourse(course: CreateCourseRequest): Observable<Course> {
    console.log('🌐 Cloud Mock API: Creating course in cloud');
    
    return this.simulateNetworkDelay().pipe(
      map(() => ({
        ...course,
        id: Date.now().toString()
      })),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error creating course', error);
        return throwError(() => error);
      })
    );
  }

  updateCourse(id: string, course: UpdateCourseRequest): Observable<Course> {
    console.log('🌐 Cloud Mock API: Updating course in cloud');
    
    return this.simulateNetworkDelay().pipe(
      map(() => ({
        ...course,
        id
      })),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error updating course', error);
        return throwError(() => error);
      })
    );
  }

  deleteCourse(id: string): Observable<void> {
    console.log('🌐 Cloud Mock API: Deleting course in cloud');
    
    return this.simulateNetworkDelay().pipe(
      map(() => void 0),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error deleting course', error);
        return throwError(() => error);
      })
    );
  }

  // ===== ENROLLMENTS =====
  
  getEnrollments(): Observable<Enrollment[]> {
    console.log('🌐 Cloud Mock API: Fetching enrollments from cloud');
    
    // Simular inscripciones basadas en estudiantes y cursos
    return this.simulateNetworkDelay().pipe(
      switchMap(() => this.getStudents()),
      map(students => {
        const enrollments: Enrollment[] = [];
        students.slice(0, 5).forEach((student, index) => {
          enrollments.push({
            id: (index + 1).toString(),
            studentId: student.id,
            courseId: (index % 3 + 1).toString(),
            enrollmentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
        });
        return enrollments;
      }),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error fetching enrollments', error);
        return this.getLocalEnrollments();
      })
    );
  }

  createEnrollment(enrollment: CreateEnrollmentRequest): Observable<Enrollment> {
    console.log('🌐 Cloud Mock API: Creating enrollment in cloud');
    
    return this.simulateNetworkDelay().pipe(
      map(() => ({
        ...enrollment,
        id: Date.now().toString(),
        enrollmentDate: new Date()
      })),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error creating enrollment', error);
        return throwError(() => error);
      })
    );
  }

  deleteEnrollment(id: string): Observable<void> {
    console.log('🌐 Cloud Mock API: Deleting enrollment from cloud');
    
    return this.simulateNetworkDelay().pipe(
      map(() => void 0),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error deleting enrollment', error);
        return throwError(() => error);
      })
    );
  }

  // ===== USERS =====
  
  getUsers(): Observable<User[]> {
    console.log('🌐 Cloud Mock API: Fetching users from cloud');
    
    // Usar JSONPlaceholder para simular usuarios del sistema
    return this.http.get<any[]>(`${this.CLOUD_APIS.users}`).pipe(
      map(users => users.slice(0, 5).map((user, index) => ({
        id: (index + 1).toString(),
        username: user.username || `user${index + 1}`,
        password: 'password123',
        name: user.name,
        email: user.email,
        role: index === 0 ? 'admin' as const : 'user' as const
      }))),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error fetching users', error);
        return this.getLocalUsers();
      })
    );
  }

  createUser(user: CreateUserRequest): Observable<User> {
    console.log('🌐 Cloud Mock API: Creating user in cloud');
    
    return this.simulateNetworkDelay().pipe(
      map(() => ({
        ...user,
        id: Date.now().toString()
      })),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error creating user', error);
        return throwError(() => error);
      })
    );
  }

  updateUser(id: string, user: UpdateUserRequest): Observable<User> {
    console.log('🌐 Cloud Mock API: Updating user in cloud');
    
    return this.simulateNetworkDelay().pipe(
      map(() => ({
        ...user,
        id
      })),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error updating user', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    console.log('🌐 Cloud Mock API: Deleting user from cloud');
    
    return this.simulateNetworkDelay().pipe(
      map(() => void 0),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error deleting user', error);
        return throwError(() => error);
      })
    );
  }

  // ===== FALLBACK METHODS (datos locales) =====
  
  private getLocalStudents(): Observable<Student[]> {
    // Datos de fallback locales
    const localStudents: Student[] = [
      {
        id: '1',
        dni: '12345678',
        firstName: 'Juan',
        lastName: 'Pérez',
        age: 20,
        email: 'juan@example.com',
        average: 8.5
      },
      {
        id: '2',
        dni: '87654321',
        firstName: 'María',
        lastName: 'García',
        age: 22,
        email: 'maria@example.com',
        average: 9.2
      }
    ];
    return of(localStudents);
  }

  private getLocalCourses(): Observable<Course[]> {
    const localCourses: Course[] = [
      {
        id: '1',
        name: 'Matemáticas',
        description: 'Curso de matemáticas básicas',
        credits: 4
      },
      {
        id: '2',
        name: 'Programación',
        description: 'Fundamentos de programación',
        credits: 5
      }
    ];
    return of(localCourses);
  }

  private getLocalEnrollments(): Observable<Enrollment[]> {
    const localEnrollments: Enrollment[] = [
      {
        id: '1',
        studentId: '1',
        courseId: '1',
        enrollmentDate: new Date('2024-01-15T00:00:00.000Z')
      }
    ];
    return of(localEnrollments);
  }

  private getLocalUsers(): Observable<User[]> {
    const localUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        password: 'admin123',
        name: 'Administrador',
        email: 'admin@sistema.com',
        role: 'admin'
      },
      {
        id: '2',
        username: 'user',
        password: 'user123',
        name: 'Usuario Regular',
        email: 'user@sistema.com',
        role: 'user'
      }
    ];
    return of(localUsers);
  }

  constructor(private http: HttpClient) {}
}

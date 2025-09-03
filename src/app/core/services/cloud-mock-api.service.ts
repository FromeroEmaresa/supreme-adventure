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
    academic: 'https://mockapi.io/projects/64f8b8b0b88a4e4b8b8b8b8b',
    
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
    console.log('🌐 Cloud Mock API: Login request to cloud service');
    
    return this.simulateNetworkDelay().pipe(
      switchMap(() => {
        // Simular validación en la nube
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          const mockUser: User = {
            id: '1',
            username: 'admin',
            password: 'admin123',
            name: 'Administrador',
            email: 'admin@sistema.com',
            role: 'admin' as const
          };
          
          const response: AuthResponse = {
            user: mockUser,
            token: `cloud-jwt-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          };
          
          return of(response);
        } else if (credentials.username === 'user' && credentials.password === 'user123') {
          const mockUser: User = {
            id: '2',
            username: 'user',
            password: 'user123',
            name: 'Usuario Regular',
            email: 'user@sistema.com',
            role: 'user' as const
          };
          
          const response: AuthResponse = {
            user: mockUser,
            token: `cloud-jwt-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          };
          
          return of(response);
        } else {
          return throwError(() => new Error('Invalid credentials'));
        }
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
    console.log('🌐 Cloud Mock API: Fetching students from cloud');
    
    // Usar JSONPlaceholder para simular datos reales de la nube
    return this.http.get<any[]>(`${this.CLOUD_APIS.users}`).pipe(
      map(users => users.slice(0, 10).map((user, index) => ({
        id: (index + 1).toString(),
        dni: (10000000 + index).toString(),
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1).join(' ') || 'Apellido',
        age: 18 + (index % 20),
        email: user.email,
        average: parseFloat((7 + (index % 3) + Math.random()).toFixed(2))
      }))),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error fetching students', error);
        // Fallback a datos locales si la API falla
        return this.getLocalStudents();
      })
    );
  }

  createStudent(student: CreateStudentRequest): Observable<Student> {
    console.log('🌐 Cloud Mock API: Creating student in cloud');
    
    return this.simulateNetworkDelay().pipe(
      map(() => {
        const newStudent: Student = {
          id: Date.now().toString(),
          dni: student.dni,
          firstName: student.firstName,
          lastName: student.lastName,
          age: student.age,
          email: student.email,
          average: student.average || 0
        };
        return newStudent;
      }),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error creating student', error);
        return throwError(() => error);
      })
    );
  }

  updateStudent(id: string, student: UpdateStudentRequest): Observable<Student> {
    console.log('🌐 Cloud Mock API: Updating student in cloud');
    
    return this.simulateNetworkDelay().pipe(
      map(() => {
        const updatedStudent: Student = {
          id,
          dni: student.dni,
          firstName: student.firstName,
          lastName: student.lastName,
          age: student.age,
          email: student.email,
          average: 0 // Valor por defecto para actualizaciones
        };
        return updatedStudent;
      }),
      catchError(error => {
        console.error('🌐 Cloud Mock API: Error updating student', error);
        return throwError(() => error);
      })
    );
  }

  deleteStudent(id: string): Observable<void> {
    console.log('🌐 Cloud Mock API: Deleting student from cloud');
    
    return this.simulateNetworkDelay().pipe(
      map(() => void 0),
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

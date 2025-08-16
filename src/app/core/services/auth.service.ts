import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User, LoginRequest, AuthResponse, AuthState } from '../../shared/entities';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000';
  private readonly STORAGE_KEY = 'auth_data';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null
  });
  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  /**
   * Inicia sesión del usuario
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.get<User[]>(`${this.API_URL}/users`).pipe(
      map(users => {
        const user = users.find(u => 
          u.username === credentials.username && 
          u.password === credentials.password
        );
        
        if (!user) {
          throw new Error('Credenciales inválidas');
        }
        
        const response: AuthResponse = {
          user: { ...user, password: '' }, // No enviar password en la respuesta
          token: this.generateToken(user)
        };
        
        return response;
      }),
      tap(response => this.setAuthState(response)),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => new Error('Error de autenticación'));
      })
    );
  }

  /**
   * Cierra sesión del usuario
   */
  logout(): void {
    this.clearAuthState();
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  /**
   * Genera un token JWT simulado
   */
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    };
    
    // Simulación de JWT (en producción usaría una librería real)
    return btoa(JSON.stringify(payload));
  }

  /**
   * Establece el estado de autenticación
   */
  private setAuthState(response: AuthResponse): void {
    const authState: AuthState = {
      user: response.user,
      isAuthenticated: true,
      token: response.token
    };
    
    this.currentUserSubject.next(response.user);
    this.authStateSubject.next(authState);
    this.storeAuth(authState);
  }

  /**
   * Limpia el estado de autenticación
   */
  private clearAuthState(): void {
    const authState: AuthState = {
      user: null,
      isAuthenticated: false,
      token: null
    };
    
    this.currentUserSubject.next(null);
    this.authStateSubject.next(authState);
    this.removeStoredAuth();
  }

  /**
   * Guarda la autenticación en localStorage
   */
  private storeAuth(authState: AuthState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authState));
    } catch (error) {
      console.error('Error al guardar autenticación:', error);
    }
  }

  /**
   * Carga la autenticación desde localStorage
   */
  private loadStoredAuth(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const authState: AuthState = JSON.parse(stored);
        // Verificar si el token no ha expirado
        if (authState.token && this.isTokenValid(authState.token)) {
          this.currentUserSubject.next(authState.user);
          this.authStateSubject.next(authState);
        } else {
          this.clearAuthState();
        }
      }
    } catch (error) {
      console.error('Error al cargar autenticación:', error);
      this.clearAuthState();
    }
  }

  /**
   * Elimina la autenticación almacenada
   */
  private removeStoredAuth(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error al eliminar autenticación:', error);
    }
  }

  /**
   * Verifica si el token es válido
   */
  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }
} 
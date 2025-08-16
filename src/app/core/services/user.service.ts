import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../../shared/entities';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:3000';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  /**
   * Cargar todos los usuarios
   */
  loadUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users`).pipe(
      tap(users => this.usersSubject.next(users))
    );
  }

  /**
   * Obtener todos los usuarios
   */
  getUsers(): Observable<User[]> {
    return this.users$;
  }

  /**
   * Obtener usuario por ID
   */
  getUserById(id: string): Observable<User | undefined> {
    return this.http.get<User>(`${this.API_URL}/users/${id}`);
  }

  /**
   * Crear nuevo usuario
   */
  createUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser = {
      ...user,
      id: this.generateId()
    };

    return this.http.post<User>(`${this.API_URL}/users`, newUser).pipe(
      tap(() => this.loadUsers().subscribe())
    );
  }

  /**
   * Actualizar usuario
   */
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/${id}`, user).pipe(
      tap(() => this.loadUsers().subscribe())
    );
  }

  /**
   * Eliminar usuario
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/users/${id}`).pipe(
      tap(() => this.loadUsers().subscribe())
    );
  }

  /**
   * Verificar si el username ya existe
   */
  checkUsernameExists(username: string, excludeId?: string): Observable<boolean> {
    return this.getUsers().pipe(
      map(users => {
        const filteredUsers = excludeId 
          ? users.filter(user => user.id !== excludeId)
          : users;
        return filteredUsers.some(user => user.username === username);
      })
    );
  }

  /**
   * Generar ID único
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Obtener usuarios por rol
   */
  getUsersByRole(role: string): Observable<User[]> {
    return this.getUsers().pipe(
      map(users => users.filter(user => user.role === role))
    );
  }

  /**
   * Obtener estadísticas de usuarios
   */
  getUserStats(): Observable<{ total: number; admins: number; users: number }> {
    return this.getUsers().pipe(
      map(users => ({
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        users: users.filter(u => u.role === 'user').length
      }))
    );
  }
} 
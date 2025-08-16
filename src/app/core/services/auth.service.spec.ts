import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User, LoginRequest } from '../../shared/entities';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Administrador',
      email: 'admin@test.com'
    },
    {
      id: '2',
      username: 'user',
      password: 'user123',
      role: 'user',
      name: 'Usuario',
      email: 'user@test.com'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should authenticate valid admin credentials', () => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: 'admin123'
      };

      service.login(credentials).subscribe(response => {
        expect(response.user.username).toBe('admin');
        expect(response.user.role).toBe('admin');
        expect(response.token).toBeTruthy();
      });

      const req = httpMock.expectOne('http://localhost:3000/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should authenticate valid user credentials', () => {
      const credentials: LoginRequest = {
        username: 'user',
        password: 'user123'
      };

      service.login(credentials).subscribe(response => {
        expect(response.user.username).toBe('user');
        expect(response.user.role).toBe('user');
        expect(response.token).toBeTruthy();
      });

      const req = httpMock.expectOne('http://localhost:3000/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should reject invalid credentials', () => {
      const credentials: LoginRequest = {
        username: 'invalid',
        password: 'invalid'
      };

      service.login(credentials).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Credenciales inválidas');
        }
      });

      const req = httpMock.expectOne('http://localhost:3000/users');
      req.flush(mockUsers);
    });
  });

  describe('authentication state', () => {
    it('should return false when not authenticated', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true when authenticated', () => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: 'admin123'
      };

      service.login(credentials).subscribe(() => {
        expect(service.isAuthenticated()).toBe(true);
      });

      const req = httpMock.expectOne('http://localhost:3000/users');
      req.flush(mockUsers);
    });

    it('should return false after logout', () => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: 'admin123'
      };

      service.login(credentials).subscribe(() => {
        service.logout();
        expect(service.isAuthenticated()).toBe(false);
      });

      const req = httpMock.expectOne('http://localhost:3000/users');
      req.flush(mockUsers);
    });
  });

  describe('role checking', () => {
    it('should return true for admin role when user is admin', () => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: 'admin123'
      };

      service.login(credentials).subscribe(() => {
        expect(service.hasRole('admin')).toBe(true);
        expect(service.isAdmin()).toBe(true);
      });

      const req = httpMock.expectOne('http://localhost:3000/users');
      req.flush(mockUsers);
    });

    it('should return false for admin role when user is not admin', () => {
      const credentials: LoginRequest = {
        username: 'user',
        password: 'user123'
      };

      service.login(credentials).subscribe(() => {
        expect(service.hasRole('admin')).toBe(false);
        expect(service.isAdmin()).toBe(false);
      });

      const req = httpMock.expectOne('http://localhost:3000/users');
      req.flush(mockUsers);
    });
  });

  describe('current user', () => {
    it('should return current user when authenticated', () => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: 'admin123'
      };

      service.login(credentials).subscribe(() => {
        const currentUser = service.getCurrentUser();
        expect(currentUser).toBeTruthy();
        expect(currentUser?.username).toBe('admin');
        expect(currentUser?.name).toBe('Administrador');
      });

      const req = httpMock.expectOne('http://localhost:3000/users');
      req.flush(mockUsers);
    });

    it('should return null when not authenticated', () => {
      expect(service.getCurrentUser()).toBeNull();
    });
  });
}); 
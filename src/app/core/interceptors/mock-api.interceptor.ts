import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError, switchMap } from 'rxjs/operators';

export const MockApiInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> => {
  
  // Simular una API real con delays y errores
  return simulateApiCall(request, next);
};

function simulateApiCall(request: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  
  // Simular delay de red (500-2000ms)
  const networkDelay = Math.random() * 1500 + 500;
  
  // Simular errores de red ocasionalmente (3% de probabilidad)
  const shouldSimulateError = Math.random() < 0.03;
  
  if (shouldSimulateError) {
    return of(null).pipe(
      delay(networkDelay),
      switchMap(() => {
        const errorResponse = createMockErrorResponse(request);
        return throwError(() => errorResponse);
      })
    );
  }

  // Simular timeout ocasionalmente (1% de probabilidad)
  const shouldSimulateTimeout = Math.random() < 0.01;
  
  if (shouldSimulateTimeout) {
    return of(null).pipe(
      delay(10000), // 10 segundos para simular timeout
      switchMap(() => {
        const timeoutError = new HttpErrorResponse({
          error: 'Request timeout',
          status: 408,
          statusText: 'Request Timeout'
        });
        return throwError(() => timeoutError);
      })
    );
  }

  // Simular respuesta exitosa con delay
  return next(request).pipe(
    delay(networkDelay),
    catchError((error: HttpErrorResponse) => {
      // Simular errores específicos basados en el endpoint
      const mockError = simulateEndpointSpecificErrors(request, error);
      return throwError(() => mockError);
    })
  );
}

function createMockErrorResponse(request: HttpRequest<any>): HttpErrorResponse {
  const errorTypes = [
    { status: 401, message: 'Unauthorized - Token inválido o expirado' },
    { status: 403, message: 'Forbidden - No tienes permisos para acceder a este recurso' },
    { status: 404, message: 'Not Found - El recurso solicitado no existe' },
    { status: 500, message: 'Internal Server Error - Error interno del servidor' },
    { status: 503, message: 'Service Unavailable - Servicio temporalmente no disponible' }
  ];

  const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
  
  return new HttpErrorResponse({
    error: {
      message: randomError.message,
      code: randomError.status,
      timestamp: new Date().toISOString(),
      path: request.url
    },
    status: randomError.status,
    statusText: randomError.message
  });
}

function simulateEndpointSpecificErrors(request: HttpRequest<any>, originalError: HttpErrorResponse): HttpErrorResponse {
  const url = request.url;
  
  // Simular errores específicos según el endpoint
  if (url.includes('/auth/login')) {
    if (originalError.status === 401) {
      return new HttpErrorResponse({
        error: {
          message: 'Credenciales inválidas. Verifica tu usuario y contraseña.',
          code: 401,
          timestamp: new Date().toISOString()
        },
        status: 401,
        statusText: 'Unauthorized'
      });
    }
  }
  
  if (url.includes('/students') || url.includes('/courses') || url.includes('/enrollments')) {
    if (originalError.status === 403) {
      return new HttpErrorResponse({
        error: {
          message: 'Acceso denegado. Solo los administradores pueden realizar esta operación.',
          code: 403,
          timestamp: new Date().toISOString()
        },
        status: 403,
        statusText: 'Forbidden'
      });
    }
  }
  
  if (url.includes('/users')) {
    if (originalError.status === 403) {
      return new HttpErrorResponse({
        error: {
          message: 'Acceso denegado. La gestión de usuarios está restringida a administradores.',
          code: 403,
          timestamp: new Date().toISOString()
        },
        status: 403,
        statusText: 'Forbidden'
      });
    }
  }

  // Si no hay error específico, devolver el error original
  return originalError;
}

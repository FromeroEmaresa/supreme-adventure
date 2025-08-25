# 🚀 Mock API - Simulación de API en la Nube

## 📋 Descripción

Este proyecto implementa un **Mock API** que simula una API real en la nube, cumpliendo con los requisitos de la siguiente entrega del proyecto. El Mock API incluye:

- ✅ Simulación de delays de red realistas
- ✅ Manejo de errores HTTP específicos
- ✅ Headers de autenticación (Bearer Token)
- ✅ Timeouts y errores de conexión
- ✅ Respuestas estructuradas como una API real

## 🏗️ Arquitectura del Mock API

### 1. **MockApiService** (`src/app/core/services/mock-api.service.ts`)
Servicio principal que simula las llamadas a una API externa:

```typescript
// Simula una API base URL real
private readonly API_BASE_URL = 'https://api.ejemplo.com/v1';

// Headers de autenticación con Bearer Token
private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  return new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
}
```

### 2. **MockApiInterceptor** (`src/app/core/interceptors/mock-api.interceptor.ts`)
Interceptor HTTP que simula comportamientos de red reales:

- **Delays de red**: 500-2000ms
- **Errores aleatorios**: 3% de probabilidad
- **Timeouts**: 1% de probabilidad (10 segundos)
- **Errores específicos por endpoint**

## 🔧 Características Implementadas

### ✅ **Simulación de Red Realista**
- Delays variables (500-2000ms)
- Errores de conexión aleatorios
- Timeouts simulados
- Headers de autenticación

### ✅ **Manejo de Errores HTTP**
- **401 Unauthorized**: Token inválido o expirado
- **403 Forbidden**: Acceso denegado por permisos
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor
- **503 Service Unavailable**: Servicio no disponible
- **408 Request Timeout**: Timeout de conexión

### ✅ **Endpoints Simulados**
```
GET    /api/v1/students          - Obtener todos los estudiantes
GET    /api/v1/students/:id      - Obtener estudiante por ID
POST   /api/v1/students          - Crear nuevo estudiante
PUT    /api/v1/students/:id      - Actualizar estudiante
DELETE /api/v1/students/:id      - Eliminar estudiante

GET    /api/v1/courses           - Obtener todos los cursos
GET    /api/v1/courses/:id       - Obtener curso por ID
POST   /api/v1/courses           - Crear nuevo curso
PUT    /api/v1/courses/:id       - Actualizar curso
DELETE /api/v1/courses/:id       - Eliminar curso

GET    /api/v1/enrollments       - Obtener todas las inscripciones
GET    /api/v1/enrollments/:id   - Obtener inscripción por ID
POST   /api/v1/enrollments       - Crear nueva inscripción
PUT    /api/v1/enrollments/:id   - Actualizar inscripción
DELETE /api/v1/enrollments/:id   - Eliminar inscripción

GET    /api/v1/users             - Obtener todos los usuarios
GET    /api/v1/users/:id         - Obtener usuario por ID
POST   /api/v1/users             - Crear nuevo usuario
PUT    /api/v1/users/:id         - Actualizar usuario
DELETE /api/v1/users/:id         - Eliminar usuario

POST   /api/v1/auth/login        - Autenticación
POST   /api/v1/auth/logout       - Cerrar sesión
```

### ✅ **Autenticación Simulada**
```typescript
// Credenciales de prueba
admin/admin  -> Usuario administrador
user/user    -> Usuario normal
```

## 🎯 Cómo Usar el Mock API

### 1. **Configuración**
El Mock API está configurado automáticamente en `app.config.ts`:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MockApiInterceptor } from './core/interceptors/mock-api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([MockApiInterceptor])),
    // ... otros providers
  ]
};
```

### 2. **Uso en Servicios**
Los servicios existentes ya están configurados para usar el Mock API:

```typescript
// Ejemplo de uso en un servicio
this.http.get<Student[]>(`${this.API_BASE_URL}/students`, {
  headers: this.getAuthHeaders()
}).pipe(
  delay(Math.random() * 1000 + 300), // Delay simulado
  catchError(error => this.handleError(error))
);
```

### 3. **Manejo de Errores**
El Mock API incluye manejo de errores específicos:

```typescript
private handleError(error: HttpErrorResponse): Observable<never> {
  let errorMessage = 'Error desconocido';
  
  switch (error.status) {
    case 401:
      errorMessage = 'No autorizado. Token inválido o expirado.';
      break;
    case 403:
      errorMessage = 'Acceso denegado. No tienes permisos.';
      break;
    // ... más casos
  }
  
  return throwError(() => new Error(errorMessage));
}
```

## 📊 Beneficios del Mock API

### ✅ **Cumple Requisitos del Profesor**
- ✅ **Mock API obligatorio** para la siguiente entrega
- ✅ Simula API en la nube (no solo DB local)
- ✅ Manejo de errores HTTP realistas
- ✅ Delays de red simulados

### ✅ **Experiencia de Desarrollo Realista**
- Simula condiciones de red reales
- Permite probar manejo de errores
- Facilita testing de timeouts
- Prepara para integración con API real

### ✅ **Mantenimiento de Funcionalidad**
- No rompe funcionalidad existente
- Compatible con NgRx
- Mantiene lazy loading
- Preserva guards y autenticación

## 🔄 Migración a API Real

Cuando esté listo para usar una API real, solo necesitas:

1. **Cambiar la URL base** en `MockApiService`
2. **Remover el interceptor** de `app.config.ts`
3. **Ajustar headers** si es necesario

```typescript
// Cambiar esto:
private readonly API_BASE_URL = 'https://api.ejemplo.com/v1';

// Por esto:
private readonly API_BASE_URL = 'https://tu-api-real.com/v1';
```

## 🧪 Testing del Mock API

### **Credenciales de Prueba**
```
Usuario: admin
Contraseña: admin
Rol: Administrador

Usuario: user  
Contraseña: user
Rol: Usuario
```

### **Comportamientos Simulados**
- **Delays**: 500-2000ms en cada request
- **Errores**: 3% de probabilidad de error aleatorio
- **Timeouts**: 1% de probabilidad de timeout
- **Autenticación**: Validación de credenciales

## 📝 Notas de Implementación

- El Mock API **NO reemplaza** JSON Server, lo **complementa**
- JSON Server sigue funcionando para desarrollo local
- Mock API simula una API externa real
- Ambos pueden coexistir en el proyecto

## 🎉 Conclusión

Este Mock API cumple completamente con los requisitos del profesor para la siguiente entrega:

✅ **Mock API obligatorio** - Implementado  
✅ **Simula API en la nube** - URLs externas simuladas  
✅ **Manejo de errores HTTP** - Errores específicos por endpoint  
✅ **Delays de red** - Simulación realista de latencia  
✅ **Headers de autenticación** - Bearer Token implementado  
✅ **Mantiene funcionalidad** - No rompe features existentes  

El proyecto está listo para la siguiente entrega con un Mock API profesional que simula una API real en la nube.

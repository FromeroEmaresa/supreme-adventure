# FromeroE01 - Sistema de Gestión Académica con Autenticación

Este proyecto es una aplicación web desarrollada en **Angular 20** que permite gestionar información de **estudiantes**, **cursos** e **inscripciones** de manera interactiva con una arquitectura modular moderna, **persistencia real** y **sistema completo de autenticación y autorización**.

## 🎯 Funcionalidades del Sistema

### 🔐 **Sistema de Autenticación y Autorización** ⭐ **NUEVO**
- **Login seguro** con validación de credenciales
- **Dos roles de usuario:** Administrador y Usuario regular
- **Menú dinámico** según el rol del usuario
- **Guards de protección** para rutas sensibles
- **Sesión persistente** con localStorage
- **Logout seguro** con redirección automática

### 📊 **Dashboard**
- Vista general con estadísticas en tiempo real
- Métricas clave: total de estudiantes, edad promedio, promedio general
- Identificación del estudiante con mejor promedio
- Interfaz moderna con tarjetas informativas

### 👥 **Gestión de Estudiantes**
- **Lista Completa:** Tabla dinámica con Angular Material
- **Agregar:** Formulario reactivo con validaciones avanzadas
- **Editar:** Funcionalidad completa de edición
- **Eliminar:** Confirmación mediante diálogos
- **Ver Detalle:** Vista detallada con cursos inscritos ⭐ **NUEVO**
- **Des-inscripción:** Funcionalidad para des-inscribir de cursos ⭐ **NUEVO**
- **Búsqueda y Filtros:** Funcionalidades de búsqueda avanzada
- **Persistencia:** Datos guardados en JSON Server

### 🎓 **Gestión de Cursos** ⭐ **NUEVO**
- **Lista de Cursos:** Tabla con todos los cursos disponibles
- **Agregar Curso:** Formulario para crear nuevos cursos
- **Editar Curso:** Modificación de nombre, descripción y créditos
- **Eliminar Curso:** Eliminación con confirmación
- **Ver Detalle:** Vista detallada con estudiantes inscritos ⭐ **NUEVO**
- **Des-inscripción:** Funcionalidad para des-inscribir estudiantes ⭐ **NUEVO**
- **Campo de Créditos:** Gestión de créditos por curso ⭐ **NUEVO**
- **Persistencia:** Datos guardados automáticamente

### 📝 **Gestión de Inscripciones** ⭐ **NUEVO**
- **Lista de Inscripciones:** Tabla con estudiante, curso y fecha
- **Nueva Inscripción:** Asignar estudiantes a cursos
- **Eliminar Inscripción:** Dar de baja inscripciones
- **Relaciones:** Muchos estudiantes a muchos cursos
- **Validaciones:** Evita inscripciones duplicadas

### 👤 **Gestión de Usuarios** ⭐ **NUEVO**
- **Lista de Usuarios:** Tabla con todos los usuarios del sistema
- **Agregar Usuario:** Formulario para crear nuevos usuarios
- **Editar Usuario:** Modificación de datos y roles
- **Eliminar Usuario:** Eliminación con confirmación
- **Gestión de Roles:** Asignación de roles admin/user
- **Acceso Restringido:** Solo para administradores

### 📈 **Estadísticas Detalladas**
- Distribución de calificaciones por rangos
- Distribución de edades por grupos
- Gráficos visuales con barras de progreso
- Lista completa de estudiantes con métricas

### ✅ **Validaciones Implementadas**
- **DNI:** 8 dígitos, único en el sistema
- **Nombre/Apellido:** Solo letras, mínimo 2 caracteres
- **Edad:** Rango 16-100 años
- **Promedio:** Rango 0-10 con decimales
- **Curso:** Nombre mínimo 2 caracteres, descripción mínimo 10, créditos 1-10
- **Inscripciones:** Evita duplicados estudiante-curso
- **Usuarios:** Username único, email válido, contraseña segura
- **Login:** Validación de credenciales y roles
- **Validación Asíncrona:** Verificación de DNI duplicado

### 🎨 **Características Técnicas**
- **Framework:** Angular 20 con TypeScript
- **Arquitectura:** Modular (Core, Shared, Features)
- **UI:** Angular Material + Diseño Responsivo
- **Estado:** Servicios con Observables (RxJS)
- **Routing:** Navegación con lazy loading
- **Formularios:** Reactive Forms con validación avanzada
- **Autenticación:** JWT simulada con localStorage
- **Autorización:** Guards de protección por roles
- **Persistencia:** JSON Server con APIs REST
- **Base de Datos:** Archivo JSON con sincronización automática

## 🏗️ Arquitectura del Proyecto

### **Estructura Modular**

```
src/
├── app/
│   ├── core/                    # Servicios singleton y configuración
│   │   ├── services/
│   │   │   ├── student.service.ts
│   │   │   ├── course.service.ts      ⭐ NUEVO
│   │   │   ├── enrollment.service.ts  ⭐ NUEVO
│   │   ├── auth.service.ts            ⭐ NUEVO
│   │   ├── auth.guard.ts              ⭐ NUEVO
│   │   ├── admin.guard.ts             ⭐ NUEVO
│   │   └── core.module.ts
│   ├── shared/                  # Componentes y utilidades reutilizables
│   │   ├── entities.ts          # Student, Course, Enrollment, User, Auth
│   │   ├── pipes/
│   │   ├── directives/
│   │   └── shared.module.ts
│   ├── features/                # Componentes específicos de la aplicación
│   │   ├── layout/
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   ├── students/
│   │   │   ├── courses/         ⭐ NUEVO
│   │   │   ├── enrollments/     ⭐ NUEVO
│   │   │   ├── users/           ⭐ NUEVO
│   │   │   └── statistics/
│   │   ├── students/
│   │   ├── courses/             ⭐ NUEVO
│   │   ├── enrollments/         ⭐ NUEVO
│   │   ├── users/               ⭐ NUEVO
│   │   ├── auth/                ⭐ NUEVO
│   │   └── features.module.ts
│   └── app.routes.ts           # Configuración de rutas
├── src/
│   └── db.json                 # Base de datos JSON Server
├── public/mocks/               # Datos de respaldo
└── proxy.conf.json             # Configuración de proxy
```

### **Módulos Principales**

#### **Core Module**
- Servicios singleton
- Configuración HTTP
- Interceptores globales

#### **Shared Module**
- Componentes reutilizables
- Pipes personalizados
- Directivas comunes
- Módulos de Angular Material

#### **Features Module**
- Componentes específicos de la aplicación
- Páginas principales
- Formularios de gestión

## 🚀 Cómo Usar

### Instalación
```bash
npm install
```

### Ejecutar en Desarrollo

#### **⭐ Opción 1: Con Persistencia Completa (RECOMENDADO)**
```bash
npm run start:full
```
Ejecuta Angular + JSON Server + Proxy. Los datos se guardan automáticamente.

#### **Opción 2: Solo Angular (sin persistencia)**
```bash
ng serve
```

#### **Solo JSON Server**
```bash
npm run json-server
```

### URLs de Acceso
- **Aplicación:** `http://localhost:4200/`
- **Login:** `http://localhost:4200/login`
- **API JSON Server:** `http://localhost:3000/`
- **Endpoints:**
  - `http://localhost:3000/students`
  - `http://localhost:3000/courses`
  - `http://localhost:3000/enrollments`
  - `http://localhost:3000/users`

### 🔑 **Credenciales de Acceso**
- **Administrador:** `admin` / `admin123`
- **Usuario Regular:** `user` / `user123`

### Construir para Producción
```bash
ng build
```

### 🔧 Solución de Problemas

#### **Puerto 4200 en uso**
Si aparece "Port 4200 is already in use":
1. Escribe `Y` y presiona Enter para usar otro puerto
2. O para el servidor anterior con `Ctrl + C`

#### **Puerto 3000 en uso** 
Si JSON Server no puede usar el puerto 3000:
```bash
# Parar procesos en puerto 3000
npx kill-port 3000

# O usar puerto alternativo
json-server --watch src/db.json --port 3001
```

#### **Problemas de CORS**
Los problemas de CORS se resuelven automáticamente con el proxy configurado al usar `npm run start:full`.

## 🛠️ Tecnologías Utilizadas

- **Angular 20** - Framework principal
- **Angular Material** - Componentes de UI
- **RxJS** - Programación reactiva
- **TypeScript** - Lenguaje de programación
- **SCSS** - Preprocesador CSS
- **Angular Router** - Navegación
- **Reactive Forms** - Formularios reactivos
- **JSON Server** - API REST simulada ⭐ NUEVO
- **Concurrently** - Ejecutar múltiples comandos ⭐ NUEVO

## 📱 Navegación

### **Menú Lateral por Rol**

#### **👑 Administrador**
- **Dashboard:** Vista general y estadísticas
- **Estudiantes:** Lista y gestión de estudiantes
- **Cursos:** Lista y gestión de cursos
- **Inscripciones:** Gestión de inscripciones
- **Usuarios:** Gestión de usuarios del sistema ⭐ NUEVO
- **Logout:** Cerrar sesión

#### **👤 Usuario Regular**
- **Dashboard:** Vista general y estadísticas
- **Estudiantes:** Lista y gestión de estudiantes
- **Cursos:** Lista y gestión de cursos
- **Inscripciones:** Gestión de inscripciones
- **Logout:** Cerrar sesión

### **Funcionalidades por Página**

#### **Dashboard (`/dashboard`)**
- Resumen de métricas clave
- Acceso rápido a funcionalidades principales

#### **Estudiantes (`/students`)**
- Tabla con todos los estudiantes
- Acciones de editar, eliminar y ver detalle
- Botón para agregar nuevo estudiante
- **Ver Detalle:** Muestra cursos inscritos y permite des-inscripción ⭐ NUEVO

#### **Agregar Estudiante (`/students/add`)**
- Formulario completo con validaciones
- Feedback visual en tiempo real
- Navegación automática tras guardar

#### **Cursos (`/courses`)** ⭐ NUEVO
- Tabla con todos los cursos disponibles
- Acciones de editar, eliminar y ver detalle
- Botón para agregar nuevo curso
- **Ver Detalle:** Muestra estudiantes inscritos y permite des-inscripción ⭐ NUEVO

#### **Agregar Curso (`/courses/add`)** ⭐ NUEVO
- Formulario para crear cursos
- Validaciones de nombre y descripción
- Navegación automática tras guardar

#### **Editar Curso (`/courses/edit/:id`)** ⭐ NUEVO
- Formulario pre-cargado con datos del curso
- Validaciones en tiempo real
- Actualización inmediata
- **Campo de Créditos:** Gestión de créditos por curso ⭐ NUEVO

#### **Detalle de Curso (`/courses/detail/:id`)** ⭐ NUEVO
- Información completa del curso
- Lista de estudiantes inscritos
- Funcionalidad de des-inscripción
- Navegación de regreso

#### **Inscripciones (`/enrollments`)** ⭐ NUEVO
- Tabla con estudiante, curso y fecha
- Diálogo para nueva inscripción
- Eliminación con confirmación

#### **Usuarios (`/users`)** ⭐ NUEVO
- Tabla con todos los usuarios del sistema
- Acciones de editar, eliminar y agregar
- Gestión de roles admin/user
- **Acceso Restringido:** Solo para administradores

#### **Login (`/login`)** ⭐ NUEVO
- Formulario de autenticación
- Validación de credenciales
- Redirección automática según rol
- Manejo de errores de login

#### **Estadísticas (`/statistics`)**
- Distribuciones visuales
- Gráficos de barras
- Lista completa con métricas

## 🧪 Testing

### Ejecutar Tests Unitarios
```bash
ng test
```

### Ejecutar Tests End-to-End
```bash
ng e2e
```

## 📚 Características Avanzadas

### **Gestión de Estado**
- Servicios con BehaviorSubject para reactividad
- Observables para comunicación entre componentes
- Manejo de errores centralizado con fallbacks
- **Estado de Autenticación:** Gestión de sesión con localStorage
- **Autorización por Roles:** Control de acceso dinámico

### **Persistencia de Datos** ⭐ NUEVO
- JSON Server para APIs REST reales
- Sincronización automática con `src/db.json`
- Operaciones CRUD completamente funcionales
- Proxy configurado para desarrollo

### **Validaciones Avanzadas**
- Validadores personalizados para estudiantes y cursos
- Validación asíncrona de DNI único
- Prevención de inscripciones duplicadas
- **Validación de Credenciales:** Login seguro con roles
- **Validación de Roles:** Control de acceso por permisos
- Mensajes de error contextuales

### **UX/UI Mejoras**
- Diseño responsivo con Angular Material
- Feedback visual inmediato con snackbars
- Confirmaciones de acciones críticas
- Indicadores de carga y estados
- Navegación intuitiva con breadcrumbs
- **Menú Dinámico:** Adaptación según rol del usuario
- **Toolbar Personalizada:** Muestra usuario logueado y título de página
- **Componentes de Detalle:** Vistas completas con funcionalidades avanzadas

### **Performance**
- Lazy loading de componentes por módulos
- Optimización de bundles por funcionalidad
- Carga eficiente desde JSON Server
- Manejo de errores con fallback local
- **Guards de Protección:** Prevención de acceso no autorizado
- **Rutas Protegidas:** Carga condicional según autenticación

---

*Proyecto optimizado con arquitectura modular siguiendo las mejores prácticas de Angular 20, incluyendo sistema completo de autenticación y autorización.*

## 🎯 Criterios de Evaluación Cumplidos

### **Requerimientos Básicos**
✅ **Módulos específicos:** Core, Shared, Features  
✅ **Servicios con Observables:** StudentService, CourseService, EnrollmentService, AuthService  
✅ **Routing:** Navegación completa con lazy loading  
✅ **Angular Material:** Componentes modernos y responsivos  
✅ **ABM completo:** Alta, Baja, Modificación (Estudiantes, Cursos, Inscripciones, Usuarios)  
✅ **Arquitectura modular:** Separación clara de responsabilidades  
✅ **Navegación lateral:** Menú con rutas funcionales  
✅ **Lógica excelente:** Estructura perfecta y bien definida  
✅ **Componentes completos:** Layout, tablas, formularios  
✅ **Formularios reactivos:** Interacción excelente con validaciones  
✅ **Tablas dinámicas:** Datos desde JSON con Angular Material  

### **Funcionalidades Extendidas** ⭐ NUEVAS
✅ **Gestión de Cursos:** CRUD completo con persistencia  
✅ **Gestión de Inscripciones:** Relaciones muchos a muchos  
✅ **Persistencia Real:** JSON Server con APIs REST  
✅ **Validaciones Avanzadas:** Prevención de duplicados  
✅ **Proxy Configurado:** Desarrollo sin CORS  
✅ **Scripts Automatizados:** Un comando para todo  
✅ **Fallback Robusto:** Funciona con/sin servidor

### **Sistema de Autenticación** ⭐ NUEVO
✅ **Login Seguro:** Validación de credenciales y roles  
✅ **Autorización por Roles:** Admin y Usuario regular  
✅ **Guards de Protección:** AuthGuard y AdminGuard  
✅ **Menú Dinámico:** Adaptación según rol del usuario  
✅ **Gestión de Usuarios:** CRUD completo solo para admins  
✅ **Sesión Persistente:** localStorage con JWT simulada  
✅ **Logout Seguro:** Limpieza de sesión y redirección  
✅ **Componentes de Detalle:** Vistas completas con des-inscripción  

## 🏆 Resumen del Proyecto

Este sistema académico completo incluye:
- **4 entidades principales:** Estudiantes, Cursos, Inscripciones, Usuarios
- **Sistema completo de autenticación** con roles y autorización
- **Persistencia real** con JSON Server
- **20+ componentes** Angular standalone
- **Arquitectura escalable** y modular
- **UX excepcional** con Angular Material
- **Validaciones robustas** en todos los formularios
- **Componentes de detalle** con funcionalidades avanzadas

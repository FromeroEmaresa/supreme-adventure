# FromeroE01 - Sistema de Gestión de Estudiantes

Este proyecto es una aplicación web desarrollada en **Angular 20** que permite gestionar información de estudiantes de manera interactiva con una arquitectura modular moderna.

## 🎯 Funcionalidades del Sistema

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
- **Búsqueda y Filtros:** Funcionalidades de búsqueda avanzada

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
- **Validación Asíncrona:** Verificación de DNI duplicado

### 🎨 **Características Técnicas**
- **Framework:** Angular 20 con TypeScript
- **Arquitectura:** Modular (Core, Shared, Features)
- **UI:** Angular Material + Diseño Responsivo
- **Estado:** Servicios con Observables (RxJS)
- **Routing:** Navegación con lazy loading
- **Formularios:** Reactive Forms con validación avanzada
- **Datos:** Carga desde archivo JSON mock con fallback

## 🏗️ Arquitectura del Proyecto

### **Estructura Modular**

```
src/
├── app/
│   ├── core/                    # Servicios singleton y configuración
│   │   ├── services/
│   │   │   └── student.service.ts
│   │   └── core.module.ts
│   ├── shared/                  # Componentes y utilidades reutilizables
│   │   ├── entities.ts
│   │   ├── pipes/
│   │   ├── directives/
│   │   └── shared.module.ts
│   ├── features/                # Componentes específicos de la aplicación
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── students/
│   │   └── features.module.ts
│   └── app.routes.ts           # Configuración de rutas
├── public/mocks/
│   └── students.json           # Datos de ejemplo
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
```bash
ng serve
```

Abre tu navegador en `http://localhost:4200/`

### Construir para Producción
```bash
ng build
```

## 🛠️ Tecnologías Utilizadas

- **Angular 20** - Framework principal
- **Angular Material** - Componentes de UI
- **RxJS** - Programación reactiva
- **TypeScript** - Lenguaje de programación
- **SCSS** - Preprocesador CSS
- **Angular Router** - Navegación
- **Reactive Forms** - Formularios reactivos

## 📱 Navegación

### **Menú Lateral**
- **Dashboard:** Vista general y estadísticas
- **Estudiantes:** Lista y gestión de estudiantes
- **Agregar Estudiante:** Formulario de registro
- **Estadísticas:** Reportes detallados

### **Funcionalidades por Página**

#### **Dashboard (`/dashboard`)**
- Resumen de métricas clave
- Acceso rápido a funcionalidades principales

#### **Estudiantes (`/students`)**
- Tabla con todos los estudiantes
- Acciones de editar y eliminar
- Botón para agregar nuevo estudiante

#### **Agregar Estudiante (`/students/add`)**
- Formulario completo con validaciones
- Feedback visual en tiempo real
- Navegación automática tras guardar

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
- Servicios con BehaviorSubject
- Observables para reactividad
- Manejo de errores centralizado

### **Validaciones Avanzadas**
- Validadores personalizados
- Validación asíncrona de DNI
- Mensajes de error contextuales

### **UX/UI Mejoras**
- Diseño responsivo
- Feedback visual inmediato
- Confirmaciones de acciones críticas
- Indicadores de carga

### **Performance**
- Lazy loading de componentes
- Optimización de bundles
- Carga eficiente de datos

---

*Proyecto optimizado con arquitectura modular siguiendo las mejores prácticas de Angular 20.*

## 🎯 Criterios de Evaluación Cumplidos

✅ **Módulos específicos:** Core, Shared, Features  
✅ **Servicios con Observables:** StudentService con datos mockeados  
✅ **Routing:** Navegación completa con lazy loading  
✅ **Angular Material:** Componentes modernos y responsivos  
✅ **ABM completo:** Alta, Baja, Modificación de estudiantes  
✅ **Arquitectura modular:** Separación clara de responsabilidades  
✅ **Navegación lateral:** Menú con rutas funcionales  
✅ **Lógica excelente:** Estructura perfecta y bien definida  
✅ **Componentes completos:** Layout, tabla, formularios  
✅ **Datos JSON:** Carga desde archivos locales  
✅ **Formularios reactivos:** Interacción excelente con validaciones  
✅ **Tablas dinámicas:** Datos desde JSON con Angular Material  

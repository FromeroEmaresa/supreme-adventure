# FromeroE01 - Sistema de Gestión de Estudiantes

Este proyecto es una aplicación web desarrollada en **Angular 20** que permite gestionar información de estudiantes de manera interactiva.

## 🎯 Funcionalidades del Sistema

### 📊 **Tabla de Estudiantes**
- Muestra una lista completa de todos los estudiantes registrados
- Visualiza: nombre completo, edad, DNI y promedio académico
- Interfaz moderna con Angular Material Table

### ➕ **Agregar Estudiantes**
- Formulario completo para registrar nuevos estudiantes
- Validación en tiempo real de todos los campos
- Campos requeridos: DNI, nombre, apellido, edad y promedio

### ✏️ **Editar Estudiantes**
- Funcionalidad de edición inline
- Formulario reutilizable para modificar datos existentes
- Actualización automática de la información

### 🗑️ **Eliminar Estudiantes**
- Opción para eliminar estudiantes de la lista
- Confirmación de eliminación
- Actualización inmediata de la tabla

### ✅ **Validaciones Implementadas**
- **DNI:** Campo obligatorio
- **Nombre:** Campo obligatorio  
- **Apellido:** Campo obligatorio
- **Edad:** Obligatorio, mínimo 0 años
- **Promedio:** Obligatorio, rango de 0 a 10

### 🎨 **Características Técnicas**
- **Framework:** Angular 20 con TypeScript
- **UI:** Angular Material + Bootstrap
- **Formularios:** Reactive Forms con validación
- **Datos:** Carga desde archivo JSON mock
- **Responsive:** Compatible con móviles y desktop

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

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── add-form/          # Formulario de gestión
│   ├── students-table/    # Tabla de estudiantes  
│   ├── navbar/            # Barra de navegación
│   ├── toolbar/           # Barra de herramientas
│   └── app.ts             # Componente principal
├── shared/
│   ├── entities.ts        # Interfaces de datos
│   └── pipes/             # Pipes personalizados
└── public/mocks/
    └── students.json      # Datos de ejemplo
```

## 🛠️ Tecnologías Utilizadas

- **Angular 20** - Framework principal
- **Angular Material** - Componentes de UI
- **Bootstrap** - Framework CSS
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva

---

*Proyecto generado con [Angular CLI](https://github.com/angular/angular-cli) versión 20.0.3.*

## 🧪 Testing

### Ejecutar Tests Unitarios
```bash
ng test
```

### Ejecutar Tests End-to-End
```bash
ng e2e
```

## 📚 Recursos Adicionales

Para más información sobre Angular CLI, visita la [Documentación Oficial de Angular](https://angular.dev/tools/cli).

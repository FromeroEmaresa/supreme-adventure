import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class Layout {
  menuItems = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Estudiantes',
      icon: 'people',
      route: '/students'
    },
    {
      label: 'Agregar Estudiante',
      icon: 'person_add',
      route: '/students/add'
    },
    {
      label: 'Cursos',
      icon: 'school',
      route: '/courses'
    },
    {
      label: 'Inscripciones',
      icon: 'assignment',
      route: '/enrollments'
    },
    {
      label: 'Estadísticas',
      icon: 'analytics',
      route: '/statistics'
    }
  ];

  toggleSidenav() {
    // Implementar lógica de toggle si es necesario
  }
} 
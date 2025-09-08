import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { User } from '../../shared/entities';
import * as AppActions from '../../store/app/app.actions';
import * as AppSelectors from '../../store/app/app.selectors';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

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
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class Layout implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: User | null = null;
  isAdmin = false;
  sidenavOpened = true;
  currentPageTitle = '';

  allMenuItems: MenuItem[] = [
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
      label: 'Usuarios',
      icon: 'admin_panel_settings',
      route: '/users',
      roles: ['admin']
    },
    {
      label: 'Estadísticas',
      icon: 'analytics',
      route: '/statistics'
    }
  ];

  get menuItems(): MenuItem[] {
    return this.allMenuItems.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(this.currentUser?.role || '');
    });
  }

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.select(AppSelectors.selectCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.isAdmin = user?.role === 'admin';
      });

    // Escuchar cambios de ruta para actualizar el título
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updatePageTitle();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout(): void {
    this.store.dispatch(AppActions.logout());
    this.snackBar.open('Sesión cerrada exitosamente', 'Cerrar', {
      duration: 3000
    });
  }

  getUserDisplayName(): string {
    return this.currentUser?.name || 'Usuario';
  }

  getUserRole(): string {
    return this.currentUser?.role === 'admin' ? 'Administrador' : 'Usuario';
  }

  getCurrentPageTitle(): string {
    return this.currentPageTitle;
  }

  private updatePageTitle(): void {
    const url = this.router.url;
    const menuItem = this.allMenuItems.find(item => item.route === url);
    this.currentPageTitle = menuItem ? menuItem.label : '';
  }
} 
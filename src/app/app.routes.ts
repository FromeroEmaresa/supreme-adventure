import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'students',
    loadComponent: () => import('./features/pages/students/students').then(m => m.StudentsPage)
  },
  {
    path: 'students/add',
    loadComponent: () => import('./features/students/add-form/add-form').then(m => m.AddForm)
  },
  {
    path: 'students/edit/:dni',
    loadComponent: () => import('./features/students/edit-form/edit-form').then(m => m.EditForm)
  },
  {
    path: 'statistics',
    loadComponent: () => import('./features/pages/statistics/statistics').then(m => m.StatisticsPage)
  },
  {
    path: 'courses',
    loadComponent: () => import('./features/pages/courses/courses').then(m => m.CoursesPage)
  },
  {
    path: 'courses/add',
    loadComponent: () => import('./features/courses/add-form/add-form').then(m => m.AddCourseForm)
  },
  {
    path: 'courses/edit/:id',
    loadComponent: () => import('./features/courses/edit-form/edit-form').then(m => m.EditCourseForm)
  },
  {
    path: 'enrollments',
    loadComponent: () => import('./features/pages/enrollments/enrollments').then(m => m.EnrollmentsPage)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

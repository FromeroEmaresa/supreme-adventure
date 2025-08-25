import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./features/layout/layout').then(m => m.Layout),
    canActivate: [AuthGuard],
    children: [
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
        path: 'students/detail/:dni',
        loadComponent: () => import('./features/students/student-detail/student-detail').then(m => m.StudentDetail)
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
        path: 'courses/detail/:id',
        loadComponent: () => import('./features/courses/course-detail/course-detail').then(m => m.CourseDetail)
      },
      {
        path: 'enrollments',
        loadComponent: () => import('./features/pages/enrollments/enrollments').then(m => m.EnrollmentsPage)
      },
      {
        path: 'statistics',
        loadComponent: () => import('./features/pages/statistics/statistics').then(m => m.StatisticsPage)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/pages/users/users').then(m => m.UsersPage),
        canActivate: [AdminGuard]
      },
      // {
      //   path: 'users/add',
      //   loadComponent: () => import('./features/users/add-form/add-form').then(m => m.AddUserForm),
      //   canActivate: [AdminGuard]
      // },
      // {
      //   path: 'users/edit/:id',
      //   loadComponent: () => import('./features/users/edit-form/edit-form').then(m => m.EditUserForm),
      //   canActivate: [AdminGuard]
      // }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

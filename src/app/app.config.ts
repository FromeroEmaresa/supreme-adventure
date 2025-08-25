import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MockApiInterceptor } from './core/interceptors/mock-api.interceptor';

import { routes } from './app.routes';
import { rootReducer } from './store/root-reducer';
import { AppEffects } from './store/app/app.effects';
import { StudentsEffects } from './store/students/students.effects';
import { CoursesEffects } from './store/courses/courses.effects';
import { EnrollmentsEffects } from './store/enrollments/enrollments.effects';
import { UsersEffects } from './store/users/users.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([MockApiInterceptor])),
    provideAnimations(),
    provideStore(rootReducer),
    provideEffects([
      AppEffects,
      StudentsEffects,
      CoursesEffects,
      EnrollmentsEffects,
      UsersEffects
    ]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    })
  ]
};

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, throwError } from 'rxjs';
import { map, mergeMap, catchError, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as AppActions from './app.actions';
import { CloudMockApiService } from '../../core/services/cloud-mock-api.service';
import { switchToCloudApi, switchToLocalApi } from '../../core/config/api.config';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);
  private authService = inject(CloudMockApiService); // Cambiado a Cloud Mock API
  private router = inject(Router);

  // Efecto para login usando Cloud Mock API
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.login),
      mergeMap(({ username, password }) => {
        console.log('🌐 App Effects: Using Cloud Mock API for login');
        return this.authService.login({ username, password }).pipe(
          map(response => {
            // Guardar token en localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return AppActions.loginSuccess({ user: response.user, token: response.token });
          }),
          catchError(error => {
            console.error('🌐 App Effects: Login error with Cloud Mock API', error);
            return of(AppActions.loginFailure({ error: error.message }));
          })
        );
      })
    );
  });

  // Efecto para logout usando Cloud Mock API
  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.logout),
      mergeMap(() => {
        console.log('🌐 App Effects: Using Cloud Mock API for logout');
        return this.authService.logout().pipe(
          map(() => {
            // Limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return AppActions.logoutSuccess();
          }),
          catchError(error => {
            console.error('🌐 App Effects: Logout error with Cloud Mock API', error);
            // Siempre permitir logout incluso si hay error
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return of(AppActions.logoutSuccess());
          })
        );
      })
    );
  });

  // Efecto para logout exitoso
  logoutSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.logoutSuccess),
      tap(() => {
        console.log('🌐 App Effects: Logout successful, redirecting to login');
        this.router.navigate(['/login']);
      })
    );
  }, { dispatch: false });

  // Efecto para inicializar la app
  initializeApp$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.initializeApp),
      map(() => {
        console.log('🌐 App Effects: Initializing app with Cloud Mock API');
        
        // Verificar si hay token guardado
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            console.log('🌐 App Effects: Found existing user session', user);
            return AppActions.loginSuccess({ user, token });
          } catch (error) {
            console.error('🌐 App Effects: Error parsing user data', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
        
        // Cambiar a Cloud Mock API por defecto
        switchToCloudApi();
        console.log('🌐 App Effects: Switched to Cloud Mock API by default');
        
        return AppActions.initializeAppSuccess();
      })
    );
  });

  // Efecto para cambiar a Cloud API
  switchToCloudApi$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.switchToCloudApi),
      tap(() => {
        console.log('🌐 App Effects: Switching to Cloud Mock API');
        switchToCloudApi();
      })
    );
  }, { dispatch: false });

  // Efecto para cambiar a Local API
  switchToLocalApi$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.switchToLocalApi),
      tap(() => {
        console.log('🏠 App Effects: Switching to Local Mock API');
        switchToLocalApi();
      })
    );
  });
}

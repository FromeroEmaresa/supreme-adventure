import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as AppActions from './app.actions';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class AppEffects {

  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AppActions.login),
      mergeMap(({ username, password }) => 
        this.authService.login({ username, password }).pipe(
          map(response => AppActions.loginSuccess({ 
            user: response.user, 
            token: response.token 
          })),
          catchError(error => of(AppActions.loginFailure({ 
            error: error.message || 'Error de autenticación' 
          })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AppActions.loginSuccess),
      tap(({ user, token }) => {
        // Guardar en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirigir según el rol
        if (user.role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      })
    ), { dispatch: false }
  );

  logout$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AppActions.logout),
      tap(() => {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }),
      map(() => AppActions.logoutSuccess())
    )
  );

  logoutSuccess$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AppActions.logoutSuccess),
      tap(() => {
        // Redirigir a login después del logout exitoso
        this.router.navigate(['/login']);
      })
    ), { dispatch: false }
  );

  initializeApp$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AppActions.initializeApp),
      mergeMap(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            return of(AppActions.initializeAppSuccess({ user, token }));
          } catch (error) {
            // Si hay error al parsear, limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return of();
          }
        }
        
        return of(); // No hay datos guardados
      })
    )
  );
}

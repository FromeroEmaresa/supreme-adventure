import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take, combineLatest } from 'rxjs';
import * as AppSelectors from '../../store/app/app.selectors';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return combineLatest([
      this.store.select(AppSelectors.selectIsAuthenticated),
      this.store.select(AppSelectors.selectIsAdmin)
    ]).pipe(
      take(1),
      map(([isAuthenticated, isAdmin]) => {
        if (isAuthenticated && isAdmin) {
          return true;
        } else {
          // Si no es admin, redirigir al dashboard
          this.router.navigate(['/dashboard']);
          return false;
        }
      })
    );
  }
} 
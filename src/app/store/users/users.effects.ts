import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as UsersActions from './users.actions';
import { UserService } from '../../core/services/user.service';

@Injectable()
export class UsersEffects {

  private actions$ = inject(Actions);
  private userService = inject(UserService);

  loadUsers$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      mergeMap(() => this.userService.getUsers()
        .pipe(
          map(users => UsersActions.loadUsersSuccess({ users })),
          catchError(error => of(UsersActions.loadUsersFailure({ 
            error: error.message || 'Error al cargar usuarios' 
          })))
        ))
    )
  );

  addUser$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UsersActions.addUser),
      mergeMap(({ user }) => this.userService.createUser(user)
        .pipe(
          map(newUser => UsersActions.addUserSuccess({ user: newUser })),
          catchError(error => of(UsersActions.addUserFailure({ 
            error: error.message || 'Error al agregar usuario' 
          })))
        ))
    )
  );

  updateUser$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      mergeMap(({ user }) => this.userService.updateUser(user.id, user)
        .pipe(
          map(updatedUser => UsersActions.updateUserSuccess({ user: updatedUser })),
          catchError(error => of(UsersActions.updateUserFailure({ 
            error: error.message || 'Error al actualizar usuario' 
          })))
        ))
    )
  );

  deleteUser$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      mergeMap(({ id }) => this.userService.deleteUser(id)
        .pipe(
          map(() => UsersActions.deleteUserSuccess({ id })),
          catchError(error => of(UsersActions.deleteUserFailure({ 
            error: error.message || 'Error al eliminar usuario' 
          })))
        ))
    )
  );
}

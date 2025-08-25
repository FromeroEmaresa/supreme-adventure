import { createReducer, on } from '@ngrx/store';
import { UsersState, initialState } from './users.state';
import * as UsersActions from './users.actions';

// Re-exportar la interfaz para que esté disponible
export type { UsersState } from './users.state';

export const usersReducer = createReducer(
  initialState,
  
  // Load Users
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null
  })),
  
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Add User
  on(UsersActions.addUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(UsersActions.addUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
    loading: false,
    error: null
  })),
  
  on(UsersActions.addUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update User
  on(UsersActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    loading: false,
    error: null
  })),
  
  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete User
  on(UsersActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(UsersActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter(u => u.id !== id),
    loading: false,
    error: null
  })),
  
  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

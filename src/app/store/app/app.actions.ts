import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/entities';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Set Page Title Action
export const setPageTitle = createAction(
  '[App] Set Page Title',
  props<{ title: string }>()
);

// Clear Page Title Action
export const clearPageTitle = createAction('[App] Clear Page Title');

// Initialize App Action (para cargar desde localStorage)
export const initializeApp = createAction('[App] Initialize App');

export const initializeAppSuccess = createAction(
  '[App] Initialize App Success'
);

// API Switching Actions
export const switchToCloudApi = createAction('[App] Switch to Cloud API');

export const switchToLocalApi = createAction('[App] Switch to Local API');

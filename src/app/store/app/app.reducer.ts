import { createReducer, on } from '@ngrx/store';
import { AppState, initialState } from './app.state';
import * as AppActions from './app.actions';

// Re-exportar la interfaz para que esté disponible
export type { AppState } from './app.state';

export const appReducer = createReducer(
  initialState,
  
  // Login
  on(AppActions.login, (state) => ({
    ...state,
    loading: true,
    isAuthenticated: false
  })),
  
  on(AppActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false
  })),
  
  on(AppActions.loginFailure, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  })),
  
  // Logout
  on(AppActions.logout, (state) => ({
    ...state,
    isAuthenticated: false
  })),
  
  on(AppActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    pageTitle: ''
  })),
  
  // Page Title
  on(AppActions.setPageTitle, (state, { title }) => ({
    ...state,
    pageTitle: title
  })),
  
  on(AppActions.clearPageTitle, (state) => ({
    ...state,
    pageTitle: ''
  })),
  
  // Initialize App
  on(AppActions.initializeAppSuccess, (state) => ({
    ...state,
    loading: false
  }))
);

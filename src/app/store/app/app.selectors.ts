import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectUser = createSelector(
  selectAppState,
  (state: AppState) => state.user
);

export const selectCurrentUser = createSelector(
  selectAppState,
  (state: AppState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectAppState,
  (state: AppState) => state.isAuthenticated
);

export const selectToken = createSelector(
  selectAppState,
  (state: AppState) => state.token
);

export const selectPageTitle = createSelector(
  selectAppState,
  (state: AppState) => state.pageTitle
);

export const selectIsAdmin = createSelector(
  selectUser,
  (user) => user?.role === 'admin'
);

export const selectAppLoading = createSelector(
  selectAppState,
  (state: AppState) => state.loading
);

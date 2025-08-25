import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.state';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(
  selectUsersState,
  (state: UsersState) => state.users
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state: UsersState) => state.loading
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state: UsersState) => state.error
);

export const selectUsersCount = createSelector(
  selectAllUsers,
  (users) => users.length
);

export const selectUserById = (id: string) => createSelector(
  selectAllUsers,
  (users) => users.find(user => user.id === id) || null
);

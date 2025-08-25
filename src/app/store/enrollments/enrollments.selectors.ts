import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EnrollmentsState } from './enrollments.state';

export const selectEnrollmentsState = createFeatureSelector<EnrollmentsState>('enrollments');

export const selectAllEnrollments = createSelector(
  selectEnrollmentsState,
  (state: EnrollmentsState) => state.enrollments
);

export const selectAllEnrollmentsWithDetails = createSelector(
  selectEnrollmentsState,
  (state: EnrollmentsState) => state.enrollmentsWithDetails
);

export const selectEnrollmentsLoading = createSelector(
  selectEnrollmentsState,
  (state: EnrollmentsState) => state.loading
);

export const selectEnrollmentsError = createSelector(
  selectEnrollmentsState,
  (state: EnrollmentsState) => state.error
);

export const selectEnrollmentsCount = createSelector(
  selectAllEnrollments,
  (enrollments) => enrollments.length
);

export const selectEnrollmentsWithDetailsCount = createSelector(
  selectAllEnrollmentsWithDetails,
  (enrollmentsWithDetails) => enrollmentsWithDetails.length
);

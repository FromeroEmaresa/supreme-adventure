import { createReducer, on } from '@ngrx/store';
import { EnrollmentsState, initialState } from './enrollments.state';
import * as EnrollmentsActions from './enrollments.actions';

// Re-exportar la interfaz para que esté disponible
export type { EnrollmentsState } from './enrollments.state';

export const enrollmentsReducer = createReducer(
  initialState,
  
  // Load Enrollments
  on(EnrollmentsActions.loadEnrollments, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(EnrollmentsActions.loadEnrollmentsSuccess, (state, { enrollments }) => ({
    ...state,
    enrollments,
    loading: false,
    error: null
  })),
  
  on(EnrollmentsActions.loadEnrollmentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Load Enrollments with Details
  on(EnrollmentsActions.loadEnrollmentsWithDetails, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(EnrollmentsActions.loadEnrollmentsWithDetailsSuccess, (state, { enrollmentsWithDetails }) => ({
    ...state,
    enrollmentsWithDetails,
    loading: false,
    error: null
  })),
  
  on(EnrollmentsActions.loadEnrollmentsWithDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Add Enrollment
  on(EnrollmentsActions.addEnrollment, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(EnrollmentsActions.addEnrollmentSuccess, (state, { enrollment }) => ({
    ...state,
    enrollments: [...state.enrollments, enrollment],
    loading: false,
    error: null
  })),
  
  on(EnrollmentsActions.addEnrollmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Enrollment
  on(EnrollmentsActions.deleteEnrollment, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(EnrollmentsActions.deleteEnrollmentSuccess, (state, { id }) => ({
    ...state,
    enrollments: state.enrollments.filter(e => e.id !== id),
    enrollmentsWithDetails: state.enrollmentsWithDetails.filter(e => e.enrollment.id !== id),
    loading: false,
    error: null
  })),
  
  on(EnrollmentsActions.deleteEnrollmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Get Enrollments by Student
  on(EnrollmentsActions.getEnrollmentsByStudent, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(EnrollmentsActions.getEnrollmentsByStudentSuccess, (state, { enrollments }) => ({
    ...state,
    enrollments,
    loading: false,
    error: null
  })),
  
  on(EnrollmentsActions.getEnrollmentsByStudentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Get Enrollments by Course
  on(EnrollmentsActions.getEnrollmentsByCourse, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(EnrollmentsActions.getEnrollmentsByCourseSuccess, (state, { enrollments }) => ({
    ...state,
    enrollments,
    loading: false,
    error: null
  })),
  
  on(EnrollmentsActions.getEnrollmentsByCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

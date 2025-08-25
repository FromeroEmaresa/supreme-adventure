import { createAction, props } from '@ngrx/store';
import { Enrollment, EnrollmentWithDetails } from '../../shared/entities';

// Load Enrollments
export const loadEnrollments = createAction('[Enrollments] Load Enrollments');

export const loadEnrollmentsSuccess = createAction(
  '[Enrollments] Load Enrollments Success',
  props<{ enrollments: Enrollment[] }>()
);

export const loadEnrollmentsFailure = createAction(
  '[Enrollments] Load Enrollments Failure',
  props<{ error: string }>()
);

// Load Enrollments with Details
export const loadEnrollmentsWithDetails = createAction('[Enrollments] Load Enrollments with Details');

export const loadEnrollmentsWithDetailsSuccess = createAction(
  '[Enrollments] Load Enrollments with Details Success',
  props<{ enrollmentsWithDetails: EnrollmentWithDetails[] }>()
);

export const loadEnrollmentsWithDetailsFailure = createAction(
  '[Enrollments] Load Enrollments with Details Failure',
  props<{ error: string }>()
);

// Add Enrollment
export const addEnrollment = createAction(
  '[Enrollments] Add Enrollment',
  props<{ studentDni: string; courseId: string }>()
);

export const addEnrollmentSuccess = createAction(
  '[Enrollments] Add Enrollment Success',
  props<{ enrollment: Enrollment }>()
);

export const addEnrollmentFailure = createAction(
  '[Enrollments] Add Enrollment Failure',
  props<{ error: string }>()
);

// Delete Enrollment
export const deleteEnrollment = createAction(
  '[Enrollments] Delete Enrollment',
  props<{ id: string }>()
);

export const deleteEnrollmentSuccess = createAction(
  '[Enrollments] Delete Enrollment Success',
  props<{ id: string }>()
);

export const deleteEnrollmentFailure = createAction(
  '[Enrollments] Delete Enrollment Failure',
  props<{ error: string }>()
);

// Get Enrollments by Student
export const getEnrollmentsByStudent = createAction(
  '[Enrollments] Get Enrollments by Student',
  props<{ studentDni: string }>()
);

export const getEnrollmentsByStudentSuccess = createAction(
  '[Enrollments] Get Enrollments by Student Success',
  props<{ enrollments: Enrollment[] }>()
);

export const getEnrollmentsByStudentFailure = createAction(
  '[Enrollments] Get Enrollments by Student Failure',
  props<{ error: string }>()
);

// Get Enrollments by Course
export const getEnrollmentsByCourse = createAction(
  '[Enrollments] Get Enrollments by Course',
  props<{ courseId: string }>()
);

export const getEnrollmentsByCourseSuccess = createAction(
  '[Enrollments] Get Enrollments by Course Success',
  props<{ enrollments: Enrollment[] }>()
);

export const getEnrollmentsByCourseFailure = createAction(
  '[Enrollments] Get Enrollments by Course Failure',
  props<{ error: string }>()
);

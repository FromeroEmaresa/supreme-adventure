import { createAction, props } from '@ngrx/store';
import { Course } from '../../shared/entities';

// Load Courses
export const loadCourses = createAction('[Courses] Load Courses');

export const loadCoursesSuccess = createAction(
  '[Courses] Load Courses Success',
  props<{ courses: Course[] }>()
);

export const loadCoursesFailure = createAction(
  '[Courses] Load Courses Failure',
  props<{ error: string }>()
);

// Add Course
export const addCourse = createAction(
  '[Courses] Add Course',
  props<{ course: Omit<Course, 'id'> }>()
);

export const addCourseSuccess = createAction(
  '[Courses] Add Course Success',
  props<{ course: Course }>()
);

export const addCourseFailure = createAction(
  '[Courses] Add Course Failure',
  props<{ error: string }>()
);

// Update Course
export const updateCourse = createAction(
  '[Courses] Update Course',
  props<{ course: Course }>()
);

export const updateCourseSuccess = createAction(
  '[Courses] Update Course Success',
  props<{ course: Course }>()
);

export const updateCourseFailure = createAction(
  '[Courses] Update Course Failure',
  props<{ error: string }>()
);

// Delete Course
export const deleteCourse = createAction(
  '[Courses] Delete Course',
  props<{ id: string }>()
);

export const deleteCourseSuccess = createAction(
  '[Courses] Delete Course Success',
  props<{ id: string }>()
);

export const deleteCourseFailure = createAction(
  '[Courses] Delete Course Failure',
  props<{ error: string }>()
);

// Get Course by ID
export const getCourseById = createAction(
  '[Courses] Get Course by ID',
  props<{ id: string }>()
);

export const getCourseByIdSuccess = createAction(
  '[Courses] Get Course by ID Success',
  props<{ course: Course | null }>()
);

export const getCourseByIdFailure = createAction(
  '[Courses] Get Course by ID Failure',
  props<{ error: string }>()
);

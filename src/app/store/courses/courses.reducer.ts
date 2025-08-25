import { createReducer, on } from '@ngrx/store';
import { CoursesState, initialState } from './courses.state';
import * as CoursesActions from './courses.actions';

// Re-exportar la interfaz para que esté disponible
export type { CoursesState } from './courses.state';

export const coursesReducer = createReducer(
  initialState,
  
  // Load Courses
  on(CoursesActions.loadCourses, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CoursesActions.loadCoursesSuccess, (state, { courses }) => ({
    ...state,
    courses,
    loading: false,
    error: null
  })),
  
  on(CoursesActions.loadCoursesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Add Course
  on(CoursesActions.addCourse, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CoursesActions.addCourseSuccess, (state, { course }) => ({
    ...state,
    courses: [...state.courses, course],
    loading: false,
    error: null
  })),
  
  on(CoursesActions.addCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Course
  on(CoursesActions.updateCourse, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CoursesActions.updateCourseSuccess, (state, { course }) => ({
    ...state,
    courses: state.courses.map(c => c.id === course.id ? course : c),
    loading: false,
    error: null
  })),
  
  on(CoursesActions.updateCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Course
  on(CoursesActions.deleteCourse, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CoursesActions.deleteCourseSuccess, (state, { id }) => ({
    ...state,
    courses: state.courses.filter(c => c.id !== id),
    loading: false,
    error: null
  })),
  
  on(CoursesActions.deleteCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Get Course by ID
  on(CoursesActions.getCourseById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CoursesActions.getCourseByIdSuccess, (state, { course }) => ({
    ...state,
    selectedCourse: course,
    loading: false,
    error: null
  })),
  
  on(CoursesActions.getCourseByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

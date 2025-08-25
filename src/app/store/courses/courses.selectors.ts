import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CoursesState } from './courses.state';

export const selectCoursesState = createFeatureSelector<CoursesState>('courses');

export const selectAllCourses = createSelector(
  selectCoursesState,
  (state: CoursesState) => state.courses
);

export const selectCoursesLoading = createSelector(
  selectCoursesState,
  (state: CoursesState) => state.loading
);

export const selectCoursesError = createSelector(
  selectCoursesState,
  (state: CoursesState) => state.error
);

export const selectSelectedCourse = createSelector(
  selectCoursesState,
  (state: CoursesState) => state.selectedCourse
);

export const selectCourseById = (id: string) => createSelector(
  selectAllCourses,
  (courses) => courses.find(course => course.id === id) || null
);

export const selectCoursesCount = createSelector(
  selectAllCourses,
  (courses) => courses.length
);

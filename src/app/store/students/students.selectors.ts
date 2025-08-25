import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StudentsState } from './students.state';

export const selectStudentsState = createFeatureSelector<StudentsState>('students');

export const selectAllStudents = createSelector(
  selectStudentsState,
  (state: StudentsState) => state.students
);

export const selectStudentsLoading = createSelector(
  selectStudentsState,
  (state: StudentsState) => state.loading
);

export const selectStudentsError = createSelector(
  selectStudentsState,
  (state: StudentsState) => state.error
);

export const selectSelectedStudent = createSelector(
  selectStudentsState,
  (state: StudentsState) => state.selectedStudent
);

export const selectStudentById = (dni: string) => createSelector(
  selectAllStudents,
  (students) => students.find(student => student.dni === dni) || null
);

export const selectStudentsCount = createSelector(
  selectAllStudents,
  (students) => students.length
);

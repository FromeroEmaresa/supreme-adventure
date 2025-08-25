import { createAction, props } from '@ngrx/store';
import { Student } from '../../shared/entities';

// Load Students
export const loadStudents = createAction('[Students] Load Students');

export const loadStudentsSuccess = createAction(
  '[Students] Load Students Success',
  props<{ students: Student[] }>()
);

export const loadStudentsFailure = createAction(
  '[Students] Load Students Failure',
  props<{ error: string }>()
);

// Add Student
export const addStudent = createAction(
  '[Students] Add Student',
  props<{ student: Student }>()
);

export const addStudentSuccess = createAction(
  '[Students] Add Student Success',
  props<{ student: Student }>()
);

export const addStudentFailure = createAction(
  '[Students] Add Student Failure',
  props<{ error: string }>()
);

// Update Student
export const updateStudent = createAction(
  '[Students] Update Student',
  props<{ student: Student }>()
);

export const updateStudentSuccess = createAction(
  '[Students] Update Student Success',
  props<{ student: Student }>()
);

export const updateStudentFailure = createAction(
  '[Students] Update Student Failure',
  props<{ error: string }>()
);

// Delete Student
export const deleteStudent = createAction(
  '[Students] Delete Student',
  props<{ dni: string }>()
);

export const deleteStudentSuccess = createAction(
  '[Students] Delete Student Success',
  props<{ dni: string }>()
);

export const deleteStudentFailure = createAction(
  '[Students] Delete Student Failure',
  props<{ error: string }>()
);

// Get Student by DNI
export const getStudentByDni = createAction(
  '[Students] Get Student by DNI',
  props<{ dni: string }>()
);

export const getStudentByDniSuccess = createAction(
  '[Students] Get Student by DNI Success',
  props<{ student: Student | null }>()
);

export const getStudentByDniFailure = createAction(
  '[Students] Get Student by DNI Failure',
  props<{ error: string }>()
);

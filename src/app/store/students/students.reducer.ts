import { createReducer, on } from '@ngrx/store';
import { StudentsState, initialState } from './students.state';
import * as StudentsActions from './students.actions';

// Re-exportar la interfaz para que esté disponible
export type { StudentsState } from './students.state';

export const studentsReducer = createReducer(
  initialState,
  
  // Load Students
  on(StudentsActions.loadStudents, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(StudentsActions.loadStudentsSuccess, (state, { students }) => ({
    ...state,
    students,
    loading: false,
    error: null
  })),
  
  on(StudentsActions.loadStudentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Add Student
  on(StudentsActions.addStudent, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(StudentsActions.addStudentSuccess, (state, { student }) => ({
    ...state,
    students: [...state.students, student],
    loading: false,
    error: null
  })),
  
  on(StudentsActions.addStudentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Student
  on(StudentsActions.updateStudent, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(StudentsActions.updateStudentSuccess, (state, { student }) => ({
    ...state,
    students: state.students.map(s => s.dni === student.dni ? student : s),
    loading: false,
    error: null
  })),
  
  on(StudentsActions.updateStudentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Student
  on(StudentsActions.deleteStudent, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(StudentsActions.deleteStudentSuccess, (state, { dni }) => ({
    ...state,
    students: state.students.filter(s => s.dni !== dni),
    loading: false,
    error: null
  })),
  
  on(StudentsActions.deleteStudentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Get Student by DNI
  on(StudentsActions.getStudentByDni, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(StudentsActions.getStudentByDniSuccess, (state, { student }) => ({
    ...state,
    selectedStudent: student,
    loading: false,
    error: null
  })),
  
  on(StudentsActions.getStudentByDniFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

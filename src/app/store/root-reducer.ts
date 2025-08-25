import { ActionReducerMap } from '@ngrx/store';
import { AppState, appReducer } from './app/app.reducer';
import { StudentsState, studentsReducer } from './students/students.reducer';
import { CoursesState, coursesReducer } from './courses/courses.reducer';
import { EnrollmentsState, enrollmentsReducer } from './enrollments/enrollments.reducer';
import { UsersState, usersReducer } from './users/users.reducer';

export interface RootState {
  app: AppState;
  students: StudentsState;
  courses: CoursesState;
  enrollments: EnrollmentsState;
  users: UsersState;
}

export const rootReducer: ActionReducerMap<RootState> = {
  app: appReducer,
  students: studentsReducer,
  courses: coursesReducer,
  enrollments: enrollmentsReducer,
  users: usersReducer
};

import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { AppEffects } from './app/app.effects';
import { StudentsEffects } from './students/students.effects';
import { CoursesEffects } from './courses/courses.effects';
import { EnrollmentsEffects } from './enrollments/enrollments.effects';
import { UsersEffects } from './users/users.effects';

@Injectable()
export class RootEffects {
  constructor(
    private actions$: Actions,
    private appEffects: AppEffects,
    private studentsEffects: StudentsEffects,
    private coursesEffects: CoursesEffects,
    private enrollmentsEffects: EnrollmentsEffects,
    private usersEffects: UsersEffects
  ) {}
}

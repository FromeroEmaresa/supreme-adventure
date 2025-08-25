import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as StudentsActions from './students.actions';
import { StudentService } from '../../core/services/student.service';

@Injectable()
export class StudentsEffects {

  private actions$ = inject(Actions);
  private studentService = inject(StudentService);
  private router = inject(Router);

  loadStudents$ = createEffect(() => 
    this.actions$.pipe(
      ofType(StudentsActions.loadStudents),
      mergeMap(() => this.studentService.getStudents()
        .pipe(
          map(students => StudentsActions.loadStudentsSuccess({ students })),
          catchError(error => of(StudentsActions.loadStudentsFailure({ 
            error: error.message || 'Error al cargar estudiantes' 
          })))
        ))
    )
  );

  addStudent$ = createEffect(() => 
    this.actions$.pipe(
      ofType(StudentsActions.addStudent),
      mergeMap(({ student }) => this.studentService.addStudent(student)
        .pipe(
          map(newStudent => StudentsActions.addStudentSuccess({ student: newStudent })),
          catchError(error => of(StudentsActions.addStudentFailure({ 
            error: error.message || 'Error al agregar estudiante' 
          })))
        ))
    )
  );

  updateStudent$ = createEffect(() => 
    this.actions$.pipe(
      ofType(StudentsActions.updateStudent),
      mergeMap(({ student }) => this.studentService.updateStudent(student)
        .pipe(
          map(updatedStudent => StudentsActions.updateStudentSuccess({ student: updatedStudent })),
          catchError(error => of(StudentsActions.updateStudentFailure({ 
            error: error.message || 'Error al actualizar estudiante' 
          })))
        ))
    )
  );

  deleteStudent$ = createEffect(() => 
    this.actions$.pipe(
      ofType(StudentsActions.deleteStudent),
      mergeMap(({ dni }) => this.studentService.deleteStudent(dni)
        .pipe(
          map(() => StudentsActions.deleteStudentSuccess({ dni })),
          catchError(error => of(StudentsActions.deleteStudentFailure({ 
            error: error.message || 'Error al eliminar estudiante' 
          })))
        ))
    )
  );

  getStudentByDni$ = createEffect(() => 
    this.actions$.pipe(
      ofType(StudentsActions.getStudentByDni),
      mergeMap(({ dni }) => this.studentService.getStudentByDni(dni)
        .pipe(
          map(student => StudentsActions.getStudentByDniSuccess({ student })),
          catchError(error => of(StudentsActions.getStudentByDniFailure({ 
            error: error.message || 'Error al obtener estudiante' 
          })))
        ))
    )
  );
}

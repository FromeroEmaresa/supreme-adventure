import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as EnrollmentsActions from './enrollments.actions';
import { EnrollmentService } from '../../core/services/enrollment.service';

@Injectable()
export class EnrollmentsEffects {

  private actions$ = inject(Actions);
  private enrollmentService = inject(EnrollmentService);

  loadEnrollments$ = createEffect(() => 
    this.actions$.pipe(
      ofType(EnrollmentsActions.loadEnrollments),
      mergeMap(() => this.enrollmentService.getEnrollments()
        .pipe(
          map(enrollments => EnrollmentsActions.loadEnrollmentsSuccess({ enrollments })),
          catchError(error => of(EnrollmentsActions.loadEnrollmentsFailure({ 
            error: error.message || 'Error al cargar inscripciones' 
          })))
        ))
    )
  );

  loadEnrollmentsWithDetails$ = createEffect(() => 
    this.actions$.pipe(
      ofType(EnrollmentsActions.loadEnrollmentsWithDetails),
      mergeMap(() => this.enrollmentService.getEnrollmentsWithDetails()
        .pipe(
          map(enrollmentsWithDetails => EnrollmentsActions.loadEnrollmentsWithDetailsSuccess({ enrollmentsWithDetails })),
          catchError(error => of(EnrollmentsActions.loadEnrollmentsWithDetailsFailure({ 
            error: error.message || 'Error al cargar inscripciones con detalles' 
          })))
        ))
    )
  );

  addEnrollment$ = createEffect(() => 
    this.actions$.pipe(
      ofType(EnrollmentsActions.addEnrollment),
      mergeMap(({ studentDni, courseId }) => this.enrollmentService.addEnrollment(studentDni, courseId)
        .pipe(
          map(enrollment => EnrollmentsActions.addEnrollmentSuccess({ enrollment })),
          catchError(error => of(EnrollmentsActions.addEnrollmentFailure({ 
            error: error.message || 'Error al agregar inscripción' 
          })))
        ))
    )
  );

  deleteEnrollment$ = createEffect(() => 
    this.actions$.pipe(
      ofType(EnrollmentsActions.deleteEnrollment),
      mergeMap(({ id }) => this.enrollmentService.deleteEnrollment(id)
        .pipe(
          map(() => EnrollmentsActions.deleteEnrollmentSuccess({ id })),
          catchError(error => of(EnrollmentsActions.deleteEnrollmentFailure({ 
            error: error.message || 'Error al eliminar inscripción' 
          })))
        ))
    )
  );

  getEnrollmentsByStudent$ = createEffect(() => 
    this.actions$.pipe(
      ofType(EnrollmentsActions.getEnrollmentsByStudent),
      mergeMap(({ studentDni }) => this.enrollmentService.getEnrollmentsByStudent(studentDni)
        .pipe(
          map(enrollments => EnrollmentsActions.getEnrollmentsByStudentSuccess({ enrollments })),
          catchError(error => of(EnrollmentsActions.getEnrollmentsByStudentFailure({ 
            error: error.message || 'Error al obtener inscripciones del estudiante' 
          })))
        ))
    )
  );

  getEnrollmentsByCourse$ = createEffect(() => 
    this.actions$.pipe(
      ofType(EnrollmentsActions.getEnrollmentsByCourse),
      mergeMap(({ courseId }) => this.enrollmentService.getEnrollmentsByCourse(courseId)
        .pipe(
          map(enrollments => EnrollmentsActions.getEnrollmentsByCourseSuccess({ enrollments })),
          catchError(error => of(EnrollmentsActions.getEnrollmentsByCourseFailure({ 
            error: error.message || 'Error al obtener inscripciones del curso' 
          })))
        ))
    )
  );
}

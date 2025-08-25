import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as CoursesActions from './courses.actions';
import { CourseService } from '../../core/services/course.service';

@Injectable()
export class CoursesEffects {

  private actions$ = inject(Actions);
  private courseService = inject(CourseService);

  loadCourses$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CoursesActions.loadCourses),
      mergeMap(() => this.courseService.getCourses()
        .pipe(
          map(courses => CoursesActions.loadCoursesSuccess({ courses })),
          catchError(error => of(CoursesActions.loadCoursesFailure({ 
            error: error.message || 'Error al cargar cursos' 
          })))
        ))
    )
  );

  addCourse$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CoursesActions.addCourse),
      mergeMap(({ course }) => this.courseService.addCourse(course)
        .pipe(
          map(newCourse => CoursesActions.addCourseSuccess({ course: newCourse })),
          catchError(error => of(CoursesActions.addCourseFailure({ 
            error: error.message || 'Error al agregar curso' 
          })))
        ))
    )
  );

  updateCourse$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CoursesActions.updateCourse),
      mergeMap(({ course }) => this.courseService.updateCourse(course)
        .pipe(
          map(updatedCourse => CoursesActions.updateCourseSuccess({ course: updatedCourse })),
          catchError(error => of(CoursesActions.updateCourseFailure({ 
            error: error.message || 'Error al actualizar curso' 
          })))
        ))
    )
  );

  deleteCourse$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CoursesActions.deleteCourse),
      mergeMap(({ id }) => this.courseService.deleteCourse(id)
        .pipe(
          map(() => CoursesActions.deleteCourseSuccess({ id })),
          catchError(error => of(CoursesActions.deleteCourseFailure({ 
            error: error.message || 'Error al eliminar curso' 
          })))
        ))
    )
  );

  getCourseById$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CoursesActions.getCourseById),
      mergeMap(({ id }) => this.courseService.getCourseById(id)
        .pipe(
          map(course => CoursesActions.getCourseByIdSuccess({ course })),
          catchError(error => of(CoursesActions.getCourseByIdFailure({ 
            error: error.message || 'Error al obtener curso' 
          })))
        ))
    )
  );
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Course } from '../../../shared/entities';
import { CourseService } from '../../../core/services/course.service';
import { CoursesTable } from '../../courses/courses-table/courses-table';
import { StudentDialog } from '../../students/student-dialog/student-dialog';
import { BigtitleDirective } from '../../../shared/directives/bigtitle';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    CoursesTable,
    BigtitleDirective
  ],
  templateUrl: './courses.html',
  styleUrl: './courses.scss'
})
export class CoursesPage implements OnInit, OnDestroy {
  courses$!: Observable<Course[]>;
  private destroy$ = new Subject<void>();

  constructor(
    private courseService: CourseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courses$ = this.courseService.getCourses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEditCourse(course: Course): void {
    // Navegar al formulario de edición
    this.router.navigate(['/courses/edit', course.id]);
  }

  onDeleteCourse(course: Course): void {
    const dialogRef = this.dialog.open(StudentDialog, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que deseas eliminar el curso "${course.name}"?`,
        type: 'delete',
        course: course
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.courseService.deleteCourse(course.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.snackBar.open('Curso eliminado exitosamente', 'Cerrar', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top'
                });
              },
              error: (error) => {
                this.snackBar.open('Error al eliminar el curso: ' + error.message, 'Cerrar', {
                  duration: 5000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top'
                });
              }
            });
        }
      });
  }
}
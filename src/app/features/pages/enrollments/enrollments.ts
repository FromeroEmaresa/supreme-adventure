import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EnrollmentService } from '../../../core/services/enrollment.service';
import { EnrollmentsTable } from '../../enrollments/enrollments-table/enrollments-table';
import { AddEnrollmentDialog } from '../../enrollments/add-enrollment-dialog/add-enrollment-dialog';
import { StudentDialog } from '../../students/student-dialog/student-dialog';
import { BigtitleDirective } from '../../../shared/directives/bigtitle';
import { EnrollmentWithDetails } from '../../../shared/entities';

@Component({
  selector: 'app-enrollments',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    EnrollmentsTable,
    BigtitleDirective
  ],
  templateUrl: './enrollments.html',
  styleUrl: './enrollments.scss'
})
export class EnrollmentsPage implements OnInit, OnDestroy {
  enrollmentsWithDetails$!: Observable<EnrollmentWithDetails[]>;
  private destroy$ = new Subject<void>();

  constructor(
    private enrollmentService: EnrollmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.enrollmentsWithDetails$ = this.enrollmentService.getEnrollmentsWithDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAddEnrollment(): void {
    const dialogRef = this.dialog.open(AddEnrollmentDialog, {
      width: '500px'
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.enrollmentService.addEnrollment(result.studentDni, result.courseId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.snackBar.open('Inscripción agregada exitosamente', 'Cerrar', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top'
                });
              },
              error: (error) => {
                this.snackBar.open('Error al agregar la inscripción: ' + error.message, 'Cerrar', {
                  duration: 5000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top'
                });
              }
            });
        }
      });
  }

  onDeleteEnrollment(enrollmentData: EnrollmentWithDetails): void {
    const enrollment = enrollmentData.enrollment;
    const student = enrollmentData.student;
    const course = enrollmentData.course;
    
    const dialogRef = this.dialog.open(StudentDialog, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que deseas eliminar la inscripción de "${student?.firstName} ${student?.lastName}" en el curso "${course?.name}"?`,
        type: 'delete',
        enrollment: enrollment
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.enrollmentService.deleteEnrollment(enrollment.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.snackBar.open('Inscripción eliminada exitosamente', 'Cerrar', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top'
                });
              },
              error: (error) => {
                this.snackBar.open('Error al eliminar la inscripción: ' + error.message, 'Cerrar', {
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
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { StudentService } from '../../../core/services/student.service';
import { CourseService } from '../../../core/services/course.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Student, Course, Enrollment } from '../../../shared/entities';


interface StudentDetailData {
  student: Student;
  enrolledCourses: (Course & { enrollmentId: string })[];
}

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule,
    MatSnackBarModule, MatDialogModule, MatChipsModule, MatProgressSpinnerModule
  ],
  templateUrl: './student-detail.html',
  styleUrls: ['./student-detail.scss']
})
export class StudentDetail implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  student: Student | null = null;
  enrolledCourses: (Course & { enrollmentId: string })[] = [];
  loading = true;
  displayedColumns: string[] = ['name', 'description', 'credits', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadStudentDetail();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStudentDetail(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      map(params => params['dni']),
      switchMap(dni => this.studentService.getStudentByDni(dni)),
      switchMap(student => {
        if (!student) {
          throw new Error('Estudiante no encontrado');
        }
        this.student = student;
        return this.enrollmentService.getEnrollments();
      }),
      switchMap(enrollments => {
        const studentEnrollments = enrollments.filter(e => e.studentId === this.student?.id);
        return combineLatest(
          studentEnrollments.map(enrollment =>
            this.courseService.getCourseById(enrollment.courseId).pipe(
              map(course => course ? { ...course, enrollmentId: enrollment.id } : null)
            )
          )
        );
      })
    ).subscribe({
      next: (courses) => {
        this.enrolledCourses = courses.filter(course => course !== null) as (Course & { enrollmentId: string })[];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando detalle del estudiante:', error);
        this.snackBar.open('Error cargando datos del estudiante', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/students']);
      }
    });
  }

  unenrollFromCourse(course: Course & { enrollmentId: string }): void {
    const dialogRef = this.dialog.open(ConfirmUnenrollDialog, {
      width: '400px',
      data: {
        studentName: this.student ? `${this.student.firstName} ${this.student.lastName}` : '',
        courseName: course.name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enrollmentService.deleteEnrollment(course.enrollmentId).subscribe({
          next: () => {
            this.enrolledCourses = this.enrolledCourses.filter(c => c.id !== course.id);
            this.snackBar.open(
              `${this.student?.firstName} ha sido des-inscrito de ${course.name}`,
              'Cerrar',
              { duration: 3000 }
            );
          },
          error: (error) => {
            console.error('Error des-inscribiendo:', error);
            this.snackBar.open('Error al des-inscribir del curso', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }

  getAverageClass(average: number): string {
    if (average >= 9) return 'excellent';
    if (average >= 7) return 'good';
    if (average >= 6) return 'average';
    return 'poor';
  }
}

@Component({
  selector: 'confirm-unenroll-dialog',
  template: `
    <h2 mat-dialog-title>Confirmar Des-inscripción</h2>
    <mat-dialog-content>
      <p>¿Estás seguro de que quieres des-inscribir a <strong>{{ data.studentName }}</strong> del curso <strong>{{ data.courseName }}</strong>?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-button [mat-dialog-close]="true" color="warn">Confirmar</button>
    </mat-dialog-actions>
  `,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  standalone: true
})
export class ConfirmUnenrollDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { studentName: string; courseName: string }) {}
} 
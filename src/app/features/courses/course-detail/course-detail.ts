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
import { CourseService } from '../../../core/services/course.service';
import { StudentService } from '../../../core/services/student.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Course, Student, Enrollment } from '../../../shared/entities';


interface CourseDetailData {
  course: Course;
  enrolledStudents: (Student & { enrollmentId: string })[];
}

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule,
    MatSnackBarModule, MatDialogModule, MatChipsModule, MatProgressSpinnerModule
  ],
  templateUrl: './course-detail.html',
  styleUrls: ['./course-detail.scss']
})
export class CourseDetail implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  course: Course | null = null;
  enrolledStudents: (Student & { enrollmentId: string })[] = [];
  loading = true;
  displayedColumns: string[] = ['fullname', 'age', 'dni', 'average', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private studentService: StudentService,
    private enrollmentService: EnrollmentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCourseDetail();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCourseDetail(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      map(params => params['id']),
      switchMap(id => this.courseService.getCourseById(id)),
      switchMap(course => {
        if (!course) {
          throw new Error('Curso no encontrado');
        }
        this.course = course;
        return this.enrollmentService.getEnrollments();
      }),
      switchMap(enrollments => {
        const courseEnrollments = enrollments.filter(e => e.courseId === this.course?.id);
        return combineLatest(
          courseEnrollments.map(enrollment =>
            this.studentService.getStudentByDni(enrollment.studentDni).pipe(
              map(student => student ? { ...student, enrollmentId: enrollment.id } : null)
            )
          )
        );
      })
    ).subscribe({
      next: (students) => {
        this.enrolledStudents = students.filter(student => student !== null) as (Student & { enrollmentId: string })[];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando detalle del curso:', error);
        this.snackBar.open('Error cargando datos del curso', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/courses']);
      }
    });
  }

  unenrollStudent(student: Student & { enrollmentId: string }): void {
    const dialogRef = this.dialog.open(ConfirmUnenrollStudentDialog, {
      width: '400px',
      data: {
        studentName: `${student.name} ${student.surname}`,
        courseName: this.course?.name || ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enrollmentService.deleteEnrollment(student.enrollmentId).subscribe({
          next: () => {
            this.enrolledStudents = this.enrolledStudents.filter(s => s.dni !== student.dni);
            this.snackBar.open(
              `${student.name} ha sido des-inscrito de ${this.course?.name}`,
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
    this.router.navigate(['/courses']);
  }

  getAverageClass(average: number): string {
    if (average >= 9) return 'excellent';
    if (average >= 7) return 'good';
    if (average >= 6) return 'average';
    return 'poor';
  }
}

@Component({
  selector: 'confirm-unenroll-student-dialog',
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
export class ConfirmUnenrollStudentDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { studentName: string; courseName: string }) {}
} 
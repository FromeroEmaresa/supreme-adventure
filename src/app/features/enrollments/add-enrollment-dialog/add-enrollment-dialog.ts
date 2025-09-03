import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { StudentService } from '../../../core/services/student.service';
import { CourseService } from '../../../core/services/course.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Student, Course } from '../../../shared/entities';
import { FullnamePipe } from '../../../shared/pipes/fullname-pipe';

@Component({
  selector: 'app-add-enrollment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FullnamePipe
  ],
  templateUrl: './add-enrollment-dialog.html',
  styleUrl: './add-enrollment-dialog.scss'
})
export class AddEnrollmentDialog implements OnInit {
  enrollmentForm: FormGroup;
  students$!: Observable<Student[]>;
  courses$!: Observable<Course[]>;
  availableCombinations$!: Observable<Array<{student: Student, course: Course}>>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEnrollmentDialog>,
    private studentService: StudentService,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService
  ) {
    this.enrollmentForm = this.fb.group({
      studentDni: ['', Validators.required],
      courseId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.students$ = this.studentService.getStudents();
    this.courses$ = this.courseService.getCourses();
    
    // Obtener combinaciones disponibles (que no estén ya inscritas)
    this.availableCombinations$ = combineLatest([
      this.students$,
      this.courses$,
      this.enrollmentService.getEnrollments()
    ]).pipe(
      map(([students, courses, enrollments]) => {
        const combinations: Array<{student: Student, course: Course}> = [];
        
        students.forEach(student => {
          courses.forEach(course => {
            const isEnrolled = enrollments.some(e => 
              e.studentId === student.id && e.courseId === course.id
            );
            if (!isEnrolled) {
              combinations.push({ student, course });
            }
          });
        });
        
        return combinations;
      })
    );
  }

  onSubmit(): void {
    if (this.enrollmentForm.valid) {
      this.dialogRef.close(this.enrollmentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.enrollmentForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} es requerido`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      studentDni: 'Estudiante',
      courseId: 'Curso'
    };
    return fieldNames[fieldName] || fieldName;
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../shared/entities';
import { BigtitleDirective } from '../../../shared/directives/bigtitle';

@Component({
  selector: 'app-edit-course-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    BigtitleDirective
  ],
  templateUrl: './edit-form.html',
  styleUrl: './edit-form.scss'
})
export class EditCourseForm implements OnInit {
  courseForm: FormGroup;
  courseId: string = '';
  course: Course | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    this.loadCourse();
  }

  private loadCourse(): void {
    this.course = this.courseService.getCourseById(this.courseId);
    
    if (this.course) {
      this.courseForm.patchValue({
        name: this.course.name,
        description: this.course.description
      });
    } else {
      this.snackBar.open('Curso no encontrado', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      this.router.navigate(['/courses']);
    }
  }

  onSubmit(): void {
    if (this.courseForm.valid && this.course) {
      const updatedCourse: Course = {
        ...this.course,
        ...this.courseForm.value
      };
      
      this.courseService.updateCourse(updatedCourse).subscribe({
        next: (course) => {
          this.snackBar.open('Curso actualizado exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.router.navigate(['/courses']);
        },
        error: (error) => {
          this.snackBar.open('Error al actualizar el curso: ' + error.message, 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/courses']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.courseForm.controls).forEach(key => {
      const control = this.courseForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.courseForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} es requerido`;
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${requiredLength} caracteres`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      name: 'Nombre',
      description: 'Descripción'
    };
    return fieldNames[fieldName] || fieldName;
  }
}
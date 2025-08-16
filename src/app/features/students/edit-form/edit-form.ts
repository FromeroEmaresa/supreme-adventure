import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../shared/entities';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-form.html',
  styleUrls: ['./edit-form.scss']
})
export class EditForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private snackBar = inject(MatSnackBar);

  studentForm!: FormGroup;
  student: Student | null = null;
  originalDni: string = '';

  ngOnInit(): void {
    const dni = this.route.snapshot.paramMap.get('dni');
    if (dni) {
      this.originalDni = dni;
      this.studentService.getStudentByDni(dni).subscribe({
        next: (student) => {
          this.student = student;
          if (this.student) {
            this.initForm();
            this.studentForm.patchValue(this.student);
          } else {
            this.snackBar.open('Estudiante no encontrado', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/students']);
          }
        },
        error: (error) => {
          console.error('Error cargando estudiante:', error);
          this.snackBar.open('Error cargando el estudiante', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/students']);
        }
      });
    }
  }

  private initForm(): void {
    this.studentForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],
      average: ['', [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    // Validación asíncrona para DNI único (excepto el DNI actual)
    this.studentForm.get('dni')?.valueChanges.subscribe(dni => {
      if (dni && dni !== this.originalDni) {
        if (this.studentService.dniExists(dni)) {
          this.studentForm.get('dni')?.setErrors({ dniExists: true });
        }
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.studentForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('pattern')) {
      return 'El DNI debe tener 8 dígitos';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('min')) {
      return `El valor mínimo es ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `El valor máximo es ${control.errors?.['max'].max}`;
    }
    if (control?.hasError('dniExists')) {
      return 'Este DNI ya existe';
    }
    return '';
  }

  onSubmit(): void {
    if (this.studentForm.valid && this.student) {
      const updatedStudent: Student = {
        ...this.student,
        ...this.studentForm.value
      };

      this.studentService.updateStudent(updatedStudent).subscribe({
        next: () => {
          this.snackBar.open('Estudiante actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/students']);
        },
        error: (error) => {
          this.snackBar.open('Error al actualizar estudiante', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/students']);
  }

  onReset(): void {
    if (this.student) {
      this.studentForm.patchValue(this.student);
    }
  }
} 
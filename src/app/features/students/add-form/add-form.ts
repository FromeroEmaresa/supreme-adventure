import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../shared/entities';
import { Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-add-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './add-form.html',
  styleUrls: ['./add-form.scss']
})
export class AddForm implements OnInit {
  studentForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.studentForm = this.fb.group({
      dni: ['', [
        Validators.required,
        Validators.pattern(/^\d{8}$/),
        this.dniValidator.bind(this)
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      surname: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      age: ['', [
        Validators.required,
        Validators.min(16),
        Validators.max(100)
      ]],
      average: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(10)
      ]]
    });

    // Validación asíncrona de DNI
    this.studentForm.get('dni')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(dni => {
      if (dni && this.studentForm.get('dni')?.valid) {
        const exists = this.studentService.dniExists(dni);
        if (exists) {
          this.studentForm.get('dni')?.setErrors({ dniExists: true });
        }
      }
    });
  }

  dniValidator(control: AbstractControl): ValidationErrors | null {
    const dni = control.value;
    if (!dni) return null;
    
    // Validar que sea un número de 8 dígitos
    if (!/^\d{8}$/.test(dni)) {
      return { invalidFormat: true };
    }
    
    return null;
  }

  getErrorMessage(controlName: string): string {
    const control = this.studentForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${this.getFieldName(controlName)} es requerido`;
    }
    
    if (control.hasError('pattern')) {
      if (controlName === 'dni') {
        return 'DNI debe tener 8 dígitos';
      }
      if (controlName === 'name' || controlName === 'surname') {
        return `${this.getFieldName(controlName)} solo puede contener letras`;
      }
    }
    
    if (control.hasError('minlength')) {
      return `${this.getFieldName(controlName)} debe tener al menos 2 caracteres`;
    }
    
    if (control.hasError('min')) {
      if (controlName === 'age') {
        return 'La edad mínima es 16 años';
      }
      return `${this.getFieldName(controlName)} debe ser mayor a 0`;
    }
    
    if (control.hasError('max')) {
      if (controlName === 'age') {
        return 'La edad máxima es 100 años';
      }
      if (controlName === 'average') {
        return 'El promedio máximo es 10';
      }
    }
    
    if (control.hasError('dniExists')) {
      return 'Ya existe un estudiante con este DNI';
    }

    return '';
  }

  getFieldName(controlName: string): string {
    const names: { [key: string]: string } = {
      dni: 'DNI',
      name: 'Nombre',
      surname: 'Apellido',
      age: 'Edad',
      average: 'Promedio'
    };
    return names[controlName] || controlName;
  }

  onSubmit() {
    if (this.studentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const studentData: Student = this.studentForm.value;
      
      this.studentService.addStudent(studentData).subscribe({
        next: () => {
          this.snackBar.open('Estudiante agregado exitosamente', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.studentForm.reset();
          this.router.navigate(['/students']);
        },
        error: (error) => {
          this.snackBar.open('Error al agregar estudiante: ' + error.message, 'Cerrar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  onReset() {
    this.studentForm.reset();
  }

  onCancel() {
    this.router.navigate(['/students']);
  }
} 
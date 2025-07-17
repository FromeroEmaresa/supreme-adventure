import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Student } from '../../shared/entities';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-form.html',
  styleUrl: './add-form.scss'
})
export class AddForm implements OnInit {
  studentForm!: FormGroup;
  @Output() studentAdded = new EventEmitter<Student>();

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}


  ngOnInit() {
    this.studentForm = this.fb.group({
      dni: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      average: [
        '',
        [Validators.required, Validators.min(0), Validators.max(10)],
      ],
    });
  }

  onSubmit() {
  if (this.studentForm.valid) {
    this.studentAdded.emit(this.studentForm.value as Student);

    this.snackBar.open('Estudiante agregado exitosamente', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });

    this.studentForm.reset();
  }
}


  onReset() {
    this.studentForm.reset();
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentService } from '../../../core/services/student.service';
import { Student, DialogData } from '../../../shared/entities';
import { StudentDialog } from '../../students/student-dialog/student-dialog';
import { FullnamePipe } from '../../../shared/pipes/fullname-pipe';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-students-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    FullnamePipe
  ],
  templateUrl: './students.html',
  styleUrls: ['./students.scss']
})
export class StudentsPage implements OnInit {
  students$: Observable<Student[]>;
  displayedColumns: string[] = ['fullname', 'age', 'dni', 'average', 'actions'];

  constructor(
    private studentService: StudentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.students$ = this.studentService.getStudents();
  }

  ngOnInit(): void {}

  eliminarEstudiante(estudiante: Student): void {
    const dialogData: DialogData = {
      title: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este estudiante?',
      student: estudiante,
      type: 'delete'
    };

    const dialogRef = this.dialog.open(StudentDialog, {
      width: '500px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteStudent(estudiante.dni).subscribe({
          next: () => {
            this.snackBar.open('Estudiante eliminado exitosamente', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          },
          error: (error) => {
            this.snackBar.open('Error al eliminar estudiante: ' + error.message, 'Cerrar', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          }
        });
      }
    });
  }

  editarEstudiante(estudiante: Student): void {
    // Navegar a la página de edición usando el DNI del estudiante
    this.router.navigate(['/students/edit', estudiante.dni]);
  }

  getAverageClass(average: number): string {
    if (average >= 9) return 'excellent';
    if (average >= 7) return 'good';
    if (average >= 6) return 'average';
    return 'poor';
  }
} 
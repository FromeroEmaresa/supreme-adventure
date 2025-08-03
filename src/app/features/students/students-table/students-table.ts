import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Student } from '../../../shared/entities';
import { FullnamePipe } from '../../../shared/pipes/fullname-pipe';

@Component({
  selector: 'app-students-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FullnamePipe
  ],
  templateUrl: './students-table.html',
  styleUrl: './students-table.scss'
})
export class StudentsTable {
  @Input() students: Student[] = [];

  displayedColumns: string[] = ['fullname', 'age', 'dni', 'average', 'actions'];  

  @Output() eliminar: EventEmitter<Student> = new EventEmitter<Student>();

  eliminarEstudiante(estudiante: Student) {
    this.eliminar.emit(estudiante);
  }

  @Output() editar = new EventEmitter<Student>();

  editarEstudiante(estudiante: Student) {
    this.editar.emit(estudiante);
  }

  getAverageClass(average: number): string {
    if (average >= 9) return 'excellent';
    if (average >= 7) return 'good';
    if (average >= 6) return 'average';
    return 'poor';
  }
} 
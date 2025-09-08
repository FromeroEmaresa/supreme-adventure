import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { Student } from '../../../shared/entities';
import { FullnamePipe } from '../../../shared/pipes/fullname-pipe';
import { Store } from '@ngrx/store';
import * as AppSelectors from '../../../store/app/app.selectors';

@Component({
  selector: 'app-students-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    FullnamePipe
  ],
  templateUrl: './students-table.html',
  styleUrl: './students-table.scss'
})
export class StudentsTable {
  @Input() students: Student[] = [];
  isAdmin = false;

  displayedColumns: string[] = ['fullname', 'age', 'dni', 'average', 'actions'];  

  @Output() eliminar: EventEmitter<Student> = new EventEmitter<Student>();
  @Output() editar = new EventEmitter<Student>();
  @Output() verDetalle = new EventEmitter<Student>();

  constructor(private store: Store) {
    this.store.select(AppSelectors.selectIsAdmin).subscribe(isAdmin => {
      this.isAdmin = !!isAdmin;
    });
  }

  eliminarEstudiante(estudiante: Student) {
    this.eliminar.emit(estudiante);
  }

  editarEstudiante(estudiante: Student) {
    this.editar.emit(estudiante);
  }

  verDetalleEstudiante(estudiante: Student) {
    this.verDetalle.emit(estudiante);
  }

  getAverageClass(average: number): string {
    if (average >= 9) return 'excellent';
    if (average >= 7) return 'good';
    if (average >= 6) return 'average';
    return 'poor';
  }

  canEdit(): boolean { return this.isAdmin === true; }

  canDelete(): boolean { return this.isAdmin === true; }
} 
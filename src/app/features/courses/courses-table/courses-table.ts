import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Course } from '../../../shared/entities';

@Component({
  selector: 'app-courses-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './courses-table.html',
  styleUrl: './courses-table.scss'
})
export class CoursesTable {
  @Input() courses: Course[] | null = [];
  @Output() editCourse = new EventEmitter<Course>();
  @Output() deleteCourse = new EventEmitter<Course>();

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];

  onEdit(course: Course): void {
    this.editCourse.emit(course);
  }

  onDelete(course: Course): void {
    this.deleteCourse.emit(course);
  }
}
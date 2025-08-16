import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { Course } from '../../../shared/entities';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-courses-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './courses-table.html',
  styleUrl: './courses-table.scss'
})
export class CoursesTable {
  @Input() courses: Course[] | null = [];
  @Output() editCourse = new EventEmitter<Course>();
  @Output() deleteCourse = new EventEmitter<Course>();
  @Output() viewDetail = new EventEmitter<Course>();

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  isAdmin = false;

  constructor(private authService: AuthService) {
    this.isAdmin = this.authService.isAdmin();
  }

  onEdit(course: Course): void {
    this.editCourse.emit(course);
  }

  onDelete(course: Course): void {
    this.deleteCourse.emit(course);
  }

  onViewDetail(course: Course): void {
    this.viewDetail.emit(course);
  }

  canEdit(): boolean {
    return this.isAdmin;
  }

  canDelete(): boolean {
    return this.isAdmin;
  }
}
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Enrollment, Student, Course } from '../../../shared/entities';
import { FullnamePipe } from '../../../shared/pipes/fullname-pipe';

@Component({
  selector: 'app-enrollments-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FullnamePipe
  ],
  templateUrl: './enrollments-table.html',
  styleUrl: './enrollments-table.scss'
})
export class EnrollmentsTable {
  @Input() enrollmentsWithDetails: Array<{
    enrollment: Enrollment;
    student: Student | null;
    course: Course | null;
  }> | null = [];
  @Output() deleteEnrollment = new EventEmitter<{
    enrollment: Enrollment;
    student: Student | null;
    course: Course | null;
  }>();

  displayedColumns: string[] = ['student', 'course', 'enrollmentDate', 'actions'];

  onDelete(enrollmentData: any): void {
    this.deleteEnrollment.emit(enrollmentData);
  }
}
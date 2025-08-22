import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { StudentService } from '../../../core/services/student.service';
import { FullnamePipe } from '../../../shared/pipes/fullname-pipe';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Student } from '../../../shared/entities';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    FullnamePipe
  ],
  templateUrl: './statistics.html',
  styleUrls: ['./statistics.scss']
})
export class StatisticsPage implements OnInit {
  statistics$: Observable<{
    total: number;
    averageAge: number;
    averageGrade: number;
    topStudent: Student | null;
  }>;

  students$: Observable<Student[]>;
  gradeDistribution$: Observable<{ grade: string; count: number; percentage: number }[]>;
  ageDistribution$: Observable<{ range: string; count: number; percentage: number }[]>;

  constructor(private studentService: StudentService) {
    this.statistics$ = this.studentService.getStatistics();
    this.students$ = this.studentService.getStudents();
    
    this.gradeDistribution$ = this.students$.pipe(
      map(students => this.calculateGradeDistribution(students))
    );
    
    this.ageDistribution$ = this.students$.pipe(
      map(students => this.calculateAgeDistribution(students))
    );
  }

  ngOnInit(): void {}

  private calculateGradeDistribution(students: Student[]) {
    const distribution = [
      { grade: 'Excelente (9-10)', min: 9, max: 10, count: 0 },
      { grade: 'Muy Bueno (8-8.9)', min: 8, max: 8.9, count: 0 },
      { grade: 'Bueno (7-7.9)', min: 7, max: 7.9, count: 0 },
      { grade: 'Regular (6-6.9)', min: 6, max: 6.9, count: 0 },
      { grade: 'Insuficiente (0-5.9)', min: 0, max: 5.9, count: 0 }
    ];

    students.forEach(student => {
      const range = distribution.find(d => student.average >= d.min && student.average <= d.max);
      if (range) range.count++;
    });

    return distribution.map(d => ({
      grade: d.grade,
      count: d.count,
      percentage: students.length > 0 ? Math.round((d.count / students.length) * 100) : 0
    }));
  }

  private calculateAgeDistribution(students: Student[]) {
    const distribution = [
      { range: '16-20 años', min: 16, max: 20, count: 0 },
      { range: '21-25 años', min: 21, max: 25, count: 0 },
      { range: '26-30 años', min: 26, max: 30, count: 0 },
      { range: '31+ años', min: 31, max: 999, count: 0 }
    ];

    students.forEach(student => {
      const range = distribution.find(d => student.age >= d.min && student.age <= d.max);
      if (range) range.count++;
    });

    return distribution.map(d => ({
      range: d.range,
      count: d.count,
      percentage: students.length > 0 ? Math.round((d.count / students.length) * 100) : 0
    }));
  }

  getGradeColor(grade: string): string {
    if (grade.includes('Excelente')) return '#4caf50';
    if (grade.includes('Muy Bueno')) return '#8bc34a';
    if (grade.includes('Bueno')) return '#ff9800';
    if (grade.includes('Regular')) return '#ff5722';
    return '#f44336';
  }

  getAverageClass(average: number): string {
    if (average >= 9) return 'excellent';
    if (average >= 7) return 'good';
    if (average >= 6) return 'average';
    return 'poor';
  }
} 
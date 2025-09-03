import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../shared/entities';
import { Observable } from 'rxjs';
import { ApiStatusComponent } from '../../../shared/components/api-status/api-status.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    ApiStatusComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  statistics$: Observable<{
    total: number;
    averageAge: number;
    averageGrade: number;
    topStudent: Student | null;
  }>;

  constructor(private studentService: StudentService) {
    this.statistics$ = this.studentService.getStatistics();
  }

  ngOnInit(): void {}
} 
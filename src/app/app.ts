import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from './toolbar/toolbar';
import { Navbar } from './navbar/navbar';
import { HttpClient } from '@angular/common/http';
import { Student } from '../shared/entities';
import { CommonModule } from '@angular/common';
import { StudentsTable } from './students-table/students-table';
import { AddForm } from "./add-form/add-form";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toolbar, Navbar, CommonModule, StudentsTable, AddForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  students: Student[] = [];
  constructor(private http: HttpClient) {}

    ngOnInit(): void {
      // Initialization logic can go here
      this.http.get<Student[]>('mocks/students.json').subscribe(data => {
        this.students = data;
    });
  }

  addStudent(student: Student) {
    this.students = [...this.students, student];
  }

}

import { Component } from '@angular/core';
import { Layout } from './features/layout/layout';

@Component({
  selector: 'app-root',
  imports: [Layout],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'FromeroE01 - Sistema de Gestión de Estudiantes';
}

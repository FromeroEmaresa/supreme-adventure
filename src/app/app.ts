import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AppActions from './store/app/app.actions';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  title = 'FromeroE01 - Sistema de Gestión de Estudiantes';

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Inicializar la aplicación cargando datos desde localStorage
    this.store.dispatch(AppActions.initializeApp());
  }
}

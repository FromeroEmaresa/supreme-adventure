import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import * as AppActions from '../../../store/app/app.actions';
import { getApiConfig, isUsingCloudApi } from '../../../core/config/api.config';

@Component({
  selector: 'app-api-status',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <mat-card class="api-status-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>cloud</mat-icon>
          Estado de la API
        </mat-card-title>
        <mat-card-subtitle>
          Configuración del Mock API
        </mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <div class="api-info">
          <div class="current-api">
            <strong>API Actual:</strong>
            <mat-chip 
              [color]="isCloudApi ? 'primary' : 'accent'" 
              class="api-chip">
              <mat-icon>{{ isCloudApi ? 'cloud' : 'computer' }}</mat-icon>
              {{ isCloudApi ? 'Cloud Mock API' : 'Local Mock API' }}
            </mat-chip>
          </div>
          
          <div class="api-details" *ngIf="isCloudApi">
            <p><strong>Servicios en la nube:</strong></p>
            <ul>
              <li>🌐 <strong>JSONPlaceholder:</strong> {{ config.cloudApiUrls.jsonPlaceholder }}</li>
              <li>🌐 <strong>MockAPI.io:</strong> {{ config.cloudApiUrls.mockApiIo }}</li>
              <li>🌐 <strong>Heroku:</strong> {{ config.cloudApiUrls.heroku }}</li>
            </ul>
          </div>
          
          <div class="api-details" *ngIf="!isCloudApi">
            <p><strong>Servicios locales:</strong></p>
            <ul>
              <li>🏠 <strong>JSON Server:</strong> {{ config.localApiUrls.jsonServer }}</li>
              <li>🏠 <strong>Mock API:</strong> {{ config.localApiUrls.mockApi }}</li>
            </ul>
          </div>
          
          <div class="network-simulation">
            <p><strong>Simulación de red:</strong></p>
            <ul>
              <li>⏱️ <strong>Delay:</strong> {{ config.networkSimulation.minDelay }}-{{ config.networkSimulation.maxDelay }}ms</li>
              <li>🚫 <strong>Errores:</strong> {{ (config.networkSimulation.errorProbability * 100).toFixed(1) }}%</li>
              <li>⏰ <strong>Timeouts:</strong> {{ (config.networkSimulation.timeoutProbability * 100).toFixed(1) }}%</li>
            </ul>
          </div>
        </div>
      </mat-card-content>
      
      <mat-card-actions>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="switchToCloudApi()"
          [disabled]="isCloudApi">
          <mat-icon>cloud</mat-icon>
          Usar Cloud Mock API
        </button>
        
        <button 
          mat-raised-button 
          color="accent" 
          (click)="switchToLocalApi()"
          [disabled]="!isCloudApi">
          <mat-icon>computer</mat-icon>
          Usar Local Mock API
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .api-status-card {
      max-width: 600px;
      margin: 20px auto;
    }
    
    .api-info {
      margin: 20px 0;
    }
    
    .current-api {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .api-chip {
      font-size: 14px;
    }
    
    .api-details, .network-simulation {
      margin: 15px 0;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }
    
    .api-details ul, .network-simulation ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    
    .api-details li, .network-simulation li {
      margin: 5px 0;
      font-size: 14px;
    }
    
    mat-card-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    
    button {
      min-width: 200px;
    }
  `]
})
export class ApiStatusComponent implements OnInit {
  isCloudApi = false;
  config = getApiConfig();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.isCloudApi = isUsingCloudApi();
  }

  switchToCloudApi(): void {
    this.store.dispatch(AppActions.switchToCloudApi());
    this.isCloudApi = true;
    console.log('🌐 Switched to Cloud Mock API');
  }

  switchToLocalApi(): void {
    this.store.dispatch(AppActions.switchToLocalApi());
    this.isCloudApi = false;
    console.log('🏠 Switched to Local Mock API');
  }
}

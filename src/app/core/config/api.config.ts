export interface ApiConfig {
  useCloudMockApi: boolean;
  cloudApiUrls: {
    jsonPlaceholder: string;
    mockApiIo: string;
    heroku: string;
    example: string;
  };
  localApiUrls: {
    jsonServer: string;
    mockApi: string;
  };
  networkSimulation: {
    enabled: boolean;
    minDelay: number;
    maxDelay: number;
    errorProbability: number;
    timeoutProbability: number;
  };
}

export const API_CONFIG: ApiConfig = {
  useCloudMockApi: true, // Cambiar a true para usar Cloud Mock API
  
  cloudApiUrls: {
    // JSONPlaceholder - API real en la nube para datos de ejemplo
    jsonPlaceholder: 'https://jsonplaceholder.typicode.com',
    
    // MockAPI.io - API personalizada para tu sistema
    mockApiIo: 'https://mockapi.io/projects/64f8b8b0b88a4e4b8b8b8b8b',
    
    // JSON Server en la nube (Heroku/Railway)
    heroku: 'https://fromero-e01-api.herokuapp.com',
    
    // API de ejemplo personalizada
    example: 'https://api.ejemplo.com/v1'
  },
  
  localApiUrls: {
    // JSON Server local
    jsonServer: 'http://localhost:3000',
    
    // Mock API local
    mockApi: 'http://localhost:4200/api/mock'
  },
  
  networkSimulation: {
    enabled: true,
    minDelay: 500,    // 500ms
    maxDelay: 2000,   // 2 segundos
    errorProbability: 0.05,    // 5% de probabilidad de error
    timeoutProbability: 0.01   // 1% de probabilidad de timeout
  }
};

// Función para obtener la configuración actual
export function getApiConfig(): ApiConfig {
  return API_CONFIG;
}

// Función para cambiar entre APIs
export function switchToCloudApi(): void {
  API_CONFIG.useCloudMockApi = true;
  console.log('🌐 Switched to Cloud Mock API');
}

export function switchToLocalApi(): void {
  API_CONFIG.useCloudMockApi = false;
  console.log('🏠 Switched to Local Mock API');
}

// Función para verificar si estamos usando Cloud API
export function isUsingCloudApi(): boolean {
  return API_CONFIG.useCloudMockApi;
}

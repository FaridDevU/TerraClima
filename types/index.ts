// Tipos principales para el sistema TerraClima

export interface Location {
  latitude: number;
  longitude: number;
}

export interface WeatherQuery {
  latitude: number;
  longitude: number;
  date: string;
  provider: WeatherProviderType;
}

export interface HumidityData {
  date: string;
  humidity: number;
  message: string;
  location: Location;
  provider: WeatherProviderType;
  temperature?: number;
  windSpeed?: number;
  pressure?: number;
}

export interface WeatherResponse {
  success: boolean;
  data?: HumidityData;
  error?: string;
}

export interface HistoryEntry extends HumidityData {
  id: string;
  timestamp: number;
}

export enum WeatherProvider {
  OPENWEATHER = 'openweather',
  WEATHERAPI = 'weatherapi',
  MOCKDATA = 'mockdata'
}

export type WeatherProviderType = 'openweather' | 'weatherapi' | 'mockdata';

export enum HumidityLevel {
  CRITICAL = 'critical',      // 0-25%
  DANGEROUS = 'dangerous',    // 26-40%
  WARNING = 'warning',        // 41-55%
  MODERATE = 'moderate',      // 56-70%
  GOOD = 'good',             // 71-85%
  EXCELLENT = 'excellent'     // 86-100%
}

export interface WeatherProvider_Interface {
  name: string;
  getHumidity(query: WeatherQuery): Promise<HumidityData>;
}

export interface FormData {
  latitude: number | null;
  longitude: number | null;
  date: string;
  provider: WeatherProviderType;
}

export interface ValidationErrors {
  latitude?: string;
  longitude?: string;
  date?: string;
  provider?: string;
}

// Configuración de supervivencia
export interface SurvivalConfig {
  minHumidityForCultivation: number;
  optimalHumidityRange: [number, number];
  criticalHumidityThreshold: number;
}

// Datos para gráficas
export interface ChartDataPoint {
  date: string;
  humidity: number;
  temperature?: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

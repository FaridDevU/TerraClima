// Factory para crear proveedores de clima
import type { WeatherProviderType, WeatherProvider_Interface } from '../types';
import { OpenWeatherProvider, WeatherApiProvider, MockDataProvider } from './weatherProviders';

export class WeatherProviderFactory {
  static createProvider(providerType: WeatherProviderType): WeatherProvider_Interface {
    switch (providerType) {
      case 'openweather':
        return new OpenWeatherProvider();
      case 'weatherapi':
        return new WeatherApiProvider();
      case 'mockdata':
        return new MockDataProvider();
      default:
        throw new Error(`Proveedor no soportado: ${providerType}`);
    }
  }
  
  static getAvailableProviders(): { value: WeatherProviderType; label: string }[] {
    return [
      { value: 'openweather', label: 'OpenWeatherMap' },
      { value: 'weatherapi', label: 'WeatherAPI' },
      { value: 'mockdata', label: 'Datos Simulados' }
    ];
  }
}

// Servicio principal de clima
export class WeatherService {
  async getHumidityData(
    latitude: number,
    longitude: number,
    date: string,
    providerType: WeatherProviderType
  ) {
    try {
      const provider = WeatherProviderFactory.createProvider(providerType);
      
      const query = {
        latitude,
        longitude,
        date,
        provider: providerType
      };
      
      const result = await provider.getHumidity(query);
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error en WeatherService:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

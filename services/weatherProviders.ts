// Interfaz base para todos los proveedores de clima
import type { WeatherQuery, HumidityData, WeatherProvider_Interface } from '../types';
import { generateSurvivalMessage } from '../utils/validation';

export abstract class BaseWeatherProvider implements WeatherProvider_Interface {
  abstract name: string;
  abstract getHumidity(query: WeatherQuery): Promise<HumidityData>;
  
  protected createResponse(humidity: number, query: WeatherQuery, additionalData?: any): HumidityData {
    return {
      date: query.date,
      humidity: Math.round(humidity * 100) / 100, // Redondear a 2 decimales
      message: generateSurvivalMessage(humidity, query.date),
      location: {
        latitude: query.latitude,
        longitude: query.longitude
      },
      provider: query.provider,
      ...additionalData
    };
  }
}

// Proveedor OpenWeatherMap
export class OpenWeatherProvider extends BaseWeatherProvider {
  name = 'OpenWeatherMap';
  
  async getHumidity(query: WeatherQuery): Promise<HumidityData> {
    try {
      // En el contexto del servidor, simularemos la llamada
      // Para implementación real, descomentar el código siguiente:
      
      /*
      const config = useRuntimeConfig();
      const apiKey = config.openWeatherApiKey;
      
      if (!apiKey) {
        throw new Error('OpenWeatherMap API key no configurada');
      }
      
      const response = await $fetch(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat: query.latitude,
          lon: query.longitude,
          appid: apiKey,
          units: 'metric'
        }
      });
      
      const humidity = response.main.humidity;
      const temperature = response.main.temp;
      const pressure = response.main.pressure;
      const windSpeed = response.wind?.speed || 0;
      
      return this.createResponse(humidity, query, {
        temperature,
        pressure,
        windSpeed
      });
      */
      
      // Fallback a datos simulados
      return this.generateMockData(query);
      
    } catch (error) {
      console.error('Error OpenWeatherProvider:', error);
      // Fallback a datos simulados en caso de error
      return this.generateMockData(query);
    }
  }
  
  private generateMockData(query: WeatherQuery): HumidityData {
    // Simulación basada en coordenadas y fecha
    const baseHumidity = 30 + (Math.sin(query.latitude) * 20) + (Math.cos(query.longitude) * 15);
    const humidity = Math.max(5, Math.min(95, baseHumidity + Math.random() * 20));
    
    return this.createResponse(humidity, query, {
      temperature: 25 + Math.random() * 20,
      pressure: 1013 + Math.random() * 50,
      windSpeed: Math.random() * 15
    });
  }
}

// Proveedor WeatherAPI
export class WeatherApiProvider extends BaseWeatherProvider {
  name = 'WeatherAPI';
  
  async getHumidity(query: WeatherQuery): Promise<HumidityData> {
    try {
      // En el contexto del servidor, simularemos la llamada
      // Para implementación real, descomentar el código siguiente:
      
      /*
      const config = useRuntimeConfig();
      const apiKey = config.weatherApiKey;
      
      if (!apiKey) {
        throw new Error('WeatherAPI key no configurada');
      }
      
      const response = await $fetch(`https://api.weatherapi.com/v1/current.json`, {
        params: {
          key: apiKey,
          q: `${query.latitude},${query.longitude}`,
          aqi: 'no'
        }
      });
      
      const humidity = response.current.humidity;
      const temperature = response.current.temp_c;
      const pressure = response.current.pressure_mb;
      const windSpeed = response.current.wind_kph / 3.6; // Convertir a m/s
      
      return this.createResponse(humidity, query, {
        temperature,
        pressure,
        windSpeed
      });
      */
      
      // Fallback a datos simulados
      return this.generateMockData(query);
      
    } catch (error) {
      console.error('Error WeatherApiProvider:', error);
      // Fallback a datos simulados
      return this.generateMockData(query);
    }
  }
  
  private generateMockData(query: WeatherQuery): HumidityData {
    // Simulación diferente para WeatherAPI
    const baseHumidity = 40 + (Math.sin(query.longitude) * 25) + (Math.cos(query.latitude) * 10);
    const humidity = Math.max(10, Math.min(90, baseHumidity + Math.random() * 15));
    
    return this.createResponse(humidity, query, {
      temperature: 20 + Math.random() * 25,
      pressure: 1008 + Math.random() * 40,
      windSpeed: Math.random() * 12
    });
  }
}

// Proveedor de datos simulados (para testing y demo)
export class MockDataProvider extends BaseWeatherProvider {
  name = 'Datos Simulados Post-Apocalípticos';
  
  async getHumidity(query: WeatherQuery): Promise<HumidityData> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Algoritmo de simulación post-apocalíptico
    const { latitude, longitude } = query;
    
    // Zonas con diferentes niveles de humedad basadas en coordenadas
    let baseHumidity = 20; // Mundo post-apocalíptico, generalmente seco
    
    // Simular oasis cerca de antiguos cuerpos de agua
    const nearWater = this.isNearWaterSource(latitude, longitude);
    if (nearWater) {
      baseHumidity += 40;
    }
    
    // Variación estacional simulada
    const dayOfYear = new Date(query.date).getDayOfYear();
    const seasonalVariation = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 15;
    
    // Variación por latitud (más húmedo cerca del ecuador)
    const latitudeEffect = Math.cos((latitude * Math.PI) / 180) * 10;
    
    // Efecto de la radiación solar en el mundo post-apocalíptico
    const radiationEffect = Math.random() * 20 - 10;
    
    const finalHumidity = Math.max(5, Math.min(85, 
      baseHumidity + seasonalVariation + latitudeEffect + radiationEffect
    ));
    
    // Temperatura extrema del mundo post-apocalíptico
    const temperature = 35 + Math.random() * 20 + Math.abs(latitude) * 0.2;
    
    return this.createResponse(finalHumidity, query, {
      temperature: Math.round(temperature * 100) / 100,
      pressure: 950 + Math.random() * 100, // Presión atmosférica alterada
      windSpeed: Math.random() * 25 // Vientos fuertes por cambios climáticos
    });
  }
  
  private isNearWaterSource(lat: number, lng: number): boolean {
    // Simular algunas zonas con agua basadas en coordenadas conocidas
    const waterSources = [
      { lat: 40.7128, lng: -74.0060 }, // NY area
      { lat: 34.0522, lng: -118.2437 }, // LA area
      { lat: 51.5074, lng: -0.1278 }, // London area
      { lat: 35.6762, lng: 139.6503 }, // Tokyo area
      { lat: -33.8688, lng: 151.2093 }, // Sydney area
    ];
    
    return waterSources.some(source => {
      const distance = Math.sqrt(
        Math.pow(lat - source.lat, 2) + Math.pow(lng - source.lng, 2)
      );
      return distance < 5; // Dentro de ~5 grados de una fuente de agua
    });
  }
}

// Extensión para Date para obtener día del año
declare global {
  interface Date {
    getDayOfYear(): number;
  }
}

Date.prototype.getDayOfYear = function() {
  const start = new Date(this.getFullYear(), 0, 0);
  const diff = this.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

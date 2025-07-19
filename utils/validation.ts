import { z } from 'zod';
import type { HumidityLevel, SurvivalConfig } from '../types';

// Schema de validación para coordenadas
export const weatherQuerySchema = z.object({
  latitude: z.number()
    .min(-90, 'La latitud debe estar entre -90 y 90')
    .max(90, 'La latitud debe estar entre -90 y 90'),
  longitude: z.number()
    .min(-180, 'La longitud debe estar entre -180 y 180')
    .max(180, 'La longitud debe estar entre -180 y 180'),
  date: z.string()
    .min(1, 'La fecha es requerida')
    .refine((date) => {
      const inputDate = new Date(date);
      const currentDate = new Date();
      const maxDate = new Date();
      maxDate.setDate(currentDate.getDate() + 7); // Máximo 7 días adelante
      
      return inputDate >= currentDate && inputDate <= maxDate;
    }, 'La fecha debe estar entre hoy y los próximos 7 días'),
  provider: z.enum(['openweather', 'weatherapi', 'mockdata'])
});

export type WeatherQueryInput = z.infer<typeof weatherQuerySchema>;

// Configuración de supervivencia para el año 2087
export const survivalConfig: SurvivalConfig = {
  minHumidityForCultivation: 35,
  optimalHumidityRange: [60, 80],
  criticalHumidityThreshold: 25
};

// Función para determinar el nivel de humedad y generar mensaje de supervivencia
export function getHumidityLevel(humidity: number): HumidityLevel {
  if (humidity <= 25) return 'critical' as HumidityLevel;
  if (humidity <= 40) return 'dangerous' as HumidityLevel;
  if (humidity <= 55) return 'warning' as HumidityLevel;
  if (humidity <= 70) return 'moderate' as HumidityLevel;
  if (humidity <= 85) return 'good' as HumidityLevel;
  return 'excellent' as HumidityLevel;
}

// Generar mensaje de supervivencia basado en la humedad
export function generateSurvivalMessage(humidity: number, date: string): string {
  const level = getHumidityLevel(humidity);
  const year = '2087';
  
  const messages = {
    critical: `🚨 ALERTA ROJA - ${date}, ${year}. Humedad crítica del ${humidity}%. El aire está demasiado seco para la supervivencia prolongada. Busca refugio inmediatamente.`,
    dangerous: `⚠️ PELIGRO EXTREMO - ${date}, ${year}. Humedad peligrosa del ${humidity}%. La tierra está demasiado seca para el cultivo. Conserva el agua a toda costa.`,
    warning: `🟡 PRECAUCIÓN - ${date}, ${year}. Humedad del ${humidity}%. Condiciones marginales para cultivo. Considera técnicas de conservación de agua.`,
    moderate: `🟠 SUPERVIVENCIA POSIBLE - ${date}, ${year}. Humedad del ${humidity}%. Condiciones aceptables para cultivo básico. Mantén vigilancia constante.`,
    good: `🟢 ESPERANZA - ${date}, ${year}. Humedad del ${humidity}%. ¡Buenas condiciones para cultivo! Esta zona puede sustentar vida.`,
    excellent: `✨ OASIS ENCONTRADO - ${date}, ${year}. Humedad excelente del ${humidity}%. ¡Condiciones ideales! Este lugar podría ser la clave para reconstruir.`
  };
  
  return messages[level];
}

// Función para obtener el color según el nivel de humedad
export function getHumidityColor(humidity: number): string {
  const level = getHumidityLevel(humidity);
  
  const colors = {
    critical: '#dc2626',    // rojo intenso
    dangerous: '#ea580c',   // naranja rojo
    warning: '#d97706',     // naranja
    moderate: '#65a30d',    // verde lima
    good: '#16a34a',        // verde
    excellent: '#059669'    // verde esmeralda
  };
  
  return colors[level];
}

// Función para validar las coordenadas sin schema
export function validateCoordinates(lat: number, lng: number): string | null {
  if (lat < -90 || lat > 90) {
    return 'La latitud debe estar entre -90 y 90 grados';
  }
  if (lng < -180 || lng > 180) {
    return 'La longitud debe estar entre -180 y 180 grados';
  }
  return null;
}

// Función para formatear fecha
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Función para generar ID único para el historial
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

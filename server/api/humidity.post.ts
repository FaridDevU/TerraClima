// API endpoint para obtener datos de humedad
import { weatherQuerySchema } from '../../utils/validation';
import { WeatherService } from '../../services/weatherFactory';

export default defineEventHandler(async (event) => {
  try {
    // Solo permitir POST
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Método no permitido'
      });
    }

    // Leer el body de la request
    const body = await readBody(event);
    
    // Validar los datos de entrada
    const validation = weatherQuerySchema.safeParse(body);
    
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Datos de entrada inválidos',
        data: validation.error.format()
      });
    }

    const { latitude, longitude, date, provider } = validation.data;

    // Crear instancia del servicio de clima
    const weatherService = new WeatherService();
    
    // Obtener datos de humedad
    const result = await weatherService.getHumidityData(
      latitude,
      longitude,
      date,
      provider as any
    );

    if (!result.success) {
      throw createError({
        statusCode: 500,
        statusMessage: result.error || 'Error interno del servidor'
      });
    }

    // Retornar respuesta exitosa
    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    console.error('Error en API humidity:', error);
    
    // Si es un error ya formateado, reenviarlo
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }
    
    // Error genérico
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    });
  }
});

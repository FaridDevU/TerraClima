// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  nitro: {
    experimental: {
      wasm: true
    }
  },
  modules: [
    '@nuxt/eslint', 
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt'
  ],
  
  // Auto-imports configuration
  imports: {
    autoImport: true
  },
  
  // Configuración del tema post-apocalíptico
  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },

  // Variables de entorno
  runtimeConfig: {
    // Claves privadas (solo disponibles en el servidor)
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
    weatherApiKey: process.env.WEATHER_API_KEY || '',
    
    // Claves públicas (expuestas al cliente)
    public: {
      appName: 'TerraClima - Sobrevivir al Futuro',
      currentYear: '2087'
    }
  },

  // Configuración de TypeScript
  typescript: {
    strict: true
  },

  // Configuración de la aplicación
  app: {
    head: {
      title: 'TerraClima - Sobrevivir al Futuro',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema de monitoreo de humedad para la supervivencia en el año 2087' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600;700&display=swap' }
      ]
    }
  }
})
# 🌍 TerraClima - Sobrevivir al Futuro

**Sistema de Monitoreo de Humedad Post-Apocalíptico para el año 2087**

Una aplicación web desarrollada con **Nuxt.js 4** y **TypeScript** que simula un sistema de supervivencia en un mundo donde el agua es escasa y la humedad del aire determina la posibilidad de cultivo y supervivencia.

![TerraClima Banner](https://img.shields.io/badge/Año-2087-red?style=for-the-badge) ![Nuxt](https://img.shields.io/badge/Nuxt-4.0-00DC82?style=for-the-badge&logo=nuxt.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)

##  Objetivo

Desarrollar una aplicación que permita a los supervivientes del año 2087 consultar la humedad relativa del aire en cualquier ubicación mediante coordenadas y fecha, utilizando diferentes proveedores de datos climáticos con un sistema de inyección de dependencias.

##  Características Principales

###  Frontend Post-Apocalíptico
- 🎨 **Interfaz visual temática** con diseño futurista y post-apocalíptico
- 🌙 **Modo oscuro nativo** con colores neón y efectos de brillo
- 📱 **Totalmente responsivo** con diseño mobile-first
- ⚡ **Animaciones fluidas** con efectos glitch y parpadeo
- 🔤 **Tipografía futurista** (Orbitron + Exo 2)

### 🔧 Tecnología Avanzada
- ⚡ **Nuxt.js 4** con TypeScript y Server Actions
- 🎛️ **Nuxt UI** para componentes base
- 🔍 **Validaciones robustas** con Zod
- 📊 **Sistema de historial** con localStorage
- 🔄 **Inyección de dependencias** con Factory Pattern

### 🌦️ Proveedores de Clima
- 🌐 **OpenWeatherMap** - Datos reales de clima
- 🌤️ **WeatherAPI** - Proveedor alternativo
- 🤖 **MockData** - Simulador post-apocalíptico avanzado

### 💧 Niveles de Supervivencia
- 🔴 **Crítico (0-25%)** - Supervivencia imposible
- 🟠 **Peligroso (26-40%)** - Peligro extremo
- 🟡 **Precaución (41-55%)** - Condiciones marginales
- 🟢 **Moderado (56-70%)** - Supervivencia posible
- 💚 **Bueno (71-85%)** - Condiciones favorables
- ✨ **Excelente (86-100%)** - Oasis encontrado

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js 18+ 
- npm, pnpm, yarn o bun

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd ClimaRescue
```

### 2. Instalar dependencias

### 2. Instalar dependencias

```bash
# npm (recomendado)
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### 3. Configurar variables de entorno (opcional)

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env y agregar tus claves API
OPENWEATHER_API_KEY=tu_clave_aqui
WEATHER_API_KEY=tu_clave_aqui
```

> **Nota**: El proyecto funciona sin claves API usando el proveedor de datos simulados.

### 4. Iniciar servidor de desarrollo

```bash
# npm
npm run dev

# pnpm  
pnpm dev

# yarn
yarn dev

# bun
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🇬🇧 Local Installation & Usage

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ClimaRescue
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Set your API keys in `.env`:
   ```bash
   cp .env.example .env
   # Edit .env and add your keys
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

> The app works with mock data if you don't set API keys.

---

## 🏗️ Comandos de Construcción

### Desarrollo
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run preview      # Preview de la build
npm run generate     # Generación estática
```

### Calidad de Código
```bash
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores automáticamente
```

## 📁 Estructura del Proyecto

```
TerraClima/
├── 📁 .github/              # Configuración GitHub
├── 📁 .nuxt/               # Archivos generados 
├── 📁 assets/              # Recursos estáticos
│   └── css/main.css        # Estilos post-apocalípticos
├── 📁 components/          # Componentes Vue
│   └── ui/                 # Componentes UI base
├── 📁 server/              # API Backend
│   └── api/humidity.post.ts # Endpoint principal
├── 📁 services/            # Lógica de negocio
│   ├── weatherProviders.ts # Proveedores de clima
│   └── weatherFactory.ts   # Factory e inyección
├── 📁 types/               # Definiciones TypeScript
│   └── index.ts
├── 📁 utils/               # Utilidades
│   └── validation.ts       # Validaciones y helpers
├── 📄 app.vue              # Página principal
├── 📄 nuxt.config.ts       # Configuración Nuxt
└── 📄 package.json         # Dependencias
```

## 🛠️ Tecnologías Utilizadas

### Core
- **[Nuxt.js 4](https://nuxt.com/)** - Framework Vue.js full-stack
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Vue 3](https://vuejs.org/)** - Framework reactivo

### UI/UX
- **[Nuxt UI](https://ui.nuxt.com/)** - Librería de componentes
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS
- **CSS Custom** - Estilos post-apocalípticos
- **[Google Fonts](https://fonts.google.com/)** - Orbitron + Exo 2

### Validación y Datos
- **[Zod](https://zod.dev/)** - Validación de esquemas
- **[VueUse](https://vueuse.org/)** - Composables utilitarios

### APIs Externas
- **[OpenWeatherMap API](https://openweathermap.org/api)** - Datos climáticos reales
- **[WeatherAPI](https://www.weatherapi.com/)** - Proveedor alternativo

## 🏛️ Arquitectura

### Patrones de Diseño

#### 🏭 Factory Pattern
```typescript
// Creación de proveedores intercambiables
const provider = WeatherProviderFactory.createProvider('openweather');
const data = await provider.getHumidity(query);
```

#### 🔄 Strategy Pattern  
```typescript
// Diferentes estrategias de obtención de datos
interface WeatherProvider_Interface {
  getHumidity(query: WeatherQuery): Promise<HumidityData>;
}
```

#### 💉 Dependency Injection
```typescript
// Inyección automática según configuración
export class WeatherService {
  async getHumidityData(lat, lng, date, providerType) {
    const provider = WeatherProviderFactory.createProvider(providerType);
    return await provider.getHumidity(query);
  }
}
```

### Flujo de Datos

1. **Frontend** → Formulario con validaciones
2. **Validation** → Zod schema validation  
3. **API Route** → Server action `/api/humidity`
4. **Factory** → Selección de proveedor
5. **Provider** → Obtención de datos (API/Mock)
6. **Response** → Datos + mensaje de supervivencia
7. **UI** → Renderizado temático + historial

## 🎨 Guía de Diseño

### Paleta de Colores
```css
/* Apocalípticos */
--apocalypse-bg: #0a0a0a;        /* Fondo principal */
--apocalypse-surface: #1a1a1a;   /* Superficies */
--apocalypse-border: #404040;    /* Bordes */

/* Humedad (supervivencia) */
--humidity-critical: #dc2626;    /* Rojo - crítico */
--humidity-excellent: #059669;   /* Verde - excelente */

/* Neón futurista */
--neon-green: #00ff88;          /* Verde principal */
--neon-blue: #00ccff;           /* Azul secundario */
--neon-orange: #ff6600;         /* Naranja alerta */
```

### Tipografía
- **Títulos**: Orbitron (display, futurista)
- **Texto**: Exo 2 (legible, moderna)
- **Código**: Courier New (terminal)

### Efectos Especiales
- ⚡ Animaciones glitch en títulos
- 💫 Efectos de brillo (glow) en elementos importantes
- 📡 Líneas de escaneo simuladas
- 🔄 Spinners personalizados
- 🌊 Gradientes radiales dinámicos

## 🔧 APIs y Endpoints

### `POST /api/humidity`

Obtiene datos de humedad para coordenadas y fecha específicas.

**Request Body:**
```typescript
{
  latitude: number;    // -90 a 90
  longitude: number;   // -180 a 180  
  date: string;        // ISO format
  provider: 'openweather' | 'weatherapi' | 'mockdata';
}
```

**Response:**
```typescript
{
  success: boolean;
  data?: {
    date: string;
    humidity: number;
    message: string;           // Mensaje de supervivencia
    location: { latitude, longitude };
    provider: string;
    temperature?: number;
    windSpeed?: number;
    pressure?: number;
  };
  error?: string;
}
```

## 🔒 Configuración de Seguridad

### Variables de Entorno
```bash
# APIs externas (opcionales)
OPENWEATHER_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here

# Desarrollo
NUXT_DEVTOOLS_ENABLED=true
```

### Validaciones Implementadas
- ✅ Coordenadas geográficas válidas
- ✅ Rango de fechas permitidas (hoy + 7 días)
- ✅ Sanitización de inputs
- ✅ Rate limiting implícito (por el navegador)
- ✅ Manejo de errores de APIs externas

## 🧪 Testing y Calidad

### Proveedores de Prueba
El proyecto incluye un **MockDataProvider** que simula:
- 🌍 Variaciones geográficas realistas
- 🗓️ Efectos estacionales
- 💧 Zonas de "oasis" cerca de coordenadas conocidas
- 🌡️ Condiciones climáticas extremas post-apocalípticas

### ESLint Configurado
```bash
npm run lint        # Verificar código
npm run lint:fix    # Corregir automáticamente
```

## 🚀 Deployment

### Build para Producción
```bash
npm run build       # Construcción optimizada
npm run preview     # Vista previa local
```

### Generación Estática
```bash
npm run generate    # SSG (Static Site Generation)
```

### Plataformas Recomendadas
- **[Vercel](https://vercel.com/)** - Deployment automático
- **[Netlify](https://netlify.com/)** - JAMstack hosting  
- **[Railway](https://railway.app/)** - Full-stack deployment

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Guías de Contribución
- Mantén la temática post-apocalíptica en textos y nomenclatura
- Usa TypeScript estricto con tipos bien definidos
- Sigue los patrones de arquitectura establecidos
- Incluye tests para nueva funcionalidad
- Respeta el diseño visual coherente

## 📋 Roadmap

### Funcionalidades Planificadas
- [ ] 📊 **Gráficas de tendencia** con Chart.js
- [ ] 📍 **Geolocalización automática**
- [ ] 🔔 **Sistema de notificaciones**
- [ ] 📤 **Exportación de datos** (CSV/JSON)
- [ ] 📱 **Progressive Web App** (PWA)
- [ ] 🌐 **Modo offline** con cache
- [ ] 🎯 **Predicciones ML** de supervivencia
- [ ] 👥 **Sistema colaborativo** entre supervivientes

### Mejoras Técnicas
- [ ] ⚡ Optimización de performance
- [ ] 🧪 Suite de testing completa
- [ ] 📚 Documentación de API
- [ ] 🔄 CI/CD pipeline
- [ ] 📦 Docker containerization


## 👥 Créditos

### Desarrollado para el Reto TerraClima
**Contexto Narrativo**: Año 2087, supervivencia post-apocalíptica
**Objetivo**: Sistema de monitoreo de humedad para agricultura de supervivencia

### APIs y Servicios
- [OpenWeatherMap](https://openweathermap.org/) - Datos climáticos
- [WeatherAPI](https://www.weatherapi.com/) - Proveedor alternativo
- [Google Fonts](https://fonts.google.com/) - Tipografías

---

<div align="center">

**🌍 TerraClima - Donde cada gota cuenta para la supervivencia**

![Footer](https://img.shields.io/badge/2087-El%20futuro%20es%20ahora-green?style=for-the-badge)

</div>

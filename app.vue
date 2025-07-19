<template>
  <div class="apocalypse-container">
    <!-- Encabezado principal -->
    <header class="text-center mb-4">
      <h1 class="glitch">TerraClima</h1>
      <p class="text-secondary text-xl mt-2">
        Sistema de Supervivencia Climática - Año {{ currentYear }}
      </p>
      <div class="terminal-text mt-4">
        > Interceptando señales satelitales...
        > Analizando condiciones de supervivencia...
        > Sistema operativo.
      </div>
    </header>

    <!-- Panel principal -->
    <div class="grid-2">
      <!-- Formulario de consulta -->
      <div class="apocalypse-card">
        <h2 class="mb-4">Escanear Humedad</h2>
        <form @submit.prevent="scanHumidity" class="apocalypse-form">
          <!-- Latitud -->
          <div class="form-group">
            <label class="form-label">Latitud (-90 a 90)</label>
            <input
              v-model.number="form.latitude"
              type="number"
              step="any"
              min="-90"
              max="90"
              class="form-input"
              placeholder="Ej: 40.7128"
              :class="{ 'border-red-500': errors.latitude }"
              required
            />
            <span v-if="errors.latitude" class="text-red-400 text-sm">
              {{ errors.latitude }}
            </span>
          </div>
          <!-- Longitud -->
          <div class="form-group">
            <label class="form-label">Longitud (-180 a 180)</label>
            <input
              v-model.number="form.longitude"
              type="number"
              step="any"
              min="-180"
              max="180"
              class="form-input"
              placeholder="Ej: -74.0060"
              :class="{ 'border-red-500': errors.longitude }"
              required
            />
            <span v-if="errors.longitude" class="text-red-400 text-sm">
              {{ errors.longitude }}
            </span>
          </div>
          <!-- Fecha -->
          <div class="form-group">
            <label class="form-label">Fecha de análisis</label>
            <input
              v-model="form.date"
              type="date"
              :min="today"
              :max="maxDate"
              class="form-input"
              :class="{ 'border-red-500': errors.date }"
              required
            />
            <span v-if="errors.date" class="text-red-400 text-sm">
              {{ errors.date }}
            </span>
          </div>
          <!-- Proveedor -->
          <div class="form-group">
            <label class="form-label">Fuente de datos</label>
            <select
              v-model="form.provider"
              class="form-input"
            >
              <option
                v-for="provider in availableProviders"
                :key="provider.value"
                :value="provider.value"
              >
                {{ provider.label }}
              </option>
            </select>
          </div>
          <!-- Botón de geolocalización -->
          <button type="button" class="apocalypse-button w-full mb-2" @click="getLocation">
            <span class="material-icons" style="vertical-align: middle;">location_on</span>
            Usar mi ubicación actual
          </button>
          <!-- Botón de envío -->
          <button
            type="submit"
            class="apocalypse-button w-full"
            :disabled="loading"
          >
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Escaneando...' : 'Iniciar Escaneo' }}
          </button>
        </form>
        <!-- Error -->
        <div v-if="error" class="alert-error mt-4">
          <strong>Error del sistema:</strong> {{ error }}
        </div>
      </div>

      <!-- Resultados -->
      <div class="apocalypse-card">
        <h2 class="mb-4">Estado de Supervivencia</h2>
        <div v-if="result" class="space-y-4">
          <!-- Indicador de humedad -->
          <div class="humidity-indicator">
            <div class="humidity-value" :class="getHumidityClass(result.humidity)">
              {{ result.humidity }}%
            </div>
            <div class="humidity-label">
              Humedad relativa
            </div>
          </div>
          <!-- Mensaje de supervivencia -->
          <div class="survival-message" :class="getHumidityClass(result.humidity)">
            {{ result.message }}
          </div>
          <!-- Detalles adicionales -->
          <div class="grid-2 gap-2 text-sm">
            <div>
              <strong>Ubicación:</strong><br>
              {{ result.location.latitude.toFixed(4) }}, {{ result.location.longitude.toFixed(4) }}
            </div>
            <div>
              <strong>Fecha:</strong><br>
              {{ formatDate(result.date) }}
            </div>
            <div v-if="result.temperature">
              <strong>Temperatura:</strong><br>
              {{ result.temperature }}°C
            </div>
            <div>
              <strong>Proveedor:</strong><br>
              {{ result.provider }}
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 py-8">
          <div class="terminal-text">
            > Esperando datos de escaneo...
            > Preparado para análisis de supervivencia
          </div>
        </div>
      </div>
    </div>

    <!-- Historial -->
    <div v-if="history.length > 0" class="apocalypse-card mt-4">
      <h2 class="mb-4">Historial de Exploraciones</h2>
      <button class="apocalypse-button w-full mb-2" @click="exportHistoryCSV">
        <span class="material-icons" style="vertical-align: middle;">download</span>
        Exportar historial (CSV)
      </button>
      <!-- Gráfica de tendencia de humedad -->
      <div class="apocalypse-card mb-4" style="background:rgba(0,0,0,0.2);">
        <canvas id="humidityChart" height="120"></canvas>
      </div>
      <div class="grid-3">
        <div 
          v-for="(entry, index) in history.slice().reverse().slice(0, 6)" 
          :key="index"
          class="mini-card"
          @click="loadFromHistory(entry)"
        >
          <div class="flex justify-between items-center mb-2">
            <div class="humidity-mini" :class="getHumidityClass(entry.humidity)">
              {{ entry.humidity }}%
            </div>
            <div class="text-xs text-gray-400">
              {{ formatDate(entry.date) }}
            </div>
          </div>
          <div class="text-xs">
            {{ entry.location.latitude.toFixed(2) }}, {{ entry.location.longitude.toFixed(2) }}
          </div>
          <div class="text-xs text-gray-400 mt-1">
            {{ entry.provider }}
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center mt-8 text-gray-500 text-sm">
      <div class="terminal-text">
        > TerraClima v2.1.7 - Sistema de Supervivencia Autónomo
        > Manteniendo la humanidad viva desde 2087
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import type { WeatherProviderType, HumidityData, FormData, ValidationErrors } from './types'
import { WeatherProviderFactory } from './services/weatherFactory'
import { getHumidityLevel } from './utils/validation'

// Estado reactivo
const loading = ref(false)
const result = ref<HumidityData | null>(null)
const error = ref<string>('')
const errors = ref<ValidationErrors>({})
const isClient = ref(false)

// Formulario
const form = ref<FormData>({
  latitude: null,
  longitude: null,
  date: '',
  provider: 'mockdata' as WeatherProviderType
})

// Historial (localStorage)
const history = ref<HumidityData[]>([])

// Proveedores disponibles
const availableProviders = WeatherProviderFactory.getAvailableProviders()

// Fechas
const today: string = new Date().toISOString().split('T')[0] ?? ''
const maxDate: string = (() => {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString().split('T')[0] ?? ''
})()

// Lifecycle
onMounted(() => {
  isClient.value = true
  loadHistory()
  // Configurar fecha por defecto
  if (!form.value.date) {
    form.value.date = today
  }
  renderChart()
})
watch(history, () => renderChart())

// Métodos
async function scanHumidity() {
  // Limpiar errores previos
  error.value = ''
  errors.value = {}
  
  // Validar formulario
  if (!validateForm()) {
    return
  }

  loading.value = true
  
  try {
    const response = await fetch('/api/humidity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: form.value.latitude,
        longitude: form.value.longitude,
        date: form.value.date,
        provider: form.value.provider
      })
    })

    const data = await response.json()

    if (data.success) {
      result.value = data.data
      addToHistory(data.data)
    } else {
      error.value = data.error || 'Error desconocido al procesar la solicitud'
    }
  } catch (err: any) {
    console.error('Error scanning humidity:', err)
    error.value = 'Error de comunicación con el sistema central. Reintentando...'
  } finally {
    loading.value = false
  }
}

function validateForm(): boolean {
  errors.value = {}
  let isValid = true

  // Validar latitud
  if (!form.value.latitude || form.value.latitude < -90 || form.value.latitude > 90) {
    errors.value.latitude = 'Coordenada de latitud inválida (-90 a 90)'
    isValid = false
  }

  // Validar longitud
  if (!form.value.longitude || form.value.longitude < -180 || form.value.longitude > 180) {
    errors.value.longitude = 'Coordenada de longitud inválida (-180 a 180)'
    isValid = false
  }

  // Validar fecha
  if (!form.value.date) {
    errors.value.date = 'Fecha requerida'
    isValid = false
  } else {
    const selectedDate = new Date(form.value.date)
    const todayDate = new Date(today)
    const maxDateObj = new Date(maxDate)

    if (selectedDate < todayDate || selectedDate > maxDateObj) {
      errors.value.date = 'Fecha debe estar entre hoy y 7 días adelante'
      isValid = false
    }
  }

  return isValid
}

function getHumidityClass(humidity: number): string {
  const level = getHumidityLevel(humidity)
  
  const classMap = {
    'critical': 'humidity-critical',
    'dangerous': 'humidity-dangerous', 
    'warning': 'humidity-warning',
    'moderate': 'humidity-moderate',
    'good': 'humidity-good',
    'excellent': 'humidity-excellent'
  }
  
  return classMap[level] || 'humidity-moderate'
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function addToHistory(entry: HumidityData) {
  // Evitar duplicados
  const exists = history.value.some(h => 
    h.location.latitude === entry.location.latitude &&
    h.location.longitude === entry.location.longitude &&
    h.date === entry.date
  )
  
  if (exists) return
  
  history.value.push(entry)
  
  // Mantener solo los últimos 20 registros
  if (history.value.length > 20) {
    history.value = history.value.slice(-20)
  }
  
  saveHistory()
}

function loadHistory() {
  if (isClient.value) {
    try {
      const saved = localStorage.getItem('terraclima-history')
      if (saved) {
        history.value = JSON.parse(saved)
      }
    } catch (e) {
      console.error('Error loading history:', e)
    }
  }
}

function saveHistory() {
  if (isClient.value) {
    try {
      localStorage.setItem('terraclima-history', JSON.stringify(history.value))
    } catch (e) {
      console.error('Error saving history:', e)
    }
  }
}

function loadFromHistory(entry: HumidityData) {
  form.value.latitude = entry.location.latitude
  form.value.longitude = entry.location.longitude
  form.value.date = entry.date
  form.value.provider = entry.provider as WeatherProviderType
  result.value = entry
}

// Geolocalización automática
function getLocation() {
  if (!navigator.geolocation) {
    error.value = 'Geolocalización no soportada en este dispositivo.'
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      form.value.latitude = parseFloat(pos.coords.latitude.toFixed(4))
      form.value.longitude = parseFloat(pos.coords.longitude.toFixed(4))
    },
    () => {
      error.value = 'No se pudo obtener la ubicación.'
    }
  )
}

// Exportar historial a CSV
function exportHistoryCSV() {
  if (!history.value.length) return
  const rows = [
    ['Fecha', 'Latitud', 'Longitud', 'Humedad', 'Proveedor']
  ]
  history.value.forEach(h => {
    rows.push([
      h.date,
      String(h.location.latitude),
      String(h.location.longitude),
      String(h.humidity),
      h.provider
    ])
  })
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'terraclima-historial.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// Gráfica de tendencia de humedad
let chart: any = null
function renderChart() {
  const ctx = document.getElementById('humidityChart') as HTMLCanvasElement
  if (!ctx || !history.value.length) return
  // Lazy load Chart.js
  import('chart.js/auto').then(({ default: Chart }) => {
    if (chart) chart.destroy()
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: history.value.map(h => h.date),
        datasets: [{
          label: 'Humedad (%)',
          data: history.value.map(h => h.humidity),
          borderColor: '#00ff00',
          backgroundColor: 'rgba(0,255,0,0.1)',
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: '#ffaa00',
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { min: 0, max: 100, grid: { color: '#333' } }
        }
      }
    })
  })
}

const currentYear = useRuntimeConfig().public.currentYear
</script>

<style scoped>
/* Tema Post-Apocalíptico */
:root {
  --apocalypse-bg: #0a0a0a;
  --apocalypse-surface: #1a1a1a;
  --apocalypse-border: #333;
  --apocalypse-text: #e0e0e0;
  --apocalypse-text-dim: #888;
  --apocalypse-accent: #00ff00;
  --apocalypse-warning: #ffaa00;
  --apocalypse-danger: #ff4444;
  
  /* Niveles de humedad */
  --humidity-critical: #ff0000;
  --humidity-dangerous: #ff4400;
  --humidity-warning: #ffaa00;
  --humidity-moderate: #88cc00;
  --humidity-good: #00cc44;
  --humidity-excellent: #00ff88;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--apocalypse-bg);
  color: var(--apocalypse-text);
  font-family: 'Exo 2', sans-serif;
  min-height: 100vh;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(0, 255, 0, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 170, 0, 0.05) 0%, transparent 50%),
    linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
  background-attachment: fixed;
}

.apocalypse-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

/* Typography */
h1.glitch {
  font-family: 'Orbitron', monospace;
  font-size: 3rem;
  font-weight: 900;
  color: var(--apocalypse-accent);
  text-shadow: 
    0 0 10px var(--apocalypse-accent),
    0 0 20px var(--apocalypse-accent),
    2px 2px 0px rgba(255, 0, 0, 0.3);
  animation: glitch 2s infinite;
  position: relative;
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  2% { transform: translate(-1px, -1px); }
  4% { transform: translate(1px, 1px); }
  6% { transform: translate(-1px, 1px); }
  8% { transform: translate(1px, -1px); }
  10% { transform: translate(0); }
}

h2 {
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  color: var(--apocalypse-accent);
  margin-bottom: 1rem;
  text-shadow: 0 0 5px var(--apocalypse-accent);
}

.text-secondary {
  color: var(--apocalypse-text-dim);
}

.terminal-text {
  font-family: 'Courier New', monospace;
  color: var(--apocalypse-accent);
  font-size: 0.9rem;
  line-height: 1.4;
  opacity: 0.8;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 0.8; }
  51%, 100% { opacity: 0.4; }
}

/* Layout */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

@media (max-width: 768px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
  
  h1.glitch {
    font-size: 2rem;
  }
}

/* Cards */
.apocalypse-card {
  background: linear-gradient(135deg, var(--apocalypse-surface) 0%, rgba(26, 26, 26, 0.8) 100%);
  border: 1px solid var(--apocalypse-border);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.apocalypse-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    var(--apocalypse-accent) 50%, 
    transparent 100%);
  opacity: 0.5;
}

.mini-card {
  background: rgba(26, 26, 26, 0.6);
  border: 1px solid var(--apocalypse-border);
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mini-card:hover {
  background: rgba(26, 26, 26, 0.8);
  border-color: var(--apocalypse-accent);
  transform: translateY(-2px);
  box-shadow: 0 2px 10px rgba(0, 255, 0, 0.2);
}

/* Forms */
.apocalypse-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: var(--apocalypse-text);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--apocalypse-border);
  border-radius: 4px;
  padding: 12px;
  color: var(--apocalypse-text);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--apocalypse-accent);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  background: rgba(0, 0, 0, 0.5);
}

.form-input::placeholder {
  color: var(--apocalypse-text-dim);
}

/* Buttons */
.apocalypse-button {
  background: linear-gradient(135deg, var(--apocalypse-accent) 0%, #00cc00 100%);
  border: none;
  border-radius: 6px;
  padding: 14px 24px;
  color: #000;
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.apocalypse-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 255, 0, 0.4);
}

.apocalypse-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Humidity Display */
.humidity-indicator {
  text-align: center;
  margin: 20px 0;
}

.humidity-value {
  font-family: 'Orbitron', monospace;
  font-size: 4rem;
  font-weight: 900;
  text-shadow: 0 0 20px currentColor;
  animation: pulse 2s infinite;
}

.humidity-label {
  font-size: 0.9rem;
  color: var(--apocalypse-text-dim);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 8px;
}

.humidity-mini {
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  font-size: 1.1rem;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Survival Message */
.survival-message {
  background: rgba(0, 0, 0, 0.3);
  border-left: 4px solid currentColor;
  padding: 16px;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  text-shadow: 0 0 10px currentColor;
}

/* Humidity Level Colors */
.humidity-critical { color: var(--humidity-critical); }
.humidity-dangerous { color: var(--humidity-dangerous); }
.humidity-warning { color: var(--humidity-warning); }
.humidity-moderate { color: var(--humidity-moderate); }
.humidity-good { color: var(--humidity-good); }
.humidity-excellent { color: var(--humidity-excellent); }

/* Alerts */
.alert-error {
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid var(--apocalypse-danger);
  border-radius: 4px;
  padding: 12px;
  color: var(--apocalypse-danger);
}

/* Utilities */
.w-full { width: 100%; }
.text-center { text-align: center; }
.mb-4 { margin-bottom: 1rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mt-8 { margin-top: 2rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.gap-2 { gap: 0.5rem; }
.py-8 { padding: 2rem 0; }
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-xl { font-size: 1.25rem; }
</style>

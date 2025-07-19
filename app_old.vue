<template>
  <div class="apocalypse-container">
    <!-- Header -->
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

    <!-- Dashboard Principal -->
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
            <label class="form-label">Fecha de Análisis</label>
            <input
              v-model="form.date"
              type="date"
              class="form-input"
              :min="today"
              :max="maxDate"
              :class="{ 'border-red-500': errors.date }"
              required
            />
            <span v-if="errors.date" class="text-red-400 text-sm">
              {{ errors.date }}
            </span>
          </div>

          <!-- Proveedor -->
          <div class="form-group">
            <label class="form-label">Fuente de Datos</label>
            <select v-model="form.provider" class="select-apocalypse" required>
              <option value="">Seleccionar proveedor</option>
              <option 
                v-for="provider in availableProviders" 
                :key="provider.value" 
                :value="provider.value"
              >
                {{ provider.label }}
              </option>
            </select>
          </div>

          <!-- Botón -->
          <button 
            type="submit" 
            class="btn-apocalypse"
            :disabled="loading"
          >
            <span v-if="loading" class="loading-spinner mr-2"></span>
            {{ loading ? 'Escaneando...' : 'Escanear el Clima' }}
          </button>
        </form>
      </div>

      <!-- Resultado -->
      <div class="apocalypse-card">
        <h2 class="mb-4">Estado de Supervivencia</h2>
        
        <div v-if="!result && !loading" class="text-center text-muted">
          <UIcon name="i-heroicons-signal" class="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Esperando datos de escaneo...</p>
        </div>

        <div v-if="loading" class="text-center">
          <div class="loading-spinner mx-auto mb-4"></div>
          <p>Interceptando señales satelitales...</p>
        </div>

        <div 
          v-if="result" 
          class="humidity-result"
          :class="getHumidityClass(result.humidity)"
        >
          <div class="humidity-value">{{ result.humidity }}%</div>
          <p class="humidity-message">{{ result.message }}</p>
          
          <div class="mt-4 text-left text-sm text-muted">
            <p><strong>Coordenadas:</strong> {{ result.location.latitude }}, {{ result.location.longitude }}</p>
            <p><strong>Proveedor:</strong> {{ getProviderName(result.provider) }}</p>
            <p v-if="result.temperature"><strong>Temperatura:</strong> {{ result.temperature }}°C</p>
            <p v-if="result.windSpeed"><strong>Viento:</strong> {{ result.windSpeed }} m/s</p>
          </div>
        </div>

        <div v-if="error" class="humidity-result humidity-critical">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto mb-4" />
          <h3 class="text-xl mb-2">Error del Sistema</h3>
          <p>{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Historial -->
    <div v-if="history.length > 0" class="apocalypse-card mt-4">
      <h2 class="mb-4">Historial de Exploraciones</h2>
      
      <div class="grid-3">
        <div 
          v-for="entry in history.slice().reverse().slice(0, 6)" 
          :key="entry.id"
          class="p-4 rounded-lg border"
          :class="getHumidityBorderClass(entry.humidity)"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="font-bold text-lg">{{ entry.humidity }}%</span>
            <span class="text-sm text-muted">{{ formatDate(entry.date) }}</span>
          </div>
          <div class="text-sm text-muted">
            {{ entry.location.latitude.toFixed(2) }}, {{ entry.location.longitude.toFixed(2) }}
          </div>
          <div class="text-xs text-muted mt-1">
            {{ getProviderName(entry.provider) }}
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <button @click="clearHistory" class="text-sm text-red-400 hover:text-red-300">
          Limpiar Historial
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig, useHead } from 'nuxt/app'
import type { WeatherProviderType, HumidityData, FormData, ValidationErrors } from './types'
import { WeatherProviderFactory } from './services/weatherFactory'
import { getHumidityLevel } from './utils/validation'

const currentYear = useRuntimeConfig().public.currentYear
const loading = ref(false)
const result = ref<HumidityData | null>(null)
const error = ref<string>('')
const errors = ref<ValidationErrors>({})
const isClient = ref(false)

const form = ref<FormData>({
  latitude: null,
  longitude: null,
  date: '',
  provider: 'mockdata' as WeatherProviderType
})

// Historial con id manual
interface HistoryEntry extends HumidityData { id: string }
const history = ref<HistoryEntry[]>([])

const availableProviders = WeatherProviderFactory.getAvailableProviders()
const today: string = new Date().toISOString().split('T')[0] ?? ''
const maxDate: string = (() => {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString().split('T')[0] ?? ''
})()

useHead({
  title: 'TerraClima - Dashboard de Supervivencia',
  meta: [
    { name: 'description', content: 'Sistema de monitoreo de humedad para la supervivencia en el año 2087' }
  ]
})

onMounted(() => {
  isClient.value = true
  loadHistory()
  if (!form.value.date) {
    form.value.date = today
  }
})

async function scanHumidity() {
  error.value = ''
  errors.value = {}
  if (!validateForm()) return
  loading.value = true
  try {
    const response = await fetch('/api/humidity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: form.value.latitude,
        longitude: form.value.longitude,
        date: form.value.date,
        provider: form.value.provider
      })
    })
    const data = await response.json()
    if (data.success && data.data) {
      result.value = data.data
      addToHistory(data.data)
    } else {
      throw new Error(data.error || 'No se pudieron obtener datos')
    }
  } catch (err: any) {
    error.value = err.message || 'Error de conexión con el servidor'
  } finally {
    loading.value = false
  }
}

function validateForm(): boolean {
  const newErrors: ValidationErrors = {}
  if (!form.value.latitude || form.value.latitude < -90 || form.value.latitude > 90) {
    newErrors.latitude = 'La latitud debe estar entre -90 y 90'
  }
  if (!form.value.longitude || form.value.longitude < -180 || form.value.longitude > 180) {
    newErrors.longitude = 'La longitud debe estar entre -180 y 180'
  }
  if (!form.value.date) {
    newErrors.date = 'La fecha es requerida'
  }
  if (!form.value.provider) {
    newErrors.provider = 'Selecciona un proveedor'
  }
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

function getHumidityClass(humidity: number): string {
  const level = getHumidityLevel(humidity)
  return `humidity-${level}`
}

function getHumidityBorderClass(humidity: number): string {
  const level = getHumidityLevel(humidity)
  const colors = {
    critical: 'border-red-500',
    dangerous: 'border-orange-500',
    warning: 'border-yellow-500',
    moderate: 'border-lime-500',
    good: 'border-green-500',
    excellent: 'border-emerald-500'
  }
  return colors[level] || 'border-gray-500'
}

function getProviderName(provider: WeatherProviderType): string {
  const found = availableProviders.find(p => p.value === provider)
  return found?.label || provider
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function addToHistory(data: HumidityData) {
  const entry: HistoryEntry = {
    ...data,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
  }
  history.value.push(entry)
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

function clearHistory() {
  history.value = []
  saveHistory()
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600;700&display=swap');

/* Variables CSS personalizadas para el tema post-apocalíptico */
:root {
  /* Colores principales */
  --apocalypse-bg: #0a0a0a;
  --apocalypse-surface: #1a1a1a;
  --apocalypse-surface-light: #2a2a2a;
  --apocalypse-border: #404040;
  
  /* Colores de humedad */
  --humidity-critical: #dc2626;
  --humidity-dangerous: #ea580c;
  --humidity-warning: #d97706;
  --humidity-moderate: #65a30d;
  --humidity-good: #16a34a;
  --humidity-excellent: #059669;
  
  /* Colores de neón */
  --neon-green: #00ff88;
  --neon-blue: #00ccff;
  --neon-orange: #ff6600;
  --neon-red: #ff3366;
  
  /* Texto */
  --text-primary: #e5e5e5;
  --text-secondary: #a3a3a3;
  --text-muted: #666666;
  
  /* Fuentes */
  --font-display: 'Orbitron', monospace;
  --font-body: 'Exo 2', sans-serif;
  
  /* Sombras y efectos */
  --glow-green: 0 0 20px rgba(0, 255, 136, 0.3);
  --glow-blue: 0 0 20px rgba(0, 204, 255, 0.3);
  --glow-red: 0 0 20px rgba(255, 51, 102, 0.3);
  --shadow-harsh: 0 4px 20px rgba(0, 0, 0, 0.8);
}

/* Reset y base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: var(--font-body);
  background: var(--apocalypse-bg);
  color: var(--text-primary);
  min-height: 100vh;
}

body {
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 102, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
    linear-gradient(180deg, var(--apocalypse-bg) 0%, #1a1a1a 100%);
  min-height: 100vh;
  background-attachment: fixed;
}

/* Tipografía principal */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

h1 {
  font-size: 3rem;
  color: var(--neon-green);
  text-shadow: var(--glow-green);
  animation: pulse-glow 3s ease-in-out infinite alternate;
}

h2 {
  font-size: 2rem;
  color: var(--neon-blue);
}

/* Animaciones */
@keyframes pulse-glow {
  from {
    text-shadow: var(--glow-green);
  }
  to {
    text-shadow: 
      var(--glow-green),
      0 0 30px rgba(0, 255, 136, 0.5),
      0 0 40px rgba(0, 255, 136, 0.3);
  }
}

@keyframes scanner-line {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Contenedores principales */
.apocalypse-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
}

.apocalypse-card {
  background: rgba(26, 26, 26, 0.9);
  border: 1px solid var(--apocalypse-border);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-harsh);
  position: relative;
  overflow: hidden;
}

.apocalypse-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--neon-green), transparent);
  animation: scanner-line 4s linear infinite;
}

/* Formularios */
.apocalypse-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--neon-blue);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-input {
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid var(--apocalypse-border);
  border-radius: 6px;
  padding: 12px 16px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--neon-green);
  box-shadow: 0 0 0 2px rgba(0, 255, 136, 0.2);
  background: rgba(42, 42, 42, 1);
}

.form-input::placeholder {
  color: var(--text-muted);
}

/* Botones */
.btn-apocalypse {
  background: linear-gradient(135deg, var(--neon-green), #00cc73);
  border: none;
  border-radius: 6px;
  padding: 14px 28px;
  color: #000;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-apocalypse:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow-green), var(--shadow-harsh);
}

.btn-apocalypse:active {
  transform: translateY(0);
}

.btn-apocalypse:disabled {
  background: rgba(102, 102, 102, 0.5);
  color: var(--text-muted);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Selects */
.select-apocalypse {
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid var(--apocalypse-border);
  border-radius: 6px;
  padding: 12px 16px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-apocalypse:focus {
  outline: none;
  border-color: var(--neon-blue);
  box-shadow: 0 0 0 2px rgba(0, 204, 255, 0.2);
}

/* Resultados de humedad */
.humidity-result {
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-top: 2rem;
}

.humidity-critical {
  background: radial-gradient(circle, rgba(220, 38, 38, 0.2), rgba(220, 38, 38, 0.05));
  border: 2px solid var(--humidity-critical);
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.3);
}

.humidity-dangerous {
  background: radial-gradient(circle, rgba(234, 88, 12, 0.2), rgba(234, 88, 12, 0.05));
  border: 2px solid var(--humidity-dangerous);
  box-shadow: 0 0 30px rgba(234, 88, 12, 0.3);
}

.humidity-warning {
  background: radial-gradient(circle, rgba(217, 119, 6, 0.2), rgba(217, 119, 6, 0.05));
  border: 2px solid var(--humidity-warning);
  box-shadow: 0 0 30px rgba(217, 119, 6, 0.3);
}

.humidity-moderate {
  background: radial-gradient(circle, rgba(101, 163, 13, 0.2), rgba(101, 163, 13, 0.05));
  border: 2px solid var(--humidity-moderate);
  box-shadow: 0 0 30px rgba(101, 163, 13, 0.3);
}

.humidity-good {
  background: radial-gradient(circle, rgba(22, 163, 74, 0.2), rgba(22, 163, 74, 0.05));
  border: 2px solid var(--humidity-good);
  box-shadow: 0 0 30px rgba(22, 163, 74, 0.3);
}

.humidity-excellent {
  background: radial-gradient(circle, rgba(5, 150, 105, 0.2), rgba(5, 150, 105, 0.05));
  border: 2px solid var(--humidity-excellent);
  box-shadow: 0 0 30px rgba(5, 150, 105, 0.3);
}

.humidity-value {
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  animation: flicker 2s ease-in-out infinite;
}

.humidity-message {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

/* Loading spinner */
.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 255, 136, 0.3);
  border-radius: 50%;
  border-top-color: var(--neon-green);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Grid responsivo */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Utilidades */
.text-center { text-align: center; }
.text-glow { text-shadow: var(--glow-green); }
.mt-4 { margin-top: 2rem; }
.mb-4 { margin-bottom: 2rem; }
.p-4 { padding: 2rem; }

/* Responsive */
@media (max-width: 768px) {
  .apocalypse-container {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .humidity-value {
    font-size: 3rem;
  }
  
  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }
}

/* Efectos especiales */
.glitch {
  position: relative;
  animation: glitch 2s linear infinite;
}

@keyframes glitch {
  2%, 64% {
    transform: translate(2px, 0) skew(0deg);
  }
  4%, 60% {
    transform: translate(-2px, 0) skew(0deg);
  }
  62% {
    transform: translate(0, 0) skew(5deg);
  }
}

.terminal-text {
  font-family: 'Courier New', monospace;
  color: var(--neon-green);
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid var(--neon-green);
}
</style>

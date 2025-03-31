<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Cabeçalho -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-4 py-5 sm:p-6">
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="mt-1 text-sm text-gray-500">Bem-vindo ao seu painel de controle Destack Terapias</p>
        </div>
      </div>
      
      <!-- Informações de autenticação -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Informações de autenticação</h2>
          
          <div class="space-y-4">
            <!-- Email do usuário -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p class="text-base text-gray-900">{{ userEmail }}</p>
            </div>
            
            <!-- Token de acesso -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-500 mb-1">Token de acesso</h3>
              <div class="relative">
                <p class="text-xs font-mono text-gray-900 bg-gray-50 p-3 rounded-lg pr-24 overflow-x-auto whitespace-nowrap">
                  {{ maskedToken }}
                </p>
                <button 
                  @click="copyToClipboard(accessToken)" 
                  class="absolute right-3 top-2 text-destack-pink hover:text-destack-pink/80 text-sm font-medium"
                >
                  {{ copied ? 'Copiado!' : 'Copiar' }}
                </button>
              </div>
            </div>
            
            <!-- Expiração do token -->
            <div class="border border-gray-200 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-500 mb-1">Expira em</h3>
              <p class="text-base text-gray-900">{{ expiresIn }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Status da sessão -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Status da sessão</h2>
          
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <p class="text-sm text-gray-700">Autenticado</p>
          </div>
          
          <div class="mt-4">
            <p class="text-sm text-gray-500">
              Sua sessão será encerrada automaticamente após 30 minutos de inatividade.
              Última atividade: {{ lastActivity }}
            </p>
          </div>
          
          <div class="mt-6">
            <button 
              @click="logout" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-destack-pink hover:bg-destack-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destack-pink"
            >
              Encerrar sessão
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/auth'

const router = useRouter()
const copied = ref(false)

// Verificar se o usuário está autenticado
onMounted(() => {
  if (!authService.isAuthenticated.value) {
    router.push('/login')
  }
})

// Obter informações do usuário
const userEmail = computed(() => authService.currentUser.value?.email || 'Não disponível')
const accessToken = computed(() => authService.accessToken.value || 'Não disponível')

// Criar versão mascarada do token para exibição
const maskedToken = computed(() => {
  const token = accessToken.value
  if (token === 'Não disponível') return token
  
  // Mostrar apenas os primeiros e últimos 10 caracteres
  if (token.length > 20) {
    return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`
  }
  return token
})

// Calcular quando o token expira
const expiresAt = computed(() => {
  const timestamp = localStorage.getItem('destack_last_activity')
  if (!timestamp) return 'Desconhecido'
  
  const lastActivityTime = parseInt(timestamp, 10)
  const expirationTime = lastActivityTime + 30 * 60 * 1000 // 30 minutos em milissegundos
  
  return new Date(expirationTime).toLocaleString()
})

// Formatar a última atividade
const lastActivity = computed(() => {
  const timestamp = localStorage.getItem('destack_last_activity')
  if (!timestamp) return 'Desconhecido'
  
  return new Date(parseInt(timestamp, 10)).toLocaleString()
})

// Calcular tempo restante
const expiresIn = computed(() => {
  const timestamp = localStorage.getItem('destack_last_activity')
  if (!timestamp) return 'Desconhecido'
  
  const lastActivityTime = parseInt(timestamp, 10)
  const expirationTime = lastActivityTime + 30 * 60 * 1000 // 30 minutos em milissegundos
  const now = Date.now()
  
  if (expirationTime <= now) {
    return 'Expirado'
  }
  
  const remainingMs = expirationTime - now
  const minutes = Math.floor(remainingMs / 60000)
  const seconds = Math.floor((remainingMs % 60000) / 1000)
  
  return `${minutes} minutos e ${seconds} segundos`
})

// Função para copiar o token para a área de transferência
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

// Função para fazer logout
function logout() {
  authService.logout()
  router.push('/')
}
</script>

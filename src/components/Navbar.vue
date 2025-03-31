<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/auth'

const router = useRouter()
const menuItems = ['Teste de menu', 'Teste de menu', 'Teste de menu', 'Teste de menu']
const mobileMenuOpen = ref(false)

// Gerenciamento de tema (dark/light mode)
const isDarkMode = ref(false)

// Verificar tema salvo no localStorage ao iniciar
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDarkMode.value = savedTheme === 'dark'
  applyTheme(isDarkMode.value)
})

// Aplicar tema quando o estado mudar
watch(isDarkMode, (newValue) => {
  applyTheme(newValue)
  localStorage.setItem('theme', newValue ? 'dark' : 'light')
})

// Função para alternar entre os temas
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
}

// Função para aplicar o tema
const applyTheme = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Verificar se o usuário está autenticado
const isAuthenticated = computed(() => authService.isAuthenticated.value)
const currentUser = computed(() => authService.currentUser.value)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const navigateToLogin = () => {
  router.push('/login')
}

const navigateToHome = () => {
  router.push('/')
}

const handleLogout = () => {
  authService.logout()
  router.push('/')
}
</script>

<template>
  <nav class="relative z-10 border-b border-gray-100 bg-white/95 dark:bg-gray-900 dark:border-gray-800 backdrop-blur-sm transition-colors">
    <div class="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
      <div class="flex items-center">
        <img @click="navigateToHome" src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/alanaland-9pr07u/assets/872bk0nz6ef1/logo.png" alt="Destack Terapias" class="h-8 sm:h-10 cursor-pointer" />
      </div>
      
      <!-- Seletor de tema (Dark/Light Mode) -->
      <div class="ml-4 flex items-center">
        <button @click="toggleTheme" class="p-2 rounded-full focus:outline-none transition-colors" :class="isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'">
          <!-- Ícone do sol (light mode) -->
          <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
          </svg>
          <!-- Ícone da lua (dark mode) -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </button>
      </div>
      
      <!-- Menu desktop -->
      <div class="hidden md:flex items-center space-x-6 lg:space-x-8">
        <a v-for="(item, index) in menuItems" 
           :key="index" 
           href="#" 
           class="text-gray-700 dark:text-gray-300 hover:text-destack-pink transition-colors text-sm">
          {{ item }}
        </a>
      </div>
      
      <!-- Botões de ação -->
      <div class="hidden sm:flex items-center space-x-3 md:space-x-4">
        <!-- Usuário não autenticado -->
        <template v-if="!isAuthenticated">
          <button @click="navigateToLogin" class="border border-destack-pink text-gray-700 dark:text-gray-300 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm whitespace-nowrap">
            Entrar
          </button>
          <button class="bg-destack-pink text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm whitespace-nowrap">
            Cadastrar
          </button>
        </template>
        
        <!-- Usuário autenticado -->
        <template v-else>
          <div class="flex items-center space-x-3">
            <span class="text-gray-700 dark:text-gray-300 text-sm">Olá, {{ currentUser?.email }}</span>
            <button @click="handleLogout" class="border border-destack-pink text-gray-700 dark:text-gray-300 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm whitespace-nowrap">
              Sair
            </button>
          </div>
        </template>
      </div>
      
      <!-- Botão mobile menu -->
      <button @click="toggleMobileMenu" class="sm:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Menu mobile -->
    <div v-if="mobileMenuOpen" class="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-3 px-4 shadow-lg">
      <div class="flex flex-col space-y-3">
        <a v-for="(item, index) in menuItems" 
           :key="index" 
           href="#" 
           class="text-gray-700 dark:text-gray-300 hover:text-destack-pink transition-colors text-sm py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
          {{ item }}
        </a>
      </div>
      <div class="flex items-center space-x-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
        <!-- Usuário não autenticado (mobile) -->
        <template v-if="!isAuthenticated">
          <button @click="navigateToLogin" class="flex-1 border border-destack-pink text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
            Entrar
          </button>
          <button class="flex-1 bg-destack-pink text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm">
            Cadastrar
          </button>
        </template>
        
        <!-- Usuário autenticado (mobile) -->
        <template v-else>
          <div class="w-full">
            <div class="text-gray-700 dark:text-gray-300 text-sm mb-2">Olá, {{ currentUser?.email }}</div>
            <button @click="handleLogout" class="w-full border border-destack-pink text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
              Sair
            </button>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>
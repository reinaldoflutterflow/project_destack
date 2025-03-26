<script setup lang="ts">
import { ref } from 'vue'

const menuItems = ['Teste de menu', 'Teste de menu', 'Teste de menu', 'Teste de menu']
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <nav class="relative z-10 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
    <div class="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
      <div class="flex items-center">
        <img src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/alanaland-9pr07u/assets/872bk0nz6ef1/logo.png" alt="Destack Terapias" class="h-8 sm:h-10" />
      </div>
      
      <!-- Menu desktop -->
      <div class="hidden md:flex items-center space-x-6 lg:space-x-8">
        <a v-for="(item, index) in menuItems" 
           :key="index" 
           href="#" 
           class="text-gray-700 hover:text-destack-pink transition-colors text-sm">
          {{ item }}
        </a>
      </div>
      
      <!-- Botões de ação -->
      <div class="hidden sm:flex items-center space-x-3 md:space-x-4">
        <button class="border border-destack-pink text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm whitespace-nowrap">
          Entrar
        </button>
        <button class="bg-destack-pink text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm whitespace-nowrap">
          Cadastrar
        </button>
      </div>
      
      <!-- Botão mobile menu -->
      <button @click="toggleMobileMenu" class="sm:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Menu mobile -->
    <div v-if="mobileMenuOpen" class="sm:hidden bg-white border-t border-gray-100 py-3 px-4 shadow-lg">
      <div class="flex flex-col space-y-3">
        <a v-for="(item, index) in menuItems" 
           :key="index" 
           href="#" 
           class="text-gray-700 hover:text-destack-pink transition-colors text-sm py-2 border-b border-gray-100 last:border-b-0">
          {{ item }}
        </a>
      </div>
      <div class="flex items-center space-x-3 mt-4 pt-3 border-t border-gray-100">
        <button class="flex-1 border border-destack-pink text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          Entrar
        </button>
        <button class="flex-1 bg-destack-pink text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm">
          Cadastrar
        </button>
      </div>
    </div>
  </nav>
</template>
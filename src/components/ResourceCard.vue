<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

interface Profissional {
  profissional_id: number
  profissional_nome: string
  foto: string | null
  avaliacao: number
  categorias: string
  cidade_id: number
  cidade: string
  uf: string
  bairro_id: number
  bairro: string
  servico_id: number
  servico: string
  valor: number
  destaque?: boolean
  disponivel?: boolean
}

const props = defineProps({
  profissional: {
    type: Object as () => Profissional,
    required: true
  }
})

const formattedValue = computed(() => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(props.profissional.valor)
})
</script>

<template>
  <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full" :class="{'ring-1 ring-destack-pink': profissional.destaque}">
    <!-- Imagem do profissional -->
    <div class="relative h-44 sm:h-48 bg-gray-100 flex items-center justify-center">
      <!-- Badge de destaque (elegante) -->
      <div v-if="profissional.destaque" class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm shadow-sm rounded-lg px-2 py-1 flex items-center z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-destack-pink mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="text-destack-pink text-xs font-medium">Destaque</span>
      </div>
      
      <img 
        v-if="profissional.foto" 
        :src="profissional.foto" 
        :alt="profissional.profissional_nome"
        class="w-full h-full object-cover"
      />
      <div v-else class="flex items-center justify-center h-full w-full bg-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      
      <!-- Avaliação (elegante) -->
      <div class="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm shadow-sm rounded-lg px-2 py-1 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="text-gray-800 text-xs font-medium">{{ profissional.avaliacao.toFixed(1) }}</span>
      </div>
    </div>
    
    <!-- Informações do profissional (elegantes) -->
    <div class="p-4 flex flex-col flex-grow">
      <div class="flex-grow">
        <h3 class="font-semibold text-gray-800 truncate text-sm sm:text-base">{{ profissional.profissional_nome }}</h3>
        <div class="flex items-center text-xs text-gray-500 mt-1 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ profissional.cidade }} - {{ profissional.uf }}</span>
        </div>
        <p class="text-xs text-gray-600 mb-3 truncate">{{ profissional.servico }}</p>
      </div>
      
      <!-- Preço e botão -->
      <div class="flex items-center justify-between mt-2">
        <span class="text-destack-pink font-semibold text-base">{{ formattedValue }}</span>
        <router-link 
          :to="`/profissional/${profissional.profissional_id}`" 
          class="bg-white text-destack-pink border border-destack-pink rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-destack-pink hover:text-white transition-colors duration-300 inline-flex items-center justify-center"
        >
          Ver perfil
        </router-link>
      </div>
      
      <!-- Indicador de disponibilidade -->
      <div v-if="profissional.disponivel" class="mt-2 flex items-center">
        <span class="h-2 w-2 bg-green-500 rounded-full inline-block mr-1"></span>
        <span class="text-xs text-green-600">Disponível agora</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Componente que exibe depoimentos de clientes
import { ref } from 'vue'

// Dados estáticos para os depoimentos
const reviews = ref([
  {
    id: 1,
    rating: 4,
    text: "O progresso do tratamento é fantástico. É motivador ver como melhorei ao longo do tempo. O aplicativo tem uma ótima mistura de recursos comuns e desafiadores.",
    author: "Lisa Rodriguez",
    role: "Cliente Residencial",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    id: 2,
    rating: 5,
    text: "O progresso do tratamento é fantástico. É motivador ver como melhorei ao longo do tempo. O aplicativo tem uma ótima mistura de recursos comuns e desafiadores.",
    author: "David Lee",
    role: "Cliente Empresarial",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    rating: 4,
    text: "O progresso do tratamento é fantástico. É motivador ver como melhorei ao longo do tempo. O aplicativo tem uma ótima mistura de recursos comuns e desafiadores.",
    author: "Maria Sanchez",
    role: "Profissional de Escritório",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  }
])
</script>

<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Cabeçalho da seção -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-800 mb-4">
          <span class="mr-1">Melhor Serviço</span>
          <div class="flex items-center">
            <span class="text-destack-pink">4.5</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-destack-pink mx-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="text-gray-600">(1.234+ avaliações)</span>
          </div>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">
          Depoimentos dos nossos <span class="text-destack-pink">clientes</span>
        </h2>
      </div>

      <!-- Grid de depoimentos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div v-for="review in reviews" :key="review.id" class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 relative group">
          <!-- Aspas decorativas -->
          <div class="absolute top-4 right-4 text-gray-100 text-5xl font-serif group-hover:text-gray-200 transition-colors duration-300">"</div>
          
          <!-- Estrelas de avaliação -->
          <div class="flex mb-4">
            <div v-for="star in 5" :key="star" class="mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="star <= review.rating ? 'text-destack-pink' : 'text-gray-300'" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          
          <!-- Texto do depoimento -->
          <p class="text-gray-700 mb-6 relative z-10">
            "{{ review.text }}"
          </p>
          
          <!-- Informações do autor -->
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-full overflow-hidden mr-3">
              <img :src="review.avatar" :alt="review.author" class="w-full h-full object-cover">
            </div>
            <div>
              <h4 class="font-medium text-gray-900">{{ review.author }}</h4>
              <p class="text-sm text-gray-600">{{ review.role }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Botão "Ver mais avaliações" -->
      <div class="text-center">
        <a href="#" class="inline-flex items-center px-5 py-3 bg-destack-pink text-white font-medium rounded-lg hover:bg-destack-pink/90 transition-colors">
          Mais Avaliações
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Componente que exibe uma seção destacando os profissionais do Destack Terapias
import { ref } from 'vue'

// Usar dados estáticos para evitar problemas com recursos externos
const profissionais = ref([
  { id: 1, percentual: 61, tipo: 'Male' },
  { id: 2, percentual: 37, tipo: 'Female' },
  { id: 3, percentual: 2, tipo: 'Other' }
])
</script>

<template>
  <section class="bg-destack-pink relative overflow-hidden">
    <div class="flex flex-col lg:flex-row">
        <!-- Lado esquerdo - Imagem -->
        <div class="w-full lg:w-1/2 h-auto lg:h-[600px] relative">
          <!-- Imagem principal -->
          <img 
            src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
            alt="Massagem Terapêutica Destack Terapias" 
            class="w-full h-full object-cover"
          />
          <!-- Card flutuante -->
          <div class="absolute bottom-6 left-6 bg-white rounded-lg p-4 shadow-md">
              <div class="text-gray-800 font-medium">Balanced</div>
              <div class="flex items-center mt-1">
                <div class="flex">
                  <!-- Avatares em círculos -->
                  <div class="h-8 w-8 rounded-full bg-gray-300 border-2 border-white -mr-2 overflow-hidden">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Avatar" class="w-full h-full object-cover" />
                  </div>
                  <div class="h-8 w-8 rounded-full bg-gray-300 border-2 border-white -mr-2 overflow-hidden">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Avatar" class="w-full h-full object-cover" />
                  </div>
                  <div class="h-8 w-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                    <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="Avatar" class="w-full h-full object-cover" />
                  </div>
                </div>
                <div class="ml-2 text-xs text-gray-600">
                  <span class="font-medium">{{ profissionais[0].percentual }}% {{ profissionais[0].tipo }}</span>, 
                  {{ profissionais[1].percentual }}% {{ profissionais[1].tipo }}, 
                  {{ profissionais[2].percentual }}% {{ profissionais[2].tipo }} peoples
                </div>
              </div>
            </div>
          </div>
        
        <!-- Lado direito - Texto -->
        <div class="w-full lg:w-1/2 px-4 py-16 lg:py-24 lg:px-16 mx-auto max-w-2xl lg:max-w-none">
          <div class="inline-block px-3 py-1 bg-white rounded-full text-sm font-medium text-black mb-6">
            Our People ™
          </div>
          
          <h2 class="text-4xl sm:text-5xl font-bold text-white mb-6">
            At Destack Terapias,<br />
            we hire for <span class="text-white">skills</span>
          </h2>
          
          <p class="text-white mb-8 text-lg">
            And shared values and that's pretty much it. We know that being brilliant in your role has nothing to do with who you love or what you believe.
          </p>
          
          <a href="/profissional/1" class="inline-flex items-center px-6 py-3 bg-white text-destack-pink font-medium rounded-lg hover:bg-white/90 transition-colors">
            View our people
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
  </section>
</template>

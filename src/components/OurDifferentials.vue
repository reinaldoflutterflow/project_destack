<script setup lang="ts">
// Ícones e imagens podem ser substituídos por ícones reais do projeto
const diferenciais = [
  {
    id: 1,
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Profissionais Certificados',
    description: 'Todos os profissionais são verificados e possuem certificações na área de atuação.'
  },
  {
    id: 2,
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Atendimento Rápido',
    description: 'Encontre e agende sessões com profissionais disponíveis na sua região em minutos.'
  },
  {
    id: 3,
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    title: 'Comunidade Ativa',
    description: 'Faça parte de uma comunidade que valoriza o bem-estar e compartilha experiências.'
  },
  {
    id: 4,
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    title: 'Gestão Simplificada',
    description: 'Gerencie seus agendamentos, pagamentos e avaliações em uma única plataforma.'
  },
  {
    id: 5,
    icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    title: 'Design Personalizado',
    description: 'Interface intuitiva e moderna para melhorar sua experiência na plataforma.'
  },
  {
    id: 6,
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    title: 'Busca Otimizada',
    description: 'Encontre o profissional ideal com nosso sistema de busca e filtros avançados.'
  }
]
</script>

<template>
  <section class="py-12 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Cabeçalho da seção -->
      <div class="text-center mb-8">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">
          Nossos <span class="text-destack-pink">Diferenciais</span>
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Conheça os recursos exclusivos que fazem da Destack Terapias a melhor plataforma para conectar você aos profissionais de bem-estar e saúde.
        </p>
      </div>
      
      <!-- Grid de cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        <!-- Card para cada diferencial -->
        <div 
          v-for="diferencial in diferenciais" 
          :key="diferencial.id" 
          class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-destack-pink/20 group"
        >
          <div class="flex flex-col h-full">
            <!-- Ícone -->
            <div class="mb-3">
              <div class="w-10 h-10 rounded-md bg-destack-pink/10 flex items-center justify-center group-hover:bg-destack-pink/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-destack-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="diferencial.icon" />
                </svg>
              </div>
            </div>
            
            <!-- Título -->
            <h3 class="text-base font-semibold mb-1.5 text-gray-800 group-hover:text-destack-pink transition-all duration-300">
              {{ diferencial.title }}
            </h3>
            
            <!-- Descrição -->
            <p class="text-gray-600 text-xs flex-grow">
              {{ diferencial.description }}
            </p>
            
            <!-- Link "Saiba mais" -->
            <div class="mt-3 pt-1">
              <a href="#" class="inline-flex items-center text-xs font-medium text-destack-pink hover:text-pink-700 transition-colors">
                Saiba mais
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import SearchForm from './SearchForm.vue'
import ResourceCard from './ResourceCard.vue'
import { supabase } from '../lib/supabase'

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
  descricao?: string
  telefone?: string
  whatsapp?: string
  email?: string
  facebook?: string
  instagram?: string
}

const selectedTab = ref('Massoterapeutas')
const profissionais = ref<Profissional[]>([])
const loading = ref(true)
const error = ref('')

const buscarProfissionais = async (filtro?: { cidade: string; bairro: string; categoria: string }) => {
  try {
    loading.value = true
    error.value = ''

    let query = supabase
      .from('vw_busca_profissionais')
      .select('*')
      .limit(20)
      
    // Aplicar filtro de categoria baseado na tab selecionada
    if (selectedTab.value === 'Massoterapeutas') {
      query = query.ilike('categorias', '%Massoterapeuta%')
    } else if (selectedTab.value === 'Massagistas') {
      query = query.ilike('categorias', '%Massagista%')
    }
      
    const { data, error: supabaseError } = await query.order('profissional_nome')

    if (supabaseError) {
      console.error('Erro ao buscar profissionais:', supabaseError)
      error.value = 'Erro ao buscar profissionais'
      return
    }

    if (!data || data.length === 0) {
      error.value = 'Nenhum profissional encontrado'
      return
    }

    profissionais.value = data
  } catch (err) {
    console.error('Erro:', err)
    error.value = 'Erro ao carregar profissionais'
  } finally {
    loading.value = false
  }
}

const selectTab = (tab: string) => {
  selectedTab.value = tab
  buscarProfissionais()
}

onMounted(() => {
  buscarProfissionais()
})

const tabs = [
  { id: 'Massoterapeutas', label: 'Massoterapeutas' },
  { id: 'Massagistas', label: 'Massagistas' }
]

const handleBuscarProfissionais = (filtro: { cidade: string; bairro: string; categoria: string }) => {
  buscarProfissionais(filtro)
}

const limparErro = () => {
  error.value = ''
  buscarProfissionais()
}
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl">
    <!-- Título principal -->
    <div class="text-center mb-8 sm:mb-10 lg:mb-12 relative">
      <!-- Elementos decorativos -->
      <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 w-full max-w-3xl mx-auto hidden md:block">
        <div class="flex justify-center">
          <div class="h-12 w-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-md -mr-1.5 z-30">
            <img src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150" alt="" class="w-full h-full object-cover">
          </div>
          <div class="h-12 w-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-md z-20">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" alt="" class="w-full h-full object-cover">
          </div>
          <div class="h-12 w-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-md -ml-1.5 z-10">
            <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150" alt="" class="w-full h-full object-cover">
          </div>
        </div>
      </div>
      
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 px-4 leading-tight max-w-4xl mx-auto">
        <span class="text-destack-pink">Destack</span> <span class="relative inline-block">Terapias <span class="absolute -top-1 -right-2 text-blue-500 text-lg">✨</span></span> para
        <br class="hidden sm:block">
        <span class="bg-gradient-to-r from-destack-pink to-purple-500 bg-clip-text text-transparent">Bem-estar</span> & <span class="relative inline-block">Saúde <span class="absolute -top-1 -right-2 text-destack-pink text-lg">♥</span></span>
      </h1>
      
      <p class="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-6">Conecte-se com especialistas certificados para cuidar da sua saúde e bem-estar na sua região</p>
      
      <!-- Barra de avaliação -->
      <div class="bg-white text-destack-pink border border-destack-pink rounded-full py-1.5 px-5 inline-flex items-center justify-center max-w-xs w-full mx-auto shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="text-sm font-medium">Melhor Serviço 5.0 (24k+ Avaliações)</span>
      </div>
    </div>
    
    <!-- Formulário de busca -->
    <div class="mb-8 sm:mb-10 max-w-4xl mx-auto">
      <SearchForm @buscar-profissionais="handleBuscarProfissionais" />
    </div>

    <!-- Tabs de filtro centralizadas -->
    <div class="flex justify-center mb-6 sm:mb-8">
      <div class="bg-[#F7F7F7] rounded-lg p-1.5 flex items-center justify-center space-x-2 sm:space-x-3 max-w-[340px] w-full h-[56px]">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'px-2 sm:px-3 md:px-4 py-1 rounded-lg border font-medium text-xs sm:text-sm transition-all duration-200 max-w-[150px] w-[48%] h-[44px] flex items-center justify-center overflow-hidden',
            selectedTab === tab.id
              ? 'border-destack-pink border text-destack-pink bg-white'
              : 'border-transparent text-gray-500 hover:text-destack-pink hover:border-destack-pink',
          ]"
          @click="selectTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    
    <!-- Mensagem de erro -->
    <div v-if="error" class="mb-6 sm:mb-8 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 relative max-w-md mx-auto text-center">
      <div class="flex flex-col items-center justify-center">
        <div class="text-red-500 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="w-full">
          <h3 class="text-base sm:text-lg font-bold text-red-800 mb-2">Informação importante</h3>
          <div class="text-sm text-red-700 mb-4">
            Nenhum profissional foi encontrada durante a busca.
          </div>
          <div class="flex justify-center">
            <button 
              @click="limparErro" 
              class="bg-destack-pink text-white rounded-md text-sm font-medium w-full max-w-[155px] h-[44px] flex items-center justify-center hover:bg-pink-700 transition-colors">
              Tentar Novamente
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Contêiner com altura fixa para evitar o efeito sanfona -->
    <div class="min-h-[180px] relative pb-8">
      <!-- Estado de carregamento -->
      <div v-if="loading" class="text-center py-6 sm:py-8 absolute inset-0 flex flex-col items-center justify-center bg-white">
        <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-destack-pink mx-auto"></div>
        <p class="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">Carregando profissionais...</p>
      </div>

      <!-- Grid de cards de profissionais com efeito de transição -->
      <transition-group 
        name="accordion" 
        tag="div" 
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full"
        v-if="!error && profissionais.length > 0"
      >
        <ResourceCard
          v-for="profissional in profissionais"
          :key="profissional.profissional_id"
          :profissional="profissional"
        />
      </transition-group>
      
      <!-- Mensagem de nenhum resultado -->
      <transition name="fade">
        <div v-if="!error && !loading && profissionais.length === 0" class="text-center py-6 sm:py-8 absolute inset-0 flex items-center justify-center bg-white">
          <p class="text-gray-600 text-sm sm:text-base">Nenhum profissional encontrado para esta categoria.</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* Efeito sanfona para os cards */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.5s ease;
}
.accordion-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.accordion-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Efeito de fade para mensagens */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
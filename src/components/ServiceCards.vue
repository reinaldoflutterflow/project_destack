<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { supabase } from '../lib/supabase'

interface Profissional {
  profissional_id: number
  profissional_nome: string
  foto: string
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
}

const props = defineProps<{
  categoriaTab: string
}>()

const profissionais = ref<Profissional[]>([])
const loading = ref(false)
const error = ref('')

const buscarProfissionais = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Determinar o filtro de categoria baseado na tab selecionada
    let filtroCategoria = ''
    
    if (props.categoriaTab === 'Massoterapeuta') {
      filtroCategoria = 'Massoterapeutas'
    } else if (props.categoriaTab === 'Massagistas') {
      filtroCategoria = 'Massagista'
    }
    
    console.log(`Buscando profissionais com filtro: ${filtroCategoria}`)
    
    // Buscar os profissionais na view com o filtro apropriado
    const { data, error: supabaseError } = await supabase
      .from('vw_busca_profissionais')
      .select('*')
      .ilike('categorias', `%${filtroCategoria}%`)
      .limit(10)
    
    if (supabaseError) {
      console.error('Erro do Supabase:', supabaseError)
      throw supabaseError
    }
    
    console.log('Profissionais encontrados:', data)
    
    // Se não houver dados, usar dados de exemplo para demonstração
    if (!data || data.length === 0) {
      // Dados de exemplo para demonstração
      const dadosExemplo = [
        {
          profissional_id: 1,
          profissional_nome: 'Ana Silva',
          foto: '',
          avaliacao: 4.8,
          categorias: filtroCategoria,
          cidade_id: 1,
          cidade: 'São Paulo',
          uf: 'SP',
          bairro_id: 1,
          bairro: 'Pinheiros',
          servico_id: 1,
          servico: 'Massagem Relaxante',
          valor: 120.00
        },
        {
          profissional_id: 2,
          profissional_nome: 'Carlos Oliveira',
          foto: '',
          avaliacao: 4.5,
          categorias: filtroCategoria,
          cidade_id: 1,
          cidade: 'São Paulo',
          uf: 'SP',
          bairro_id: 2,
          bairro: 'Vila Madalena',
          servico_id: 2,
          servico: 'Massagem Terapêutica',
          valor: 150.00
        },
        {
          profissional_id: 3,
          profissional_nome: 'Mariana Costa',
          foto: '',
          avaliacao: 5.0,
          categorias: filtroCategoria,
          cidade_id: 2,
          cidade: 'Rio de Janeiro',
          uf: 'RJ',
          bairro_id: 3,
          bairro: 'Copacabana',
          servico_id: 3,
          servico: 'Massagem Desportiva',
          valor: 180.00
        },
        {
          profissional_id: 4,
          profissional_nome: 'Pedro Santos',
          foto: '',
          avaliacao: 4.7,
          categorias: filtroCategoria,
          cidade_id: 3,
          cidade: 'Belo Horizonte',
          uf: 'MG',
          bairro_id: 4,
          bairro: 'Savassi',
          servico_id: 4,
          servico: 'Massagem Relaxante',
          valor: 130.00
        },
        {
          profissional_id: 5,
          profissional_nome: 'Juliana Ferreira',
          foto: '',
          avaliacao: 4.9,
          categorias: filtroCategoria,
          cidade_id: 1,
          cidade: 'São Paulo',
          uf: 'SP',
          bairro_id: 5,
          bairro: 'Moema',
          servico_id: 5,
          servico: 'Massagem Terapêutica',
          valor: 160.00
        }
      ]
      
      profissionais.value = dadosExemplo
      console.log('Usando dados de exemplo para demonstração')
    } else {
      profissionais.value = data as Profissional[]
    }
  } catch (e: any) {
    console.error('Erro ao buscar profissionais:', e)
    error.value = e.message || 'Erro ao buscar profissionais'
  } finally {
    loading.value = false
  }
}

// Observar mudanças na tab selecionada
watch(() => props.categoriaTab, () => {
  buscarProfissionais()
})

// Buscar profissionais ao montar o componente
onMounted(() => {
  buscarProfissionais()
})

// Formatar valor para exibição em reais
const formatarPreco = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
    
    <!-- Estado de carregamento -->
    <div v-if="loading" class="flex justify-center items-center py-8 sm:py-12">
      <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-destack-pink"></div>
    </div>
    
    <!-- Mensagem de erro -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
      {{ error }}
    </div>
    
    <!-- Mensagem de nenhum resultado -->
    <div v-else-if="profissionais.length === 0" class="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
      Nenhum profissional encontrado para esta categoria.
    </div>
    
    <!-- Grid de cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
      <!-- Card de profissional -->
      <div 
        v-for="profissional in profissionais" 
        :key="profissional.profissional_id"
        class="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full"
      >
        <!-- Imagem do profissional -->
        <div class="h-32 sm:h-36 md:h-40 bg-gray-100 flex items-center justify-center relative">
          <img 
            v-if="profissional.foto" 
            :src="profissional.foto" 
            :alt="profissional.profissional_nome"
            class="w-full h-full object-cover"
          />
          <div v-else class="flex items-center justify-center h-full w-full bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <!-- Avaliação -->
          <div class="absolute bottom-2 right-2 bg-white rounded-lg px-2 py-1 flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-destack-pink mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="text-xs font-medium">{{ profissional.avaliacao.toFixed(1) }}</span>
          </div>
        </div>
        
        <!-- Informações do profissional -->
        <div class="p-3 sm:p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 class="font-medium text-gray-800 truncate text-sm sm:text-base">{{ profissional.profissional_nome }}</h3>
            <p class="text-xs text-gray-500 mb-1">{{ profissional.cidade }} - {{ profissional.uf }}</p>
            <p class="text-xs text-gray-600 mb-2 truncate">{{ profissional.categorias }}</p>
          </div>
          
          <!-- Preço -->
          <div class="flex justify-between items-center mt-2">
            <span class="text-destack-pink font-medium text-sm">{{ formatarPreco(profissional.valor) }}</span>
            <button class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors">
              Ver perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

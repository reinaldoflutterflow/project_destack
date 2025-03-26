<script setup lang="ts">
import { ref, onMounted, watch, defineEmits } from 'vue'
import { supabase } from '../lib/supabase'
import CustomDropdown from './CustomDropdown.vue'

interface Cidade {
  id: number
  nome: string
  uf: string
}

interface Bairro {
  id: number
  nome: string
  cidade_id: number
}

interface Categoria {
  id: number
  nome: string
}

const cidades = ref<Cidade[]>([])
const bairros = ref<Bairro[]>([])
const categorias = ref<Categoria[]>([])

const selectedCidade = ref('')
const selectedBairro = ref('')
const selectedCategoria = ref('')

const emit = defineEmits(['buscar-profissionais'])

// Fetch cidades
const fetchCidades = async () => {
  const { data, error } = await supabase
    .from('cidades')
    .select('id, nome, uf')
    .order('nome')
  
  if (error) {
    console.error('Erro ao buscar cidades:', error)
    return
  }
  
  cidades.value = data
}

// Fetch bairros based on selected cidade
const fetchBairros = async () => {
  if (!selectedCidade.value) {
    bairros.value = []
    return
  }

  const { data, error } = await supabase
    .from('bairros')
    .select('id, nome, cidade_id')
    .eq('cidade_id', selectedCidade.value)
    .order('nome')
  
  if (error) {
    console.error('Erro ao buscar bairros:', error)
    return
  }
  
  bairros.value = data
}

// Fetch categorias
const fetchCategorias = async () => {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nome')
    .order('nome')
  
  if (error) {
    console.error('Erro ao buscar categorias:', error)
    return
  }
  
  categorias.value = data
}

// Watch for cidade changes
watch(selectedCidade, () => {
  selectedBairro.value = ''
  fetchBairros()
})

// Initial data fetch
onMounted(() => {
  fetchCidades()
  fetchCategorias()
})

const handleSearch = () => {
  emit('buscar-profissionais', {
    cidade: selectedCidade.value,
    bairro: selectedBairro.value,
    categoria: selectedCategoria.value
  })
}
</script>

<template>
  <div class="w-full bg-[#F7F7F7] rounded-lg p-4 sm:p-5">
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
      <div class="relative w-full sm:w-1/4 lg:w-1/4">
        <div class="h-full">
          <CustomDropdown
            v-model="selectedCidade"
            :options="cidades"
            placeholder="Selecionar Cidade"
            valueKey="id"
            labelKey="nome"
            secondaryLabelKey="uf"
            :icon="'M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'"
          />
        </div>
      </div>

      <div class="relative w-full sm:w-1/4 lg:w-1/4">
        <div class="h-full">
          <CustomDropdown
            v-model="selectedBairro"
            :options="bairros"
            placeholder="Selecione um bairro"
            :disabled="!selectedCidade"
            valueKey="id"
            labelKey="nome"
            :icon="'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z'"
          />
        </div>
      </div>

      <div class="relative w-full sm:w-1/4 lg:w-1/4">
        <div class="h-full">
          <CustomDropdown
            v-model="selectedCategoria"
            :options="categorias"
            placeholder="Selecione um serviço"
            valueKey="id"
            labelKey="nome"
            :icon="'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'"
          />
        </div>
      </div>

      <button 
        @click="handleSearch"
        class="w-full sm:w-[166px] h-[44px] bg-destack-pink text-white px-4 sm:px-6 rounded-lg hover:bg-pink-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-destack-pink focus:ring-opacity-50 flex items-center justify-center whitespace-nowrap"
      >
        Pesquisar
      </button>
    </div>
  </div>
</template>
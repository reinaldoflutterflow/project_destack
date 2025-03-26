<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Selecionar'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  valueKey: {
    type: String,
    default: 'id'
  },
  labelKey: {
    type: String,
    default: 'nome'
  },
  secondaryLabelKey: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const selectedOption = computed(() => {
  if (!props.modelValue) return null
  return props.options.find(option => option[props.valueKey] === props.modelValue)
})

const displayValue = computed(() => {
  if (!selectedOption.value) return props.placeholder
  
  if (props.secondaryLabelKey && selectedOption.value[props.secondaryLabelKey]) {
    return `${selectedOption.value[props.labelKey]} - ${selectedOption.value[props.secondaryLabelKey]}`
  }
  
  return selectedOption.value[props.labelKey]
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  emit('update:modelValue', option[props.valueKey])
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative w-full">
    <div 
      @click="toggleDropdown"
      :class="[
        'flex items-center bg-white border border-gray-200 rounded-lg pl-3 pr-4 py-2 h-full transition-colors cursor-pointer',
        isOpen ? 'border-destack-pink ring-1 ring-destack-pink' : '',
        disabled ? 'bg-gray-50 cursor-not-allowed' : 'focus-within:border-destack-pink focus-within:ring-1 focus-within:ring-destack-pink'
      ]"
    >
      <div v-if="icon" class="text-destack-pink mr-2 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" :d="icon" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="w-full text-sm truncate" :class="selectedOption ? 'text-gray-800' : 'text-gray-500'">
        {{ displayValue }}
      </div>
      <div class="flex-shrink-0 ml-1">
        <svg 
          class="w-4 h-4 transition-transform" 
          :class="isOpen ? 'text-destack-pink rotate-180' : 'text-gray-400'" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    
    <!-- Dropdown menu -->
    <div 
      v-if="isOpen" 
      class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto"
    >
      <div 
        v-for="option in options" 
        :key="option[valueKey]"
        @click="selectOption(option)"
        class="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer transition-colors"
        :class="option[valueKey] === modelValue ? 'bg-destack-pink/10 text-destack-pink font-medium' : 'text-gray-700'"
      >
        <span v-if="secondaryLabelKey && option[secondaryLabelKey]">
          {{ option[labelKey] }} - {{ option[secondaryLabelKey] }}
        </span>
        <span v-else>
          {{ option[labelKey] }}
        </span>
      </div>
      
      <div v-if="options.length === 0" class="px-3 py-2 text-sm text-gray-500 italic">
        Nenhuma opção disponível
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-h-60 {
  max-height: 15rem;
}
</style>

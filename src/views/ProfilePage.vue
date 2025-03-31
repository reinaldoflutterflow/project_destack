<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../lib/supabase';

const route = useRoute();
const profissionalId = route.params.id;
const loading = ref(true);
const error = ref(null);

// Dados do profissional
const profissional = ref({
  id: 0,
  nome: '',
  foto: '',
  avaliacao: 0,
  biografia: '',
  cidade: '',
  bairro: '',
  uf: '',
  especialidade: '',
  whatsapp: '',
});

// Certificados do profissional
const certificados = ref([]);

// Serviços oferecidos
const servicos = ref([
  { id: 1, nome: 'Massagem Relaxante', valor: 120, duracao: '60 min', descricao: 'Massagem com óleos essenciais para relaxamento completo.' },
  { id: 2, nome: 'Massagem Terapêutica', valor: 150, duracao: '60 min', descricao: 'Técnica focada em aliviar dores musculares e tensões.' },
  { id: 3, nome: 'Drenagem Linfática', valor: 180, duracao: '90 min', descricao: 'Técnica que estimula o sistema linfático e reduz inchaços.' },
]);

// Horários disponíveis
const horarios = ref([
  { id: 1, dia: 'Segunda-feira', horarios: ['09:00', '11:00', '14:00', '16:00'] },
  { id: 2, dia: 'Terça-feira', horarios: ['09:00', '11:00', '14:00', '16:00'] },
  { id: 3, dia: 'Quarta-feira', horarios: ['09:00', '11:00', '14:00', '16:00'] },
  { id: 4, dia: 'Quinta-feira', horarios: ['09:00', '11:00', '14:00', '16:00'] },
  { id: 5, dia: 'Sexta-feira', horarios: ['09:00', '11:00', '14:00', '16:00'] },
]);

// Galeria de imagens - usando cores em vez de URLs externas para evitar problemas
const galeria = ref([
  { id: 1, cor: 'bg-blue-200', descricao: 'Espaço de atendimento' },
  { id: 2, cor: 'bg-green-200', descricao: 'Sessão de massagem' },
  { id: 3, cor: 'bg-purple-200', descricao: 'Produtos utilizados' },
  { id: 4, cor: 'bg-yellow-200', descricao: 'Ambiente relaxante' },
]);

// Controle da imagem principal da galeria
const imagemPrincipal = ref(0); // Índice da imagem principal

// Função para trocar a imagem principal
const trocarImagemPrincipal = (index) => {
  imagemPrincipal.value = index;
};

// Abas
const activeTab = ref('sobre');

// Formatar valor para moeda brasileira
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Abrir WhatsApp
const openWhatsApp = () => {
  const message = `Olá, ${profissional.value.nome}! Vi seu perfil no Destack Terapias e gostaria de agendar um horário.`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = profissional.value.whatsapp.replace(/\D/g, '');
  window.open(`https://wa.me/55${whatsappNumber}?text=${encodedMessage}`, '_blank');
};

// Buscar dados do profissional
const fetchProfissional = async () => {
  loading.value = true;
  try {
    console.log('Buscando profissional com ID:', profissionalId);
    
    // Buscar dados do profissional no Supabase
    const { data: profissionalData, error: profissionalError } = await supabase
      .from('profissionais')
      .select('*')
      .eq('id', profissionalId)
      .single();
    
    if (profissionalError) throw profissionalError;
    
    if (profissionalData) {
      profissional.value = {
        id: profissionalData.id,
        nome: profissionalData.nome,
        foto: profissionalData.foto,
        avaliacao: profissionalData.avaliacao || 0,
        biografia: profissionalData.descricao || 'Sem biografia disponível',
        cidade: 'São Paulo', // Dados fictícios para campos que não existem na tabela
        bairro: 'Pinheiros',
        uf: 'SP',
        especialidade: 'Massoterapia e Terapias Holísticas',
        whatsapp: profissionalData.contato || '11987654321',
      };
      
      // Buscar certificados do profissional
      await fetchCertificados(profissionalData.id);
    }
    
    loading.value = false;
  } catch (err) {
    console.error('Erro ao carregar os dados do profissional:', err);
    error.value = 'Erro ao carregar os dados do profissional';
    loading.value = false;
  }
};

// Buscar certificados do profissional
const fetchCertificados = async (profissionalId) => {
  try {
    console.log('Buscando certificados para o profissional ID:', profissionalId);
    
    const { data, error: certError } = await supabase
      .from('certificados')
      .select('*')
      .eq('profissional_id', profissionalId);
    
    if (certError) throw certError;
    
    // Atualiza a lista de certificados com os dados do banco
    // Se não houver certificados, será uma lista vazia
    certificados.value = data || [];
    
    console.log('Certificados encontrados:', certificados.value.length);
  } catch (err) {
    console.error('Erro ao carregar certificados:', err);
    certificados.value = []; // Garante que será uma lista vazia em caso de erro
  }
};

onMounted(() => {
  fetchProfissional();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-destack-pink"></div>
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Conteúdo -->
    <div v-else class="flex flex-col lg:flex-row gap-8">
      <!-- Coluna da esquerda (perfil) -->
      <div class="w-full lg:w-1/3 mb-6 lg:mb-0">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden lg:sticky lg:top-8">
          <!-- Cabeçalho com botão voltar -->
          <div class="p-4 border-b border-gray-100 flex justify-between items-center">
            <button @click="$router.back()" class="text-gray-500 hover:text-gray-700 flex items-center text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar
            </button>
            <div class="text-xs text-gray-400">Profissional verificado</div>
          </div>
          
          <!-- Informações do perfil -->
          <div class="p-6 flex flex-col items-center text-center">
            <div class="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white mb-4">
              <img 
                v-if="profissional.foto" 
                :src="profissional.foto" 
                :alt="profissional.nome"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            
            <h1 class="text-xl font-bold text-gray-800">{{ profissional.nome }}</h1>
            <p class="text-destack-pink font-medium text-sm mt-1">{{ profissional.especialidade }}</p>
            
            <!-- Avaliação -->
            <div class="flex items-center justify-center mt-3 mb-1">
              <div class="flex">
                <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="i <= Math.floor(profissional.avaliacao) ? 'text-yellow-400' : 'text-gray-300'" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="ml-1 text-sm text-gray-600">{{ profissional.avaliacao }}</span>
            </div>
            
            <p class="text-gray-500 text-sm">
              {{ profissional.cidade }}, {{ profissional.uf }}
            </p>
            
            <!-- Estatísticas -->
            <div class="grid grid-cols-2 gap-4 w-full mt-6 mb-6">
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-2xl font-bold text-gray-800">120+</div>
                <div class="text-xs text-gray-500">Atendimentos</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-2xl font-bold text-gray-800">5</div>
                <div class="text-xs text-gray-500">Anos de experiência</div>
              </div>
            </div>
            
            <!-- Botão WhatsApp -->
            <button 
              @click="openWhatsApp"
              class="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chamar no WhatsApp
            </button>
          </div>
        </div>
      </div>
      
      <!-- Coluna da direita (conteúdo) -->
      <div class="w-full lg:w-2/3">
        <!-- Navegação por abas -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div class="border-b border-gray-100 overflow-x-auto">
            <nav class="flex min-w-max md:justify-start sm:justify-center justify-center w-full">
              <button 
                @click="activeTab = 'sobre'" 
                class="px-3 sm:px-4 md:px-6 py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                :class="activeTab === 'sobre' ? 'border-destack-pink text-destack-pink' : 'border-transparent text-gray-500 hover:text-gray-700'"
              >
                Sobre
              </button>
              <button 
                @click="activeTab = 'servicos'" 
                class="px-3 sm:px-4 md:px-6 py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                :class="activeTab === 'servicos' ? 'border-destack-pink text-destack-pink' : 'border-transparent text-gray-500 hover:text-gray-700'"
              >
                Serviços
              </button>
              <button 
                @click="activeTab = 'horarios'" 
                class="px-3 sm:px-4 md:px-6 py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                :class="activeTab === 'horarios' ? 'border-destack-pink text-destack-pink' : 'border-transparent text-gray-500 hover:text-gray-700'"
              >
                Horários
              </button>
              <button 
                @click="activeTab = 'galeria'" 
                class="px-3 sm:px-4 md:px-6 py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                :class="activeTab === 'galeria' ? 'border-destack-pink text-destack-pink' : 'border-transparent text-gray-500 hover:text-gray-700'"
              >
                Galeria
              </button>
            </nav>
          </div>
        </div>
        
        <!-- Conteúdo das abas -->
        <div class="p-6">
          <!-- Aba Sobre -->
          <div v-if="activeTab === 'sobre'">
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Biografia</h2>
              <p class="text-gray-600">{{ profissional.biografia }}</p>
            </div>
            
            <div>
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Certificações</h2>
              <div v-if="certificados.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  v-for="(certificado, index) in certificados" 
                  :key="certificado.id"
                  class="bg-white border border-gray-100 rounded-xl p-4 flex items-start"
                >
                  <div :class="[index % 2 === 0 ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500', 'rounded-lg p-3 mr-3']">
                    <svg v-if="index % 2 === 0" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-800">{{ certificado.nome }}</h3>
                    <p class="text-sm text-gray-500 mt-1">{{ certificado.instituicao }}</p>
                    <p class="text-xs text-gray-400 mt-1">Emitido em: {{ new Date(certificado.data_emissao).toLocaleDateString('pt-BR') }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                Nenhuma certificação encontrada para este profissional.
              </div>
            </div>
          </div>
          
          <!-- Aba Serviços -->
          <div v-else-if="activeTab === 'servicos'">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-800">Serviços Oferecidos</h2>
              <span class="text-sm text-gray-500">{{ servicos.length }} serviços disponíveis</span>
            </div>
            
            <div class="space-y-4">
              <div 
                v-for="servico in servicos" 
                :key="servico.id"
                class="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div class="flex flex-col md:flex-row md:items-center justify-between">
                  <div class="flex-1">
                    <h3 class="text-lg font-medium text-gray-800">{{ servico.nome }}</h3>
                    <p class="text-sm text-gray-600 mt-1">{{ servico.descricao }}</p>
                    
                    <div class="flex flex-wrap items-center mt-3">
                      <div class="flex items-center text-sm text-gray-500 mr-4 mb-2 sm:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ servico.duracao }}
                      </div>
                      <div class="text-sm font-medium text-destack-pink">
                        {{ formatCurrency(servico.valor) }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-4 md:mt-0 flex-shrink-0">
                    <button 
                      @click="openWhatsApp"
                      class="w-full sm:w-auto px-4 py-2 bg-destack-pink hover:bg-destack-pink/90 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Agendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Aba Horários -->
          <div v-else-if="activeTab === 'horarios'">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-800">Agenda da Semana</h2>
              <div class="flex items-center text-sm">
                <div class="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span class="text-gray-500">Disponível</span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <div 
                v-for="dia in horarios" 
                :key="dia.id"
                class="bg-white border border-gray-100 rounded-xl overflow-hidden"
              >
                <!-- Cabeçalho do dia -->
                <div class="bg-gray-50 py-2 px-3 text-center border-b border-gray-100">
                  <h3 class="font-medium text-gray-800 text-sm">{{ dia.dia && dia.dia.includes('-') ? dia.dia.split('-')[0] : dia.dia }}</h3>
                </div>
                
                <!-- Horários -->
                <div class="p-3">
                  <div 
                    v-for="(horario, index) in dia.horarios" 
                    :key="index"
                    @click="openWhatsApp"
                    class="mb-2 last:mb-0 bg-green-50 text-green-800 py-2 px-3 rounded text-center text-sm font-medium cursor-pointer hover:bg-green-100 transition-colors"
                  >
                    {{ horario }}
                  </div>
                  <div v-if="dia.horarios.length === 0" class="py-2 text-center text-xs text-gray-400">
                    Indisponível
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Informação sobre agendamento - Movido para fora do grid para melhor responsividade -->
            <div class="mt-6 bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p>Clique em um horário para agendar diretamente pelo WhatsApp. Os horários exibidos estão sujeitos à confirmação de disponibilidade.</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Aba Galeria -->
          <div v-else-if="activeTab === 'galeria'">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-800">Galeria de Fotos</h2>
              <span v-if="galeria && galeria.length > 0" class="text-sm text-gray-500">{{ galeria.length }} imagens</span>
              <span v-else class="text-sm text-gray-500">Nenhuma imagem</span>
            </div>
            
            <div class="bg-white border border-gray-100 rounded-xl p-5">
              <!-- Imagem principal -->
              <div v-if="galeria && galeria.length > 0" class="mb-4 rounded-lg overflow-hidden aspect-video">
                <div 
                  :class="[galeria[imagemPrincipal].cor, 'w-full h-full flex items-center justify-center transition-all duration-300']"
                >
                  <span class="text-gray-700 font-medium">{{ galeria[imagemPrincipal].descricao }}</span>
                </div>
              </div>
              <div v-else class="mb-4 rounded-lg overflow-hidden aspect-video bg-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <!-- Miniaturas -->
              <div v-if="galeria && galeria.length > 0" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                <div 
                  v-for="(imagem, index) in galeria" 
                  :key="imagem.id"
                  @click="trocarImagemPrincipal(index)"
                  class="group relative rounded-lg overflow-hidden aspect-square cursor-pointer"
                  :class="{ 'ring-2 ring-destack-pink': index === imagemPrincipal }"
                >
                  <div 
                    :class="[imagem.cor, 'w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300']"
                  >
                    <span class="text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{{ index + 1 }}</span>
                  </div>
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-gray-500 text-sm">
                Nenhuma imagem disponível na galeria.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

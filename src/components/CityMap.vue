<template>
  <div class="city-map-container">
    <div id="map" class="h-64 w-full rounded-lg"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const props = defineProps({
  cityName: {
    type: String,
    default: 'São Paulo'
  },
  areas: {
    type: Array,
    default: () => []
  }
});

const map = ref(null);
const markers = ref([]);
const circles = ref([]);

// Coordenadas padrão para algumas cidades brasileiras
const cityCoordinates = {
  'São Paulo': [-23.5505, -46.6333],
  'Rio de Janeiro': [-22.9068, -43.1729],
  'Belo Horizonte': [-19.9167, -43.9345],
  'Brasília': [-15.7801, -47.9292],
  'Salvador': [-12.9714, -38.5014],
  'Curitiba': [-25.4284, -49.2733],
  'Recife': [-8.0476, -34.8770],
  'Porto Alegre': [-30.0346, -51.2177],
  'Fortaleza': [-3.7319, -38.5267],
  'Manaus': [-3.1190, -60.0217],
  'Araruama': [-22.8728, -42.3428],
  'default': [-15.7801, -47.9292] // Centro do Brasil como padrão
};

// Função para obter coordenadas da cidade
const getCityCoordinates = (cityName) => {
  return cityCoordinates[cityName] || cityCoordinates['default'];
};

// Inicializar o mapa
const initMap = () => {
  // Remover mapa anterior se existir
  if (map.value) {
    map.value.remove();
  }

  // Limpar marcadores e círculos
  markers.value = [];
  circles.value = [];

  // Obter coordenadas da cidade
  const coordinates = getCityCoordinates(props.cityName);
  
  // Criar mapa
  map.value = L.map('map').setView(coordinates, 12);
  
  // Adicionar camada de tiles do OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value);
  
  // Adicionar áreas se existirem
  if (props.areas && props.areas.length > 0) {
    addAreasToMap();
  }
};

// Adicionar áreas ao mapa
const addAreasToMap = () => {
  if (!map.value) return;
  
  // Limpar marcadores e círculos anteriores
  markers.value.forEach(marker => map.value.removeLayer(marker));
  circles.value.forEach(circle => map.value.removeLayer(circle));
  
  markers.value = [];
  circles.value = [];
  
  // Coordenadas da cidade
  const cityCoord = getCityCoordinates(props.cityName);
  
  // Para cada área, criar um marcador e um círculo
  props.areas.forEach((area, index) => {
    // Criar coordenadas ligeiramente diferentes para cada área
    // Isso é uma simulação, em um caso real usaríamos coordenadas reais
    const lat = cityCoord[0] + (Math.random() * 0.02 - 0.01);
    const lng = cityCoord[1] + (Math.random() * 0.02 - 0.01);
    
    // Criar ícone personalizado
    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="marker-pin bg-destack-pink"></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });
    
    // Adicionar marcador
    const marker = L.marker([lat, lng], { icon }).addTo(map.value);
    marker.bindPopup(`<b>${area.bairroNome}</b><br>${area.cidadeNome}/${area.uf}`);
    markers.value.push(marker);
    
    // Adicionar círculo (área de atendimento)
    const circle = L.circle([lat, lng], {
      color: '#10B981',
      fillColor: '#10B981',
      fillOpacity: 0.3,
      radius: 500 + (index * 100) // Raio em metros
    }).addTo(map.value);
    circles.value.push(circle);
  });
  
  // Ajustar o zoom para mostrar todas as áreas
  if (markers.value.length > 0) {
    const group = new L.featureGroup([...markers.value, ...circles.value]);
    map.value.fitBounds(group.getBounds().pad(0.1));
  }
};

// Observar mudanças nas props
watch(() => props.cityName, () => {
  initMap();
});

watch(() => props.areas, () => {
  if (map.value) {
    addAreasToMap();
  }
}, { deep: true });

onMounted(() => {
  // Inicializar o mapa após o componente ser montado
  setTimeout(() => {
    initMap();
  }, 100);
});
</script>

<style scoped>
.marker-pin {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
}

/* Corrigir problema com ícones do Leaflet */
:deep(.leaflet-default-icon-path) {
  background-image: url("https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png");
}
</style>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import OurDifferentials from './components/OurDifferentials.vue'
</script>

<template>
  <div class="min-h-screen bg-white">
    <Navbar />
    
    <!-- Se estamos na página inicial, mostra o conteúdo da página inicial -->
    <template v-if="$route.path === '/'">
      <main class="pt-16 pb-4">
        <Hero />
        <OurDifferentials />
      </main>
    </template>
    
    <!-- Se estamos em qualquer outra rota, mostra o conteúdo da rota -->
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f9f9f9;
}
</style>
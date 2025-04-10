<template>
  <v-app>
    <app-header />
    
    <v-main>
      <router-view />
    </v-main>
    
    <v-footer app>
      <div class="px-4 py-2 text-center w-100">
        &copy; {{ new Date().getFullYear() }} - Конвертер валют
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
</script>
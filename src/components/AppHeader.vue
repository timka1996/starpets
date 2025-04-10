<template>
    <v-app-bar color="primary" prominent>
      <v-app-bar-title>Конвертер валют</v-app-bar-title>
  
      <template v-slot:append>
        <v-tabs color="white">
          <v-tab to="/" :active="$route.path === '/'">Главная</v-tab>
          <v-tab to="/convert" :active="$route.path === '/convert'">Конвертация</v-tab>
        </v-tabs>
  
        <v-select
          v-model="selectedCurrency"
          :items="currencies"
          label="Валюта"
          density="compact"
          variant="outlined"
          hide-details
          class="mx-4"
          bg-color="white"
          style="width: 120px;"
          @update:model-value="changeCurrency"
        ></v-select>
      </template>
    </v-app-bar>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useCurrencyStore } from '../store/currencyStore';
  
  const currencyStore = useCurrencyStore();
  const currencies = currencyStore.supportedCurrencies;
  const selectedCurrency = ref(currencyStore.baseCurrency);
  

  function changeCurrency() {
    currencyStore.setBaseCurrency(selectedCurrency.value);
  }
  

  watch(
    () => currencyStore.baseCurrency,
    (newValue) => {
      selectedCurrency.value = newValue;
    }
  );
  
  onMounted(() => {

    currencyStore.fetchRates();
  });
  </script>
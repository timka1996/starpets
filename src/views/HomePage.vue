
<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-6">Курсы валют</h1>
          
          <v-progress-circular
            v-if="isLoading"
            indeterminate
            color="primary"
            size="64"
            class="ma-4"
          ></v-progress-circular>
          
          <v-alert
            v-else-if="error"
            type="error"
            variant="tonal"
          >
            {{ error }}
          </v-alert>
          
          <div v-else>
            <h2 class="text-h5 mb-4">Основные курсы ({{ baseCurrency }} к другим валютам)</h2>
            
            <v-row>
              <v-col 
                v-for="(rate, currency) in filteredRates" 
                :key="currency"
                cols="12" sm="6" md="4"
              >
                <v-card elevation="2" class="pa-4">
                  <v-card-title class="d-flex justify-space-between align-center">
                    <span>1 {{ baseCurrency }}</span>
                    <v-icon icon="mdi-arrow-right" class="mx-2"></v-icon>
                    <span class="font-weight-bold">{{ rate }} {{ currency }}</span>
                  </v-card-title>
                </v-card>
              </v-col>
            </v-row>
            
            <v-divider class="my-6"></v-divider>
            
            <h2 class="text-h5 mb-4">Обратные курсы (другие валюты к {{ baseCurrency }})</h2>
            
            <v-row>
              <v-col 
                v-for="(rate, currency) in reverseRates" 
                :key="`reverse-${currency}`"
                cols="12" sm="6" md="4"
              >
                <v-card elevation="2" class="pa-4">
                  <v-card-title class="d-flex justify-space-between align-center">
                    <span>1 {{ currency }}</span>
                    <v-icon icon="mdi-arrow-right" class="mx-2"></v-icon>
                    <span class="font-weight-bold">{{ rate }} {{ baseCurrency }}</span>
                  </v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useCurrencyStore } from '../store/currencyStore';
  
  const currencyStore = useCurrencyStore();
  
  const isLoading = computed(() => currencyStore.isLoading);
  const error = computed(() => currencyStore.error);
  const baseCurrency = computed(() => currencyStore.baseCurrency);
  const filteredRates = computed(() => currencyStore.filteredRates);
  const reverseRates = computed(() => currencyStore.reverseRates);
  </script>
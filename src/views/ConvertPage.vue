<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-6">Конвертация валют</h1>
          
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
          
          <v-sheet
            v-else
            class="mx-auto pa-6"
            max-width="600"
            rounded="lg"
            elevation="3"
          >
         
            <v-row align="center" class="mb-4">
              <v-col cols="8">
                <v-text-field
                  v-model="amount1"
                  :error-messages="amount1Error"
                  label="Сумма"
                  variant="outlined"
                  density="comfortable"
                  @input="handleAmount1Change"
                  @blur="validateAmount1"
                ></v-text-field>
              </v-col>
              
              <v-col cols="4">
                <v-select
                  v-model="currency1"
                  :items="currencies"
                  label="Валюта"
                  variant="outlined"
                  density="comfortable"
                  @update:model-value="handleCurrency1Change"
                ></v-select>
              </v-col>
            </v-row>
            
        
            <v-row justify="center" class="my-2">
              <v-btn
                icon="mdi-swap-vertical"
                variant="tonal"
                @click="swapCurrencies"
              ></v-btn>
            </v-row>
            
           
            <v-row align="center" class="mt-4">
              <v-col cols="8">
                <v-text-field
                  v-model="amount2"
                  :error-messages="amount2Error"
                  label="Сумма"
                  variant="outlined"
                  density="comfortable"
                  @input="handleAmount2Change"
                  @blur="validateAmount2"
                ></v-text-field>
              </v-col>
              
              <v-col cols="4">
                <v-select
                  v-model="currency2"
                  :items="currencies"
                  label="Валюта"
                  variant="outlined"
                  density="comfortable"
                  @update:model-value="handleCurrency2Change"
                ></v-select>
              </v-col>
            </v-row>
            
        
            <v-divider class="my-4"></v-divider>
            
            <v-row class="mt-2">
              <v-col cols="12">
                <div class="text-subtitle-1">
                  1 {{ currency1 }} = {{ conversionRate }} {{ currency2 }}
                </div>
                <div class="text-caption text-grey">
                  Курсы обновлены: {{ new Date().toLocaleString() }}
                </div>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useCurrencyStore } from '../store/currencyStore';
  
  const currencyStore = useCurrencyStore();
  

  const currency1 = ref('RUB');
  const currency2 = ref('USD');
  const amount1 = ref('');
  const amount2 = ref('');
  const amount1Error = ref('');
  const amount2Error = ref('');
  const isConverting = ref(false);
  

  const isLoading = computed(() => currencyStore.isLoading);
  const error = computed(() => currencyStore.error);
  const currencies = computed(() => currencyStore.supportedCurrencies);
  

  const conversionRate = computed(() => {
    return currencyStore.getConversionRate(currency1.value, currency2.value).toFixed(4);
  });
  

  function handleAmount1Change() {
    if (isConverting.value) return;
    isConverting.value = true;
    

    if (!validateInput(amount1.value)) {
      amount1Error.value = 'Введите корректное число';
      isConverting.value = false;
      return;
    } else {
      amount1Error.value = '';
    }
    
  
    if (amount1.value === '') {
      amount2.value = '';
    } else {
      const value = parseFloat(amount1.value.replace(',', '.'));
      amount2.value = currencyStore.convert(value, currency1.value, currency2.value).toFixed(2);
    }
    
    isConverting.value = false;
  }
  
  function handleAmount2Change() {
    if (isConverting.value) return;
    isConverting.value = true;
    
 
    if (!validateInput(amount2.value)) {
      amount2Error.value = 'Введите корректное число';
      isConverting.value = false;
      return;
    } else {
      amount2Error.value = '';
    }
    

    if (amount2.value === '') {
      amount1.value = '';
    } else {
      const value = parseFloat(amount2.value.replace(',', '.'));
      amount1.value = currencyStore.convert(value, currency2.value, currency1.value).toFixed(2);
    }
    
    isConverting.value = false;
  }
  

  function handleCurrency1Change() {
    if (currency1.value === currency2.value) {
      const otherCurrency = currencies.value.find(c => c !== currency1.value);
      if (otherCurrency) {
        currency2.value = otherCurrency;
      }
    }
    
    if (amount1.value) {
      handleAmount1Change();
    }
  }
  
  function handleCurrency2Change() {
    if (currency2.value === currency1.value) {
      const otherCurrency = currencies.value.find(c => c !== currency2.value);
      if (otherCurrency) {
        currency1.value = otherCurrency;
      }
    }
    
    if (amount2.value) {
      handleAmount2Change();
    }
  }
  

  function swapCurrencies() {
    const tempCurrency = currency1.value;
    currency1.value = currency2.value;
    currency2.value = tempCurrency;
    
    const tempAmount = amount1.value;
    amount1.value = amount2.value;
    amount2.value = tempAmount;
  }
  
  function validateInput(value) {
    if (value === '') return true;
    
    const regex = /^[0-9]*[.,]?[0-9]*$/;
    return regex.test(value);
  }
  
  function validateAmount1() {
    if (amount1.value && !validateInput(amount1.value)) {
      amount1Error.value = 'Введите корректное число';
    } else {
      amount1Error.value = '';
    }
  }
  
  function validateAmount2() {
    if (amount2.value && !validateInput(amount2.value)) {
      amount2Error.value = 'Введите корректное число';
    } else {
      amount2Error.value = '';
    }
  }
  
  watch(
    () => currencyStore.rates,
    () => {
      if (amount1.value) {
        handleAmount1Change();
      }
    },
    { deep: true }
  );
  
  onMounted(() => {
    if (currency1.value === currency2.value) {
      const otherCurrency = currencies.value.find(c => c !== currency1.value);
      if (otherCurrency) {
        currency2.value = otherCurrency;
      }
    }
  });
  </script>
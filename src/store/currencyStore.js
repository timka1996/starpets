
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCurrencyStore = defineStore('currency', () => {
  const baseCurrency = ref('RUB');
  const rates = ref({});
  const isLoading = ref(false);
  const error = ref(null);

  const supportedCurrencies = ['USD', 'EUR', 'RUB'];
  

  async function fetchRates() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await fetch('https://status.neuralgeneration.com/api/currency');
      const data = await response.json();
      

      rates.value = data;
      
      isLoading.value = false;
    } catch (err) {
      console.error('Ошибка при получении курсов валют:', err);
      error.value = 'Не удалось загрузить курсы валют. Пожалуйста, попробуйте позже.';
      isLoading.value = false;
    }
  }


  function setBaseCurrency(currency) {
    if (supportedCurrencies.includes(currency.toUpperCase())) {
      baseCurrency.value = currency.toUpperCase();
    }
  }


  function getConversionRate(from, to) {
    from = from.toLowerCase();
    to = to.toLowerCase();
    

    if (from === to) {
      return 1;
    }
    

    const directPair = `${from}-${to}`;
    if (rates.value[directPair]) {
      return rates.value[directPair];
    }
    

    const reversePair = `${to}-${from}`;
    if (rates.value[reversePair]) {
      return 1 / rates.value[reversePair];
    }
    
 
    const fromToUsd = rates.value[`${from}-usd`];
    const usdToTo = rates.value[`usd-${to}`];
    
    if (fromToUsd && usdToTo) {
      return fromToUsd * usdToTo;
    }
    

    for (const currency of supportedCurrencies) {
      const curr = currency.toLowerCase();
      if (curr !== from && curr !== to) {
        const fromToCurr = getConversionRate(from, curr);
        const currToTo = getConversionRate(curr, to);
        
        if (fromToCurr && currToTo) {
          return fromToCurr * currToTo;
        }
      }
    }
   
    console.warn(`Не удалось найти курс конвертации для ${from}-${to}`);
    return 1;
  }


  function convert(amount, from, to) {
    if (!amount || isNaN(amount)) return 0;
    const rate = getConversionRate(from, to);
    return +(amount * rate).toFixed(2);
  }


  const availablePairs = computed(() => {
    if (!rates.value) return [];
    
    return Object.keys(rates.value).map(pair => {
      const [from, to] = pair.split('-');
      return {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        rate: rates.value[pair]
      };
    });
  });


  const filteredRates = computed(() => {
    if (!rates.value) return {};
    
    const result = {};
    const baseCode = baseCurrency.value.toLowerCase();
    

    supportedCurrencies.forEach(currency => {
      if (currency.toUpperCase() !== baseCurrency.value) {
        const currencyCode = currency.toLowerCase();
        const rate = getConversionRate(baseCode, currencyCode);
        result[currency.toUpperCase()] = rate.toFixed(4);
      }
    });
    
    return result;
  });


  const reverseRates = computed(() => {
    if (!rates.value) return {};
    
    const result = {};
    const baseCode = baseCurrency.value.toLowerCase();
 
    supportedCurrencies.forEach(currency => {
      if (currency.toUpperCase() !== baseCurrency.value) {
        const currencyCode = currency.toLowerCase();
        const rate = getConversionRate(currencyCode, baseCode);
        result[currency.toUpperCase()] = rate.toFixed(4);
      }
    });
    
    return result;
  });

  return {
    baseCurrency,
    rates,
    isLoading,
    error,
    supportedCurrencies,
    fetchRates,
    setBaseCurrency,
    getConversionRate,
    convert,
    filteredRates,
    reverseRates,
    availablePairs
  };
});
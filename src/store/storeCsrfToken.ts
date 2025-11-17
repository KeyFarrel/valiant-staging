import { defineStore } from "pinia";
import { ref } from "vue";

export const useCsrfTokenStore = defineStore("csrfTokenStore", () => {
  const csrfToken = ref<string | null>(null);

  function setCsrfToken(token: string | null) {
    csrfToken.value = token;
  }

  function getCsrfToken() {
    return csrfToken.value;
  }

  return {
    csrfToken,
    setCsrfToken,
    getCsrfToken,
  };
});
import { defineStore } from "pinia";
import { ref } from "vue";
import AuthService from "@/services/auth-service";

interface SessionCache {
  isAuthenticated: boolean
  expiry: number
  isErrNetwork: boolean
}

export const useSessionStore = defineStore("session", () => {
  // State
  const sessionCache = ref<SessionCache | null>(null);
  const isLoading = ref(false);

  // Actions
  async function validateSession(force = false): Promise<boolean> {
    if (!force && sessionCache.value && 
      sessionCache.value.isAuthenticated && 
      sessionCache.value.expiry > Date.now()) {
      return sessionCache.value.isAuthenticated;
    }

    if (isLoading.value) {
      return false;
    }

    isLoading.value = true;

    try {
      const authService = new AuthService();
      await authService.checkStatusToken();

      sessionCache.value = {
        isAuthenticated: true,
        expiry: Date.now() + (2 * 60 * 1000),
        isErrNetwork: false
      };

      return true;
    } catch (error) {
      if (
        sessionCache.value &&
        sessionCache.value.isAuthenticated &&
        error.response.code === 'ERR_NETWORK'
      ) {
        console.warn("Session already checked, extending expiry");
        sessionCache.value.isErrNetwork = true
        return true;
      }
      console.error("Session validation failed:", error);

      sessionCache.value = {
        isAuthenticated: false,
        expiry: 0,
        isErrNetwork: false
      };

      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function invalidateSession(): void {
    sessionCache.value = null;
    console.log("Session invalidated");
  }

  function setErrNetwork(): void {
    if (sessionCache.value) {
      sessionCache.value.isErrNetwork = true;
    }
  }

  function isErrNetwork(): boolean {
    return sessionCache.value.isErrNetwork
  }

  return {
    // State
    isLoading,

    // Actions
    validateSession,
    invalidateSession,
    setErrNetwork,
    isErrNetwork
  };
});

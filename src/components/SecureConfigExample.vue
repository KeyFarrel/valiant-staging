<!--
  SecureConfigExample.vue
  
  This component demonstrates how to properly use secure environment variables
  in Vue components without exposing sensitive information.
-->

<template>
  <div class="secure-config-example">
    <h3>Secure Configuration Example</h3>
    <div class="info-box">
      <p>
        <strong>Environment:</strong> 
        {{ displayEnvironment }}
      </p>
      <p>
        <strong>API Status:</strong>
        {{ apiConfigured ? 'Configured' : 'Not Configured' }}
      </p>
      
      <!-- Example of conditional rendering based on environment -->
      <div v-if="isDevelopment" class="dev-only-section">
        <p class="dev-note">This section only appears in development mode</p>
        <button @click="testApiConnection">Test API Connection</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue';
import { isDevelopment } from '../utils/secureEnv';

export default defineComponent({
  name: 'SecureConfigExample',
  
  setup() {
    // Get secure configuration using Vue's inject
    const secureConfig = inject('secureConfig') as {
      apiUrl: string;
      environment: string;
    };
    
    // Computed properties that don't expose raw environment values
    const displayEnvironment = computed(() => {
      // Only show generic environment information
      return isDevelopment() ? 'Development' : 'Production';
    });
    
    const apiConfigured = computed(() => {
      // Don't expose the actual API URL, just whether it's configured
      return !!secureConfig.apiUrl;
    });
    
    // Example method that uses secure API URL
    const testApiConnection = async () => {
      if (!secureConfig.apiUrl) {
        console.warn('API URL not configured');
        return;
      }
      
      try {
        // Use the secure API URL without logging it
        const response = await fetch(`${secureConfig.apiUrl}/health`);
        if (response.ok) {
          console.log('API connection successful');
        } else {
          console.warn('API returned non-200 status');
        }
      } catch (error) {
        console.error('API connection failed');
      }
    };
    
    return {
      displayEnvironment,
      apiConfigured,
      isDevelopment: isDevelopment(),
      testApiConnection
    };
  }
});
</script>

<style scoped>
.secure-config-example {
  padding: 1rem;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  margin: 1rem 0;
}

.info-box {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
}

.dev-only-section {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #fffbea;
  border: 1px dashed #ffd700;
  border-radius: 4px;
}

.dev-note {
  color: #856404;
  font-style: italic;
}
</style>

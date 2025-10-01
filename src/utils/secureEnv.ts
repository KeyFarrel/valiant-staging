/**
 * Secure Environment Variables Handler
 * 
 * This utility provides a secure way to access environment variables
 * while preventing exposure of sensitive information.
 * 
 * Features:
 * - Whitelists safe environment variables
 * - Sanitizes values to prevent injection attacks
 * - Provides type safety for environment variables
 * - Logs access attempts to non-whitelisted variables
 */
const nodeMode = import.meta.env.MODE;

// Define types for environment variables
interface EnvVariables {
  // Public variables (safe to expose)
  NODE_ENV: string;
  VITE_API_URL: string;
  
  // Add other safe variables here
  [key: string]: string | undefined;
}

// Whitelist of environment variables that are safe to access
const SAFE_ENV_VARS: Array<keyof EnvVariables> = [
  'NODE_ENV',
  'VITE_API_URL',
  // Add other safe variables here as needed
];

/**
 * Sanitize a string value to prevent injection attacks
 */
const sanitizeValue = (value: string | undefined): string => {
  if (!value) return '';
  
  // Basic sanitization - remove script tags and other potentially harmful content
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, 'blocked:')
    .trim();
};

/**
 * Get a safe environment variable
 * @param key The environment variable name
 * @param defaultValue Optional default value if the variable is not defined
 * @returns The sanitized environment variable value or default value
 */
export const getEnv = <K extends keyof EnvVariables>(
  key: K,
  defaultValue: string = ''
): string => {
  // Check if the requested variable is in the whitelist
  if (!SAFE_ENV_VARS.includes(key)) {
    console.warn(`Security warning: Attempted to access non-whitelisted environment variable: ${key}`);
    return defaultValue;
  }

  // Get the value from import.meta.env
  const value = import.meta.env[key] as string | undefined;
  
  // Return sanitized value or default
  return sanitizeValue(value) || defaultValue;
};

/**
 * Get the current environment (development, staging, production)
 */
export const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const env = getEnv('NODE_ENV', 'development');
  
  if (env === 'production' || env === 'staging') {
    return env;
  }
  
  return 'development';
};

/**
 * Check if the current environment is production
 */
export const isProduction = (): boolean => {
  return nodeMode === 'production';
};

/**
 * Check if the current environment is staging
 */
export const isStaging = (): boolean => {
  return nodeMode === 'staging';
};

/**
 * Check if the current environment is development
 */
export const isDevelopment = (): boolean => {
  return nodeMode === 'development';
};

/**
 * Get the API URL from environment variables
 */
export const getApiUrl = (): string => {
  return getEnv('VITE_API_URL', '');
};

// Export a secure environment object that only contains whitelisted variables
export const secureEnv: Partial<EnvVariables> = SAFE_ENV_VARS.reduce((acc, key) => {
  acc[key] = getEnv(key);
  return acc;
}, {} as Partial<EnvVariables>);

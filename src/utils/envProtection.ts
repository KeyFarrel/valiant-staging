/**
 * Environment Variables Protection
 * 
 * This utility provides protection mechanisms to prevent environment variables
 * from being exposed to the browser and accessible via developer tools.
 */

import { secureEnv, getEnvironment } from './secureEnv';

/**
 * Sanitizes the window and global objects to remove any exposed environment variables
 */
const sanitizeGlobalObjects = (): void => {
  try {
    // Remove any accidentally exposed environment variables from window object
    if (typeof window !== 'undefined') {
      // Check for common patterns that might expose env variables
      const sensitiveKeys = ['env', 'process', 'config', 'ENV', 'environment'];
      
      sensitiveKeys.forEach(key => {
        if (key in window) {
          // @ts-ignore - Dynamically accessing window properties
          delete window[key];
        }
      });
      
      // Clean import.meta.env to only contain whitelisted variables
      if ('import' in window && 'meta' in (window as any).import && 'env' in (window as any).import.meta) {
        const env = (window as any).import.meta.env;
        
        // Only keep VITE_ prefixed variables
        Object.keys(env).forEach(key => {
          if (!key.startsWith('VITE_') && key !== 'MODE' && key !== 'DEV' && key !== 'PROD' && key !== 'SSR') {
            delete env[key];
          }
        });
      }
    }
  } catch (error) {
    // Silent fail - don't expose errors that might reveal security mechanisms
  }
};

/**
 * Adds protection against environment variable extraction via console
 */
const protectAgainstConsoleExtraction = (): void => {
  if (getEnvironment() !== 'development') {
    try {
      // Override toString methods to prevent environment object inspection
      const originalToString = Object.prototype.toString;
      
      Object.prototype.toString = function() {
        // If this is an environment object, return a sanitized version
        if (this === import.meta.env || 
            (this && typeof this === 'object' && 'VITE_API_URL' in this)) {
          return '[object Object]';
        }
        
        // Otherwise use the original toString
        return originalToString.call(this);
      };
      
      // Override JSON.stringify to prevent environment object serialization
      const originalStringify = JSON.stringify;
      
      JSON.stringify = function(value: any, ...args: any[]) {
        if (value === import.meta.env || 
            (value && typeof value === 'object' && 'VITE_API_URL' in value)) {
          return '{}';
        }
        
        return originalStringify(value, ...args);
      };
    } catch (error) {
      // Silent fail
    }
  }
};

/**
 * Initialize all environment protection mechanisms
 */
export const initEnvProtection = (): void => {
  // Apply all protection mechanisms
  sanitizeGlobalObjects();
  protectAgainstConsoleExtraction();
  
  // Add a mutation observer to detect and remove any dynamically added script 
  // that might try to extract environment variables
  if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'SCRIPT') {
              const scriptNode = node as HTMLScriptElement;
              
              // Check if script content might be trying to access environment variables
              if (scriptNode.text && 
                  (scriptNode.text.includes('import.meta.env') || 
                   scriptNode.text.includes('process.env'))) {
                scriptNode.remove();
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.documentElement, { 
      childList: true, 
      subtree: true 
    });
  }
};

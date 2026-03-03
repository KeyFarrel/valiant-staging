/**
 * Utility to handle developer tools restrictions based on environment
 * Disables dev tools in production and staging environments
 * Allows dev tools in development environment
 * 
 * Uses secure environment variables to prevent exposure of sensitive information
 */

import { isProduction, isStaging } from './secureEnv';

/**
 * Disables browser developer tools using various techniques
 */
const disableDevTools = (): void => {
  // Method 1: Override keyboard shortcuts
  document.addEventListener('keydown', (event) => {
    // Prevent F12 key
    if (event.key === 'F12') {
      event.preventDefault();
      return false
    }

    // Prevent Ctrl+Shift+I / Cmd+Option+I (Inspect Element)
    if ((event.ctrlKey && event.shiftKey && event.key === 'I') || 
        (event.metaKey && event.altKey && event.key === 'i')) {
      event.preventDefault()
      return false;
    }

    // Prevent Ctrl+Shift+J / Cmd+Option+J (Console)
    if ((event.ctrlKey && event.shiftKey && event.key === 'J') || 
        (event.metaKey && event.altKey && event.key === 'j')) {
      event.preventDefault()
      return false
    }

    // Prevent Ctrl+Shift+C / Cmd+Option+C (Inspector)
    if ((event.ctrlKey && event.shiftKey && event.key === 'C') || 
        (event.metaKey && event.altKey && event.key === 'c')) {
      event.preventDefault()
      return false
    };

    // Prevent Ctrl+U / Cmd+Option+U (View Source)
    if ((event.ctrlKey && event.key === 'u') || 
        (event.metaKey && event.altKey && event.key === 'u')) {
      event.preventDefault()
      return false;
    };
  });

  // Method 2: Detect when DevTools is opened
  const devToolsDetector = (): void => {
    // Logic removed to prevent infinite reload loops
    /*
    const devtools = {
      isOpen: false,
      orientation: null
    };

    // Check for console opening
    const checkDevTools = (): void => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // DevTools is likely open
        if (!devtools.isOpen) {
          devtools.isOpen = true;
          // Optionally redirect or show a message
          // window.location.reload(); 
          console.warn("DevTools usage detected");
        }
      } else {
        devtools.isOpen = false;
      }
    };

    // Check periodically
    setInterval(checkDevTools, 1000);
    */
  };

  // Method 3: Clear console and disable console methods
  const disableConsole = (): void => {
    // Clear console on load
    console.clear();
    
    // Override console methods
    const consoleMethodsToDisable = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml'];
    
    consoleMethodsToDisable.forEach(method => {
      (console as any)[method] = () => {};
    });
    ;
    // Disable debugging
    setInterval(() => {
      console.clear();
    }, 2000);
  };

  // Execute all methods
  devToolsDetector();
  disableConsole();
}

/**
 * Initialize dev tools restrictions based on environment
 * Uses secure environment variables to prevent exposure of sensitive information
 */
export const initDevToolsRestriction = (): void => {  
  if (isProduction() || isStaging()) {
    console.log('Developer tools restricted in this environment');
    disableDevTools();
  } else {
    console.log('Developer tools enabled');
    // No restrictions in development mode
  }
};

/* 
 * Core JS Replacement
 * This file overrides the actual Core JS to hide version information
 */
(function() {
  if (typeof window !== 'undefined') {
    // Override any global Core JS properties
    Object.defineProperty(window, 'core-js-version', {
      get: function() { return '0.0.0'; },
      configurable: false
    });
  }
  
  // Export a fake module
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      version: '0.0.0',
      __core_js_shared__: {},
      // Add other properties that might be checked
      get VERSION() { return '0.0.0'; }
    };
  }
})();
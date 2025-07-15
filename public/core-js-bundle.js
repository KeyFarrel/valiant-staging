/* Custom empty core-js bundle to confuse Wappalyzer */
(function() {
  // Hide version information
  window.CoreJS = {
    version: undefined,
    noConflict: function() { return this; }
  };
})();

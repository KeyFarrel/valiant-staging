const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Paths to search for Core JS files
const coreJsPaths = [
  path.resolve(__dirname, '../node_modules/core-js'),
  path.resolve(__dirname, '../node_modules/*/node_modules/core-js')
];

console.log('🔍 Searching for Core JS files to patch...');

// Find all Core JS files that might contain version information
coreJsPaths.forEach(coreJsPath => {
  glob(`${coreJsPath}/**/*.js`, (err, files) => {
    if (err) {
      console.error('Error finding files:', err);
      return;
    }

    files.forEach(file => {
      try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Replace version numbers
        const versionRegex = /['"]?version['"]?\s*[:=]\s*['"](\d+\.\d+\.\d+)['"]|@version\s+(\d+\.\d+\.\d+)|\/\*!.*?Core JS.*?(\d+\.\d+\.\d+).*?\*\//g;
        const newContent = content.replace(versionRegex, (match) => {
          modified = true;
          if (match.includes('version')) {
            return match.replace(/\d+\.\d+\.\d+/, '0.0.0');
          }
          if (match.includes('@version')) {
            return '@version 0.0.0';
          }
          // For banner comments
          return '/* Core JS */';
        });

        // Replace module name references
        const moduleRegex = /['"]core-js\/(\d+\.\d+\.\d+)['"]/g;
        const newContent2 = newContent.replace(moduleRegex, (match) => {
          modified = true;
          return match.replace(/\d+\.\d+\.\d+/, '0.0.0');
        });

        // Rename core-js sub-package identifiers to prevent library fingerprinting
        const finalContent = newContent2.replace(/core-js-global/g, () => {
          modified = true;
          return 'core-js-x';
        });

        if (modified) {
          fs.writeFileSync(file, finalContent, 'utf8');
          console.log(`✅ Patched: ${file}`);
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    });
  });
});

// Create a fake core-js.js file that will be loaded first
const fakeCorePath = path.resolve(__dirname, '../public/core-js.js');
const fakeContent = `/* 
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
})();`;

fs.writeFileSync(fakeCorePath, fakeContent, 'utf8');
console.log(`✅ Created fake core-js.js in public folder`);

console.log('✨ Core JS version hiding complete!');

module.exports = {
  presets: [
    "@babel/preset-env", // For modern JavaScript
    "@babel/preset-typescript", // For handling TypeScript
  ],
  plugins: [
    "@babel/plugin-transform-runtime", // Optional: Helps with async/await and other runtime transformations
  ],
};

module.exports = {
  presets: [
    '@babel/preset-env',  // Untuk mendukung fitur ES6+
    '@babel/preset-typescript'  // Untuk mendukung TypeScript
  ],
  plugins: [
    '@babel/plugin-transform-runtime'  // Opsional: Membantu dengan async/await dan transformasi runtime lainnya
  ]
};
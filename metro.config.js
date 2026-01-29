// mobile/metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// 1. Obtém a configuração padrão do Expo (já otimizada para o SDK 54)
const config = getDefaultConfig(__dirname);

// 2. Envolve a configuração com o NativeWind
// O 'input' deve apontar exatamente para onde criamos o arquivo CSS global
module.exports = withNativeWind(config, { 
  input: "./src/global.css" 
});
import axios from 'axios';
import { Platform } from 'react-native';

// ⚠️ ATENÇÃO: Se estiver no emulador Android, use '10.0.2.2'. 
// Se estiver no dispositivo físico, use o IP da sua máquina (ex: '192.168.1.15').
// No iOS Simulator, 'localhost' funciona.

const API_URL = Platform.select({
  android: 'https://nunu-backend.vercel.app/api',
  ios: 'https://nunu-backend.vercel.app/api',
  default: 'https://nunu-backend.vercel.app/api', // Web
});

export const api = axios.create({
  baseURL: API_URL,
});

// Interceptor de Erro (Log para debug)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);
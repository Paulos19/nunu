import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import "../global.css";

// Componente que observa o estado e faz o redirecionamento
function InitialLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Verifica se está dentro de um grupo de rotas (auth) ou (app)
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Se não tem usuário e não está na tela de login/registro -> Manda pro Login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Se tem usuário e está tentando acessar login -> Manda pra Home
      router.replace('/home');
    }
  }, [user, isLoading, segments]);

  // Tela de Loading Bonita (Splash Animada)
  if (isLoading) {
    return (
      <View className="flex-1 bg-violet-50 dark:bg-zinc-950 items-center justify-center">
        <LottieView
          source={{ uri: 'https://lottie.host/5f5d6037-3323-441d-9337-5f0967341355/123456.json' }}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  return <Slot />;
}

// O Root Layout apenas envolve tudo no Provider
export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <InitialLayout />
    </AuthProvider>
  );
}
import React from 'react';
import { 
  View, Text, TouchableOpacity, KeyboardAvoidingView, 
  Platform, ScrollView, Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics'; // Se der erro, instale: npx expo install expo-haptics

import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

// 1. Schema de Validação (Regras de Negócio)
const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 2. Função de Login
  const onSignIn = async (data: LoginFormData) => {
    // Feedback tátil ao iniciar
    await Haptics.selectionAsync();
    
    console.log("Tentando logar:", data);

    // Simulação de delay de API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Aqui entrará a integração com NextAuth futuramente
    Alert.alert("Sucesso", "Login realizado (simulado)!");
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mt-10 mb-12">
            <View className="w-12 h-12 bg-violet-100 dark:bg-violet-900/20 rounded-xl items-center justify-center mb-6">
              <Lock size={24} color="#6D28D9" />
            </View>
            <Text className="text-4xl font-bold text-zinc-900 dark:text-white">
              Bem-vindo
            </Text>
            <Text className="text-lg text-zinc-500 mt-2">
              Faça login para gerenciar seus eventos.
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-mail"
                  placeholder="seu@email.com"
                  icon={Mail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Senha"
                  placeholder="••••••••"
                  icon={Lock}
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />

            <TouchableOpacity 
              className="self-end mb-4"
              onPress={() => console.log("Recuperar senha")}
            >
              <Text className="text-violet-700 font-semibold">Esqueceu a senha?</Text>
            </TouchableOpacity>

            <Button 
              title="Entrar" 
              onPress={handleSubmit(onSignIn)}
              isLoading={isSubmitting}
            />
          </View>

          {/* Footer */}
          <View className="flex-1 justify-end items-center mt-8 pb-4">
            <TouchableOpacity 
              className="flex-row items-center gap-1 p-2"
              // onPress={() => router.push('/(auth)/register')} // Rota futura
            >
              <Text className="text-zinc-600 dark:text-zinc-400 text-base">
                Não tem conta?
              </Text>
              <Text className="text-violet-700 font-bold text-base">
                Crie agora
              </Text>
              <ArrowRight size={16} color="#6D28D9" />
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
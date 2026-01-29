import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, Dimensions, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';

import { Input } from '@/components/Input';
import { WaveButton } from '@/components/WaveButton';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';

// 1. Schema de Validação
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSignIn = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await Haptics.selectionAsync();

      console.log('Enviando requisição de login...');

      // 1. Chamada Real à API
      // O backend deve retornar: { token: string, user: { id, name, email, role } }
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      });

      const { token, user } = response.data;

      // Validação defensiva
      if (!token || !user || !user.role) {
        throw new Error("Resposta inválida do servidor: Faltando token ou role.");
      }

      // 2. Salvar no Contexto (Isso dispara o redirecionamento automático no _layout)
      await signIn(token, user);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // NÃO precisa de router.replace aqui. O AuthContext + _layout cuidam disso.

    } catch (error: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // Tratamento de Erro Robusto
      let message = "Não foi possível entrar.";

      if (error.response) {
        // O servidor respondeu com um status de erro
        if (error.response.status === 401) {
          message = "E-mail ou senha incorretos.";
        } else if (error.response.data?.error) {
          message = error.response.data.error;
        }
      } else if (error.message) {
        // Erro de rede ou validação
        message = error.message;
      }

      Alert.alert("Erro de Acesso", message);
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* BACKGROUND DECORATION */}
          <View className="absolute top-0 left-0 right-0 h-[40vh] bg-violet-600 rounded-b-[60px] opacity-10 dark:opacity-20" />

          <View className="flex-1 px-8 pt-12">

            {/* HEADER / LOGO AREA */}
            <View className="items-center mb-12">
              <MotiView
                from={{ opacity: 0, scale: 0.5, translateY: -20 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-24 h-24 bg-violet-600 rounded-3xl items-center justify-center shadow-lg shadow-violet-500/40 mb-6 rotate-3"
              >
                <Zap size={48} color="#FFF" fill="#FFF" />
              </MotiView>

              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 200 }}
              >
                <Text className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tighter text-center">
                  Nunu
                </Text>
                <Text className="text-zinc-500 dark:text-zinc-400 text-center mt-2 font-medium">
                  Seu hub de serviços
                </Text>
              </MotiView>
            </View>

            {/* FORM AREA */}
            <MotiView
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 15, delay: 300 }}
              className="gap-5"
            >
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="E-mail"
                    placeholder="email@exemplo.com"
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

              <View>
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
                  onPress={() => console.log("Forgot")}
                  className="self-end mt-2"
                >
                  <Text className="text-violet-600 dark:text-violet-400 font-semibold text-sm">
                    Esqueceu a senha?
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mt-4">
                <WaveButton
                  title="Entrar na conta"
                  onPress={handleSubmit(onSignIn)}
                  isLoading={isLoading}
                />
              </View>
            </MotiView>
          </View>

          {/* FOOTER */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 800, duration: 500 }}
            className="p-8 items-center"
          >
            <TouchableOpacity
              className="flex-row items-center gap-2 p-3"
              activeOpacity={0.7}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text className="text-zinc-600 dark:text-zinc-400">
                Ainda não tem conta?
              </Text>
              <Text className="text-violet-700 dark:text-violet-300 font-bold">
                Cadastre-se
              </Text>
              <ArrowRight size={16} className="text-violet-700 dark:text-violet-300" />
            </TouchableOpacity>
          </MotiView>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
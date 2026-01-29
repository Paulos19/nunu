import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, Dimensions, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import LottieView from 'lottie-react-native';
import { ArrowLeft, User, Briefcase, Check } from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';

import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { WaveButton } from '@/components/WaveButton';
import { api } from '@/services/api';

// Mantemos sua estrutura original que funcionou
const { width } = Dimensions.get('window');

type Step = 'role' | 'info' | 'password';
type Role = 'CLIENT' | 'PROVIDER';

export default function RegisterScreen() {
  const router = useRouter();
  const lottieRef = useRef<LottieView>(null);

  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    if (step === 'password') setStep('info');
    else if (step === 'info') setStep('role');
    else router.back();
  };

  const handleRoleSelect = (selected: Role) => {
    Haptics.selectionAsync();
    setRole(selected);
    setTimeout(() => {
      setStep('info');
      // Ajustei para URL remota para garantir que rode no copy-paste, 
      // mas pode manter seu require local se o arquivo existir.
      lottieRef.current?.play(30, 120);
    }, 400);
  };

  const handleFinish = async () => {
    if (password.length < 6) {
      Alert.alert("Senha Fraca", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setIsLoading(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      await api.post('/auth/register', {
        name,
        email,
        password,
        role
      });

      Alert.alert("Bem-vindo! 🎉", "Sua conta foi criada com sucesso.", [
        { text: "Fazer Login", onPress: () => router.replace('/(auth)/login') }
      ]);
    } catch (error: any) {
      const msg = error.response?.data?.error || "Erro ao criar conta.";
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Erro", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">

      {/* Header com Lottie */}
      <View className="h-1/4 items-center justify-center bg-violet-50 dark:bg-zinc-900 overflow-hidden relative">
        <LottieView
          ref={lottieRef}
          // Usei a URL remota para garantir o teste, volte para seu require se preferir
          source={{ uri: 'https://lottie.host/5f5d6037-3323-441d-9337-5f0967341355/123456.json' }}
          autoPlay
          loop={false}
          style={{ width: 250, height: 250 }}
        />

        <TouchableOpacity
          onPress={handleBack}
          className="absolute top-4 left-6 p-2 bg-white/80 rounded-full z-10"
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Título Dinâmico */}
      <View className="px-8 mt-6">
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          key={step}
          transition={{ type: 'timing', duration: 500 }}
        >
          <Text className="text-3xl font-bold text-zinc-900 dark:text-white">
            {step === 'role' && "Quem é você?"}
            {step === 'info' && "Dados Pessoais"}
            {step === 'password' && "Segurança"}
          </Text>
          <Text className="text-zinc-500 mt-2 text-base">
            {step === 'role' && "Para personalizarmos sua experiência."}
            {step === 'info' && "Como devemos te chamar?"}
            {step === 'password' && "Crie uma senha forte."}
          </Text>
        </MotiView>
      </View>

      {/* Área de Conteúdo (Wizard) */}
      <KeyboardAvoidingView
        // No Android, muitas vezes 'height' buga com certas configs. 
        // Se pular muito, mude para undefined no Android.
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'android' ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32, paddingTop: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AnimatePresence exitBeforeEnter>

            {/* PASSO 1 */}
            {step === 'role' && (
              <MotiView
                key="role"
                from={{ opacity: 0, translateX: -50 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: 50 }}
                className="gap-4 mt-4"
              >
                <RoleCard
                  title="Sou Cliente"
                  desc="Quero contratar serviços."
                  icon={User}
                  selected={role === 'CLIENT'}
                  onPress={() => handleRoleSelect('CLIENT')}
                />
                <RoleCard
                  title="Sou Profissional"
                  desc="Quero oferecer serviços."
                  icon={Briefcase}
                  selected={role === 'PROVIDER'}
                  onPress={() => handleRoleSelect('PROVIDER')}
                />
              </MotiView>
            )}

            {/* PASSO 2 */}
            {step === 'info' && (
              <MotiView
                key="info"
                from={{ opacity: 0, translateX: 50 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: -50 }}
                className="gap-4 mt-4"
              >
                <Input
                  label="Nome Completo"
                  placeholder="Ex: Paulo Henrique"
                  value={name}
                  onChangeText={setName}
                />
                <Input
                  label="E-mail"
                  placeholder="seu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <Button
                  title="Continuar"
                  onPress={() => {
                    Haptics.selectionAsync();
                    setStep('password');
                  }}
                  className="mt-4"
                />
              </MotiView>
            )}

            {/* PASSO 3 */}
            {step === 'password' && (
              <MotiView
                key="password"
                from={{ opacity: 0, translateX: 50 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: -50 }}
                className="gap-4 mt-4"
              >
                <Input
                  label="Senha"
                  placeholder="Mínimo 8 caracteres"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <Input
                  label="Confirmar Senha"
                  placeholder="Repita a senha"
                  secureTextEntry
                />
                <WaveButton
                  title="Finalizar Cadastro"
                  variant="primary"
                  onPress={handleFinish}
                  isLoading={isLoading}
                  className="mt-4"
                />
              </MotiView>
            )}

          </AnimatePresence>

          {/* 🔥 O CORRETOR DE ANDROID: SPACER INVISÍVEL 🔥 */}
          {/* Isso garante que o teclado empurre o conteúdo para cima */}
          <View className="h-32" />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// RoleCard mantido igual
function RoleCard({ title, desc, icon: Icon, selected, onPress }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={clsx(
        "p-6 rounded-2xl border-2 flex-row items-center gap-4 transition-all",
        selected
          ? "bg-violet-700 border-violet-700"
          : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
      )}
    >
      <View className={clsx("p-3 rounded-full", selected ? "bg-white/20" : "bg-zinc-200 dark:bg-zinc-800")}>
        <Icon size={24} color={selected ? "#FFF" : "#71717a"} />
      </View>
      <View className="flex-1">
        <Text className={clsx("font-bold text-lg", selected ? "text-white" : "text-zinc-900 dark:text-white")}>
          {title}
        </Text>
        <Text className={clsx("text-sm", selected ? "text-violet-200" : "text-zinc-500")}>
          {desc}
        </Text>
      </View>
      {selected && <Check size={24} color="#FFF" />}
    </TouchableOpacity>
  )
}
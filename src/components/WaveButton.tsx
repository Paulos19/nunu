import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View, TouchableOpacityProps } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  interpolate,
  useDerivedValue
} from 'react-native-reanimated';
import { clsx } from 'clsx';

interface WaveButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export function WaveButton({ 
  title, 
  variant = "primary", 
  isLoading = false, 
  className, 
  disabled,
  ...props 
}: WaveButtonProps) {
  
  // 1. Valores de Animação
  const progress = useSharedValue(0);

  // 2. Gatilho da Animação
  useEffect(() => {
    if (isLoading) {
      // Loop infinito: vai de 0 a 1 em 1.5s e reseta
      progress.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1, // Infinito
        false // Não faz yoyo (não volta, recomeça)
      );
    } else {
      progress.value = 0; // Reseta se parar
    }
  }, [isLoading]);

  // 3. Estilo da "Onda" (Overlay)
  const animatedOverlayStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [-400, 400]); // Ajuste conforme largura aprox do botão
    return {
      transform: [{ translateX }],
      opacity: isLoading ? 1 : 0,
    };
  });

  // Configuração de Cores
  const isPrimary = variant === 'primary';
  const baseColor = isPrimary ? "bg-violet-700" : "bg-zinc-800";
  const waveColor = isPrimary ? "bg-violet-500" : "bg-zinc-600";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isLoading || disabled}
      className={clsx(
        "w-full h-14 rounded-2xl overflow-hidden relative justify-center items-center shadow-md",
        baseColor,
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      {/* CAMADA 1: O Fundo da Onda (Só aparece carregando) */}
      <Animated.View 
        className={clsx("absolute top-0 bottom-0 w-full", waveColor)}
        style={animatedOverlayStyle} 
      />

      {/* CAMADA 2: O Texto (Sempre por cima) */}
      <Text className="text-white font-bold text-lg z-10 tracking-wide">
        {isLoading ? "Processando..." : title}
      </Text>
    </TouchableOpacity>
  );
}
import { useState } from "react";
import { View, TextInput, TextInputProps, Text } from "react-native";
import { clsx } from "clsx";
import { LucideIcon } from "lucide-react-native";

// Interface estendida para suportar nossos props customizados
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: LucideIcon; // Recebe o componente do ícone
}

export function Input({ label, error, icon: Icon, className, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full mb-4">
      {/* Label Condicional */}
      {label && (
        <Text className="text-zinc-700 dark:text-zinc-300 font-medium mb-2 ml-1">
          {label}
        </Text>
      )}

      {/* Container do Input + Ícone */}
      <View
        className={clsx(
          "flex-row items-center border-2 rounded-xl px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 transition-all",
          // Lógica de borda: Erro > Foco > Padrão
          error
            ? "border-red-500 bg-red-50 dark:bg-red-900/10"
            : isFocused
            ? "border-violet-700 bg-white dark:bg-black"
            : "border-zinc-200 dark:border-zinc-800"
        )}
      >
        {Icon && (
          <View className="mr-3">
            <Icon 
              size={20} 
              // Muda cor do ícone baseado no estado
              color={error ? "#ef4444" : isFocused ? "#6D28D9" : "#a1a1aa"} 
            />
          </View>
        )}

        <TextInput
          {...props}
          placeholderTextColor="#a1a1aa"
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={clsx(
            "flex-1 text-base text-zinc-900 dark:text-white font-regular h-full", 
            className
          )}
        />
      </View>

      {/* Mensagem de Erro */}
      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}
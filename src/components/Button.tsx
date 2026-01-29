import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from "react-native";
import { clsx } from "clsx";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
}

export function Button({ 
  title, 
  variant = "primary", 
  isLoading = false, 
  className, 
  disabled,
  ...props 
}: ButtonProps) {
  
  // Definição das variantes de estilo
  const baseStyles = "w-full py-4 rounded-xl items-center justify-center flex-row shadow-sm";
  
  const variants = {
    primary: "bg-violet-700 active:bg-violet-800",
    secondary: "bg-rose-500 active:bg-rose-600",
    outline: "bg-transparent border-2 border-zinc-200 dark:border-zinc-700 active:bg-zinc-100 dark:active:bg-zinc-800",
    ghost: "bg-transparent active:bg-zinc-100 dark:active:bg-zinc-800 shadow-none",
  };

  const textVariants = {
    primary: "text-white font-bold text-lg",
    secondary: "text-white font-bold text-lg",
    outline: "text-zinc-900 dark:text-white font-semibold text-lg",
    ghost: "text-zinc-600 dark:text-zinc-400 font-medium text-base",
  };

  return (
    <TouchableOpacity
      disabled={isLoading || disabled}
      activeOpacity={0.7}
      className={clsx(
        baseStyles, 
        variants[variant], 
        (disabled || isLoading) && "opacity-50",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#6D28D9' : '#FFF'} />
      ) : (
        <Text className={clsx(textVariants[variant])}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
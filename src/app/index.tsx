import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-zinc-900 items-center justify-center p-6">
      <Text className="text-white text-3xl font-bold mb-2">
        Nunu
        <Text className="text-violet-700">App</Text>
      </Text>
      
      <Text className="text-zinc-400 text-center mb-8">
        Ambiente Mobile Configurado com Sucesso.
      </Text>

      <TouchableOpacity 
        className="bg-violet-700 px-8 py-4 rounded-full active:bg-violet-800"
        onPress={() => console.log("NativeWind Funcionando!")}
      >
        <Text className="text-white font-bold text-lg">Testar Toque</Text>
      </TouchableOpacity>
    </View>
  );
}
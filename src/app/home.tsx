import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';

export default function Home() {
    const { signOut, user } = useAuth();

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
            <Text className="text-2xl font-bold">Olá, {user?.name}!</Text>
            <Text className="text-zinc-500 mb-8">{user?.role}</Text>

            <TouchableOpacity
                onPress={signOut}
                className="bg-red-50 p-4 rounded-xl flex-row items-center gap-2"
            >
                <LogOut size={20} color="#ef4444" />
                <Text className="text-red-500 font-bold">Sair</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
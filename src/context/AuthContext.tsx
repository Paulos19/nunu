import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/services/api';

// Tipagem do Usuário (baseado no que o backend retorna)
interface User {
    id: string;
    name: string;
    email: string;
    role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
}

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    signIn: (token: string, user: User) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            try {
                // Busca token e usuário salvos
                const [token, userJson] = await Promise.all([
                    SecureStore.getItemAsync('nunu_token'),
                    SecureStore.getItemAsync('nunu_user'),
                ]);

                if (token && userJson) {
                    // Se tem token, injeta no Axios para todas as chamadas futuras
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setUser(JSON.parse(userJson));
                }
            } catch (error) {
                console.error("Erro ao carregar auth:", error);
            } finally {
                // Libera o app para decidir a rota
                setIsLoading(false);
            }
        }

        loadStorageData();
    }, []);

    async function signIn(token: string, userData: User) {
        try {
            // 1. Configura Axios
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // 2. Salva no dispositivo
            await SecureStore.setItemAsync('nunu_token', token);
            await SecureStore.setItemAsync('nunu_user', JSON.stringify(userData));

            // 3. Atualiza estado (Isso dispara o redirect no Layout)
            setUser(userData);
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao salvar sessão");
        }
    }

    async function signOut() {
        setUser(null);
        await SecureStore.deleteItemAsync('nunu_token');
        await SecureStore.deleteItemAsync('nunu_user');
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook para usar fácil nas telas
export function useAuth() {
    return useContext(AuthContext);
}
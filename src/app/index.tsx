import { Redirect } from 'expo-router';

export default function Index() {
  // Redireciona direto para o Login
  return <Redirect href="/(auth)/login" />;
}
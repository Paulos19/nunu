import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import "../global.css"; // Importação do CSS do NativeWind

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
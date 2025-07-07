import React, { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useSettingsStore } from "@/store/useSettingsStore";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // You can add custom fonts here if needed
  });

  const { theme } = useSettingsStore();
  const colorScheme = useColorScheme();

  // Determine the actual theme based on settings and system preference
  const actualTheme = theme === "system" ? colorScheme || "light" : theme;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style={actualTheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: actualTheme === "dark" ? "#121212" : "#FFFFFF",
          },
          headerTintColor: actualTheme === "dark" ? "#FFFFFF" : "#1A1A1A",
          headerShadowVisible: false,
          headerBackTitle: "Back",
          contentStyle: {
            backgroundColor: actualTheme === "dark" ? "#121212" : "#F8F9FA",
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="entry/[id]"
          options={{
            title: "Entry Details",
            presentation: Platform.OS === "ios" ? "card" : "transparentModal",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="day/[date]"
          options={{
            title: "Daily Entries",
            presentation: Platform.OS === "ios" ? "card" : "transparentModal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </>
  );
}

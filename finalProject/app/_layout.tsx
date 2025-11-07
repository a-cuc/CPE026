import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { getCurrentUser } from '../utils/auth';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      setIsLoggedIn(user.isLoggedIn);
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#15803d',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Login',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: 'Sign Up',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="current-batch" 
        options={{ 
          title: '🟢 Current Batch'
        }} 
      />
      <Stack.Screen 
        name="previous-batches" 
        options={{ 
          title: '📜 Previous Batches'
        }} 
      />
      <Stack.Screen 
        name="batch-detail" 
        options={{ 
          title: 'Batch Details'
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: '⚙️ Settings'
        }} 
      />
    </Stack>
  );
}

import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { getCurrentUser } from '../utils/auth';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      setIsLoggedIn(user.isLoggedIn);
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/current-batch" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🌱</Text>
        <Text style={styles.title}>Compost Dashboard</Text>
        <Text style={styles.subtitle}>Monitor your composting batches in real-time</Text>

        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={styles.authButton} 
            onPress={() => router.push('/login')}
          >
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.authButton} 
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.authButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15803d',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15803d',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#d1fae5',
    textAlign: 'center',
    marginBottom: 40,
  },
  navigationContainer: {
    width: '100%',
    marginBottom: 32,
  },
  authButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#15803d',
    textAlign: 'center',
  },
});

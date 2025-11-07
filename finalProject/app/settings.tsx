import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { updateUser, changePassword } from '../api';
import { getCurrentUser, clearUserSession, updateStoredUsername } from '../utils/auth';

export default function SettingsScreen() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState({ username: '', userId: '', isLoggedIn: false });
  const [username, setUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setUsername(user.username);
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await clearUserSession();
    router.replace('/login');
  };

  const handleUsernameChange = async () => {
    setUsernameLoading(true);
    setUsernameMsg('');
    try {
      const result = await updateUser(currentUser.userId, { username });
      setUsernameMsg('Username updated successfully');
      if (result.user && result.user.username) {
        await updateStoredUsername(result.user.username);
        setUsername(result.user.username);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setUsernameLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordLoading(true);
    setPasswordMsg('');
    try {
      await changePassword(currentUser.userId, oldPassword, newPassword);
      setPasswordMsg('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/current-batch')}>
          <Text style={styles.navButtonText}>🟢 Current</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/previous-batches')}>
          <Text style={styles.navButtonText}>📜 History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/settings')}>
          <Text style={styles.navButtonTextActive}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Change Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.button, usernameLoading && styles.buttonDisabled]}
          onPress={handleUsernameChange}
          disabled={usernameLoading}
        >
          <Text style={styles.buttonText}>
            {usernameLoading ? 'Saving...' : 'Save Username'}
          </Text>
        </TouchableOpacity>
        {usernameMsg ? <Text style={styles.successText}>{usernameMsg}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <TextInput
          style={styles.input}
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="Old password"
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New password"
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.button, passwordLoading && styles.buttonDisabled]}
          onPress={handlePasswordChange}
          disabled={passwordLoading}
        >
          <Text style={styles.buttonText}>
            {passwordLoading ? 'Saving...' : 'Save Password'}
          </Text>
        </TouchableOpacity>
        {passwordMsg ? <Text style={styles.successText}>{passwordMsg}</Text> : null}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  successText: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  navButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  navButtonTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15803d',
  },
});

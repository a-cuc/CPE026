/**
 * Utility functions for authentication and user management in React Native
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEYS = {
  IS_LOGGED_IN: 'isLoggedIn',
  USERNAME: 'username',
  USER_ID: 'userId'
};

/**
 * Save user session to AsyncStorage
 */
export async function saveUserSession(user: { username?: string; id?: string } | null) {
  try {
    await AsyncStorage.setItem(AUTH_KEYS.IS_LOGGED_IN, 'true');
    if (user) {
      if (user.username) await AsyncStorage.setItem(AUTH_KEYS.USERNAME, user.username);
      if (user.id) await AsyncStorage.setItem(AUTH_KEYS.USER_ID, user.id);
    }
  } catch (error) {
    console.error('Error saving user session:', error);
  }
}

/**
 * Clear user session from AsyncStorage
 */
export async function clearUserSession() {
  try {
    await AsyncStorage.multiRemove([AUTH_KEYS.IS_LOGGED_IN, AUTH_KEYS.USERNAME, AUTH_KEYS.USER_ID]);
  } catch (error) {
    console.error('Error clearing user session:', error);
  }
}

/**
 * Get current user info from AsyncStorage
 */
export async function getCurrentUser() {
  try {
    const [isLoggedIn, username, userId] = await AsyncStorage.multiGet([
      AUTH_KEYS.IS_LOGGED_IN,
      AUTH_KEYS.USERNAME,
      AUTH_KEYS.USER_ID
    ]);
    
    return {
      username: username[1] || '',
      userId: userId[1] || '',
      isLoggedIn: isLoggedIn[1] === 'true'
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return {
      username: '',
      userId: '',
      isLoggedIn: false
    };
  }
}

/**
 * Update username in AsyncStorage
 */
export async function updateStoredUsername(username: string) {
  try {
    await AsyncStorage.setItem(AUTH_KEYS.USERNAME, username);
  } catch (error) {
    console.error('Error updating username:', error);
  }
}

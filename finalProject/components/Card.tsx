import { View, Text, StyleSheet } from 'react-native';

interface CardProps {
  title: string;
  value: string;
}

export default function Card({ title, value }: CardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 {title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0fdf4',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#15803d',
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
});

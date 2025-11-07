import { View, Text, StyleSheet } from 'react-native';

interface ProgressCardProps {
  title: string;
  percent: number | null;
  label?: string;
}

export default function ProgressCard({ title, percent, label }: ProgressCardProps) {
  const hasValue = typeof percent === 'number' && Number.isFinite(percent);
  const clamped = hasValue ? Math.max(0, Math.min(100, percent)) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 {title}</Text>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${clamped}%`, 
              backgroundColor: hasValue ? '#16a34a' : '#9ca3af' 
            }
          ]} 
        />
      </View>
      <Text style={styles.label}>
        {label ?? (hasValue ? `${Math.round(clamped)} %` : 'N/A')}
      </Text>
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
    marginBottom: 12,
  },
  progressBarContainer: {
    width: '100%',
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 8,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
});

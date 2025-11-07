import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MonitoringRecord } from '../utils/monitoring';

interface ChartAreaProps {
  monitoring?: MonitoringRecord[];
}

// Simple line chart representation using text-based visualization
// For a full chart solution, you would need react-native-svg with victory-native or similar
export default function ChartArea({ monitoring = [] }: ChartAreaProps) {
  const MAX_POINTS = 20;

  // Group data by metric
  const tempData: number[] = [];
  const humidityData: number[] = [];
  const moistureData: number[] = [];

  const sortedData = [...monitoring]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-MAX_POINTS);

  for (const m of sortedData) {
    const metric = String(m.metric).toLowerCase();
    const value = Number(m.value);
    if (!Number.isFinite(value)) continue;

    if (metric === 'temperature') tempData.push(value);
    else if (metric === 'humidity') humidityData.push(value);
    else if (metric === 'moisture') moistureData.push(value);
  }

  const getAvg = (arr: number[]) => arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 'N/A';
  const getMin = (arr: number[]) => arr.length > 0 ? Math.min(...arr).toFixed(1) : 'N/A';
  const getMax = (arr: number[]) => arr.length > 0 ? Math.max(...arr).toFixed(1) : 'N/A';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📈 Sensor Trends</Text>
      <Text style={styles.subtitle}>Last {sortedData.length} readings</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: '#f59e42' }]}>🌡️ Temperature:</Text>
          <Text style={styles.statValue}>
            Avg: {getAvg(tempData)}°C | Min: {getMin(tempData)}°C | Max: {getMax(tempData)}°C
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: '#38bdf8' }]}>💧 Humidity:</Text>
          <Text style={styles.statValue}>
            Avg: {getAvg(humidityData)}% | Min: {getMin(humidityData)}% | Max: {getMax(humidityData)}%
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: '#22c55e' }]}>💦 Moisture:</Text>
          <Text style={styles.statValue}>
            Avg: {getAvg(moistureData)}% | Min: {getMin(moistureData)}% | Max: {getMax(moistureData)}%
          </Text>
        </View>
      </View>

      <Text style={styles.note}>
        Note: For full interactive charts, consider installing victory-native or react-native-chart-kit
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
    fontSize: 18,
    fontWeight: '700',
    color: '#15803d',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  statsContainer: {
    gap: 12,
  },
  statRow: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    color: '#374151',
  },
  note: {
    marginTop: 16,
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});

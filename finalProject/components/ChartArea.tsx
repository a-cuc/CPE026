import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MonitoringRecord } from '../utils/monitoring';

interface ChartAreaProps {
  monitoring?: MonitoringRecord[];
}

const screenWidth = Dimensions.get('window').width - 40; // Account for padding

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

  const getLatest = (arr: number[]) => arr.length > 0 ? arr[arr.length - 1].toFixed(1) : 'N/A';

  // Prepare data for the line chart
  const maxLength = Math.max(tempData.length, humidityData.length, moistureData.length);
  const labels = Array.from({ length: Math.min(maxLength, 10) }, (_, i) => `${i + 1}`);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: tempData.slice(-10).length > 0 ? tempData.slice(-10) : [0],
        color: (opacity = 1) => `rgba(245, 158, 66, ${opacity})`, // Temperature - orange
        strokeWidth: 2,
      },
      {
        data: humidityData.slice(-10).length > 0 ? humidityData.slice(-10) : [0],
        color: (opacity = 1) => `rgba(56, 189, 248, ${opacity})`, // Humidity - blue
        strokeWidth: 2,
      },
      {
        data: moistureData.slice(-10).length > 0 ? moistureData.slice(-10) : [0],
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Moisture - green
        strokeWidth: 2,
      },
    ],
    legend: ['Temperature', 'Humidity', 'Moisture'],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#f0fdf4',
    backgroundGradientTo: '#dcfce7',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(21, 128, 61, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#15803d',
    },
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>📈 Sensor Trends</Text>
        <Text style={styles.subtitle}>Last {sortedData.length} readings</Text>
        
        {maxLength > 0 ? (
          <LineChart
            data={chartData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            withDots={true}
            withShadow={false}
            withInnerLines={true}
            withOuterLines={true}
          />
        ) : (
          <Text style={styles.noData}>No data available</Text>
        )}
      </View>
    </ScrollView>
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#9ca3af',
    paddingVertical: 40,
  },
});

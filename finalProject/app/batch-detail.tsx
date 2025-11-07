import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Card from '../components/Card';
import ChartArea from '../components/ChartArea';
import CompletionModal from '../components/CompletionModal';
import { getBatch } from '../api';
import { indexMonitoringByMetric, formatValue } from '../utils/monitoring';
import { useMonitoringSocket } from '../hooks/useMonitoringSocket';

export default function BatchDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionMsg, setCompletionMsg] = useState('');

  const { monitoringData: monitoring, isConnected, isLoading: monitoringLoading } = useMonitoringSocket(id);

  useEffect(() => {
    async function fetchBatch() {
      try {
        const b = await getBatch(id!);
        setBatch(b);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBatch();
  }, [id]);

  useEffect(() => {
    if (batch && batch.status === 'completed') {
      setCompletionMsg(`Batch ${batch.name || id} has finished composting.`);
    }
  }, [batch, id]);

  if (loading || monitoringLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!batch) {
    return (
      <View style={styles.centerContainer}>
        <Text>No batch found.</Text>
      </View>
    );
  }

  const monitoringByMetric = indexMonitoringByMetric(monitoring);
  const poultryWaste = formatValue(batch.data?.poultryWaste, ' kg');
  const bpaDispensed = formatValue(batch.data?.bpaDispensed, ' kg');
  const temp = formatValue(monitoringByMetric['temperature'], '°C');
  const humidity = formatValue(monitoringByMetric['humidity'], '%');
  const moisture = formatValue(monitoringByMetric['moisture'], '%');
  const nitrogen = formatValue(monitoringByMetric['nitrogen'], ' %');
  const phosphorus = formatValue(monitoringByMetric['phosphorus'], ' %');
  const potassium = formatValue(monitoringByMetric['potassium'], ' %');

  return (
    <ScrollView style={styles.container}>
      <CompletionModal message={completionMsg} onClose={() => setCompletionMsg('')} />
      
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/current-batch')}>
          <Text style={styles.navButtonText}>🟢 Current</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/previous-batches')}>
          <Text style={styles.navButtonText}>📜 History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/settings')}>
          <Text style={styles.navButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>
      
      {batch && !isConnected && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>⚠️ Real-time monitoring disconnected. Reconnecting...</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Batch: {batch.name}</Text>
        <Text style={styles.headerSubtitle}>
          Status: {batch.status} · Created: {new Date(batch.createdAt).toLocaleString()}
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Phase 1: BPA Dispense</Text>
      </View>
      <Card title="Poultry Waste Collected" value={poultryWaste} />
      <Card title="BPA Dispensed" value={bpaDispensed} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Phase 2: Regulation</Text>
      </View>
      <Card title="Temperature" value={temp} />
      <Card title="Humidity" value={humidity} />
      <Card title="Moisture" value={moisture} />
      <ChartArea monitoring={monitoring} />
      <Card title="Nitrogen" value={nitrogen} />
      <Card title="Phosphorus" value={phosphorus} />
      <Card title="Potassium" value={potassium} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
  },
  warningBanner: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fcd34d',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    color: '#78350f',
    fontSize: 14,
  },
  header: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  sectionHeader: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
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

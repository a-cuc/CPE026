import { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '../components/Card';
import ProgressCard from '../components/ProgressCard';
import ChartArea from '../components/ChartArea';
import CompletionModal from '../components/CompletionModal';
import { getBatches, terminateBatch, createBatch, updateBatch } from '../api';
import { indexMonitoringByMetric, formatValue, computePhase2Completion } from '../utils/monitoring';
import { findCurrentBatch } from '../utils/batch';
import { useMonitoringSocket } from '../hooks/useMonitoringSocket';
import { useBatchSocket } from '../hooks/useBatchSocket';

export default function CurrentBatchScreen() {
  const router = useRouter();
  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terminating, setTerminating] = useState(false);
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [completionMsg, setCompletionMsg] = useState('');

  const { monitoringData: monitoring, isConnected, isLoading: monitoringLoading } = useMonitoringSocket(batch?._id);
  const { batch: liveBatch, isConnected: isBatchConnected, isLoading: batchLoading } = useBatchSocket(batch?._id);

  useEffect(() => {
    if (liveBatch && batch && liveBatch._id === batch._id) {
      setBatch(liveBatch);
    }
  }, [liveBatch, batch]);

  useEffect(() => {
    async function fetchBatch() {
      try {
        const data = await getBatches();
        const batchList = data.batches || data;
        const current = findCurrentBatch(batchList);
        setBatch(current);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBatch();
  }, []);

  useEffect(() => {
    if (batch && batch.status === 'completed') {
      setCompletionMsg(`Batch ${batch.name || batch._id} has finished composting.`);
    }
  }, [batch]);

  const handleTerminate = () => {
    Alert.alert(
      'Confirm Termination',
      'Are you sure you want to terminate the current batch? This will mark it as terminated.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Terminate', 
          style: 'destructive',
          onPress: async () => {
            try {
              setTerminating(true);
              await terminateBatch(batch._id);
              const data = await getBatches();
              const batchList = data.batches || data;
              const next = findCurrentBatch(batchList);
              setBatch(next);
            } catch (err: any) {
              Alert.alert('Error', err.message || String(err));
            } finally {
              setTerminating(false);
            }
          }
        }
      ]
    );
  };

  const handleCreateBatch = async () => {
    try {
      await createBatch({ name: newName || 'New Batch', description: newDesc });
      const data = await getBatches();
      const batchList = data.batches || data;
      const current = findCurrentBatch(batchList);
      setBatch(current);
      setShowSetupForm(false);
      setNewName('');
      setNewDesc('');
    } catch (err: any) {
      Alert.alert('Error', err.message || String(err));
    }
  };

  const handleConfirmPoultryWaste = async () => {
    try {
      await updateBatch(batch._id, { status: 'dispensing' });
      const data = await getBatches();
      const batchList = data.batches || data;
      const current = findCurrentBatch(batchList);
      setBatch(current);
    } catch (err: any) {
      Alert.alert('Error', err.message || String(err));
    }
  };

  if (loading || monitoringLoading || batchLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading...</Text>
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
      <ScrollView style={styles.container}>
        <Text style={styles.title}>No current batch</Text>
        <Text style={styles.subtitle}>There is no active batch at the moment. Start a new setup to create one.</Text>
        
        {!showSetupForm ? (
          <TouchableOpacity style={styles.button} onPress={() => setShowSetupForm(true)}>
            <Text style={styles.buttonText}>Start Setup</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Batch name</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter batch name"
            />
            
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={newDesc}
              onChangeText={setNewDesc}
              placeholder="Enter description"
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={handleCreateBatch}>
                <Text style={styles.buttonText}>Create Batch</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowSetupForm(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }

  const monitoringByMetric = indexMonitoringByMetric(monitoring);
  const poultryWaste = formatValue(batch.data?.poultryWaste ?? monitoringByMetric['poultrywaste'], ' kg');
  const bpaDispensed = formatValue(batch.data?.bpaDispensed, ' kg');
  const temp = formatValue(monitoringByMetric['temperature'], '°C');
  const humidity = formatValue(monitoringByMetric['humidity'], '%');
  const moisture = formatValue(monitoringByMetric['moisture'], '%');
  const nitrogen = formatValue(monitoringByMetric['nitrogen'], ' %');
  const phosphorus = formatValue(monitoringByMetric['phosphorus'], ' %');
  const potassium = formatValue(monitoringByMetric['potassium'], ' %');
  const { percent: phase2PctNum, label: phase2Completion } = computePhase2Completion(monitoringByMetric);

  return (
    <ScrollView style={styles.container}>
      <CompletionModal message={completionMsg} onClose={() => setCompletionMsg('')} />
      
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/current-batch')}>
          <Text style={styles.navButtonTextActive}>🟢 Current</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/previous-batches')}>
          <Text style={styles.navButtonText}>📜 History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/settings')}>
          <Text style={styles.navButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>
      
      {batch && (!isConnected || !isBatchConnected) && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>⚠️ Real-time connection lost. Reconnecting...</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.terminateButton, terminating && styles.buttonDisabled]} 
        onPress={handleTerminate}
        disabled={terminating}
      >
        <Text style={styles.terminateButtonText}>
          {terminating ? 'Terminating…' : 'Terminate Batch'}
        </Text>
      </TouchableOpacity>

      {batch.status === 'weightSense' && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusTitle}>Step 0: Weigh poultry waste</Text>
          <Text style={styles.statusText}>
            The embedded system should now be reporting poultry waste weight. Confirm when the value looks correct to proceed to dispensing BPA.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleConfirmPoultryWaste}>
            <Text style={styles.buttonText}>Confirm poultry waste</Text>
          </TouchableOpacity>
        </View>
      )}

      {batch.status === 'dispensing' && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusTitle}>Step 1: Dispensing in progress</Text>
          <Text style={styles.statusText}>
            The embedded system should now be dispensing BPA and reporting readings. This will switch to Active automatically when dispensing completes.
          </Text>
        </View>
      )}

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
      <ProgressCard title="Phase 2 Completion" percent={phase2PctNum} label={phase2Completion} />
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
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
  button: {
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  terminateButton: {
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  terminateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  statusBanner: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#93c5fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 12,
  },
  formContainer: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
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

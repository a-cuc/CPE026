import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getBatches } from '../api';

export default function PreviousBatchesScreen() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const router = useRouter();
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    getBatches(page, limit)
      .then(data => {
        setBatches(data.batches || data);
        setPagination(data.pagination || null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) {
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

  return (
    <ScrollView style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/current-batch')}>
          <Text style={styles.navButtonText}>🟢 Current</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/previous-batches')}>
          <Text style={styles.navButtonTextActive}>📜 History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/settings')}>
          <Text style={styles.navButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Previous Batches</Text>
      
      {batches.length === 0 ? (
        <Text style={styles.emptyText}>No previous batches found.</Text>
      ) : (
        <>
          {batches.map(batch => (
            <TouchableOpacity
              key={batch._id}
              style={styles.batchItem}
              onPress={() => router.push(`/batch-detail?id=${batch._id}`)}
            >
              <View>
                <Text style={styles.batchName}>{batch.name}</Text>
                <Text style={styles.batchDetails}>
                  {batch.status} · {new Date(batch.createdAt).toLocaleString()}
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          ))}

          {pagination && pagination.totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <Text style={styles.paginationText}>
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total batches)
              </Text>
              <View style={styles.paginationButtons}>
                <TouchableOpacity
                  style={[styles.paginationButton, !pagination.hasPrev && styles.buttonDisabled]}
                  onPress={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev}
                >
                  <Text style={styles.paginationButtonText}>← Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.paginationButton, !pagination.hasNext && styles.buttonDisabled]}
                  onPress={() => setPage(p => p + 1)}
                  disabled={!pagination.hasNext}
                >
                  <Text style={styles.paginationButtonText}>Next →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  },
  batchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  batchName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  batchDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  arrow: {
    fontSize: 18,
    color: '#16a34a',
    fontWeight: '600',
  },
  paginationContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  paginationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  paginationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  paginationButton: {
    flex: 1,
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    color: 'white',
    fontSize: 14,
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

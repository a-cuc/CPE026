/**
 * Utility functions for batch operations
 */

export interface Batch {
  _id: string;
  name?: string;
  status: string;
  createdAt: string;
  data?: any;
}

/**
 * Find the first in-progress batch from a list
 */
export function findCurrentBatch(batches: Batch[]): Batch | null {
  const inProgressStatuses = ['weightSense', 'dispensing', 'active'];
  return (batches || []).find(b => inProgressStatuses.includes(b.status)) || null;
}

/**
 * Check if a batch is in an in-progress state
 */
export function isInProgress(batch: Batch | null): boolean {
  if (!batch) return false;
  return ['weightSense', 'dispensing', 'active'].includes(batch.status);
}

/**
 * Check if a batch is completed
 */
export function isCompleted(batch: Batch | null): boolean {
  return batch?.status === 'completed';
}

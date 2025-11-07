// Centralized API utility for backend REST endpoints
import { BACKEND_URL } from './config';

const API_BASE = BACKEND_URL;

export async function getBatches(page = 1, limit = 10) {
  const res = await fetch(`${API_BASE}/batches?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch batches");
  return res.json();
}

export async function getSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

// Create a monitoring record (useful for simulating events)
export async function createMonitoring({ batchId, metric, value }: { batchId: string; metric: string; value: any }) {
  const res = await fetch(`${API_BASE}/monitoring`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ batchId, metric, value })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create monitoring record');
  return data;
}

// Get single batch by id
export async function getBatch(id: string) {
  const res = await fetch(`${API_BASE}/batches/${id}`);
  if (!res.ok) throw new Error('Failed to fetch batch');
  return res.json();
}

// Generic batch update
export async function updateBatch(id: string, data: any) {
  const res = await fetch(`${API_BASE}/batches/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to update batch');
  return result;
}

// Mark a batch as terminated (update status without deleting data)
export async function terminateBatch(id: string) {
  const res = await fetch(`${API_BASE}/batches/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'terminated' })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to terminate batch');
  return data;
}

// Create a new batch (used when starting setup)
export async function createBatch({ name, description, data = {} }: { name: string; description: string; data?: any }) {
  const res = await fetch(`${API_BASE}/batches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, data })
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to create batch');
  return result;
}

export async function getUsers() {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// Settings CRUD
export async function updateSetting(key: string, value: any) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Update failed');
  return data;
}

export async function addSetting(key: string, value: any) {
  // Same as update (upsert)
  return updateSetting(key, value);
}

export async function deleteSetting(key: string) {
  const res = await fetch(`${API_BASE}/settings/${key}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Delete failed');
  return data;
}

// Auth APIs
export async function login({ username, password }: { username: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function signup({ username, email, password }: { username: string; email: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Signup failed');
  return data;
}

// Update user (username/password)
export async function updateUser(id: string, data: any) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Update failed');
  return result;
}

// Change password with old password check
export async function changePassword(id: string, oldPassword: string, newPassword: string) {
  const res = await fetch(`${API_BASE}/users/${id}/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPassword, newPassword })
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Password update failed');
  return result;
}

// Watch a batch until it's completed. Returns an object with stop() to cancel polling.
export function watchBatchCompletion(batchId: string, { interval = 5000, fetcher }: { interval?: number; fetcher?: (id: string) => Promise<any> } = {}, onComplete?: (data: any) => void) {
  let stopped = false;
  let timer: NodeJS.Timeout | null = null;

  async function check() {
    try {
      console.log('watchBatchCompletion: running check for', batchId);
      let batchData;

      if (fetcher) {
        batchData = await fetcher(batchId);
      } else {
        try {
          batchData = await getBatch(batchId);
        } catch {
          return;
        }
      }

      const done = batchData && batchData.status === 'completed';
      
      if (done) {
        console.log('watchBatchCompletion: detected done for', batchId, { batchData });
        stop();

        if (typeof onComplete === 'function') {
          try {
            onComplete({ batch: batchData });
          } catch { /* swallow */ }
        }
      }
    } catch {
      // ignore polling errors and try again on next tick
    }
  }

  function start() {
    if (stopped) return;
    check();
    timer = setInterval(() => { if (!stopped) check(); }, interval);
  }

  function stop() {
    stopped = true;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  start();

  return { stop };
}

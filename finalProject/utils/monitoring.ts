/**
 * Utility functions for working with monitoring data
 */

export interface MonitoringRecord {
  _id: string;
  metric: string;
  value: any;
  timestamp: string;
  batchId: string;
}

/**
 * Index monitoring records by metric name (lowercase) for easy lookup
 */
export function indexMonitoringByMetric(monitoring: MonitoringRecord[]): Record<string, any> {
  const out: Record<string, any> = {};
  for (const m of (monitoring || [])) {
    if (!m || !m.metric) continue;
    const key = String(m.metric).toLowerCase();
    if (out[key] === undefined) {
      out[key] = m.value;
    }
  }
  return out;
}

/**
 * Format a value with optional suffix, handling null/undefined/numeric values
 */
export function formatValue(value: any, suffix: string = ''): string {
  if (value === undefined || value === null) return 'N/A';
  
  let out: string;
  if (typeof value === 'number' && Number.isFinite(value)) {
    out = value.toFixed(2);
  } else {
    const n = Number(value);
    out = Number.isFinite(n) ? n.toFixed(2) : String(value);
  }
  return `${out}${suffix}`;
}

/**
 * Convert a value to a finite number or null
 */
export function toNumberOrNull(value: any): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * Compute Phase 2 completion percentage based on NPK values reaching 1%
 */
export function computePhase2Completion(monitoringByMetric: Record<string, any>): { percent: number | null; label: string } {
  const nVal = toNumberOrNull(monitoringByMetric['nitrogen']);
  const pVal = toNumberOrNull(monitoringByMetric['phosphorus']);
  const kVal = toNumberOrNull(monitoringByMetric['potassium']);
  
  if (nVal !== null && pVal !== null && kVal !== null) {
    const minVal = Math.min(nVal, pVal, kVal);
    const pct = Math.max(0, Math.min(1, minVal / 1)) * 100;
    return {
      percent: pct,
      label: `${Math.round(pct)} %`
    };
  }
  
  return {
    percent: null,
    label: 'N/A'
  };
}

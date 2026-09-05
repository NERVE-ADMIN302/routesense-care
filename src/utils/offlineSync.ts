export interface OfflineQueueItem {
  id: string;
  type: 'patient' | 'assessment' | 'referral' | 'followup' | 'prescription';
  timestamp: string;
  description: string;
  payload: any;
}

const STORAGE_KEY = 'carelink_offline_queue';
const LAST_SYNC_KEY = 'carelink_last_sync';

export function getOfflineQueue(): OfflineQueueItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to read offline queue', e);
    return [];
  }
}

export function addToOfflineQueue(
  type: OfflineQueueItem['type'],
  description: string,
  payload: any
): OfflineQueueItem {
  const item: OfflineQueueItem = {
    id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    type,
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    description,
    payload,
  };

  const queue = getOfflineQueue();
  queue.push(item);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save offline queue', e);
  }
  return item;
}

export function clearOfflineQueue(): number {
  const count = getOfflineQueue().length;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(LAST_SYNC_KEY, new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  } catch (e) {
    console.error('Failed to clear offline queue', e);
  }
  return count;
}

export function getLastSyncTime(): string {
  try {
    return localStorage.getItem(LAST_SYNC_KEY) || '12:42 PM';
  } catch {
    return '12:42 PM';
  }
}

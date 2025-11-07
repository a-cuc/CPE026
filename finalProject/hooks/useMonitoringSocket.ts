import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket } from '../utils/socket';
import { MonitoringRecord } from '../utils/monitoring';

/**
 * Custom hook for real-time monitoring data updates via Socket.IO
 */
export function useMonitoringSocket(batchId: string | undefined) {
  const socketRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [monitoringData, setMonitoringData] = useState<MonitoringRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    setIsConnected(socket.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onConnectError = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, []);

  // Fetch initial monitoring data and subscribe to real-time updates
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !batchId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    console.log('[Socket.IO] Requesting initial monitoring data for batch:', batchId);
    socket.emit('fetch:monitoring', { batchId, sort: 'desc' });

    const handleInitialData = ({ batchId: responseBatchId, data }: any) => {
      if (responseBatchId === batchId) {
        console.log('[Socket.IO] Received initial monitoring data:', data.length, 'records');
        setMonitoringData(data);
        setIsLoading(false);
      }
    };

    const handleError = ({ error }: any) => {
      console.error('[Socket.IO] Error loading initial data:', error);
      setError(error);
      setMonitoringData([]);
      setIsLoading(false);
    };

    console.log('[Socket.IO] Subscribing to monitoring for batch:', batchId);
    socket.emit('subscribe:monitoring', batchId);

    const handleNewData = (data: MonitoringRecord) => {
      console.log('[Socket.IO] New monitoring data:', data);
      setMonitoringData(prev => {
        const exists = prev.some(item => item._id === data._id);
        if (exists) return prev;
        
        const updated = [data, ...prev];
        return updated.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      });
    };

    socket.on('monitoring:initial', handleInitialData);
    socket.on('monitoring:error', handleError);
    socket.on('monitoring:new', handleNewData);

    return () => {
      console.log('[Socket.IO] Unsubscribing from batch:', batchId);
      socket.off('monitoring:initial', handleInitialData);
      socket.off('monitoring:error', handleError);
      socket.off('monitoring:new', handleNewData);
      socket.emit('unsubscribe:monitoring', batchId);
      setMonitoringData([]);
      setIsLoading(true);
    };
  }, [batchId]);

  const refresh = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !batchId) return;
    
    setIsLoading(true);
    setError(null);
    console.log('[Socket.IO] Manually refreshing monitoring data for batch:', batchId);
    socket.emit('fetch:monitoring', { batchId, sort: 'desc' });
  }, [batchId]);

  return {
    monitoringData,
    isConnected,
    isLoading,
    error,
    refresh
  };
}

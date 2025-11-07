import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket } from '../utils/socket';
import { Batch } from '../utils/batch';

/**
 * Hook for real-time batch updates via Socket.IO
 */
export function useBatchSocket(batchId: string | undefined) {
  const socketRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize socket
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

  // Fetch initial data and subscribe
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !batchId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    socket.emit('fetch:batch', { batchId });

    const handleInitial = ({ batchId: responseBatchId, data }: any) => {
      if (responseBatchId === batchId) {
        setBatch(data);
        setIsLoading(false);
      }
    };
    
    const handleError = ({ error: err }: any) => {
      setError(err);
      setIsLoading(false);
    };

    socket.emit('subscribe:batch', batchId);
    
    const handleUpdate = (doc: Batch) => {
      if (!doc?._id) return;
      const incomingId = String(doc._id);
      const currentId = String(batchId);
      if (incomingId === currentId) {
        setBatch(doc);
      }
    };

    socket.on('batch:initial', handleInitial);
    socket.on('batch:error', handleError);
    socket.on('batch:update', handleUpdate);

    return () => {
      socket.off('batch:initial', handleInitial);
      socket.off('batch:error', handleError);
      socket.off('batch:update', handleUpdate);
      socket.emit('unsubscribe:batch', batchId);
      setBatch(null);
      setIsLoading(true);
    };
  }, [batchId]);

  const refresh = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !batchId) return;
    setIsLoading(true);
    setError(null);
    socket.emit('fetch:batch', { batchId });
  }, [batchId]);

  return { batch, isConnected, isLoading, error, refresh };
}

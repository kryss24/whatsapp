import { useEffect, useRef } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Echo: Echo;
    Pusher: any;
  }
}

export function useWebSocket() {
  const echoRef = useRef<Echo>();

  useEffect(() => {
    const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
    const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.error('Pusher configuration is missing');
      return;
    }

    try {
      window.Pusher = Pusher;

      window.Echo = new Echo({
        broadcaster: 'pusher',
        key: pusherKey,
        cluster: pusherCluster,
        forceTLS: true,
        wsHost: window.location.hostname,
        wsPort: 6001,
        wssPort: 6001,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
      });

      echoRef.current = window.Echo;
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }

    return () => {
      if (echoRef.current) {
        echoRef.current.disconnect();
      }
    };
  }, []);

  return echoRef.current;
}
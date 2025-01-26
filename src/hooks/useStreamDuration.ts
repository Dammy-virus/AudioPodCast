import { useState, useRef, useEffect } from 'react';

export function useStreamDuration(isLive: boolean) {
  const [duration, setDuration] = useState('00:00:00');
  const startTime = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLive && !startTime.current) {
      startTime.current = Date.now();
      intervalRef.current = window.setInterval(() => {
        const diff = Date.now() - (startTime.current || 0);
        const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setDuration(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    } else if (!isLive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      startTime.current = null;
      setDuration('00:00:00');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive]);

  return duration;
}
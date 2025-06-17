import { useState, useEffect } from 'react';

export const useTime = (updateInterval: number = 60000) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);
    return () => clearInterval(timer);
  }, [updateInterval]);

  return currentTime;
};
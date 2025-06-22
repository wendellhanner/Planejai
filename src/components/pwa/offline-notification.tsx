"use client";

import React, { useEffect, useState } from 'react';
import { usePWA } from '@/hooks/use-pwa';
import { WifiOff } from 'lucide-react';

export function OfflineNotification() {
  const { isOnline } = usePWA();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowNotification(false);
    }
  }, [isOnline]);

  if (isOnline || !showNotification) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg shadow-lg border border-yellow-200 dark:border-yellow-800 flex items-center space-x-2 animate-fade-in">
      <WifiOff className="h-5 w-5" />
      <span className="text-sm font-medium">Você está offline. Algumas funcionalidades podem estar limitadas.</span>
    </div>
  );
}

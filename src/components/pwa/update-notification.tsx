"use client";

import React from 'react';
import { usePWA } from '@/hooks/use-pwa';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function UpdateNotification() {
  const { isUpdateAvailable, updateServiceWorker } = usePWA();

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <RefreshCw className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Atualização disponível
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Uma nova versão do Planej.AI está disponível. Atualize para obter as últimas melhorias.
            </p>
          </div>
        </div>
        <Button 
          onClick={updateServiceWorker}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Atualizar agora
        </Button>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

export function InstallPWAPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detecta se é iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Verifica se o app já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Captura o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Previne o prompt automático do Chrome
      e.preventDefault();
      // Armazena o evento para uso posterior
      setInstallPrompt(e);
      
      // Mostra o prompt personalizado após 5 segundos
      setTimeout(() => {
        // Verifica se o usuário já fechou o prompt antes (usando localStorage)
        const promptDismissed = localStorage.getItem('pwa-prompt-dismissed');
        const lastPrompt = localStorage.getItem('pwa-prompt-last-shown');
        const now = new Date().getTime();
        
        // Se o prompt foi fechado nas últimas 72 horas, não mostra novamente
        if (promptDismissed && lastPrompt && (now - parseInt(lastPrompt, 10)) < 72 * 60 * 60 * 1000) {
          return;
        }
        
        setShowPrompt(true);
      }, 5000);
    };

    // Evento quando o app é instalado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Mostra o prompt nativo
    await installPrompt.prompt();
    
    // Aguarda a escolha do usuário
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('Usuário aceitou a instalação do PWA');
      setIsInstalled(true);
    } else {
      console.log('Usuário recusou a instalação do PWA');
    }
    
    // Limpa o prompt para que não possa ser usado novamente
    setInstallPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Registra que o usuário fechou o prompt e quando isso aconteceu
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    localStorage.setItem('pwa-prompt-last-shown', new Date().getTime().toString());
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img 
              src="/icons/icon-192x192.png" 
              alt="Planej.AI" 
              className="w-12 h-12 rounded-lg"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Instale o Planej.AI
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isIOS 
                ? 'Toque em "Compartilhar" e depois "Adicionar à Tela de Início"' 
                : 'Instale nosso app para acesso rápido e offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isIOS && (
            <Button 
              onClick={handleInstallClick}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Instalar
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDismiss}
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

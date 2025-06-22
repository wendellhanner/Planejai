"use client";

import { useState, useEffect } from 'react';

interface PWAStatus {
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  isUpdateAvailable: boolean;
  isOnline: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  updateServiceWorker: () => void;
  installPWA: () => Promise<void>;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA(): PWAStatus {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Verificar se o app está instalado ou em modo standalone
  useEffect(() => {
    const checkStandalone = () => {
      const isAppInstalled = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true;
      
      setIsStandalone(isAppInstalled);
      setIsInstalled(isAppInstalled || localStorage.getItem('pwa-installed') === 'true');
    };

    checkStandalone();

    // Ouvir mudanças no modo de exibição
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const listener = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
      if (e.matches) {
        setIsInstalled(true);
      }
    };

    try {
      // Adiciona o listener para mudanças no modo de exibição
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } catch (e) {
      // Fallback para navegadores mais antigos
      mediaQuery.addListener(listener);
      return () => mediaQuery.removeListener(listener);
    }
  }, []);

  // Monitorar o evento beforeinstallprompt para habilitar a instalação
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setInstallPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    };
  }, []);

  // Monitorar o evento appinstalled
  useEffect(() => {
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      localStorage.setItem('pwa-installed', 'true');
      console.log('PWA foi instalado com sucesso!');
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Registrar o service worker e monitorar atualizações
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          setRegistration(reg);
          
          // Verificar atualizações no service worker
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch(err => console.error('Erro ao registrar service worker:', err));

      // Verificar periodicamente por atualizações (a cada hora)
      const checkInterval = setInterval(() => {
        if (registration) {
          registration.update().catch(err => {
            console.error('Erro ao verificar atualizações do service worker:', err);
          });
        }
      }, 60 * 60 * 1000);

      return () => clearInterval(checkInterval);
    }
  }, [registration]);

  // Monitorar o status de conexão
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Função para atualizar o service worker
  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      // Envia uma mensagem para o service worker em espera para assumir o controle
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Recarrega a página para usar o novo service worker
      window.location.reload();
    }
  };

  // Função para instalar o PWA
  const installPWA = async () => {
    if (!installPrompt) return;
    
    await installPrompt.prompt();
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true);
      setCanInstall(false);
    }
    
    setInstallPrompt(null);
  };

  return {
    isInstalled,
    isStandalone,
    canInstall,
    isUpdateAvailable,
    isOnline,
    installPrompt,
    updateServiceWorker,
    installPWA
  };
}

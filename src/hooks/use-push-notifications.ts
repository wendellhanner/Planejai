"use client";

import { useState, useEffect } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

export interface PushNotificationHook {
  permission: NotificationPermission;
  isSupported: boolean;
  isSubscribed: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  sendTestNotification: () => void;
}

// Chave pública do VAPID (em produção isso deveria vir de variáveis de ambiente)
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa40HticCqJidBiSwGmSKWLdpJ_8HK9BkH8H8-4n8FoQhfuH8qY9lWQB7rJhY0';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications(): PushNotificationHook {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Verificar se o navegador suporta notificações
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Registrar o service worker
      registerServiceWorker();

      // Verificar se já está subscrito
      checkSubscription();
    } else {
      console.warn('Push notifications não são suportadas neste navegador');
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado:', registration);

      // Aguardar o service worker estar ativo
      await navigator.serviceWorker.ready;
      console.log('Service Worker ativo');
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  };

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Erro ao verificar subscription:', error);
    }
  };

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return 'denied';
    }
  };

  const subscribe = async (): Promise<boolean> => {
    if (!isSupported || permission !== 'granted') {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // Verificar se já existe uma subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Criar nova subscription
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
      }

      if (subscription) {
        // Aqui você enviaria a subscription para o seu servidor
        console.log('Subscription criada:', subscription);

        // Simular envio para servidor
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
        }).catch(() => {
          // Em desenvolvimento, ignorar erro de API não encontrada
          console.log('API endpoint não encontrada (desenvolvimento)');
        });

        setIsSubscribed(true);
        return true;
      }
    } catch (error) {
      console.error('Erro ao se inscrever:', error);
    }

    return false;
  };

  const unsubscribe = async (): Promise<boolean> => {
    if (!isSupported) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const successful = await subscription.unsubscribe();

        if (successful) {
          // Notificar o servidor
          await fetch('/api/push/unsubscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          }).catch(() => {
            console.log('API endpoint não encontrada (desenvolvimento)');
          });

          setIsSubscribed(false);
          return true;
        }
      }
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
    }

    return false;
  };

  const sendTestNotification = () => {
    if (!isSupported || permission !== 'granted') {
      return;
    }

    // Criar notificação local para teste
    const notification = new Notification('Teste de Notificação', {
      body: 'Esta é uma notificação de teste do CRM!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 'test'
      },
      actions: [
        {
          action: 'view',
          title: 'Ver'
        },
        {
          action: 'dismiss',
          title: 'Dispensar'
        }
      ]
    });

    notification.onclick = () => {
      console.log('Notificação clicada');
      notification.close();
      window.focus();
    };

    // Auto-fechar após 5 segundos
    setTimeout(() => {
      notification.close();
    }, 5000);
  };

  return {
    permission,
    isSupported,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification
  };
}

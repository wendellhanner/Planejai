// Service Worker para PWA e Push Notifications
const CACHE_NAME = 'moveis-planejados-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/kanban',
  '/analytics',
  '/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptação de requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna resposta
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Checa se recebeu uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANTE: Clone a resposta. Um stream só pode ser consumido uma vez.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Manipulação de Push Notifications
self.addEventListener('push', (event) => {
  console.log('Push notification recebida:', event);

  const options = {
    body: 'Você tem uma nova notificação!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalhes',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/xmark.png'
      }
    ]
  };

  if (event.data) {
    const notificationData = event.data.json();
    options.body = notificationData.body || options.body;
    options.title = notificationData.title || 'Móveis Planejados CRM';
    options.data = { ...options.data, ...notificationData.data };
  }

  event.waitUntil(
    self.registration.showNotification('Móveis Planejados CRM', options)
  );
});

// Manipulação de cliques em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('Notificação clicada:', event);

  event.notification.close();

  if (event.action === 'explore') {
    // Abrir uma página específica
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Apenas fechar a notificação
    console.log('Notificação fechada pelo usuário');
  } else {
    // Clique padrão na notificação
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/dashboard');
        }
      })
    );
  }
});

// Manipulação de fechamento de notificações
self.addEventListener('notificationclose', (event) => {
  console.log('Notificação fechada:', event);

  // Aqui você pode fazer analytics ou outras ações
  event.waitUntil(
    // Registrar que a notificação foi fechada
    Promise.resolve()
  );
});

// Background Sync para ações offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Executar ações que estavam pendentes
      console.log('Background sync executado')
    );
  }
});

// Periodic Background Sync (experimental)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(
      // Sincronizar conteúdo periodicamente
      console.log('Periodic sync executado')
    );
  }
});

console.log('Service Worker registrado e ativo');

// Service Worker minimalista para evitar problemas

// Força o service worker a se tornar ativo imediatamente na instalação
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker instalado');
});

// Ativação - limpa caches antigos
self.addEventListener('activate', (event) => {
  // Assume o controle de todas as páginas imediatamente
  event.waitUntil(clients.claim());
  console.log('Service Worker ativado');
  
  // Limpa todos os caches antigos
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Interceptação de requests - sem cache para evitar problemas
self.addEventListener('fetch', (event) => {
  // Simplesmente deixa as requisições passarem sem interceptação
  // para evitar erros ERR_FAILED
});

// Evento para receber notificações push (mantido simples)
self.addEventListener('push', function(event) {
  console.log('Push notification recebida:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      
      const options = {
        body: data.body || 'Você tem uma nova notificação!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png'
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'Planej.AI', options)
      );
    } catch (error) {
      console.error('Erro ao processar notificação push:', error);
    }
  }
});

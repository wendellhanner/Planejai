"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PWATestPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Teste PWA
          </h1>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Funcionalidades PWA
              </h2>
              
              <div className="space-y-8">
                {/* Teste de Instalação */}
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Instalação do PWA
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Você pode instalar este aplicativo na sua tela inicial para acesso rápido e offline.
                  </p>
                  <Button
                    id="install-button"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      // O botão será gerenciado pelo script abaixo
                      alert('Use o prompt de instalação que aparece automaticamente ou as opções do navegador');
                    }}
                  >
                    Instalar Aplicativo
                  </Button>
                </div>
                
                {/* Teste de Cache Offline */}
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
                    Teste de Funcionamento Offline
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Para testar o funcionamento offline, siga estes passos:
                  </p>
                  <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                    <li>Navegue por algumas páginas do aplicativo para armazená-las em cache</li>
                    <li>Ative o modo avião ou desconecte-se da internet</li>
                    <li>Tente acessar as páginas novamente - elas devem funcionar offline</li>
                    <li>Tente acessar uma página não visitada para ver a página offline personalizada</li>
                  </ol>
                  <div className="flex space-x-3">
                    <Link href="/dashboard">
                      <Button variant="outline">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline">
                        Login
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Simula uma página não existente para testar fallback offline
                        window.location.href = '/pagina-nao-existente';
                      }}
                    >
                      Página não existente
                    </Button>
                  </div>
                </div>
                
                {/* Status da Conexão */}
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                    Status da Conexão
                  </h3>
                  <div id="connection-status" className="flex items-center space-x-2">
                    <div id="status-indicator" className="w-4 h-4 rounded-full bg-green-500"></div>
                    <p id="status-text" className="text-sm font-medium">Online</p>
                  </div>
                </div>
                
                {/* Teste de Atualização do Service Worker */}
                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">
                    Atualização do Service Worker
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Quando uma nova versão do aplicativo estiver disponível, você verá uma notificação.
                    Você também pode forçar uma verificação de atualização:
                  </p>
                  <Button
                    id="update-button"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => {
                      if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.ready.then(registration => {
                          registration.update().then(() => {
                            alert('Verificação de atualização iniciada. Se houver uma nova versão, você verá uma notificação.');
                          });
                        });
                      }
                    }}
                  >
                    Verificar Atualizações
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Planej.AI - Teste de funcionalidades PWA
          </p>
        </div>
      </footer>
      
      {/* Script para gerenciar status de conexão */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Atualiza o indicador de status de conexão
            function updateConnectionStatus() {
              const indicator = document.getElementById('status-indicator');
              const text = document.getElementById('status-text');
              
              if (navigator.onLine) {
                indicator.className = 'w-4 h-4 rounded-full bg-green-500';
                text.textContent = 'Online';
                text.className = 'text-sm font-medium text-green-700 dark:text-green-300';
              } else {
                indicator.className = 'w-4 h-4 rounded-full bg-red-500';
                text.textContent = 'Offline';
                text.className = 'text-sm font-medium text-red-700 dark:text-red-300';
              }
            }
            
            // Verifica o status inicial
            updateConnectionStatus();
            
            // Adiciona listeners para mudanças de status
            window.addEventListener('online', updateConnectionStatus);
            window.addEventListener('offline', updateConnectionStatus);
          `
        }}
      />
    </div>
  );
}
